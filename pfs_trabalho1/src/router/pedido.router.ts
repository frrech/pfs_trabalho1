import {Router} from "express";
import { PedidoController } from "../controller/pedido.controller";

export class PedidoRouter {
    private pedidoController: PedidoController;
    private router: Router;

    constructor(pedidoController: PedidoController) {
        this.pedidoController = pedidoController;
        this.router = Router();
    }

    public setupRoutes(app: any): void {
        app.use("/pedidos", this.router);
        this.router.post("/", (req: any, res: any) => this.pedidoController.adicionarPedido(req, res));
        this.router.get("/", (req: any, res: any) => this.pedidoController.listarPedidos(req, res));
        this.router.get("/:id", (req: any, res: any) => this.pedidoController.buscarPedidoPorId(req, res));
        this.router.delete("/:id", (req: any, res: any) => this.pedidoController.removerPedido(req, res));
        this.router.put("/:id", (req: any, res: any) => this.pedidoController.atualizarPedido(req, res));
    }
}