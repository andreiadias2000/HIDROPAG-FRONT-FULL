import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity'; // Certifique-se de criar este caminho
import { HashService } from '../common/middlewares/hash.service';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuarios)
    private readonly repository: Repository<Usuarios>,
    
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,

    private readonly hashService: HashService,
  ) {}

  /**
   * Este método roda automaticamente sempre que o servidor sobe.
   * Ele garante que os perfis existam e que haja um administrador Root.
   */
  
  async onModuleInit() {
    const nomesPerfis = ['root', 'gestor', 'lancador', 'leitor'];
    
    // 1. Garante os perfis
    for (const nome of nomesPerfis) {
      const perfilExiste = await this.perfilRepository.findOne({ where: { nome } });
      if (!perfilExiste) {
        // Usando save(create()) para garantir a tipagem correta
        const novoPerfil = this.perfilRepository.create({ nome });
        await this.perfilRepository.save(novoPerfil);
      }
    }

    // 2. Cria o usuário Root inicial
    const emailRoot = 'admin@hidropag.com';
    const rootExiste = await this.repository.findOne({ where: { email: emailRoot } });

    if (!rootExiste) {
      const perfilRoot = await this.perfilRepository.findOne({ where: { nome: 'root' } });

      // Correção do Erro: Verificamos se o perfil foi encontrado antes de criar o usuário
      if (perfilRoot) {
        const senhaHashed = await this.hashService.gerarHash('Admin#2026');

        // Forçamos o tipo para DeepPartial para evitar o erro de sobrecarga
        const dadosUsuario = {
          nome: 'Administrador Root',
          email: emailRoot,
          senha: senhaHashed,
          perfil: perfilRoot, // Agora o TS sabe que não é null
        };

        const novoRoot = this.repository.create(dadosUsuario);
        await this.repository.save(novoRoot);
        console.log('🚀 [Seed] Perfis e Usuário ROOT criados com sucesso!');
      } else {
        console.error('❌ Erro: Perfil "root" não encontrado para criar o admin inicial.');
      }
    }
  }
  


  async inserir(usuario: Usuarios): Promise<Usuarios> {
    if (!usuario || !usuario.email || !usuario.senha) {
      throw new BadRequestException("Falta dados obrigatórios");
    }

    const usuarioExistente = await this.repository.findOne({
      where: { email: usuario.email }
    });

    if (usuarioExistente) {
      throw new BadRequestException("Este e-mail já está cadastrado no sistema.");
    }

    // Criptografia da senha antes de salvar
    usuario.senha = await this.hashService.gerarHash(usuario.senha);

    return await this.repository.save(usuario);
  }

  async listar(): Promise<Usuarios[]> {
    return await this.repository.find({
      relations: ['filial', 'perfil'], // Adicionado perfil na listagem
    });
  }

  async buscarPorId(id: number): Promise<Usuarios> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['filial', 'aprovacoes', 'perfil'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async alterar(id: number, usuario: Usuarios): Promise<void> {
    const usuarioExiste = await this.buscarPorId(id);
    
    if (usuarioExiste) {
      if (usuario.senha) {
        usuario.senha = await this.hashService.gerarHash(usuario.senha);
      }
      
      // Removemos o ID do objeto para evitar tentativa de alterar a chave primária
      delete usuario.id; 
      
      await this.repository.update(id, usuario);
    }
  }

  async excluir(id: number): Promise<void> {
    const usuarioExiste = await this.buscarPorId(id);
    if (usuarioExiste) {
      await this.repository.delete(id);
    }
  }
}