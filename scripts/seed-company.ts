import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { CreateCompanyDto } from '../src/companies/dto/create-company.dto';
import { CompaniesService } from '../src/companies/companies.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Seed Finance');
    const companiesService = app.get(CompaniesService);

    try {
        logger.log("Finance logging start");
        const response = await fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=d2us6ppr01qq994h2oegd2us6ppr01qq994h2of0');
        const data = await response.json();

        // Process companies in chunks to avoid overwhelming the database
        const chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async (company: any) => {
                try {
                    const createCompanyData: CreateCompanyDto = {
                        symbol: company.symbol,
                        name: company.description,
                        displaySymbol: company.displaySymbol,
                        currency: company.currency,
                        figi: company.figi,
                        type: company.type,
                        mic: company.mic
                    };
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