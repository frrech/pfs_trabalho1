"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../entity/User");
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.jwtSecret = process.env.JWT_SECRET || 'seu-secret-key-super-seguro';
    }
    /**
     * Hash password using bcryptjs
     */
    async hashPassword(password) {
        const salt = await bcryptjs.genSalt(10);
        return await bcryptjs.hash(password, salt);
    }
    /**
     * Compare password with hash
     */
    async comparePassword(password, hash) {
        if (!password || !hash) {
            throw new common_2.BadRequestException('Password or hash is undefined');
        }
        return await bcryptjs.compare(password, hash);
    }
    /**
     * Generate JWT token
     */
    generateToken(userId, email) {
        return jwt.sign({ userId, email }, this.jwtSecret, { expiresIn: '24h' });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        }
        catch (error) {
            throw new common_2.UnauthorizedException('Token inválido ou expirado');
        }
    }
    /**
     * Register new user with password hashing
     */
    async register(name, email, password) {
        // Validate input
        if (!name || !email || !password) {
            throw new common_2.BadRequestException('Nome, email e senha são obrigatórios');
        }
        if (password.length < 6) {
            throw new common_2.BadRequestException('A senha deve ter no mínimo 6 caracteres');
        }
        // Check if email already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_2.ConflictException('Email já cadastrado');
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
    async login(email, password) {
        // Validate input
        if (!email || !password) {
            throw new common_2.BadRequestException('Email e senha são obrigatórios');
        }
        // Find user by email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_2.UnauthorizedException('Email ou senha incorretos');
        }
        // Compare password
        const isPasswordValid = await this.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new common_2.UnauthorizedException('Email ou senha incorretos');
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
    refreshToken(token) {
        const decoded = this.verifyToken(token);
        return this.generateToken(decoded.userId, decoded.email);
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_2.UnauthorizedException('Usuário não encontrado');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map