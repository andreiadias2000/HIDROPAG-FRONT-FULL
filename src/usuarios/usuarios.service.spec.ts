// src/usuarios/usuarios.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuarios } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity'; // <-- Certifique-se de que o caminho do Perfil está correto
import { HashService } from '../common/middlewares/hash.service';
import { Repository } from 'typeorm';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuariosRepository: Repository<Usuarios>;
  let perfilRepository: Repository<Perfil>;

  // 1. Mock do Repositório de Usuários
  const mockUsuariosRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  // 2. Mock do Repositório de Perfil (O QUE ESTAVA FALTANDO!)
  const mockPerfilRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  // 3. Mock do HashService
  const mockHashService = {
    hash: jest.fn().mockResolvedValue('senha_criptografada'),
    comparar: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuarios),
          useValue: mockUsuariosRepository,
        },
        {
          // Injetando o PerfilRepository simulado para resolver a dependência do Nest
          provide: getRepositoryToken(Perfil),
          useValue: mockPerfilRepository,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
      ],
    }).compile();

    service = moduleRef.get<UsuariosService>(UsuariosService);
    usuariosRepository = moduleRef.get<Repository<Usuarios>>(getRepositoryToken(Usuarios));
    perfilRepository = moduleRef.get<Repository<Perfil>>(getRepositoryToken(Perfil));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
    expect(usuariosRepository).toBeDefined();
    expect(perfilRepository).toBeDefined();
  });

  describe('listar', () => {
    it('deve retornar uma lista de usuários com sucesso', async () => {
      const resultadoEsperado = [{ id: '1', nome: 'Ivan Silva', email: 'ivan@teste.com' }];
      
      // Força o método find simulado a retornar nossos dados de teste
      mockUsuariosRepository.find.mockResolvedValue(resultadoEsperado);

      const resultado = await service.listar();

      expect(resultado).toEqual(resultadoEsperado);
      expect(mockUsuariosRepository.find).toHaveBeenCalled();
    });
  });
});