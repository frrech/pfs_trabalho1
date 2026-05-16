import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';
import { handleRequest } from '../utils/request_handler';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService(new UserRepository());
    }

    public async register(req: Request, res: Response): Promise<void> {
        await handleRequest(req, res, async () => {
            const { name, email, password } = req.body;
            const user = await this.authService.register(name, email, password);
            
            // Remove password from response
            const userWithoutPassword: any = { ...user };
            delete userWithoutPassword.password;

            return {
                message: 'Usuário registrado com sucesso',
                user: userWithoutPassword
            };
        }, 201);
    }

    public async login(req: Request, res: Response): Promise<void> {
        await handleRequest(req, res, async () => {
            const { email, password } = req.body;
            const { token, user } = await this.authService.login(email, password);

            return {
                message: 'Login realizado com sucesso',
                token,
                user
            };
        }, 200);
    }

    public async refreshToken(req: Request, res: Response): Promise<void> {
        await handleRequest(req, res, async () => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new Error('Token não fornecido');
            }

            const token = authHeader.split(' ')[1];
            const newToken = this.authService.refreshToken(token);

            return {
                message: 'Token renovado com sucesso',
                token: newToken
            };
        }, 200);
    }
    // Endpoint para obter informações do usuário autenticado
    public async me(req: any, res: Response): Promise<void> {
        await handleRequest(req, res, async () => {
            if (!req.user) {
                throw new Error('Não autenticado');
            }

            const user = await this.authService.getUserById(req.user.userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Remove password from response
            const userWithoutPassword: any = { ...user };
            delete userWithoutPassword.password;

            return userWithoutPassword;
        }, 200);
    }
}

