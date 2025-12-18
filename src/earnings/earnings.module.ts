import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Earning } from './entities/earning.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Earning])],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService]
})
export class EarningsModule { }
