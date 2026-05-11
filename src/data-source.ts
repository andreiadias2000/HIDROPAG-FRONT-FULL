import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { Filiais } from "./filiais/entities/filiais.entity";
import { Usuarios } from "./usuarios/entities/usuario.entity";
import { Obras } from "./obras-empreendimentos/entities/obras-empreendimento.entity";
import { Notas } from "./notas-fiscais/entities/notas-fiscais.entity";
import { APROVACOES } from "./aprovaçoes/entities/aprovaçoe.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
<<<<<<< HEAD
  host: process.env.host,// Confira se o seu termina em .com
  port: 6543,
  username: process.env.USER_NAME , // Use o formato usuario.id-do-projeto
=======
  //host: 'aws-1-us-east-1.pooler.supabase.com', // Confira se o seu termina em .com
  host: process.env.host,

  port: 6543,
  //username: 'postgres.epkespwvvpmgknzwnlkp', // Use o formato usuario.id-do-projeto
  username: process.env.USER_NAME,
>>>>>>> teste-permissoes
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  synchronize: true, // Cria as tabelas automaticamente
  //dropSchema: true,  // ATENÇÃO: Isso apaga TODAS as tabelas toda vez que o servidor reinicia
  logging: true,
  entities: [Filiais, Usuarios, Obras, Notas, APROVACOES],
  ssl: {
    rejectUnauthorized: false,
  },
});