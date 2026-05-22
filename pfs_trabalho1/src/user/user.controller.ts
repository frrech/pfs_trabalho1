import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../entity/User';
import { Pedidos } from '../entity/Pedidos';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async listarUsers(): Promise<User[]> {
    return this.userService.listarUsers();
  }

  @Get(':id')
  async buscarUserPorId(@Param('id') id: string): Promise<User> {
    return this.userService.buscarUserPorId(Number(id));
  }

  @Post()
  async adicionarUser(@Body() body: { name: string; email: string }): Promise<void> {
    return this.userService.adicionarUser(body.name, body.email);
  }

  @Put(':id')
  async atualizarUser(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
    return this.userService.atualizarUser(Number(id), user);
  }

  @Delete(':id')
  async removerUser(@Param('id') id: string): Promise<void> {
    return this.userService.removerUser(Number(id));
  }

  @Post(':userId/pedidos')
  async adicionarPedido(@Param('userId') userId: string, @Body() pedido: Pedidos): Promise<void> {
    return this.userService.adicionarPedido(Number(userId), pedido);
  }
}
