//src/obras-empreendimentos/obras-empreendimentos.ts


import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Filiais } from "../../filiais/entities/filiais.entity";
import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

@Entity('OBRAS')
export class Obras {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
  id?: string;

  // adicionado o unique e nullable
  @Column({ unique: true, nullable: false }) 
  @ApiProperty({ example: 'Hospital Moinhos de Vento', description: 'Nome único da Obra' })
  nome_obra!: string; // Removi o '?' pois agora é obrigatório

  // NOVO CAMPO DE CONTROLE
  @Column({ default: true })
  @ApiProperty({ example: true, description: 'Indica se a obra está ativa ou já foi concluída/arquivada' })
  ativo!: boolean;
  
  // pra garantir que a obra sempre tenha uma filial vinculada 
  @ManyToOne(() => Filiais, (filial) => filial.obras, { nullable: false })
  @JoinColumn({ name: 'filialId' }) // Define o nome da coluna de união no banco
  @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
  filial!: Filiais; // Removi o '?' pois agora é obrigatório

  @Exclude()
  @OneToMany(() => Notas, (nota) => nota.obra)
  notas?: Notas[];
}


// import { Column, Entity, PrimaryGeneratedColumn,OneToMany, ManyToOne } from "typeorm";
// import { Filiais } from "../../filiais/entities/filiais.entity";
// import { Notas } from "../../notas-fiscais/entities/notas-fiscais.entity";
// import { ApiProperty } from "@nestjs/swagger";

// @Entity('OBRAS')
// export class Obras {
//     @PrimaryGeneratedColumn('uuid')
//     @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID único da obra' })
//     id?: string;

//     @Column()
//     @ApiProperty({ example: 'Residencial Melnik Porto Alegre', description: 'Nome da Obra' })
//     nome_obra?: string;

//     @ManyToOne(() => Filiais, (filial) => filial.obras)
//     @ApiProperty({ type: () => Filiais, description: 'Filial a qual a obra pertence' })
//     filial?: Filiais;

//     @OneToMany(() => Notas, (nota) => nota.obra)
//     notas?: Notas[];
// }
