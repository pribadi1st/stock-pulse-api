import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule { }
