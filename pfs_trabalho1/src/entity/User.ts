import { Pedidos } from "./Pedidos";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @OneToMany(() => Pedidos, pedidos => pedidos.user)
    pedidos: Pedidos[];
    
    @Column({ select: false }) // Exclui a senha das consultas por padrão
    password: string;

    constructor(name: string, email: string, password: string, pedidos: Pedidos[]) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.pedidos = pedidos;
    }
}