import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedidos } from '../entity/Pedidos';
import { Produto } from '../entity/Produto';
import { User } from '../entity/User';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedidos, Produto, User]), AuthModule],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
