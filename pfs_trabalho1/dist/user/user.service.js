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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../entity/User");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    validateId(id) {
        if (id <= 0) {
            throw new common_1.BadRequestException('O ID do usuário deve ser um número positivo.');
        }
    }
    async validateUserExists(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['pedidos'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com id ${id} não encontrado.`);
        }
        return user;
    }
    async adicionarUser(name, email) {
        if (!name || name.trim() === '') {
            throw new common_1.BadRequestException('Nome é obrigatório');
        }
        if (!email || email.trim() === '') {
            throw new common_1.BadRequestException('Email é obrigatório');
        }
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email já cadastrado');
        }
        const user = this.userRepository.create({
            name,
            email,
            password: '',
            pedidos: [],
        });
        await this.userRepository.save(user);
    }
    async listarUsers() {
        return await this.userRepository.find({ relations: ['pedidos'] });
    }
    async buscarUserPorId(id) {
        this.validateId(id);
        return await this.validateUserExists(id);
    }
    async removerUser(id) {
        this.validateId(id);
        await this.validateUserExists(id);
        await this.userRepository.delete(id);
    }
    async atualizarUser(id, userData) {
        this.validateId(id);
        const user = await this.validateUserExists(id);
        if (userData.name && userData.name.trim() === '') {
            throw new common_1.BadRequestException('Nome não pode estar vazio');
        }
        if (userData.email && userData.email.trim() === '') {
            throw new common_1.BadRequestException('Email não pode estar vazio');
        }
        Object.assign(user, userData);
        return await this.userRepository.save(user);
    }
    async adicionarPedido(userId, pedido) {
        this.validateId(userId);
        const user = await this.validateUserExists(userId);
        if (!pedido || !pedido.produtos || pedido.produtos.length === 0) {
            throw new common_1.BadRequestException('O pedido deve conter pelo menos um produto.');
        }
        if (pedido.total <= 0) {
            throw new common_1.BadRequestException('O total do pedido deve ser um número positivo.');
        }
        user.pedidos.push(pedido);
        pedido.user = user;
        await this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map