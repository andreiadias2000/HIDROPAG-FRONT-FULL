// src/usuarios/usuarios.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { LoginService } from './login.service'; // <-- Certifique-se de que o caminho do LoginService está correto
import { RolesGuard } from '../common/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  // 1. Mock completo do UsuariosService
  const mockUsuariosService = {
    inserir: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    alterar: jest.fn(),
    excluir: jest.fn(),
  };

  // 2. Mock do LoginService (Resolve a dependência que faltava!)
  const mockLoginService = {
    validarUsuario: jest.fn(),
    gerarToken: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          // Injetando o LoginService simulado para o construtor do controller não quebrar
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    })
      // Burlar o RolesGuard para não travar o teste por falta de token JWT
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = moduleRef.get<UsuariosController>(UsuariosController);
    service = moduleRef.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('buscarTodos', () => {
    it('deve retornar uma lista de usuários com sucesso', async () => {
      const resultadoEsperado = [{ id: 1, nome: 'Ivan Silva', email: 'ivan@teste.com' }];
      mockUsuariosService.listar.mockResolvedValue(resultadoEsperado);

      const resultado = await controller.buscarTodos();

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockUsuariosService.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe('buscarUma', () => {
    it('deve retornar um usuário específico por ID numérico', async () => {
      const usuarioMock = { id: 1, nome: 'Ivan Silva', email: 'ivan@teste.com' };
      mockUsuariosService.buscarPorId.mockResolvedValue(usuarioMock);

      // Executa passando o ID numérico 1
      const resultado = await controller.buscarUm(1);

      expect(resultado).toEqual(usuarioMock);
      expect(mockUsuariosService.buscarPorId).toHaveBeenCalledWith(1);
    });
  });
});