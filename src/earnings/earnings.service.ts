import { Injectable } from '@nestjs/common';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EarningsCalendarResponse } from 'types/earnings';
import { firstValueFrom } from 'rxjs';
import { GetEarningDto } from './dto/get-earning.dto';

@Injectable()
export class EarningsService {
  private readonly finnhubApiToken: string;
  private readonly finnhubBaseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.finnhubApiToken = this.configService.get<string>('FINNHUB_API_KEY') || '';
    this.finnhubBaseUrl = this.configService.get<string>('FINNHUB_BASE_URL') || '';
  }

  create(createEarningDto: CreateEarningDto) {
    return 'This action adds a new earning';
  }

  async findAll(query: GetEarningDto): Promise<EarningsCalendarResponse> {
    const { from, to } = query
    const { data } = await firstValueFrom(
      this.httpService.get<EarningsCalendarResponse>(`calendar/earnings?from=${from}&to=${to}&token=${this.finnhubApiToken}`, {
        baseURL: this.finnhubBaseUrl
      })
    )
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} earning`;
  }

  update(id: number, updateEarningDto: UpdateEarningDto) {
    return `This action updates a #${id} earning`;
  }

  remove(id: number) {
    return `This action removes a #${id} earning`;
  }
}
