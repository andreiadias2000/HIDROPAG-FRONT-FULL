import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiliaisService } from './filiais.service';
import { FiliaisController } from './filiais.controller';
import { Filiais } from './entities/filiais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Filiais])],
  controllers: [FiliaisController],
  providers: [FiliaisService],
})
export class FiliaisModule {}