import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../entity/Categoria';

@Controller('categoria')
export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  @Get()
  async listarCategorias(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  async buscarCategoriaPorId(@Param('id') id: string): Promise<Categoria> {
    return this.categoriaService.findById(Number(id));
  }

  @Post()
  async criarCategoria(@Body() body: { nome: string }): Promise<Categoria> {
    return this.categoriaService.create(body.nome);
  }

  @Put(':id')
  async atualizarCategoria(@Param('id') id: string, @Body() categoria: Partial<Categoria>): Promise<Categoria> {
    return this.categoriaService.update(Number(id), categoria);
  }

  @Delete(':id')
  async deletarCategoria(@Param('id') id: string): Promise<void> {
    return this.categoriaService.delete(Number(id));
  }
}
