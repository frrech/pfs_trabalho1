import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class AuthRouter {
    private authController: AuthController;
    private authMiddleware: AuthMiddleware;
    private router: Router;

    constructor(authController: AuthController) {
        this.authController = authController;
        this.authMiddleware = new AuthMiddleware();
        this.router = Router();
    }

    public setupRoutes(app: any): void {
        app.use("/auth", this.router);
        this.router.post("/register", (req: any, res: any) => this.authController.register(req, res));
        this.router.post("/login", (req: any, res: any) => this.authController.login(req, res));
        this.router.post("/refresh", (req: any, res: any) => this.authController.refreshToken(req, res));
        this.router.get("/me", this.authMiddleware.authenticate, (req: any, res: any) => this.authController.me(req, res));
    }
}
