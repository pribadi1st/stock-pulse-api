import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEarningDto } from '../src/earnings/dto/create-earning.dto';
import { EarningsService } from '../src/earnings/earnings.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Seed Earning');
    const configService = app.get(ConfigService)
    const earningsService = app.get(EarningsService)
    const baseURL = configService.get<string>('FINNHUB_BASE_URL')
    const apiKey = configService.get<string>('FINNHUB_API_KEY')
    try {
        logger.log("Earning logging start");
        const response = await fetch(`${baseURL}/calendar/earnings?from=2026-01-01&to=2026-03-31&token=${apiKey}`);
        const data = await response.json();
        const earnings = data.earningsCalendar
        // Process earnings in chunks to avoid overwhelming the database
        const chunkSize = 50;
        for (let i = 0; i < earnings.length; i += chunkSize) {
            const chunk = earnings.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (earning: any) => {
                try {
                    const createCompanyData: CreateEarningDto = {
                        symbol: earning.symbol,
                        date: earning.date,
                        epsActual: earning.epsActual?.toString() || undefined,
                        epsEstimate: earning.epsEstimate?.toString() || undefined,
                        hour: earning.hour,
                        quarter: earning.quarter?.toString() || undefined,
                        revenueActual: earning.revenueActual?.toString() || undefined,
                        revenueEstimate: earning.revenueEstimate?.toString() || undefined,
                        year: earning.year?.toString() || undefined,
                    };
                    console.log(createCompanyData.symbol);
                    await earningsService.create(createCompanyData);
                    logger.debug(`Added earning: ${earning.symbol}`);
                } catch (error) {
                    if (error.code !== '23505') { // Skip duplicate key errors
                        logger.error(`Error adding earning ${earning.symbol}:`, error.message);
                    }
                }
            }));
            logger.log(`Processed ${Math.min(i + chunkSize, data.length)} of ${data.length} earnings`);
        }

        logger.log("Earning logging completed successfully");
    } catch (e) {
        logger.error("Earning logging error", e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();