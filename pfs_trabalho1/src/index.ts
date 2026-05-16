import dotenv from "dotenv";
dotenv.config();

import { AppDataSource, testDataSource } from "./data-source";
import { Injector } from "./injector";
import { AuthMiddleware } from "./middleware/auth.middleware";
const express = require('express');
const app = express();

async function main(args: string[]) {
    console.log("Aplicação iniciada.");
    args[2] === 'test' ? await testDataSource.initialize() : await AppDataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida.");
    app.use(express.json());

    const authMiddleware = new AuthMiddleware();

    console.log("Registrando rotas públicas...");
    Injector.createAuthRouter().setupRoutes(app);
    Injector.createCategoriaRouter().setupRoutes(app);
    Injector.createProdutoRouter().setupRoutes(app);
    console.log("Rotas públicas registradas.");

    console.log("Registrando rotas protegidas...");
    app.use('/users', authMiddleware.authenticate.bind(authMiddleware));
    Injector.createUserRouter().setupRoutes(app);

    app.use('/pedidos', authMiddleware.authenticate.bind(authMiddleware));
    Injector.createPedidoRouter().setupRoutes(app);
    console.log("Rotas protegidas registradas.");

    app.use((err: any, req: any, res: any, next: any) => {
        console.error("Erro não tratado:", err);
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ error: err.message || "Ocorreu um erro inesperado." });
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}.`);
    });
}

main(process.argv).catch((error) => {
    console.error("Erro ao iniciar a aplicação:", error);
    process.exit(1);
});