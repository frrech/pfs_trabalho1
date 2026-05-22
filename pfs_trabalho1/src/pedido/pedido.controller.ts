import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Pedidos } from '../entity/Pedidos';

@Controller('pedidos')
@UseGuards(JwtAuthGuard)
export class PedidoController {
  constructor(private pedidoService: PedidoService) {}

  @Get()
  async listarPedidos(): Promise<Pedidos[]> {
    return this.pedidoService.listarPedidos();
  }

  @Get(':id')
  async buscarPedidoPorId(@Param('id') id: string): Promise<Pedidos> {
    return this.pedidoService.buscarPedidoPorId(Number(id));
  }

  @Post()
  async adicionarPedido(@Request() req: any, @Body() body: { descricao: string; produtos: any[] }): Promise<{ message: string }> {
    if (!body.produtos || !Array.isArray(body.produtos) || body.produtos.length === 0) {
      throw new Error('Produtos são obrigatórios e deve haver pelo menos um.');
    }

    const user = req.user;
    if (!user || !user.userId) {
      throw new Error('Usuário não autenticado.');
    }

    await this.pedidoService.adicionarPedido(body.descricao, user.userId, body.produtos);
    return { message: 'Pedido adicionado com sucesso' };
  }

  @Put(':id')
  async atualizarPedido(@Param('id') id: string, @Body() pedido: Partial<Pedidos>): Promise<Pedidos> {
    return this.pedidoService.atualizarPedido(Number(id), pedido);
  }

  @Delete(':id')
  async removerPedido(@Param('id') id: string): Promise<void> {
    return this.pedidoService.removerPedido(Number(id));
  }
}
