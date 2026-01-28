import { Test, TestingModule } from '@nestjs/testing';
import { PortofoliosController } from './portofolios.controller';
import { PortofoliosService } from './portofolios.service';

describe('PortofoliosController', () => {
  let controller: PortofoliosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortofoliosController],
      providers: [PortofoliosService],
    }).compile();

    controller = module.get<PortofoliosController>(PortofoliosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
