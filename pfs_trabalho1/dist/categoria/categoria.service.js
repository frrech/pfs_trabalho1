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
exports.CategoriaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Categoria_1 = require("../entity/Categoria");
let CategoriaService = class CategoriaService {
    constructor(categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    validateId(id) {
        if (id <= 0) {
            throw new common_1.BadRequestException('O ID da categoria deve ser um número positivo.');
        }
    }
    async validateCategoriaExists(id) {
        const categoria = await this.categoriaRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoria com id ${id} não encontrada.`);
        }
        return categoria;
    }
    async findAll() {
        try {
            return await this.categoriaRepository.find();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Erro ao buscar categorias: ${error.message}`);
        }
    }
    async findById(id) {
        this.validateId(id);
        return await this.validateCategoriaExists(id);
    }
    async create(nome) {
        if (!nome || nome.trim() === '') {
            throw new common_1.BadRequestException('O nome da categoria é obrigatório.');
        }
        const categoria = this.categoriaRepository.create({ nome });
        return await this.categoriaRepository.save(categoria);
    }
    async update(id, categoriaData) {
        this.validateId(id);
        const categoria = await this.validateCategoriaExists(id);
        if (categoriaData.nome && categoriaData.nome.trim() === '') {
            throw new common_1.BadRequestException('O nome da categoria é obrigatório.');
        }
        Object.assign(categoria, categoriaData);
        return await this.categoriaRepository.save(categoria);
    }
    async delete(id) {
        this.validateId(id);
        await this.validateCategoriaExists(id);
        await this.categoriaRepository.delete(id);
    }
};
exports.CategoriaService = CategoriaService;
exports.CategoriaService = CategoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Categoria_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriaService);
//# sourceMappingURL=categoria.service.js.map