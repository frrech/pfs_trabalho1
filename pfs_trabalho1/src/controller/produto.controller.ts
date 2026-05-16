import { ProdutoService } from "../service/produto.service";
import { Produto } from "../entity/Produto";
import { handleRequest } from "../utils/request_handler";

export class ProdutoController {
    private produtoService: ProdutoService;

    constructor(produtoService: ProdutoService) {
        this.produtoService = produtoService;
    }

    public async adicionarProduto(req: any, res: any): Promise<void> {
        await handleRequest(req, res, async () => {
            const { nome, preco, categoria, quantidade } = req.body;
            const produto = new Produto();
            produto.nome = nome;
            produto.preco = preco;
            produto.categoria = categoria;
            produto.quantidade = quantidade;
            await this.produtoService.adicionarProduto(produto);
            console.log("Produto adicionado com sucesso.");
        });
    }

    public async listarProdutos(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.listarProdutos(), 200);
    }

    public async buscarProdutoPorId(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.buscarProdutoPorId(Number(req.params.id)), 200);
    }

    public async removerProduto(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.removerProduto(Number(req.params.id)), 200);
    }

    public async atualizarProduto(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.atualizarProduto(Number(req.params.id), { ...req.body } as Produto), 200);
    }

    public async depositar(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.depositar(Number(req.params.id), Number(req.body.quantidade)), 200);
    }

    public async retirar(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.produtoService.retirar(Number(req.params.id), Number(req.body.quantidade)), 200);
    }
}
