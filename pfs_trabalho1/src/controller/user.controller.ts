import { UserService } from "../service/user.service";
import { User } from "../entity/User";
import { Pedidos } from "../entity/Pedidos";
import { handleRequest } from "../utils/request_handler";
import { ValidationError } from "../error/validation_error";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async adicionarUser(req: any, res: any): Promise<void> {
        await handleRequest(req, res, async () => {
            const { name, email, pedidos } = req.body;
            const user = new User(name, email, "", pedidos as Pedidos[]); // Senha vazia, pois não é tratada aqui
            await this.userService.adicionarUser(user);
            console.log("Usuário adicionado com sucesso.");
        });
    }

    public async listarUsers(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.userService.listarUsers(), 200);
    }

    public async buscarUserPorId(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.userService.buscarUserPorId(Number(req.params.id)), 200);
    }

    public async removerUser(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.userService.removerUser(Number(req.params.id)), 200);
    }

    public async atualizarUser(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.userService.atualizarUser(Number(req.params.id), { ...req.body } as User), 200);
    }

    public async adicionarPedido(req: any, res: any): Promise<void> {
        await handleRequest(req, res, () => this.userService.adicionarPedido(Number(req.params.userId), { ...req.body } as Pedidos), 200);
    }
}
