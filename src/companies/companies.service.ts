import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

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

  findNonUpdatedCompany() {
    try {
      return this.companyRepository.find({ where: { marketCapitalization: IsNull() }, order: { id: 'ASC' } });
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

  findOne(id: number) {
    return `This action returns a #${id} company`;
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
