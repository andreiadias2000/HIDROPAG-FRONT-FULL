// import { Module } from '@nestjs/common';
// import { AprovaçoesService } from './aprovaçoes.service';
// import { AprovaçoesController } from './aprovaçoes.controller';

// @Module({
//   controllers: [AprovaçoesController],
//   providers: [AprovaçoesService],
// })
// export class AprovaçoesModule {}


// src/aprovaçoes/aprovaçoes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AprovaçoesService } from './aprovaçoes.service';
import { AprovaçoesController } from './aprovaçoes.controller';
import { APROVACOES } from './entities/aprovaçoe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([APROVACOES])],
  controllers: [AprovaçoesController],
  providers: [AprovaçoesService],
})
export class AprovaçoesModule {}