import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { SearchCompanyDto } from './dto/search-company.dto';
import { SearchCompanyResponse } from 'types/company';
import YahooFinance from 'yahoo-finance2';
import { CreateNewsDto } from '../../src/news/dto/create-news.dto';
import { NewsService } from '../../src/news/news.service';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly newsService: NewsService

  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyRepository.create(createCompanyDto);
      return this.companyRepository.save(company);
    } catch (e) {
      throw new Error(e);
    }
  }

  async upsert(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyRepository.upsert(createCompanyDto, ['symbol']);
      return company;
    } catch (e) {
      throw new Error(e);
    }
  }

  async search(userId: string, searchCompanyDto: SearchCompanyDto): Promise<SearchCompanyResponse> {
    const limit = searchCompanyDto.limit ?? 10;
    const skip = ((searchCompanyDto.page ?? 1) - 1) * limit;
    const keyword = searchCompanyDto.keyword || '';

    const query = this.companyRepository.createQueryBuilder('c')
      .leftJoin('c.watchlists', 'w', 'w.userId = :userId', { userId })
      .addSelect('CASE WHEN w.id IS NOT NULL THEN true ELSE false END', 'c_is_watchlist')
      .where('c.type = :type', { type: 'Common Stock' })
      .andWhere('c.delisted = :delisted', { delisted: false });

    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('c.name ILIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('c.symbol ILIKE :keyword', { keyword: `%${keyword}%` });
        }),
      );
    }

    const rawResults = await query
      .orderBy('c.marketCapitalization', 'DESC')
      .limit(limit)
      .offset(skip)
      .getRawAndEntities();

    const total = await this.getSearchCount(keyword);

    const companies = rawResults.entities.map((company, index) => {
      return {
        ...company,
        isWatchlist: !!rawResults.raw[index].c_is_watchlist
      };
    });

    return { total, companies };
  }

  private async getSearchCount(keyword?: string): Promise<number> {
    const countQuery = this.companyRepository.createQueryBuilder('c')
      .where('c.type = :type', { type: 'Common Stock' })
      .andWhere('c.delisted = :delisted', { delisted: false });

    if (keyword) {
      countQuery.andWhere('(c.name ILIKE :k OR c.symbol ILIKE :k)', { k: `%${keyword}%` });
    }

    return countQuery.getCount();
  }

  private isSymbolValid(symbol: string): boolean {
    const splittedSymbol = symbol.split('-');
    if (splittedSymbol.length != 2) {
      return false;
    }
    return true
  }

  async getCompanyNews(symbol: string) {
    if (!this.isSymbolValid(symbol)) {
      throw new HttpException('Invalid symbol format', HttpStatus.BAD_REQUEST);
    }
    const splittedSymbol = symbol.split('-');
    const company = await this.companyRepository.findOne({
      where: {
        delisted: false,
        exchange: splittedSymbol[0].toUpperCase(),
        symbol: splittedSymbol[1].toUpperCase(),
      },
      relations: ["news"]
    })
    if (!company) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }
    if (company.news.length == 0) {
      await this.updateYahooNews(company);
    }
    return company.news;
  }

  private async updateYahooNews(company: Company) {
    const yahoo = new YahooFinance()
    const yahooNews = await yahoo.search(company.displaySymbol)
    if (!yahooNews) {
      return;
    }
    const news = yahooNews.news
    news.forEach(async (news) => {
      let newsDto: CreateNewsDto = {
        symbol: company.symbol,
        datetime: new Date(news.providerPublishTime),
        headline: news.title,
        image: news.thumbnail?.resolutions[0].url || '',
        source: news.publisher,
        url: news.link,
      }
      await this.newsService.create(newsDto)
    })
  }

  findNonUpdatedCompany() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return this.companyRepository.find({
        where:
        {
          // marketCapitalization: IsNull(),
          // type: 'Common Stock',
          // delisted: false,
          symbol: 'V'
        },
        order: { id: 'ASC' }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(keyword: string) {
    const limit = 20;

    const query = this.companyRepository.createQueryBuilder('c')
      .where('c.type = :type', { type: 'Common Stock' })
      .andWhere('c.delisted = :delisted', { delisted: false });

    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('c.name ILIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('c.symbol ILIKE :keyword', { keyword: `%${keyword}%` });
        }),
      );
    }

    const companies = await query
      .orderBy('c.marketCapitalization', 'DESC')
      .limit(limit)
      .getMany();

    return companies;
  }

  async findOne(userId: string, symbol: string) {
    const splittedSymbol = symbol.split('-');
    if (!this.isSymbolValid(symbol)) {
      throw new HttpException('Invalid symbol format', HttpStatus.BAD_REQUEST);
    }
    try {
      const company = await this.companyRepository.findOne({
        where: {
          delisted: false,
          exchange: splittedSymbol[0].toUpperCase(),
          symbol: splittedSymbol[1].toUpperCase(),
        },
        relations: ["watchlists"]
      })
      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }
      const { watchlists, ...companyDetail } = company;
      return {
        ...companyDetail,
        isWatchlist: !!watchlists.find((watchlist) => watchlist.userId === userId)
      }
    } catch (e) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const updatedData = await this.companyRepository.update({ id }, updateCompanyDto);
    return updatedData;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  removeBySymbol(symbol: string) {
    return this.companyRepository.delete({ symbol });
  }
}
