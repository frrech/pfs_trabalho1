import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/auth.service';
import { UserRepository } from '../repository/user.repository';

export interface AuthenticatedRequest extends Request {
    user?: { userId: number; email: string };
}

export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService(new UserRepository());
    }

    public authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                res.status(401).json({ message: 'Token não fornecido' });
                return;
            }

            // Expected format: "Bearer <token>"
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                res.status(401).json({ message: 'Formato de token inválido' });
                return;
            }

            const token = parts[1];
            const decoded = this.authService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Token inválido' });
        }
    };
}
