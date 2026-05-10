//usuarios.modulle.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from './entities/usuario.entity';
import { LoginService } from './login.service';
import { HashService } from '../common/middlewares/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios])], // Permite o uso do Repository[cite: 5]
  controllers: [UsuariosController],
  providers: [UsuariosService, LoginService,HashService],
  exports: [LoginService],
})
export class UsuariosModule {}