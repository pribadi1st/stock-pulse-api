import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
// import { CreateWatchlistDto } from './dto/create-watchlist.dto';
// import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) { }

  // @Post()
  // create(@Body() createWatchlistDto: CreateWatchlistDto) {
  //   return this.watchlistService.create(createWatchlistDto);
  // }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.watchlistService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.watchlistService.findOne(+id);
  // }

  @Patch(':symbol')
  update(@Param('symbol') symbol: string, @GetUser('sub') userId: string) {
    return this.watchlistService.update(symbol, userId);
  }

  @Delete(':symbol')
  remove(@Param('symbol') symbol: string, @GetUser('sub') userId: string) {
    return this.watchlistService.remove(symbol, userId);
  }
}
