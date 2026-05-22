"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Pedidos_1 = require("../entity/Pedidos");
const Produto_1 = require("../entity/Produto");
const User_1 = require("../entity/User");
const pedido_service_1 = require("./pedido.service");
const pedido_controller_1 = require("./pedido.controller");
const auth_module_1 = require("../auth/auth.module");
let PedidoModule = class PedidoModule {
};
exports.PedidoModule = PedidoModule;
exports.PedidoModule = PedidoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Pedidos_1.Pedidos, Produto_1.Produto, User_1.User]), auth_module_1.AuthModule],
        controllers: [pedido_controller_1.PedidoController],
        providers: [pedido_service_1.PedidoService],
        exports: [pedido_service_1.PedidoService],
    })
], PedidoModule);
//# sourceMappingURL=pedido.module.js.map