import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Produto } from "./Produto";

@Entity()
export class Pedidos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    descricao: string;

    @ManyToMany(() => Produto, produto => produto.pedidos)
    @JoinTable({ name: "pedido_produtos" })
    produtos: Produto[];

    @ManyToOne(() => User, user => user.pedidos)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total: number;

    constructor() {}
}