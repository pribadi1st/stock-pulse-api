import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>
  ) { }

  create(createNewsDto: CreateNewsDto) {
    return this.newsRepository.upsert(createNewsDto, ['symbol', 'headline']);
  }

  findAll(page: number) {
    return this.newsRepository.find({
      take: 10,
      skip: (page - 1) * 10,
      order: {
        datetime: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
