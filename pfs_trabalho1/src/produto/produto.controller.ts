import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from '../entity/Produto';

@Controller('produto')
export class ProdutoController {
  constructor(private produtoService: ProdutoService) {}

  @Get()
  async listarProdutos(): Promise<Produto[]> {
    return this.produtoService.listarProdutos();
  }

  @Get(':id')
  async buscarProdutoPorId(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.buscarProdutoPorId(Number(id));
  }

  @Post()
  async adicionarProduto(@Body() body: { nome: string; preco: number; categoria: number; quantidade: number }): Promise<void> {
    return this.produtoService.adicionarProduto(body.nome, body.preco, body.categoria, body.quantidade);
  }

  @Put(':id')
  async atualizarProduto(@Param('id') id: string, @Body() produto: Partial<Produto>): Promise<Produto> {
    return this.produtoService.atualizarProduto(Number(id), produto);
  }

  @Delete(':id')
  async removerProduto(@Param('id') id: string): Promise<void> {
    return this.produtoService.removerProduto(Number(id));
  }

  @Post(':id/depositar')
  async depositar(@Param('id') id: string, @Body() body: { quantidade: number }): Promise<Produto> {
    return this.produtoService.depositar(Number(id), body.quantidade);
  }

  @Post(':id/retirar')
  async retirar(@Param('id') id: string, @Body() body: { quantidade: number }): Promise<Produto> {
    return this.produtoService.retirar(Number(id), body.quantidade);
  }
}
