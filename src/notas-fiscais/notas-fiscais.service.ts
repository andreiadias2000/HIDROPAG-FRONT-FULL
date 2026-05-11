// notas-fiscais.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notas } from './entities/notas-fiscais.entity';

@Injectable()
export class NotasFiscaisService {
  constructor(
    @InjectRepository(Notas)
    private readonly repository: Repository<Notas>,
  ) {}

  // Criar uma nota
  // async inserir(nota: Notas): Promise<Notas> {
  //   return await this.repository.save(nota);
  // }
  async inserir(dados: Notas) {
  const novaNota = this.repository.create(dados); // O create garante que o buffer seja mantido
  return await this.repository.save(dados);
}

  // Listar todas com a Obra vinculada
  async listar(): Promise<Notas[]> {
    return await this.repository.find({
      relations: ['obra'], // Traz os dados da obra vinculada
    });
  }

  // Buscar por ID
  async buscarPorId(id: string): Promise<Notas> {
    const nota = await this.repository.findOne({
      where: { id: id as any }, // Ajuste caso seu ID seja UUID
      relations: ['obra', 'aprovacoes'],
    });

    if (!nota) {
      throw new NotFoundException(`Nota Fiscal com ID ${id} não encontrada`);
    }
    return nota;
  }

  // Atualizar (Patch/Put)
  async alterar(id: string, dados: Partial<Notas>): Promise<void> {
    const notaExiste = await this.buscarPorId(id);
    if (notaExiste) {
      await this.repository.update(id, dados);
    }
  }

  // Excluir
  async excluir(id: string): Promise<void> {
    const notaExiste = await this.buscarPorId(id);
    if (notaExiste) {
      await this.repository.delete(id);
    }
  }
}
