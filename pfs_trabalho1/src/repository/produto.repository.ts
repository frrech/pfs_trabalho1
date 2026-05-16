import { Produto } from "../entity/Produto";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export class ProdutoRepository {
    private repository: Repository<Produto>;

    constructor() {
        this.repository = AppDataSource.getRepository(Produto);
    }

    async save(produto: Produto): Promise<Produto> {
        return this.repository.save(produto);
    }

    // Fixed: Include pedidos relations
    async findAll(): Promise<Produto[]> {
        return await this.repository.find({ relations: ["categoria", "pedidos"] });
    }

    async findById(id: number): Promise<Produto | null> {
        if (id && id > 0) {
            return await this.repository.findOne({ 
                where: { id }, 
                relations: ["categoria", "pedidos"] 
            });
        }
        return null;
    }

    async delete(id: number): Promise<void> {
        if (id && id > 0) {
            await this.repository.delete(id);
        }
    }

    async update(id: number, produto: Partial<Produto>): Promise<Produto | null> {
        if (id && id > 0) {
            const existingProduto = await this.findById(id);
            if (!existingProduto) {
                return null;
            }
            Object.assign(existingProduto, produto);
            return this.repository.save(existingProduto);
        }
        return null;
    }

    async depositar(id: number, quantidade: number): Promise<Produto | null> {
        const produto = await this.findById(id);
        if (!produto) {
            return null;
        }
        produto.quantidade += quantidade;
        return this.repository.save(produto);
    }

    async retirar(id: number, quantidade: number): Promise<Produto | null> {
        const produto = await this.findById(id);
        if (!produto) {
            return null;
        }
        produto.quantidade -= quantidade;
        return this.repository.save(produto);
    }
}