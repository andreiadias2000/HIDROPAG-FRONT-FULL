import { PartialType } from '@nestjs/mapped-types';
import { CreateFilialDto } from './create-filiais.dto';

export class UpdateFilialDto extends PartialType(CreateFilialDto) {}

