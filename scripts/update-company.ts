import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { UpdateCompanyDto } from '../src/companies/dto/update-company.dto';
import { CompaniesService } from '../src/companies/companies.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Update Company');
    const companiesService = app.get(CompaniesService);
    const configService = app.get(ConfigService);
    const baseURL = configService.get<string>('FINNHUB_BASE_URL');
    const apiKey = configService.get<string>('FINNHUB_API_KEY');
    let symbol = '';
    try {
        logger.log("Updating companies without market cap data");
        const companies = await companiesService.findNonUpdatedCompany();
        console.log("companies:", companies.length);
        const chunkSize = 30;
        for (let i = 0; i < 30; i += chunkSize) {
            const chunk = companies.slice(i, i + chunkSize);
            // Use only ONE Promise.all per chunk
            await Promise.all(chunk.map(async (company: any) => {
                symbol = company.symbol;
                const apiUrl = `${baseURL}/stock/profile2?symbol=${symbol}&token=${apiKey}`;

                const response = await fetch(apiUrl);

                // CHECK: If response is not OK (200), log the status and skip
                if (!response.ok) {
                    const errorText = await response.text();
                    logger.error(`API Error for ${symbol}: ${response.status} - ${errorText.substring(0, 100)}`);
                    return;
                }

                const data = await response.json();
                if (data.shareOutstanding === null) {
                    companiesService.removeBySymbol(symbol);
                    return;
                }

                const updatedData: UpdateCompanyDto = {
                    marketCapitalization: data.marketCapitalization,
                    shareOutstanding: data.shareOutstanding,
                    ipo: data.ipo,
                    country: data.country,
                    webUrl: data.weburl || null,
                    logo: data.logo || null,
                    phone: data.phone || null,
                };

                await companiesService.update(company.id, updatedData);
            }));

            // await new Promise(resolve => setTimeout(resolve, 60000));
        }
    } catch (e) {
        logger.error("Update company logging error", e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();