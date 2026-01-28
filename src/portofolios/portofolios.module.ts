import { Module } from '@nestjs/common';
import { PortofoliosService } from './portofolios.service';
import { PortofoliosController } from './portofolios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portofolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortofoliosController],
  providers: [PortofoliosService],
})
export class PortofoliosModule { }
