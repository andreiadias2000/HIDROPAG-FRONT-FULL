//app.module
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source'; 
import { FiliaisModule } from './filiais/filiais.module';
import { UsuariosModule } from './usuarios/usuarios.module'; 
import { NotasFiscaisModule } from './notas-fiscais/notas-fiscais.module';
import { AprovaçoesModule } from './aprovaçoes/aprovaçoes.module';
import { ObrasEmpreendimentosModule } from './obras-empreendimentos/obras-empreendimentos.module';
import { LoginService } from './usuarios/login.service';
import { TokenMiddleware } from './common/middlewares/token.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    FiliaisModule,
    UsuariosModule,
    NotasFiscaisModule,
    AprovaçoesModule,
    ObrasEmpreendimentosModule, // Removi a duplicata do FiliaisModule que estava aqui embaixo
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly loginService: LoginService) {}

  configure(consumer: MiddlewareConsumer) {
    // Criamos a instância do middleware passando o serviço de login
    const tokenMiddleware = new TokenMiddleware(this.loginService);

    consumer
      .apply(tokenMiddleware.verificarAcesso)
      .exclude(
        { path: 'usuarios/login', method: RequestMethod.POST }, // Não pede token no login
        { path: 'usuarios', method: RequestMethod.POST }        // Não pede token no cadastro (opcional)
      )
      .forRoutes(
        'usuarios', // Protege todas as outras rotas de usuários (Get, Put, Delete)
        'NOTAS',    // Protege as rotas de Notas Fiscais
        'OBRAS'     // Protege as rotas de Obras
      );
  }
}