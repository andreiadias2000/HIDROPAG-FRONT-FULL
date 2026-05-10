// src/obras-empreendimentos/obras-empreendimentos.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObrasEmpreendimentosService } from './obras-empreendimentos.service';
import { ObrasEmpreendimentosController } from './obras-empreendimentos.controller';
import { Obras } from './entities/obras-empreendimento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Obras])],
  controllers: [ObrasEmpreendimentosController],
  providers: [ObrasEmpreendimentosService],
})
export class ObrasEmpreendimentosModule {}
