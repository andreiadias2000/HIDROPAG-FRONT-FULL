//filiais.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Obras } from "../../obras-empreendimentos/entities/obras-empreendimento.entity";
import { Usuarios } from "../../usuarios/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('FILIAIS')
export class Filiais {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({nullable: false, unique: true}) //nao pode nulo e duplicado
    @ApiProperty({ example: 'Filial Porto Alegre', description: 'Nome da unidade' })
    nome?: string;

    @Column({ nullable: false })
    @ApiProperty({ example: 'Porto Alegre', description: 'Cidade onde a filial está alocada' })
    cidade?: string;
    
    // CORREÇÃO: O campo em Obras chama-se 'filial' (singular)
    
    @OneToMany(() => Obras, (obra) => obra.filial) // Ajustado para bater com a classe Obras[cite: 9, 13]
    obras?: Obras[];

   
    @OneToMany(() => Usuarios, (usuario) => usuario.filial)
    usuarios?: Usuarios[];
}

