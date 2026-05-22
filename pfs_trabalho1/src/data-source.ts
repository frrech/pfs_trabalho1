import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Produto } from "./entity/Produto"
import { Categoria } from "./entity/Categoria"
import { User } from "./entity/User"
import { Pedidos } from "./entity/Pedidos"

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Produto, Categoria, User, Pedidos],
    migrations: [],
    subscribers: [],
})

export const testDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    synchronize: true,
    logging: false,
    entities: [Produto, Categoria, User, Pedidos],
    migrations: [],
    subscribers: [],
})