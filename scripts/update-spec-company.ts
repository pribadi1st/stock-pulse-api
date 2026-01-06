import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { CompaniesService } from '../src/companies/companies.service';
import YahooFinance from 'yahoo-finance2';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Update specific company');
    const companiesService = app.get(CompaniesService);
    let symbol = '6RV';
    let exchange = 'FRA';
    try {
        logger.log("Updating companies without market cap data");
        const yahooFinance = new YahooFinance();
        const results = await yahooFinance.search(symbol);
        const tickerObj = results.quotes.filter(item => item.exchange === exchange)[0];
        if (!tickerObj) {
            logger.error("Company not found");
            return;
        }
        const [quote, summary] = await Promise.all([
            yahooFinance.quote(tickerObj.symbol as string),
            yahooFinance.quoteSummary(tickerObj.symbol as string, { modules: ['assetProfile'] })
        ]);
        console.log(quote);
        console.log(summary)
        const createCompanyDto: CreateCompanyDto = {
            symbol,
            name: quote.longName,
            exchange: quote.exchange,
            marketCapitalization: quote.marketCap,
            displaySymbol: quote.symbol,
            currency: quote.currency,
            figi: '',
            type: 'Common Stock',
            mic: '',
            country: quote.region,
            ipo: null,
            shareOutstanding: quote.sharesOutstanding,
            phone: null,
            webUrl: summary.assetProfile?.website || null,
            logo: null,
            delisted: false
        };
        await companiesService.upsert(createCompanyDto);
    } catch (e) {
        logger.error("Update company logging error", e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();