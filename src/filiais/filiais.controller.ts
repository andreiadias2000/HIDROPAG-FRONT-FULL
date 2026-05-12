import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FiliaisService } from './filiais.service';

import { CreateFilialDto } from './dto/create-filiais.dto'; 
import { UpdateFilialDto } from './dto/update-filiais.dto'; 
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('FILIAIS')
@Controller('FILIAIS')
export class FiliaisController {
  constructor(private readonly filiaisService: FiliaisService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra uma nova filial' })
  @ApiResponse({ status: 201, description: 'Filial criada com sucesso!' })
  @ApiBadRequestResponse({ description: 'Erro de validação (Campos obrigatórios ou Nome duplicado)' })
  async criar(@Body() dados: CreateFilialDto) {
    return await this.filiaisService.inserir(dados);
  }

  @Get()
  async buscarTodas() {
    return await this.filiaisService.listar();
  }

  @Get(':id')
  async buscarUma(@Param('id') id: string) {
    return await this.filiaisService.buscarPorId(id);
  }

  @Put(':id')
  async atualizar(@Param('id') id: string, @Body() dados: UpdateFilialDto) {
    return await this.filiaisService.alterar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id') id: string) {
    return await this.filiaisService.excluir(id);
  }
}
// import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
// import { FiliaisService } from './filiais.service';
// import { Filiais } from './entities/filiais.entity';

// @Controller('FILIAIS')
// export class FiliaisController {
//   constructor(private readonly filiaisService: FiliaisService) {}

//   @Post()
//   async criar(@Body() dados: Filiais) {
//     return await this.filiaisService.inserir(dados);
//   }
  

//   @Get()
//   async buscarTodas() {
//     return await this.filiaisService.listar();
//   }

//   @Get(':id')
//   async buscarUma(@Param('id') id: string) {
//     return await this.filiaisService.buscarPorId(id);
//   }

//   @Put(':id')
//   async atualizar(@Param('id') id: string, @Body() dados: Partial<Filiais>) {
//     return await this.filiaisService.alterar(id, dados);
//   }

//   @Delete(':id')
//   async remover(@Param('id') id: string) {
//     return await this.filiaisService.excluir(id);
//   }
// }