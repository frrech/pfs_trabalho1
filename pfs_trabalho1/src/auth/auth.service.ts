import { Injectable } from '@nestjs/common';
import { BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';

@Injectable()
export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'seu-secret-key-super-seguro';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Hash password using bcryptjs
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
  }

  /**
   * Compare password with hash
   */
  public async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      throw new BadRequestException('Password or hash is undefined');
    }
    return await bcryptjs.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  public generateToken(userId: number, email: string): string {
    return jwt.sign(
      { userId, email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify JWT token
   */
  public verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: number; email: string };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Register new user with password hashing
   */
  public async register(name: string, email: string, password: string): Promise<User> {
    // Validate input
    if (!name || !email || !password) {
      throw new BadRequestException('Nome, email e senha são obrigatórios');
    }

    if (password.length < 6) {
      throw new BadRequestException('A senha deve ter no mínimo 6 caracteres');
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      pedidos: [],
    });
    return await this.userRepository.save(user);
  }

  /**
   * Login user and return JWT token
   */
  public async login(email: string, password: string): Promise<{ token: string; user: any }> {
    if (!email || !password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const token = this.generateToken(user.id, user.email);
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return { token, user: userWithoutPassword };
  }

  /**
   * Refresh JWT token
   */
  public refreshToken(token: string): string {
    const decoded = this.verifyToken(token);
    return this.generateToken(decoded.userId, decoded.email);
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}
