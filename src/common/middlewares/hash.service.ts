import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  // Transforma a senha (ex: "123456") em algo como "$2b$10$asdf..."
  async gerarHash(senha: string): Promise<string> {
    return await bcrypt.hash(senha, this.saltRounds);
  }

  // Compara a senha do login com o hash salvo no banco
  async comparar(senhaPlana: string, senhaHasheada: string): Promise<boolean> {
    return await bcrypt.compare(senhaPlana, senhaHasheada);
  }
}