import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { UserRepository } from '../repository/user.repository';
import { ValidationError } from '../error/validation_error';

export class AuthService {
    getUserById(userId: any) {
        const userRepository = new UserRepository();
        return userRepository.findById(userId);
    }
    private userRepository: UserRepository;
    private jwtSecret = process.env.JWT_SECRET || 'seu-secret-key-super-seguro';

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

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
            throw new Error('Password or hash is undefined');
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
            throw new ValidationError('Token inválido ou expirado', 401);
        }
    }

    /**
     * Register new user with password hashing
     */
    public async register(name: string, email: string, password: string): Promise<User> {
        // Validate input
        if (!name || !email || !password) {
            throw new ValidationError('Nome, email e senha são obrigatórios', 400);
        }

        if (password.length < 6) {
            throw new ValidationError('A senha deve ter no mínimo 6 caracteres', 400);
        }

        // Check if email already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email já cadastrado', 409);
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create user
        const user = new User(name, email, hashedPassword, []);
        return await this.userRepository.save(user);
    }

    /**
     * Login user and return JWT token
     */
    public async login(email: string, password: string): Promise<{ token: string; user: User }> {
        // Validate input
        if (!email || !password) {
            throw new ValidationError('Email e senha são obrigatórios', 400);
        }

        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new ValidationError('Email ou senha incorretos', 401);
        }

        // Compare password
        const isPasswordValid = await this.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ValidationError('Email ou senha incorretos', 401);
        }

        // Generate token
        const token = this.generateToken(user.id, user.email);

        // Return token and user (without password)
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
}
