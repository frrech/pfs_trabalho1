"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDataSource = exports.AppDataSource = void 0;
const dotenv = require("dotenv");
dotenv.config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Produto_1 = require("./entity/Produto");
const Categoria_1 = require("./entity/Categoria");
const User_1 = require("./entity/User");
const Pedidos_1 = require("./entity/Pedidos");
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Produto_1.Produto, Categoria_1.Categoria, User_1.User, Pedidos_1.Pedidos],
    migrations: [],
    subscribers: [],
});
exports.testDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [Produto_1.Produto, Categoria_1.Categoria, User_1.User, Pedidos_1.Pedidos],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map