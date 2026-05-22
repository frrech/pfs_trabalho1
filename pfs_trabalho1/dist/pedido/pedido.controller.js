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
exports.PedidoController = void 0;
const common_1 = require("@nestjs/common");
const pedido_service_1 = require("./pedido.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PedidoController = class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async listarPedidos() {
        return this.pedidoService.listarPedidos();
    }
    async buscarPedidoPorId(id) {
        return this.pedidoService.buscarPedidoPorId(Number(id));
    }
    async adicionarPedido(req, body) {
        if (!body.produtos || !Array.isArray(body.produtos) || body.produtos.length === 0) {
            throw new Error('Produtos são obrigatórios e deve haver pelo menos um.');
        }
        const user = req.user;
        if (!user || !user.userId) {
            throw new Error('Usuário não autenticado.');
        }
        await this.pedidoService.adicionarPedido(body.descricao, user.userId, body.produtos);
        return { message: 'Pedido adicionado com sucesso' };
    }
    async atualizarPedido(id, pedido) {
        return this.pedidoService.atualizarPedido(Number(id), pedido);
    }
    async removerPedido(id) {
        return this.pedidoService.removerPedido(Number(id));
    }
};
exports.PedidoController = PedidoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "listarPedidos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "buscarPedidoPorId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "adicionarPedido", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "atualizarPedido", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "removerPedido", null);
exports.PedidoController = PedidoController = __decorate([
    (0, common_1.Controller)('pedidos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoController);
//# sourceMappingURL=pedido.controller.js.map