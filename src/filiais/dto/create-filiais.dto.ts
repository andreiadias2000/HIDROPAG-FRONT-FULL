//src/filiais/dto/create-filiai.dto.ts


import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilialDto {
  @ApiProperty({ example: 'Filial Porto Alegre' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  nome!: string;

  @ApiProperty({ example: 'Porto Alegre' })
  @IsString({ message: 'A cidade deve ser um texto' })
  @IsNotEmpty({ message: 'O campo cidade é obrigatório' })
  cidade!: string;
}