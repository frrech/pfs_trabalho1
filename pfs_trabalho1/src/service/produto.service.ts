import { ProdutoRepository } from "../repository/produto.repository";
import { ValidationError } from "../error/validation_error";
import { Produto } from "../entity/Produto";
import { Categoria } from "../entity/Categoria";

export class ProdutoService {
    private produtoRepository: ProdutoRepository;

    constructor(produtoRepository: ProdutoRepository) {
        this.produtoRepository = produtoRepository;
    }

    private verificarProduto(nome: string, preco: number, categoria: Categoria): boolean {
        return nome.trim() === "" || preco <= 0 || !categoria || !categoria.id || categoria.id <= 0;
    }

    private validateId(id: number): void {
        if (id <= 0) {
            throw new ValidationError("O ID do produto deve ser um número positivo.", 400);
        }
    }

    private async validateProdutoExists(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findById(id);
        if (!produto) {
            throw new ValidationError(`Produto com id ${id} não encontrado.`, 404);
        }
        return produto;
    }

    public async adicionarProduto(produto: Produto): Promise<void> {
        const { nome, preco, categoria } = produto;
        if (this.verificarProduto(nome, preco, categoria)) {
            throw new ValidationError("Nome, preço e categoria são obrigatórios e devem ser válidos.");
        }
        if (await this.produtoRepository.findById(produto.id)) {
            let error = new ValidationError(`Produto com id ${produto.id} já existe.`, 409); // Conflict
            throw error;
        }
        await this.produtoRepository.save(produto);
    }

    public async listarProdutos() {
        return await this.produtoRepository.findAll();
    }

    public async buscarProdutoPorId(id: number) {
        this.validateId(id);
        const produto = await this.produtoRepository.findById(id);
        await this.validateProdutoExists(id);
        return produto;
    }

    public async removerProduto(id: number): Promise<void> {
        this.validateId(id);
        await this.validateProdutoExists(id);
        const produto = await this.produtoRepository.findById(id);
        await this.produtoRepository.delete(produto.id);
    }

    public async atualizarProduto(id: number, produto: Produto): Promise<void> {
        const { nome, preco, categoria } = produto;
        if (this.verificarProduto(nome, preco, categoria)) {
            const error = new ValidationError("O produto informado é inválido.", 400); // Bad Request
            throw error;
        }
        this.validateId(id);
        await this.validateProdutoExists(id);
        const produtoExistente = await this.produtoRepository.findById(produto.id);
        await this.produtoRepository.update(produto.id, produto);
    }

    public async depositar(id: number, quantidade: number): Promise<Produto> {
        if (quantidade <= 0) {
            const error = new ValidationError("A quantidade a ser depositada deve ser um número positivo.", 400); // Bad Request
            throw error;
        }
        return this.produtoRepository.depositar(id, quantidade).then(async produto => {
            await this.validateProdutoExists(id);
            return produto;
        });
    }

    public async retirar(id: number, quantidade: number): Promise<Produto> {
        this.validateId(id);
        if (quantidade <= 0) {
            const error = new ValidationError("A quantidade a ser retirada deve ser um número positivo.", 400); // Bad Request
            throw error;
        }
        return this.produtoRepository.retirar(id, quantidade).then(async produto => {
            await this.validateProdutoExists(id);
            if (produto.quantidade < 0) {
                const error = new ValidationError("A quantidade do produto não pode ser negativa.", 400); // Bad Request
                throw error;
            }
            return produto;
        });
    }
}