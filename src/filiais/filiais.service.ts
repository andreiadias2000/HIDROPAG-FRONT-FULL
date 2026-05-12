import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filiais } from './entities/filiais.entity';
import { CreateFilialDto } from './dto/create-filiais.dto';

@Injectable()
export class FiliaisService {
  constructor(
    @InjectRepository(Filiais)
    private readonly repository: Repository<Filiais>,
  ) {}

  async inserir(dados: CreateFilialDto): Promise<Filiais> {
    // 1. Busca se o nome já existe no banco
    const existe = await this.repository.findOne({
      where: { nome: dados.nome },
    });

    // 2. Se encontrar, barra na hora com erro 400 e a mensagem 
    if (existe) {
      throw new BadRequestException(`A filial com o nome "${dados.nome}" já está cadastrada.`);
    }

    // 3. Se o nome for novo, salva tranquilamente
    const novaFilial = this.repository.create(dados);
    return await this.repository.save(novaFilial);
  }

  async listar(): Promise<Filiais[]> {
    return await this.repository.find({
      relations: ['obras', 'usuarios'], // Traz os vínculos da filial
    });
  }

  async buscarPorId(id: string): Promise<Filiais> {
    const filial = await this.repository.findOne({
      where: { id: id as any },
      relations: ['obras', 'usuarios'], // Traz os vínculos da filial
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

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Filiais } from './entities/filiais.entity';

// @Injectable()
// export class FiliaisService {
//   constructor(
//     @InjectRepository(Filiais)
//     private readonly repository: Repository<Filiais>,
//   ) {}

//   async inserir(dados: Filiais): Promise<Filiais> {
//     return await this.repository.save(dados);
//   }

//   async listar(): Promise<Filiais[]> {
//     return await this.repository.find({
//       relations: ['obras', 'usuarios'], // Traz os vínculos da filial[cite: 9]
//     });
//   }

//   async buscarPorId(id: string): Promise<Filiais> {
//     const filial = await this.repository.findOne({
//       where: { id: id as any },
//       relations: ['obras', 'usuarios'],
//     });

//     if (!filial) {
//       throw new NotFoundException(`Filial com ID ${id} não encontrada`);
//     }
//     return filial;
//   }

//   async alterar(id: string, dados: Partial<Filiais>): Promise<void> {
//     const existe = await this.buscarPorId(id);
//     if (existe) {
//       await this.repository.update(id, dados);
//     }
//   }

//   async excluir(id: string): Promise<void> {
//     const existe = await this.buscarPorId(id);
//     if (existe) {
//       await this.repository.delete(id);
//     }
//   }
// }