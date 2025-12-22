import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { CreateCompanyDto } from '../src/companies/dto/create-company.dto';
import { CompaniesService } from '../src/companies/companies.service';
import { COMPANY_CONSTANT_DEFAULT } from '../constant/company';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Seed Finance');
    const companiesService = app.get(CompaniesService);
    const configService = app.get(ConfigService);
    const baseURL = configService.get<string>('FINNHUB_BASE_URL')
    const apiKey = configService.get<string>('FINNHUB_API_KEY')
    try {
        logger.log("Finance logging start");
        const response = await fetch(`${baseURL}/stock/symbol?exchange=US&token=${apiKey}`);
        const data = await response.json();

        // Process companies in chunks to avoid overwhelming the database
        const chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (company: any) => {
                try {
                    const createCompanyData: CreateCompanyDto = { ...COMPANY_CONSTANT_DEFAULT };
                    createCompanyData.symbol = company.symbol as string;
                    createCompanyData.name = company.description as string;
                    createCompanyData.displaySymbol = company.displaySymbol as string;
                    createCompanyData.currency = company.currency as string;
                    createCompanyData.figi = company.figi as string;
                    createCompanyData.type = company.type as string;
                    createCompanyData.mic = company.mic as string;
                    console.log(createCompanyData.displaySymbol);
                    await companiesService.create(createCompanyData);
                    logger.debug(`Added company: ${company.symbol}`);
                } catch (error) {
                    if (error.code !== '23505') { // Skip duplicate key errors
                        logger.error(`Error adding company ${company.symbol}:`, error.message);
                    }
                }
            }));
            logger.log(`Processed ${Math.min(i + chunkSize, data.length)} of ${data.length} companies`);
        }

        logger.log("Finance logging completed successfully");
    } catch (e) {
        logger.error("Finance logging error", e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();