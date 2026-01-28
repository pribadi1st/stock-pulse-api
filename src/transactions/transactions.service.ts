import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Portfolio } from '../../src/portofolios/entities/portofolio.entity';
import { TransactionType } from '../../types/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreateTransactionDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Save the Transaction record
      const transaction = queryRunner.manager.create(Transaction, { ...dto, userId });
      await queryRunner.manager.save(transaction);

      // 2. Manage the Portfolio (Holding Position)
      let portfolio = await queryRunner.manager.findOne(Portfolio, {
        where: { userId: userId, symbol: dto.symbol },
      });

      if (dto.type === TransactionType.BUY) {
        if (portfolio) {
          // Update existing holding
          const totalQty = portfolio.quantity + dto.quantity;
          const totalCost = (portfolio.quantity * portfolio.avgPrice) + (dto.quantity * dto.price) + (dto.fee || 0);
          portfolio.quantity = totalQty;
          portfolio.avgPrice = totalCost / totalQty;
        } else {
          // Create new holding
          portfolio = queryRunner.manager.create(Portfolio, {
            userId: userId,
            symbol: dto.symbol,
            quantity: dto.quantity,
            avgPrice: ((dto.quantity * dto.price)) / dto.quantity,
          });
        }
      } else {
        // SELL logic
        if (!portfolio || portfolio.quantity < dto.quantity) {
          throw new BadRequestException('Insufficient quantity to sell');
        }
        portfolio.quantity -= dto.quantity;
        if (portfolio.quantity === 0) {
          await queryRunner.manager.remove(portfolio);
          portfolio = null;
        }
      }

      if (portfolio) await queryRunner.manager.save(portfolio);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
