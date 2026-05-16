import { Categoria } from "../entity/Categoria";
import { CategoriaRepository } from "../repository/categoria.repository";
import { ValidationError } from "../error/validation_error";
export class CategoriaService {
    private categoriaRepository: CategoriaRepository;

    constructor(categoriaRepository?: CategoriaRepository) {
        this.categoriaRepository = categoriaRepository || new CategoriaRepository();
    }

    private validateId(id: number): void {
        if (id <= 0) {
            throw new ValidationError("O ID da categoria deve ser um número positivo.", 400);
        }
    }

    private async validateCategoriaExists(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findById(id);
        if (!categoria) {
            throw new ValidationError(`Categoria com id ${id} não encontrada.`, 404);
        }
        return categoria;
    }

    async findAll(): Promise<Categoria[]> {
        try {
            return await this.categoriaRepository.findAll();
        } catch (error) {
            throw new ValidationError("Erro ao buscar categorias: " + error.message, 500);
        }
    }

    async findById(id: number): Promise<Categoria | null> {
        this.validateId(id);
        return this.categoriaRepository.findById(id);
    }

    async create(categoria: Categoria): Promise<Categoria> {
        this.validateId(categoria.id);
        if (await this.categoriaRepository.findById(categoria.id)) {
            throw new ValidationError(`Categoria com id ${categoria.id} já existe.`, 409); // Conflict
        }
        return this.categoriaRepository.create(categoria);
    }

    async update(id: number, categoria: Partial<Categoria>): Promise<Categoria | null> {
        this.validateId(id);
        await this.validateCategoriaExists(id);
        if (categoria.id) {
            this.validateId(categoria.id);
            if (categoria.id !== id) {
                throw new ValidationError("O ID da categoria não pode ser alterado.", 400);
            }
        } 
        if (categoria.nome && categoria.nome.trim() === "") {
            throw new ValidationError("O nome da categoria é obrigatório.", 400);
        }
        return this.categoriaRepository.update(id, categoria);
    }

    async delete(id: number): Promise<boolean> {
        this.validateId(id);
        await this.validateCategoriaExists(id);
        return await this.categoriaRepository.delete(id);
    }
}