"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("./entity/User");
const Pedidos_1 = require("./entity/Pedidos");
const Produto_1 = require("./entity/Produto");
const Categoria_1 = require("./entity/Categoria");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const pedido_module_1 = require("./pedido/pedido.module");
const produto_module_1 = require("./produto/produto.module");
const categoria_module_1 = require("./categoria/categoria.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: process.env.DB_TYPE || 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [User_1.User, Pedidos_1.Pedidos, Produto_1.Produto, Categoria_1.Categoria],
                synchronize: true,
                logging: false,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            pedido_module_1.PedidoModule,
            produto_module_1.ProdutoModule,
            categoria_module_1.CategoriaModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map