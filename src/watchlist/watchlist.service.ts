import { Injectable } from '@nestjs/common';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>
  ) {

  }
  // create(createWatchlistDto: CreateWatchlistDto) {
  //   return 'This action adds a new watchlist';
  // }

  findAll() {
    return `This action returns all watchlist`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} watchlist`;
  // }

  async update(symbol: string, userId: string) {

    symbol = symbol.toUpperCase()
    await this.watchlistRepository.upsert({ symbol, userId }, ['symbol', 'userId']);
    return { success: true };
  }

  async remove(symbol: string, userId: string) {
    symbol = symbol.toUpperCase();
    await this.watchlistRepository.delete({ symbol, userId });
    return { success: true };
  }
}
