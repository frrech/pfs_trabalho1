import { PedidoService } from '../service/pedido.service';
import { PedidoRepository } from '../repository/pedido.repository';
import { ProdutoRepository } from '../repository/produto.repository';
import { UserRepository } from '../repository/user.repository';
import { ValidationError } from '../error/validation_error';
import { Pedidos } from '../entity/Pedidos';

describe('PedidoService', () => {
  let pedidoService: PedidoService;
  let pedidoRepository: jest.Mocked<PedidoRepository>;
  let produtoRepository: jest.Mocked<ProdutoRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    pedidos: [],
    password: 'hashed',
  };

  const mockProduto = {
    id: 1,
    nome: 'Notebook',
    preco: 3500,
    quantidade: '5.00',
    categoria: { id: 1, nome: 'Eletrônicos', produtos: [] },
    pedidos: [],
  };

  const mockPedido: Pedidos = {
    id: 1,
    descricao: 'Pedido de teste',
    total: 17500.00,
    user: mockUser as any,
    produtos: [mockProduto as any],
  };

  beforeEach(() => {
    pedidoRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      addProdutosToPedido: jest.fn(),
    } as any;

    produtoRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    } as any;

    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      addPedido: jest.fn(),
    } as any;

    pedidoService = new PedidoService(pedidoRepository, produtoRepository, userRepository);
  });

  describe('adicionarPedido', () => {
    it('should create a new pedido with valid data', async () => {
      userRepository.findById.mockResolvedValue(mockUser as any);
      produtoRepository.findById.mockResolvedValue(mockProduto as any);
      pedidoRepository.save.mockResolvedValue(mockPedido);

      await pedidoService.adicionarPedido('Pedido de teste', 1, [{ id: 1 }]);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(produtoRepository.findById).toHaveBeenCalledWith(1);
      expect(pedidoRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(pedidoService.adicionarPedido('Pedido de teste', 999, [{ id: 1 }])).rejects.toThrow(
        'Usuário não encontrado'
      );
    });

    it('should throw error if produtos array is empty', async () => {
      await expect(pedidoService.adicionarPedido('Pedido de teste', 1, [])).rejects.toThrow(
        'Produtos são obrigatórios'
      );
    });

    it('should throw error if produto not found', async () => {
      userRepository.findById.mockResolvedValue(mockUser as any);
      produtoRepository.findById.mockResolvedValue(null);

      await expect(pedidoService.adicionarPedido('Pedido de teste', 1, [{ id: 999 }])).rejects.toThrow(
        'Produto com id 999 não encontrado'
      );
    });

    it('should calculate total correctly', async () => {
      userRepository.findById.mockResolvedValue(mockUser as any);
      produtoRepository.findById.mockResolvedValue(mockProduto as any);
      
      let savedPedido: any;
      pedidoRepository.save.mockImplementation((pedido) => {
        savedPedido = pedido;
        return Promise.resolve({ ...pedido, id: 1 });
      });

      await pedidoService.adicionarPedido('Pedido de teste', 1, [{ id: 1 }]);

      expect(savedPedido.total).toBe(17500); // 3500 * 5
    });
  });

  describe('listarPedidos', () => {
    it('should return all pedidos', async () => {
      pedidoRepository.findAll.mockResolvedValue([mockPedido]);

      const result = await pedidoService.listarPedidos();

      expect(result).toEqual([mockPedido]);
      expect(pedidoRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array if no pedidos exist', async () => {
      pedidoRepository.findAll.mockResolvedValue([]);

      const result = await pedidoService.listarPedidos();

      expect(result).toEqual([]);
    });
  });

  describe('buscarPedidoPorId', () => {
    it('should return pedido by id', async () => {
      pedidoRepository.findById.mockResolvedValue(mockPedido);

      const result = await pedidoService.buscarPedidoPorId(1);

      expect(result).toEqual(mockPedido);
      expect(pedidoRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error if pedido not found', async () => {
      pedidoRepository.findById.mockResolvedValue(null);

      await expect(pedidoService.buscarPedidoPorId(999)).rejects.toThrow(
        'Pedido com id 999 não encontrado'
      );
    });

    it('should throw error if id is invalid', async () => {
      await expect(pedidoService.buscarPedidoPorId(0)).rejects.toThrow(
        'O ID do pedido deve ser um número positivo'
      );

      await expect(pedidoService.buscarPedidoPorId(-1)).rejects.toThrow(
        'O ID do pedido deve ser um número positivo'
      );
    });
  });

  describe('removerPedido', () => {
    it('should delete pedido by id', async () => {
      pedidoRepository.findById.mockResolvedValue(mockPedido);

      await pedidoService.removerPedido(1);

      expect(pedidoRepository.findById).toHaveBeenCalledWith(1);
      expect(pedidoRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if pedido not found', async () => {
      pedidoRepository.findById.mockResolvedValue(null);

      await expect(pedidoService.removerPedido(999)).rejects.toThrow(
        'Pedido com id 999 não encontrado'
      );
    });

    it('should throw error if id is invalid', async () => {
      await expect(pedidoService.removerPedido(0)).rejects.toThrow();
    });
  });
});
