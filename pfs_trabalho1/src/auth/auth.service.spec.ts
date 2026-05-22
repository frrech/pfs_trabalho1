import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../entity/User';
import { BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<jest.Mocked<Repository<User>>>(
      getRepositoryToken(User),
    );
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'senha123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'senha123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'senha123';
      const hash = await service.hashPassword(password);

      const isValid = await service.comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'senha123';
      const wrongPassword = 'wrongPassword';
      const hash = await service.hashPassword(password);

      const isValid = await service.comparePassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should throw error if password or hash is undefined', async () => {
      await expect(service.comparePassword('', 'hash')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.comparePassword('password', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = service.generateToken(userId, email);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = service.generateToken(userId, email);
      const decoded = service.verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should throw error for invalid token', () => {
      expect(() => service.verifyToken('invalidtoken')).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user with valid data', async () => {
      const name = 'João Silva';
      const email = 'joao@example.com';
      const password = 'senha123';
      const user = {
        id: 1,
        name,
        email,
        password: 'hashed',
        pedidos: [],
      } as any;

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(user);
      userRepository.save.mockResolvedValue(user);

      const result = await service.register(name, email, password);

      expect(result).toBeTruthy();
      expect(result.name).toBe(name);
      expect(result.email).toBe(email);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const email = 'existing@example.com';

      userRepository.findOne.mockResolvedValue({ id: 1, email } as any);

      await expect(
        service.register('Test', email, 'senha123'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw error if password is too short', async () => {
      await expect(
        service.register('Test', 'test@example.com', '123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if required fields are missing', async () => {
      await expect(
        service.register('', 'test@example.com', 'senha123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register('Test', '', 'senha123'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register('Test', 'test@example.com', ''),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const email = 'joao@example.com';
      const password = 'senha123';
      const hashedPassword = await service.hashPassword(password);
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        name: 'João',
        pedidos: [],
      } as any;

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.login(email, password);

      expect(result.token).toBeTruthy();
      expect(result.user).toBeTruthy();
      expect(result.user.email).toBe(email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'senha123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error for wrong password', async () => {
      const email = 'joao@example.com';
      const hashedPassword = await service.hashPassword('correctPassword');
      const user = {
        id: 1,
        email,
        password: hashedPassword,
        name: 'João',
        pedidos: [],
      } as any;

      userRepository.findOne.mockResolvedValue(user);

      await expect(service.login(email, 'wrongPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error if email or password is missing', async () => {
      await expect(service.login('', 'senha123')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login('test@example.com', '')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should generate a new token from valid token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = service.generateToken(userId, email);
      const newToken = service.refreshToken(token);

      expect(newToken).toBeTruthy();
      // Tokens might be identical if generated in same millisecond
      // What matters is that it decodes to the same payload
      const decoded = service.verifyToken(newToken);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });
  });
});
