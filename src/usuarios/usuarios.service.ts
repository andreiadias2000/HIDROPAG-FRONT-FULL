//usuarios.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './entities/usuario.entity';
import { HashService } from '../common/middlewares/hash.service';  // Importe o seu novo serviço

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly repository: Repository<Usuarios>,
    
    // 1. Injetamos o HashService aqui
    private readonly hashService: HashService,
  ) {}

  async inserir(usuario: Usuarios): Promise<Usuarios> {
  if (!usuario || !usuario.email || !usuario.senha) {
    throw new BadRequestException("Falta dados obrigatórios");
  }

  // 1. Verifica se já existe um usuário com este e-mail
  const usuarioExistente = await this.repository.findOne({
    where: { email: usuario.email }
  });

  if (usuarioExistente) {
    // Retorna um erro 400 avisando que o e-mail já está em uso
    throw new BadRequestException("Este e-mail já está cadastrado no sistema.");
  }

  // 2. Criptografa a senha (como fizemos antes)
  usuario.senha = await this.hashService.gerarHash(usuario.senha);

  // 3. Salva no banco
  return await this.repository.save(usuario);
}

  async listar(): Promise<Usuarios[]> {
    return await this.repository.find({
      relations: ['filial'],
    });
  }

  async buscarPorId(id: number): Promise<Usuarios> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['filial', 'aprovacoes'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  async alterar(id: number, usuario: Usuarios): Promise<void> {
    const usuarioExiste = await this.buscarPorId(id);
    
    if (usuarioExiste) {
      // 3. Opcional: Se estiver alterando a senha, também precisa de hash aqui
      if (usuario.senha) {
        usuario.senha = await this.hashService.gerarHash(usuario.senha);
      }
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



// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Usuarios } from './entities/usuario.entity';

// @Injectable()
// export class UsuariosService {
//   constructor(
//     @InjectRepository(Usuarios)
//     private readonly repository: Repository<Usuarios>,
//   ) {}

//   async inserir(usuario: Usuarios): Promise<Usuarios> {
//     if (!usuario || !usuario.email || !usuario.senha) {
//       throw new BadRequestException("Falta dados obrigatorios");
//     }
//     return await this.repository.save(usuario);
//   }

//   async listar(): Promise<Usuarios[]> {
//     return await this.repository.find({
//       relations: ['filial'],
//     });
//   }

//   async buscarPorId(id: number): Promise<Usuarios> {
//     const usuario = await this.repository.findOne({
//       where: { id },
//       relations: ['filial', 'aprovacoes'],
//     });

//     if (!usuario) {
//       throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
//     }
//     return usuario;
//   }

//   async alterar(id: number, usuario: Usuarios): Promise<void> {
//     const usuarioExiste = await this.buscarPorId(id);
//     if (usuarioExiste) {
//       await this.repository.update(id, usuario);
//     }
//   }

//   async excluir(id: number): Promise<void> {
//     const usuarioExiste = await this.buscarPorId(id);
//     if (usuarioExiste) {
//       await this.repository.delete(id);
//     }
//   }
// }