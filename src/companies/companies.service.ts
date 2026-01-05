import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, ILike, Brackets } from 'typeorm';
import { SearchCompanyDto } from './dto/search-company.dto';
import { SearchCompanyResponse } from 'types/company';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = await this.companyRepository.create(createCompanyDto);
      return this.companyRepository.save(company);
    } catch (e) {
      throw new Error(e);
    }
  }

  async search(userId: string, searchCompanyDto: SearchCompanyDto): Promise<SearchCompanyResponse> {
    const limit = searchCompanyDto.limit ?? 10;
    const skip = ((searchCompanyDto.page ?? 1) - 1) * limit;
    const keyword = searchCompanyDto.keyword || '';

    const query = this.companyRepository.createQueryBuilder('c')
      .leftJoin('watchlists', 'w', 'w.symbol = c.symbol AND w.user_id = :userId', { userId })
      .select('c.*')
      .addSelect('CASE WHEN w.id IS NOT NULL THEN true ELSE false END', 'is_watchlist')
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

    query
      .orderBy('c.marketCapitalization', 'DESC')
      .limit(limit)
      .offset(skip);

    const [companies, total] = await Promise.all([
      query.getRawMany(),
      this.getSearchCount(keyword)
    ]);

    return {
      total,
      companies
    };
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

  findNonUpdatedCompany() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return this.companyRepository.find({
        where:
        {
          marketCapitalization: IsNull(),
          type: 'Common Stock',
          delisted: false
        },
        order: { id: 'ASC' }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  findAll() {
    try {
      return this.companyRepository.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(userId: string, symbol: string) {
    const splittedSymbol = symbol.split('-');
    if (splittedSymbol.length != 2) {
      throw new HttpException('Invalid symbol format', HttpStatus.BAD_REQUEST);
    }
    try {
      const company = await this.companyRepository.createQueryBuilder("c")
        .leftJoin('watchlists', 'w', 'w.symbol = c.symbol AND w.user_id = :userId', { userId })
        .select('c.*')
        .addSelect('CASE WHEN w.id IS NOT NULL THEN true ELSE false END', 'is_watchlist')
        .where("c.exchange = :exchange", { exchange: splittedSymbol[0].toUpperCase() })
        .andWhere("c.symbol = :symbol", { symbol: splittedSymbol[1].toUpperCase() })
        .andWhere("c.delisted = :delisted", { delisted: false })
        .getRawOne();
      return company;
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
