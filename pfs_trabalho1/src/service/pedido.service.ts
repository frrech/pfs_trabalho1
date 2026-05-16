import { PedidoRepository } from "../repository/pedido.repository";
import { ProdutoRepository } from "../repository/produto.repository";
import { Pedidos } from "../entity/Pedidos";
import { ValidationError } from "../error/validation_error";
import { Produto } from "../entity/Produto";
import { User } from "../entity/User";

import { UserRepository } from "../repository/user.repository";

export class PedidoService {
    private pedidoRepository: PedidoRepository;
    private produtoRepository: ProdutoRepository;
    private userRepository: UserRepository;

    constructor(pedidoRepository: PedidoRepository, produtoRepository: ProdutoRepository, userRepository?: UserRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.userRepository = userRepository || new UserRepository();
    }

    private validateId(id: number): void {
        if (id <= 0) {
            throw new ValidationError("O ID do pedido deve ser um número positivo.", 400);
        }
    }

    private async validatePedidoExists(id: number): Promise<Pedidos> {
        const pedido = await this.pedidoRepository.findById(id);
        if (!pedido) {
            throw new ValidationError(`Pedido com id ${id} não encontrado.`, 404);
        }
        return pedido;
    }

    // Fetch real Produto entities from database
    private async getProdutosFromIds(produtoIds: number[]): Promise<Produto[]> {
        const produtos: Produto[] = [];
        for (const id of produtoIds) {
            const produto = await this.produtoRepository.findById(id);
            if (!produto) {
                throw new ValidationError(`Produto com id ${id} não encontrado.`, 404);
            }
            produtos.push(produto);
        }
        return produtos;
    }

    public async adicionarPedido(descricao: string, userId: number, produtoIds: any[]): Promise<void> {
        if (!produtoIds || !Array.isArray(produtoIds) || produtoIds.length === 0) {
            throw new ValidationError("Produtos são obrigatórios e deve haver pelo menos um.", 400);
        }

        // Fetch managed User entity from database
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ValidationError("Usuário não encontrado.", 404);
        }

        // Fetch managed Produto entities from database
        const produtos = await this.getProdutosFromIds(
            produtoIds.map(p => typeof p === 'object' ? p.id : p)
        );

        // Create pedido with managed entities
        const pedido = new Pedidos();
        pedido.descricao = descricao;
        pedido.user = user;
        pedido.produtos = produtos;
        
        // Calculate total BEFORE saving
        pedido.total = produtos.reduce((sum, p) => sum + (Number(p.preco) * Number(p.quantidade)), 0);

        await this.pedidoRepository.save(pedido);
    }

    public async listarPedidos(): Promise<Pedidos[]> {
        return await this.pedidoRepository.findAll();
    }

    public async buscarPedidoPorId(id: number): Promise<Pedidos> {
        this.validateId(id);
        return await this.validatePedidoExists(id);
    }

    public async removerPedido(id: number): Promise<void> {
        this.validateId(id);
        await this.validatePedidoExists(id);
        await this.pedidoRepository.delete(id);
    }

    public async atualizarPedido(id: number, pedido: Pedidos): Promise<void> {
        this.validateId(id);
        await this.validatePedidoExists(id);
        await this.pedidoRepository.update(id, pedido);
    }
}