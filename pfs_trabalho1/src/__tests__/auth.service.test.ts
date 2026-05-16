import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';
import { ValidationError } from '../error/validation_error';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      addPedido: jest.fn(),
    } as any;

    authService = new AuthService(userRepository);
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'senha123';
      const hashedPassword = await authService.hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'senha123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'senha123';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'senha123';
      const wrongPassword = 'wrongPassword';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.comparePassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    it('should throw error if password or hash is undefined', async () => {
      await expect(authService.comparePassword('', 'hash')).rejects.toThrow();
      await expect(authService.comparePassword('password', '')).rejects.toThrow();
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = authService.generateToken(userId, email);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = authService.generateToken(userId, email);
      const decoded = authService.verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should throw error for invalid token', () => {
      expect(() => authService.verifyToken('invalidtoken')).toThrow(ValidationError);
    });

    it('should throw error for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid';
      
      expect(() => authService.verifyToken(expiredToken)).toThrow();
    });
  });

  describe('register', () => {
    it('should register a new user with valid data', async () => {
      const name = 'João Silva';
      const email = 'joao@example.com';
      const password = 'senha123';

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({ id: 1, name, email, password: 'hashed', pedidos: [] } as any);

      const user = await authService.register(name, email, password);

      expect(user).toBeTruthy();
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const email = 'existing@example.com';

      userRepository.findByEmail.mockResolvedValue({ id: 1, email } as any);

      await expect(authService.register('Test', email, 'senha123')).rejects.toThrow(
        'Email já cadastrado'
      );
    });

    it('should throw error if password is too short', async () => {
      await expect(authService.register('Test', 'test@example.com', '123')).rejects.toThrow(
        'A senha deve ter no mínimo 6 caracteres'
      );
    });

    it('should throw error if required fields are missing', async () => {
      await expect(authService.register('', 'test@example.com', 'senha123')).rejects.toThrow();
      await expect(authService.register('Test', '', 'senha123')).rejects.toThrow();
      await expect(authService.register('Test', 'test@example.com', '')).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const email = 'joao@example.com';
      const password = 'senha123';
      const hashedPassword = await authService.hashPassword(password);

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        name: 'João',
        pedidos: [],
      } as any);

      const result = await authService.login(email, password);

      expect(result.token).toBeTruthy();
      expect(result.user).toBeTruthy();
      expect(result.user.email).toBe(email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for non-existent user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'senha123')).rejects.toThrow(
        'Email ou senha incorretos'
      );
    });

    it('should throw error for wrong password', async () => {
      const email = 'joao@example.com';
      const hashedPassword = await authService.hashPassword('correctPassword');

      userRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
        name: 'João',
        pedidos: [],
      } as any);

      await expect(authService.login(email, 'wrongPassword')).rejects.toThrow(
        'Email ou senha incorretos'
      );
    });

    it('should throw error if email or password is missing', async () => {
      await expect(authService.login('', 'senha123')).rejects.toThrow();
      await expect(authService.login('test@example.com', '')).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should generate a new token from valid token', () => {
      const userId = 1;
      const email = 'test@example.com';

      const oldToken = authService.generateToken(userId, email);
      const newToken = authService.refreshToken(oldToken);

      expect(newToken).toBeTruthy();
      expect(newToken).not.toBe(oldToken);

      const decodedNew = authService.verifyToken(newToken);
      expect(decodedNew.userId).toBe(userId);
      expect(decodedNew.email).toBe(email);
    });

    it('should throw error for invalid token', () => {
      expect(() => authService.refreshToken('invalidtoken')).toThrow();
    });
  });
});
