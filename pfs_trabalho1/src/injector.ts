import { ProdutoRepository } from "./repository/produto.repository";
import { ProdutoService } from "./service/produto.service";
import { ProdutoController } from "./controller/produto.controller";
import { ProdutoRouter } from "./router/produto.router";
import { CategoriaController } from "./controller/categoria.controller";
import { CategoriaRepository } from "./repository/categoria.repository";
import { CategoriaService } from "./service/categoria.service";
import { CategoriaRouter } from "./router/categoria.router";
import { UserController } from "./controller/user.controller";
import { UserRepository } from "./repository/user.repository";
import { UserService } from "./service/user.service";
import { UserRouter } from "./router/user.router";
import { PedidoController } from "./controller/pedido.controller";
import { PedidoRepository } from "./repository/pedido.repository";
import { PedidoService } from "./service/pedido.service";
import { PedidoRouter } from "./router/pedido.router";
import { AuthController } from "./controller/auth.controller";
import { AuthRouter } from "./router/auth.router";

export class Injector {
    private static createRouter<TRouter, TController, TService, TRepository>(
        repositoryCtor: { new (): TRepository },
        serviceCtor: { new (repository: TRepository): TService },
        controllerCtor: { new (service: TService): TController },
        routerCtor: { new (controller: TController): TRouter }
    ): TRouter {
        const repository = new repositoryCtor();
        const service = new serviceCtor(repository);
        const controller = new controllerCtor(service);
        return new routerCtor(controller);
    }

    public static createAuthRouter(): AuthRouter {
        const authController = new AuthController();
        return new AuthRouter(authController);
    }

    public static createProdutoRouter(): ProdutoRouter {
        return this.createRouter(
            ProdutoRepository,
            ProdutoService,
            ProdutoController,
            ProdutoRouter
        );
    }

    public static createCategoriaRouter(): CategoriaRouter {
        return this.createRouter(
            CategoriaRepository,
            CategoriaService,
            CategoriaController,
            CategoriaRouter
        );
    }

    public static createUserRouter(): UserRouter {
        return this.createRouter(
            UserRepository,
            UserService,
            UserController,
            UserRouter
        );
    }

    public static createPedidoRouter(): PedidoRouter {
        const produtoRepository = new ProdutoRepository();
        const pedidoRepository = new PedidoRepository();
        const pedidoService = new PedidoService(pedidoRepository, produtoRepository);
        const pedidoController = new PedidoController(pedidoService);
        return new PedidoRouter(pedidoController);
    }
}
