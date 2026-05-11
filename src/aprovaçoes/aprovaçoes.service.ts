import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { APROVACOES } from './entities/aprovaçoe.entity';

@Injectable()
export class AprovaçoesService {
  constructor(
    @InjectRepository(APROVACOES)
    private readonly repository: Repository<APROVACOES>,
  ) {}

  // Salva uma nova decisão (Aprovar/Reprovar)
  async inserir(dados: APROVACOES): Promise<APROVACOES> {
    return await this.repository.save(dados);
  }

  // Lista o histórico completo de todas as notas
  async listar(): Promise<APROVACOES[]> {
    return await this.repository.find({
      relations: ['usuario', 'nota'], // Mostra quem aprovou e qual nota foi
    });
  }

  // Busca uma aprovação específica
  async buscarPorId(id: string): Promise<APROVACOES> {
    const registro = await this.repository.findOne({
      where: { id: id as any },
      relations: ['usuario', 'nota'],
    });

    if (!registro) {
      throw new NotFoundException(`Registro de aprovação ${id} não encontrado`);
    }
    return registro;
  }

  // Excluir (caso precise cancelar um registro)
  async excluir(id: string): Promise<void> {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.repository.delete(id);
    }
  }
}
