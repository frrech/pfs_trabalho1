import { CategoriaService } from "../service/categoria.service";
import { Categoria } from "../entity/Categoria";
import { handleRequest } from "../utils/request_handler";

export class CategoriaController {
    private categoriaService: CategoriaService;
    constructor(categoriaService: CategoriaService) {
        this.categoriaService = categoriaService;
    }

    public async listarCategorias(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.categoriaService.findAll(), 200);
    }

    public async buscarCategoriaPorId(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.categoriaService.findById(Number(req.params.id)), 200);
    }

    public async criarCategoria(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.categoriaService.create({ ...req.body } as Categoria), 201);
    }

    public async atualizarCategoria(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.categoriaService.update(Number(req.params.id), { ...req.body }), 200);
    }

    public async deletarCategoria(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.categoriaService.delete(Number(req.params.id)), 200);
    }
}