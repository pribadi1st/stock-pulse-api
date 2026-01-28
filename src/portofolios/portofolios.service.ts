import { Injectable } from '@nestjs/common';
import { CreatePortofolioDto } from './dto/create-portofolio.dto';
import { UpdatePortofolioDto } from './dto/update-portofolio.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from './entities/portofolio.entity';

@Injectable()
export class PortofoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portofoliosRepository: Repository<Portfolio>
  ) { }
  create(createPortofolioDto: CreatePortofolioDto) {
    return 'This action adds a new portofolio';
  }

  findAll(userId: string) {
    return this.portofoliosRepository.find({
      where: {
        userId,
      },
      relations: ['company'],
      order: {
        symbol: 'ASC'
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} portofolio`;
  }

  update(id: number, updatePortofolioDto: UpdatePortofolioDto) {
    return `This action updates a #${id} portofolio`;
  }

  remove(id: number) {
    return `This action removes a #${id} portofolio`;
  }
}
