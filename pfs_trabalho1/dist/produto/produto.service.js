"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Produto_1 = require("../entity/Produto");
const Categoria_1 = require("../entity/Categoria");
let ProdutoService = class ProdutoService {
    constructor(produtoRepository, categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }
    validateId(id) {
        if (id <= 0) {
            throw new common_1.BadRequestException('O ID do produto deve ser um número positivo.');
        }
    }
    async validateProdutoExists(id) {
        const produto = await this.produtoRepository.findOne({ where: { id } });
        if (!produto) {
            throw new common_1.NotFoundException(`Produto com id ${id} não encontrado.`);
        }
        return produto;
    }
    verificarProduto(nome, preco, categoria) {
        return nome.trim() === '' || preco <= 0 || !categoria || !categoria.id || categoria.id <= 0;
    }
    async adicionarProduto(nome, preco, categoriaId, quantidade) {
        if (this.verificarProduto(nome, preco, { id: categoriaId })) {
            throw new common_1.BadRequestException('Nome, preço e categoria são obrigatórios e devem ser válidos.');
        }
        const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoria com id ${categoriaId} não encontrada.`);
        }
        const produto = this.produtoRepository.create({
            nome,
            preco,
            categoria,
            quantidade,
        });
        await this.produtoRepository.save(produto);
    }
    async listarProdutos() {
        return await this.produtoRepository.find({ relations: ['categoria'] });
    }
    async buscarProdutoPorId(id) {
        this.validateId(id);
        return await this.validateProdutoExists(id);
    }
    async removerProduto(id) {
        this.validateId(id);
        const produto = await this.validateProdutoExists(id);
        await this.produtoRepository.delete(produto.id);
    }
    async atualizarProduto(id, produtoData) {
        this.validateId(id);
        const produto = await this.validateProdutoExists(id);
        if (produtoData.nome && produtoData.nome.trim() === '') {
            throw new common_1.BadRequestException('O produto informado é inválido.');
        }
        if (produtoData.preco && produtoData.preco <= 0) {
            throw new common_1.BadRequestException('O produto informado é inválido.');
        }
        Object.assign(produto, produtoData);
        return await this.produtoRepository.save(produto);
    }
    async depositar(id, quantidade) {
        this.validateId(id);
        if (quantidade <= 0) {
            throw new common_1.BadRequestException('A quantidade a ser depositada deve ser um número positivo.');
        }
        const produto = await this.validateProdutoExists(id);
        produto.quantidade += quantidade;
        return await this.produtoRepository.save(produto);
    }
    async retirar(id, quantidade) {
        this.validateId(id);
        if (quantidade <= 0) {
            throw new common_1.BadRequestException('A quantidade a ser retirada deve ser um número positivo.');
        }
        const produto = await this.validateProdutoExists(id);
        produto.quantidade -= quantidade;
        if (produto.quantidade < 0) {
            throw new common_1.BadRequestException('A quantidade do produto não pode ser negativa.');
        }
        return await this.produtoRepository.save(produto);
    }
};
exports.ProdutoService = ProdutoService;
exports.ProdutoService = ProdutoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Produto_1.Produto)),
    __param(1, (0, typeorm_1.InjectRepository)(Categoria_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProdutoService);
//# sourceMappingURL=produto.service.js.map