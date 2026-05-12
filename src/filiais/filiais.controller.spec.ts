import { Test, TestingModule } from '@nestjs/testing';
import { FiliaisController } from './filiais.controller';
import { FiliaisService } from './filiais.service';
import { beforeEach, describe } from 'node:test';

describe('FiliaisController', () => {
  let controller: FiliaisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiliaisController],
      providers: [FiliaisService],
    }).compile();

    controller = module.get<FiliaisController>(FiliaisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
