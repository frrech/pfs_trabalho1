import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @OneToMany(() => Produto, produto => produto.categoria)
    produtos: Produto[];

    constructor(nome: string) {
        this.nome = nome;
    }
}