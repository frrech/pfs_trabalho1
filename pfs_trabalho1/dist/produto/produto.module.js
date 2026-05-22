"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Produto_1 = require("../entity/Produto");
const Categoria_1 = require("../entity/Categoria");
const produto_service_1 = require("./produto.service");
const produto_controller_1 = require("./produto.controller");
let ProdutoModule = class ProdutoModule {
};
exports.ProdutoModule = ProdutoModule;
exports.ProdutoModule = ProdutoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Produto_1.Produto, Categoria_1.Categoria])],
        controllers: [produto_controller_1.ProdutoController],
        providers: [produto_service_1.ProdutoService],
        exports: [produto_service_1.ProdutoService],
    })
], ProdutoModule);
//# sourceMappingURL=produto.module.js.map