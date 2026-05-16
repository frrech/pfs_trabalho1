import { Categoria } from "../entity/Categoria";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";

export class CategoriaRepository {
    private repository: Repository<Categoria>;

    constructor() {
        this.repository = AppDataSource.getRepository(Categoria);
    }

    async findAll(): Promise<Categoria[]> {
        return this.repository.find({ relations: ["produtos"] });
    }

    async findById(id: number): Promise<Categoria | null> {
        return this.repository.findOne({ where: { id }, relations: ["produtos"] });
    }

    async create(categoria: Categoria): Promise<Categoria> {
        return this.repository.save(categoria);
    }

    async update(id: number, categoria: Partial<Categoria>): Promise<Categoria | null> {
        const existingCategoria = await this.repository.findOne({ where: { id } });
        if (!existingCategoria) {
            return null;
        }
        const updatedCategoria = this.repository.merge(existingCategoria, categoria);
        return this.repository.save(updatedCategoria);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== undefined && result.affected > 0;
    }
}