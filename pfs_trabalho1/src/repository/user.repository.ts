import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async save(user: User): Promise<User> {
        return this.repository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find({ relations: ["pedidos"],  });
    }

    async findById(id: number): Promise<User | null> {
        if (id && id > 0) {
            return await this.repository.findOne({ where: { id }, relations: ["pedidos"] });
        }
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ 
            where: { email }, 
            relations: ["pedidos"],
            select: ["id", "name", "email", "password", "pedidos"]
        });
    }

    async delete(id: number): Promise<void> {
        if (id && id > 0) {
            await this.repository.delete(id);
        }
        return;
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        if (id){
            const existingUser = await this.findById(id);
            if (!existingUser) {
                return null;
            }
            Object.assign(existingUser, user);
            return this.repository.save(existingUser);
        }
        return null;
    }

    async addPedido(userId: number, pedido: any): Promise<User | null> {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }
        user.pedidos.push(pedido);
        pedido.user = user; // Estabelece a relação bidirecional
        await this.repository.save(user);
        await this.repository.save(pedido);

        return this.repository.save(user);
    }
}