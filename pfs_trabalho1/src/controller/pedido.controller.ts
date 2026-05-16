import { PedidoService } from "../service/pedido.service";
import { Pedidos } from "../entity/Pedidos";
import { handleRequest } from "../utils/request_handler";
import { ValidationError } from "../error/validation_error";

export class PedidoController {
    private pedidoService: PedidoService;

    constructor(pedidoService: PedidoService) {
        this.pedidoService = pedidoService;
    }

    public async adicionarPedido(req: any, res: any): Promise<void> {
        await handleRequest(req, res, async () => {
            const { descricao, produtos } = req.body;
            
            if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
                throw new ValidationError("Produtos são obrigatórios e deve haver pelo menos um.", 400);
            }
            
            const user = req.user;
            if (!user || !user.userId) {
                throw new ValidationError("Usuário não autenticado.", 401);
            }
            
            // Pass userId to service, let it fetch full user from DB
            await this.pedidoService.adicionarPedido(descricao, user.userId, produtos);
            return { message: "Pedido adicionado com sucesso" };
        }, 201);
    }

    public async listarPedidos(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.pedidoService.listarPedidos(), 200);
    }

    public async buscarPedidoPorId(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.pedidoService.buscarPedidoPorId(Number(req.params.id)), 200);
    }

    public async removerPedido(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.pedidoService.removerPedido(Number(req.params.id)), 200);
    }

    public async atualizarPedido(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.pedidoService.atualizarPedido(Number(req.params.id), { ...req.body } as Pedidos), 200);
    }
}