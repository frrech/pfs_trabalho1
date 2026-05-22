import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedidos } from '../entity/Pedidos';
import { Produto } from '../entity/Produto';
import { User } from '../entity/User';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedidos)
    private pedidoRepository: Repository<Pedidos>,
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private validateId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException('O ID do pedido deve ser um número positivo.');
    }
  }

  private async validatePedidoExists(id: number): Promise<Pedidos> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['produtos', 'user'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido com id ${id} não encontrado.`);
    }
    return pedido;
  }

  private async getProdutosFromIds(produtoIds: number[]): Promise<Produto[]> {
    const produtos: Produto[] = [];
    for (const id of produtoIds) {
      const produto = await this.produtoRepository.findOne({ where: { id } });
      if (!produto) {
        throw new NotFoundException(`Produto com id ${id} não encontrado.`);
      }
      produtos.push(produto);
    }
    return produtos;
  }

  async adicionarPedido(descricao: string, userId: number, produtoIds: any[]): Promise<void> {
    if (!produtoIds || !Array.isArray(produtoIds) || produtoIds.length === 0) {
      throw new BadRequestException('Produtos são obrigatórios e deve haver pelo menos um.');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const produtos = await this.getProdutosFromIds(
      produtoIds.map((p) => (typeof p === 'object' ? p.id : p)),
    );

    const pedido = this.pedidoRepository.create({
      descricao,
      user,
      produtos,
    });

    pedido.total = produtos.reduce((sum, p) => sum + Number(p.preco) * Number(p.quantidade), 0);

    await this.pedidoRepository.save(pedido);
  }

  async listarPedidos(): Promise<Pedidos[]> {
    return await this.pedidoRepository.find({ relations: ['produtos', 'user'] });
  }

  async buscarPedidoPorId(id: number): Promise<Pedidos> {
    this.validateId(id);
    return await this.validatePedidoExists(id);
  }

  async removerPedido(id: number): Promise<void> {
    this.validateId(id);
    await this.validatePedidoExists(id);
    await this.pedidoRepository.delete(id);
  }

  async atualizarPedido(id: number, pedidoData: Partial<Pedidos>): Promise<Pedidos> {
    this.validateId(id);
    const pedido = await this.validatePedidoExists(id);
    Object.assign(pedido, pedidoData);
    return await this.pedidoRepository.save(pedido);
  }
}
