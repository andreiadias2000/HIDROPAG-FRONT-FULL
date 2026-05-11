import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filiais } from './entities/filiais.entity';

@Injectable()
export class FiliaisService {
  constructor(
    @InjectRepository(Filiais)
    private readonly repository: Repository<Filiais>,
  ) {}

  async inserir(dados: Filiais): Promise<Filiais> {
    return await this.repository.save(dados);
  }

  async listar(): Promise<Filiais[]> {
    return await this.repository.find({
      relations: ['obras', 'usuarios'], // Traz os vínculos da filial[cite: 9]
    });
  }

  async buscarPorId(id: string): Promise<Filiais> {
    const filial = await this.repository.findOne({
      where: { id: id as any },
      relations: ['obras', 'usuarios'],
    });

    if (!filial) {
      throw new NotFoundException(`Filial com ID ${id} não encontrada`);
    }
    return filial;
  }

  async alterar(id: string, dados: Partial<Filiais>): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.repository.update(id, dados);
    }
  }

  async excluir(id: string): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.repository.delete(id);
    }
  }
}