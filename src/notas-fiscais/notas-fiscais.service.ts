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
  async inserir(dados: Notas) {
    const novaNota = this.repository.create(dados); 
    return await this.repository.save(novaNota);
  }

  // Listar todas com a Obra vinculada (Rápido, SEM o PDF pesado)
  async listar(): Promise<Notas[]> {
    return await this.repository.find({
      select: {
        id: true,
        numero_nf: true,
        fornecedor: true,
        data_vencimento: true,
        valor_total: true,
        quant_parcelas: true,
        status: true,
        tem_anexo: true, // <-- Trazemos a informação "true/false"
        obra: {
          id: true,
          nome_obra: true,
        }
      },
      relations: ['obra'], 
    });
  }

  // 1. GET NORMAL POR ID: Rápido e não trava o Swagger
  async buscarPorId(id: string): Promise<Notas> {
    const nota = await this.repository.findOne({
      where: { id: id as any },
      relations: ['obra'],
      select: {
        id: true,
        numero_nf: true,
        fornecedor: true,
        data_vencimento: true,
        valor_total: true,
        quant_parcelas: true,
        status: true,
        tem_anexo: true, // <-- Adicionado aqui também!
        obra: {
          id: true,
          nome_obra: true,
          ativo: true
        }
      }
    });

    if (!nota) {
      // Correção: Usando crases (`) em vez de aspas duplas (") para a variável ${id} funcionar
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
    }
    return nota;
  }

  // 2. NOVO: Método usado pelo Controller apenas na hora do Download!
  async buscarNotaComPdf(id: string): Promise<Notas> {
    const nota = await this.repository.findOne({
      where: { id: id as any },
      // Como NÃO colocamos o "select" aqui, ele vai trazer o arquivoPdf pesado do banco
    });

    if (!nota) {
      throw new NotFoundException(`Nota fiscal com ID ${id} não encontrada`);
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