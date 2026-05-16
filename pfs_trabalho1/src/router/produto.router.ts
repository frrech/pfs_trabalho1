import { ProdutoController } from "../controller/produto.controller";
import { Router } from "express";

export class ProdutoRouter {
    private produtoController: ProdutoController;
    private router: Router;

    constructor(produtoController: ProdutoController) {
        this.produtoController = produtoController;
        this.router = Router();
    }

    public setupRoutes(app: any): void {
        app.use("/produtos", this.router);
        this.router.post("/", (req: any, res: any) => this.produtoController.adicionarProduto(req, res));
        this.router.get("/", (req: any, res: any) => this.produtoController.listarProdutos(req, res));
        this.router.get("/:id", (req: any, res: any) => this.produtoController.buscarProdutoPorId(req, res));
        this.router.delete("/:id", (req: any, res: any) => this.produtoController.removerProduto(req, res));
        this.router.put("/:id", (req: any, res: any) => this.produtoController.atualizarProduto(req, res));
        this.router.post("/:id/depositar", (req: any, res: any) => this.produtoController.depositar(req, res));
        this.router.post("/:id/retirar", (req: any, res: any) => this.produtoController.retirar(req, res));
    }

}