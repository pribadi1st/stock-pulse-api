import { Test, TestingModule } from '@nestjs/testing';
import { PortofoliosService } from './portofolios.service';

describe('PortofoliosService', () => {
  let service: PortofoliosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortofoliosService],
    }).compile();

    service = module.get<PortofoliosService>(PortofoliosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
