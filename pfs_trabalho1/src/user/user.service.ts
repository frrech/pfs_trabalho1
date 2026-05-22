import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { Pedidos } from '../entity/Pedidos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private validateId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException('O ID do usuário deve ser um número positivo.');
    }
  }

  private async validateUserExists(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pedidos'],
    });
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado.`);
    }
    return user;
  }

  async adicionarUser(name: string, email: string): Promise<void> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Nome é obrigatório');
    }
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email é obrigatório');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    const user = this.userRepository.create({
      name,
      email,
      password: '',
      pedidos: [],
    });

    await this.userRepository.save(user);
  }

  async listarUsers(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['pedidos'] });
  }

  async buscarUserPorId(id: number): Promise<User> {
    this.validateId(id);
    return await this.validateUserExists(id);
  }

  async removerUser(id: number): Promise<void> {
    this.validateId(id);
    await this.validateUserExists(id);
    await this.userRepository.delete(id);
  }

  async atualizarUser(id: number, userData: Partial<User>): Promise<User> {
    this.validateId(id);
    const user = await this.validateUserExists(id);

    if (userData.name && userData.name.trim() === '') {
      throw new BadRequestException('Nome não pode estar vazio');
    }
    if (userData.email && userData.email.trim() === '') {
      throw new BadRequestException('Email não pode estar vazio');
    }

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async adicionarPedido(userId: number, pedido: Pedidos): Promise<void> {
    this.validateId(userId);
    const user = await this.validateUserExists(userId);

    if (!pedido || !pedido.produtos || pedido.produtos.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um produto.');
    }
    if (pedido.total <= 0) {
      throw new BadRequestException('O total do pedido deve ser um número positivo.');
    }

    user.pedidos.push(pedido);
    pedido.user = user;
    await this.userRepository.save(user);
  }
}
