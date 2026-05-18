import { PartialType } from '@nestjs/swagger';
import { CreateNotasFiscaiDto } from './create-notas-fiscai.dto';

export class UpdateNotasFiscaiDto extends PartialType(CreateNotasFiscaiDto) {}