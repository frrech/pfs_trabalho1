import { UserRepository } from "../repository/user.repository";
import { ValidationError } from "../error/validation_error";
import { User } from "../entity/User";
import { Pedidos } from "../entity/Pedidos";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    private verificarUser(user: User): boolean {
        const { name, email, password } = user;
        //verificar se o email está duplicado
        if (email.trim() !== "") {
            const existingUser = this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new ValidationError("Email já cadastrado", 400);
            }
            return name.trim() === "" || email.trim() === "";
        }
        //verificar se a senha está certa
        if (password.length < 6) {
            throw new ValidationError("A senha deve ter pelo menos 6 caracteres.", 400);
        }
        //verificar se a senha, o nome ou o email estão vazios
        return name.trim() === "" || email.trim() === "" || password.trim() === "";
    }

    private validateId(id: number): void {
        if (id <= 0) {
            throw new ValidationError("O ID do usuário deve ser um número positivo.", 400);
        }
    }

    private async validateUserExists(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ValidationError(`Usuário com id ${id} não encontrado.`, 404);
        }
        return user;
    }

    public async adicionarUser(user: User): Promise<void> {
        if (this.verificarUser(user)) {
            throw new ValidationError("Nome e email são obrigatórios");
        }

        await this.userRepository.save(user);
    }

    public async listarUsers() {
        return await this.userRepository.findAll();
    }

    public async buscarUserPorId(id: number) {
        this.validateId(id);
        return await this.validateUserExists(id);
    }

    public async removerUser(id: number): Promise<void> {
        this.validateId(id);
        await this.validateUserExists(id);
        await this.userRepository.delete(id);
    }

    public async atualizarUser(id: number, user: User): Promise<void> {
        this.validateId(id);
        await this.validateUserExists(id);
        if (this.verificarUser(user)) {
            throw new ValidationError("Nome e email são obrigatórios");
        }
        await this.userRepository.update(id, user);
    }

    public async adicionarPedido(userId: number, pedido: Pedidos): Promise<void> {
        this.validateId(userId);
        await this.validateUserExists(userId);
        if (!pedido || !pedido.produtos) {
            throw new ValidationError("O pedido deve conter pelo menos um produto.", 400);
        }
        if (pedido.total <= 0) {
            throw new ValidationError("O total do pedido deve ser um número positivo.", 400);
        }
        await this.userRepository.addPedido(userId, pedido);
    }
}