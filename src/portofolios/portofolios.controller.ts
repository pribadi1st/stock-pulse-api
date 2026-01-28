import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PortofoliosService } from './portofolios.service';
import { CreatePortofolioDto } from './dto/create-portofolio.dto';
import { UpdatePortofolioDto } from './dto/update-portofolio.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('portofolios')
export class PortofoliosController {
  constructor(private readonly portofoliosService: PortofoliosService) { }

  @Post()
  create(@Body() createPortofolioDto: CreatePortofolioDto) {
    return this.portofoliosService.create(createPortofolioDto);
  }

  @Get()
  findAll(@GetUser('sub') userId: string) {
    return this.portofoliosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portofoliosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePortofolioDto: UpdatePortofolioDto) {
    return this.portofoliosService.update(+id, updatePortofolioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portofoliosService.remove(+id);
  }
}
