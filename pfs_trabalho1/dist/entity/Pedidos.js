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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedidos = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Produto_1 = require("./Produto");
let Pedidos = class Pedidos {
    constructor() { }
};
exports.Pedidos = Pedidos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pedidos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pedidos.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Produto_1.Produto, produto => produto.pedidos),
    (0, typeorm_1.JoinTable)({ name: "pedido_produtos" }),
    __metadata("design:type", Array)
], Pedidos.prototype, "produtos", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.pedidos),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Pedidos.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedidos.prototype, "total", void 0);
exports.Pedidos = Pedidos = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [])
], Pedidos);
//# sourceMappingURL=Pedidos.js.map