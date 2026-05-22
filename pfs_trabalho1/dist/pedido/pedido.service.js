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
exports.PedidoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Pedidos_1 = require("../entity/Pedidos");
const Produto_1 = require("../entity/Produto");
const User_1 = require("../entity/User");
let PedidoService = class PedidoService {
    constructor(pedidoRepository, produtoRepository, userRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.userRepository = userRepository;
    }
    validateId(id) {
        if (id <= 0) {
            throw new common_1.BadRequestException('O ID do pedido deve ser um número positivo.');
        }
    }
    async validatePedidoExists(id) {
        const pedido = await this.pedidoRepository.findOne({
            where: { id },
            relations: ['produtos', 'user'],
        });
        if (!pedido) {
            throw new common_1.NotFoundException(`Pedido com id ${id} não encontrado.`);
        }
        return pedido;
    }
    async getProdutosFromIds(produtoIds) {
        const produtos = [];
        for (const id of produtoIds) {
            const produto = await this.produtoRepository.findOne({ where: { id } });
            if (!produto) {
                throw new common_1.NotFoundException(`Produto com id ${id} não encontrado.`);
            }
            produtos.push(produto);
        }
        return produtos;
    }
    async adicionarPedido(descricao, userId, produtoIds) {
        if (!produtoIds || !Array.isArray(produtoIds) || produtoIds.length === 0) {
            throw new common_1.BadRequestException('Produtos são obrigatórios e deve haver pelo menos um.');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado.');
        }
        const produtos = await this.getProdutosFromIds(produtoIds.map((p) => (typeof p === 'object' ? p.id : p)));
        const pedido = this.pedidoRepository.create({
            descricao,
            user,
            produtos,
        });
        pedido.total = produtos.reduce((sum, p) => sum + Number(p.preco) * Number(p.quantidade), 0);
        await this.pedidoRepository.save(pedido);
    }
    async listarPedidos() {
        return await this.pedidoRepository.find({ relations: ['produtos', 'user'] });
    }
    async buscarPedidoPorId(id) {
        this.validateId(id);
        return await this.validatePedidoExists(id);
    }
    async removerPedido(id) {
        this.validateId(id);
        await this.validatePedidoExists(id);
        await this.pedidoRepository.delete(id);
    }
    async atualizarPedido(id, pedidoData) {
        this.validateId(id);
        const pedido = await this.validatePedidoExists(id);
        Object.assign(pedido, pedidoData);
        return await this.pedidoRepository.save(pedido);
    }
};
exports.PedidoService = PedidoService;
exports.PedidoService = PedidoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Pedidos_1.Pedidos)),
    __param(1, (0, typeorm_1.InjectRepository)(Produto_1.Produto)),
    __param(2, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PedidoService);
//# sourceMappingURL=pedido.service.js.map