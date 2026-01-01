import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, ILike } from 'typeorm';
import { SearchCompanyDto } from './dto/search-company.dto';
import { SearchCompanyResponse } from 'types/company';

@Injectable()
export class CompaniesService {
  private DEFAULT_SEARCH_VALUE: SearchCompanyDto = {
    keyword: '',
    limit: 10,
    page: 1
  };

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

  async search(searchCompanyDto: SearchCompanyDto = this.DEFAULT_SEARCH_VALUE): Promise<SearchCompanyResponse> {
    // If no keyword provided, search all
    if (!searchCompanyDto.keyword) {
      const companies = await this.companyRepository.find({
        take: searchCompanyDto.limit ?? 10,
        skip: ((searchCompanyDto.page ?? 1) - 1) * (searchCompanyDto.limit ?? 10),
        order: { name: 'ASC' },
        where: {
          type: 'Common Stock',
          delisted: false
        }
      });
      return {
        total: await this.companyRepository.count({ where: { type: 'Common Stock' } }),
        companies
      };
    }
    const companies = await this.companyRepository.find({
      where: [{
        name: ILike(`%${searchCompanyDto.keyword}%`),
        type: 'Common Stock',
        delisted: false
      },
      {
        symbol: ILike(`%${searchCompanyDto.keyword}%`),
        type: 'Common Stock',
        delisted: false
      }],
      take: searchCompanyDto.limit ?? 10,
      skip: ((searchCompanyDto.page ?? 1) - 1) * (searchCompanyDto.limit ?? 10),
      order: { name: 'ASC' }
    });
    return {
      total: await this.companyRepository.count({
        where: [
          {
            name: ILike(`%${searchCompanyDto.keyword}%`),
            type: 'Common Stock',
            delisted: false
          },
          {
            symbol: ILike(`%${searchCompanyDto.keyword}%`),
            type: 'Common Stock',
            delisted: false
          }
        ]
      }),
      companies
    };
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

  async findOne(symbol: string) {
    const splittedSymbol = symbol.split('-');
    if (splittedSymbol.length != 2) {
      throw new HttpException('Invalid symbol format', HttpStatus.BAD_REQUEST);
    }
    try {
      const company = await this.companyRepository.findOneByOrFail({
        exchange: splittedSymbol[0].toUpperCase(),
        symbol: splittedSymbol[1].toUpperCase(),
        delisted: false
      })
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
