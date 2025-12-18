import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { EarningsModule } from './earnings/earnings.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
        username: configService.get<string>('DATABASE_USER') || 'postgres',
        password: configService.get<string>('DATABASE_PASS') || 'postgres',
        database: configService.get<string>('DATABASE_NAME') || 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CompaniesModule,
    EarningsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
