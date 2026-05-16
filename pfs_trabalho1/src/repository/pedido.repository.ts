import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";
import { Pedidos } from "../entity/Pedidos";

export class PedidoRepository {
    private repository: Repository<Pedidos>;

    constructor() {
        this.repository = AppDataSource.getRepository(Pedidos);
    }

    async save(pedido: Pedidos): Promise<Pedidos> {
        return this.repository.save(pedido);
    }

    // Fixed: Load correct relations (produtos and user, not pedidos)
    async findAll(): Promise<Pedidos[]> {
        return await this.repository.find({ relations: ["produtos", "user"] });
    }

    async findById(id: number): Promise<Pedidos | null> {
        if (id && id > 0) {
            return await this.repository.findOne({ 
                where: { id }, 
                relations: ["produtos", "user"] 
            });
        }
        return null;
    }

    async delete(id: number): Promise<void> {
        if (id && id > 0) {
            await this.repository.delete(id);
        }
    }

    async update(id: number, pedido: Partial<Pedidos>): Promise<Pedidos | null> {
        if (id && id > 0) {
            const existingPedido = await this.findById(id);
            if (!existingPedido) {
                return null;
            }
            Object.assign(existingPedido, pedido);
            return this.repository.save(existingPedido);
        }
        return null;
    }

    // Fixed: Proper method to add produtos to an existing pedido
    async addProdutosToPedido(pedidoId: number, produtos: any[]): Promise<Pedidos | null> {
        const pedido = await this.findById(pedidoId);
        if (!pedido) {
            return null;
        }
        pedido.produtos = [...(pedido.produtos || []), ...produtos];
        return this.repository.save(pedido);
    }
}
