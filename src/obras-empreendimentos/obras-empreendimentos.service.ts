import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Obras } from './entities/obras-empreendimento.entity';

@Injectable()
export class ObrasEmpreendimentosService {
  constructor(
    @InjectRepository(Obras)
    private readonly repository: Repository<Obras>,
  ) {}

  async inserir(dados: Obras): Promise<Obras> {
    return await this.repository.save(dados);
  }

  async listar(): Promise<Obras[]> {
    return await this.repository.find({
      relations: ['filial', 'notas'], // Traz a filial e as notas da obra[cite: 13]
    });
  }

  async buscarPorId(id: string): Promise<Obras> {
    const obra = await this.repository.findOne({
      where: { id: id as any },
      relations: ['filial', 'notas'],
    });

    if (!obra) {
      throw new NotFoundException(`Obra com ID ${id} não encontrada`);
    }
    return obra;
  }

  async alterar(id: string, dados: Partial<Obras>): Promise<void> {
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
