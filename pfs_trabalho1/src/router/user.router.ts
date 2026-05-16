import {Router} from "express";
import { UserController } from "../controller/user.controller";

export class UserRouter {
    private userController: UserController
    private router: Router;

    constructor(userController: UserController) {
        this.userController = userController;
        this.router = Router();
    }

    public setupRoutes(app: any): void {
        app.use("/users", this.router);
        this.router.post("/", (req: any, res: any) => this.userController.adicionarUser(req, res));
        this.router.get("/", (req: any, res: any) => this.userController.listarUsers(req, res));
        this.router.get("/:id", (req: any, res: any) => this.userController.buscarUserPorId(req, res));
        this.router.delete("/:id", (req: any, res: any) => this.userController.removerUser(req, res));
        this.router.put("/:id", (req: any, res: any) => this.userController.atualizarUser(req, res));
        this.router.post("/:userId/pedidos", (req: any, res: any) => this.userController.adicionarPedido(req, res));
    }
}