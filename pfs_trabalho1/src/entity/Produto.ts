import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { Categoria } from "./Categoria";
import { Pedidos } from "./Pedidos";

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ type: 'double precision' })
    preco: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantidade: number;

    @ManyToOne(() => Categoria, categoria => categoria.produtos)
    @JoinColumn({ name: "categoria_id" })
    categoria: Categoria;

    @ManyToMany(() => Pedidos, pedido => pedido.produtos)
    pedidos: Pedidos[];
}
