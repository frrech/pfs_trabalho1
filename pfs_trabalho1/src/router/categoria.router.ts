import { CategoriaController } from "../controller/categoria.controller";
import { Router } from "express";

export class CategoriaRouter {
    private categoriaController: CategoriaController;
    private router: Router;

    constructor(categoriaController: CategoriaController) {
        this.categoriaController = categoriaController;
        this.router = Router();
    }

    public setupRoutes(app: any): void {
        app.use("/categorias", this.router);
        this.router.get("/", (req: any, res: any) => this.categoriaController.listarCategorias(req, res));
        this.router.get("/:id", (req: any, res: any) => this.categoriaController.buscarCategoriaPorId(req, res));
        this.router.post("/", (req: any, res: any) => this.categoriaController.criarCategoria(req, res));
        this.router.put("/:id", (req: any, res: any) => this.categoriaController.atualizarCategoria(req, res));
        this.router.delete("/:id", (req: any, res: any) => this.categoriaController.deletarCategoria(req, res));
    }
}