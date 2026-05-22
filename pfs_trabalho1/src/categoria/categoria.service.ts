import { Injectable, BadRequestException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entity/Categoria';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  private validateId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException('O ID da categoria deve ser um número positivo.');
    }
  }

  private async validateCategoriaExists(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada.`);
    }
    return categoria;
  }

  async findAll(): Promise<Categoria[]> {
    try {
      return await this.categoriaRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar categorias: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Categoria> {
    this.validateId(id);
    return await this.validateCategoriaExists(id);
  }

  async create(nome: string): Promise<Categoria> {
    if (!nome || nome.trim() === '') {
      throw new BadRequestException('O nome da categoria é obrigatório.');
    }

    const categoria = this.categoriaRepository.create({ nome });
    return await this.categoriaRepository.save(categoria);
  }

  async update(id: number, categoriaData: Partial<Categoria>): Promise<Categoria> {
    this.validateId(id);
    const categoria = await this.validateCategoriaExists(id);

    if (categoriaData.nome && categoriaData.nome.trim() === '') {
      throw new BadRequestException('O nome da categoria é obrigatório.');
    }

    Object.assign(categoria, categoriaData);
    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);
    await this.validateCategoriaExists(id);
    await this.categoriaRepository.delete(id);
  }
}
