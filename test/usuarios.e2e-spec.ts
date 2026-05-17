// test/usuarios.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Usuários (E2E)', () => {
  let app: INestApplication;
  let tokenAcesso: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    try {
      // Login com o administrador root para garantir a permissão no RolesGuard
      const respostaLogin = await request.default(app.getHttpServer())
        .post('/usuarios/login') 
        .send({
          email: 'admin@hidropag.com', 
          senha: 'Admin#2026' // Ajuste a senha do admin se for diferente no seu banco local
        });

      if (respostaLogin && respostaLogin.body) {
        tokenAcesso = respostaLogin.body.token_acesso || 
                      respostaLogin.body.token || 
                      respostaLogin.body.accessToken ||
                      respostaLogin.body.access_token || '';
      }
    } catch (err) {
      console.error('Erro ao tentar realizar o login inicial:', err);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST usuarios', () => {
    it('deve rejeitar a criação se o nome não for enviado (Erro 400)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          // nome omitido de propósito
          email: 'ivan_teste@teste.com',
          senha: 'Admin#2026',
          perfil: { id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' }
        })
        .expect(400); 
    });

    it('deve rejeitar a criação se a senha não for enviada (Erro 400)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: 'Ivan Silva',
          email: 'ivan_teste@teste.com',
          // senha omitida de propósito
          perfil: { id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' }
        })
        .expect(400);
    });

    it('deve criar um usuário com sucesso se todos os dados forem válidos (Criado 201)', async () => {
      return request.default(app.getHttpServer())
        .post('/usuarios')
        .set('Authorization', `Bearer ${tokenAcesso}`)
        .send({
          nome: 'Ivan Silva Teste ${sufixoDinamico}',
          email: `ivan_e2e_${Date.now()}@teste.com`, // E-mail dinâmico para evitar erro de duplicidade
          senha: 'Admin#2026', // Senha forte atendendo aos requisitos
          perfil: {
            id: '6fc13eec-a3fe-4fe4-811b-2563cb1b5f4c' // ID do perfil válido enviado como objeto aninhado
          }
        })
        .expect(201);
    });
  });
});