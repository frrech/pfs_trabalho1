import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entity/Produto';
import { Categoria } from '../entity/Categoria';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  private validateId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException('O ID do produto deve ser um número positivo.');
    }
  }

  private async validateProdutoExists(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado.`);
    }
    return produto;
  }

  private verificarProduto(nome: string, preco: number, categoria: any): boolean {
    return nome.trim() === '' || preco <= 0 || !categoria || !categoria.id || categoria.id <= 0;
  }

  async adicionarProduto(nome: string, preco: number, categoriaId: number, quantidade: number): Promise<void> {
    if (this.verificarProduto(nome, preco, { id: categoriaId })) {
      throw new BadRequestException('Nome, preço e categoria são obrigatórios e devem ser válidos.');
    }

    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${categoriaId} não encontrada.`);
    }

    const produto = this.produtoRepository.create({
      nome,
      preco,
      categoria,
      quantidade,
    });

    await this.produtoRepository.save(produto);
  }

  async listarProdutos(): Promise<Produto[]> {
    return await this.produtoRepository.find({ relations: ['categoria'] });
  }

  async buscarProdutoPorId(id: number): Promise<Produto> {
    this.validateId(id);
    return await this.validateProdutoExists(id);
  }

  async removerProduto(id: number): Promise<void> {
    this.validateId(id);
    const produto = await this.validateProdutoExists(id);
    await this.produtoRepository.delete(produto.id);
  }

  async atualizarProduto(id: number, produtoData: Partial<Produto>): Promise<Produto> {
    this.validateId(id);
    const produto = await this.validateProdutoExists(id);

    if (produtoData.nome && produtoData.nome.trim() === '') {
      throw new BadRequestException('O produto informado é inválido.');
    }
    if (produtoData.preco && produtoData.preco <= 0) {
      throw new BadRequestException('O produto informado é inválido.');
    }

    Object.assign(produto, produtoData);
    return await this.produtoRepository.save(produto);
  }

  async depositar(id: number, quantidade: number): Promise<Produto> {
    this.validateId(id);
    if (quantidade <= 0) {
      throw new BadRequestException('A quantidade a ser depositada deve ser um número positivo.');
    }

    const produto = await this.validateProdutoExists(id);
    produto.quantidade += quantidade;
    return await this.produtoRepository.save(produto);
  }

  async retirar(id: number, quantidade: number): Promise<Produto> {
    this.validateId(id);
    if (quantidade <= 0) {
      throw new BadRequestException('A quantidade a ser retirada deve ser um número positivo.');
    }

    const produto = await this.validateProdutoExists(id);
    produto.quantidade -= quantidade;

    if (produto.quantidade < 0) {
      throw new BadRequestException('A quantidade do produto não pode ser negativa.');
    }

    return await this.produtoRepository.save(produto);
  }
}
