import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Logger } from '@nestjs/common';
import { CompaniesService } from '../src/companies/companies.service';
import YahooFinance from 'yahoo-finance2';
import { CreateCompanyDto } from '../src/companies/dto/create-company.dto';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const logger = new Logger('Update specific company');
    const companiesService = app.get(CompaniesService);
    const companies = [
        // { symbol: 'ABEA', exchange: 'XETRA' },
        // { symbol: 'AMZ', exchange: 'XETRA' },
        // { symbol: '28K1', exchange: 'FRA' },
        // { symbol: 'DTE', exchange: 'XETRA' },
        // { symbol: 'DRH', exchange: 'Munich' },
        { symbol: 'VIE', exchange: 'Munich' },
        // { symbol: '5GR', exchange: 'FRA' },
        // { symbol: '82W', exchange: 'FRA' },
        // { symbol: 'F8P', exchange: 'FRA' },
        // { symbol: 'H1W', exchange: 'FRA' },
        // { symbol: 'FB2A', exchange: 'XETRA' },
        // { symbol: 'NFC', exchange: 'FRA' },
        // { symbol: 'M1Z', exchange: 'FRA' },
        // { symbol: 'NVD', exchange: 'XETRA' },
        // { symbol: '6rj0', exchange: 'FRA' },
        // { symbol: '639', exchange: 'FRA' },
        // { symbol: 'TL0', exchange: 'FRA' },
        // { symbol: '1B8', exchange: 'FRA' },
    ]
    logger.log("Total companies to update: ", companies.length);
    let done = 0;
    try {
        logger.log("Updating companies without market cap data");
        const yahooFinance = new YahooFinance();
        for (const company of companies) {
            const results = await yahooFinance.search("Visa");
            console.log(results);
            const tickerObj = results.quotes.filter(item => item.exchDisp === company.exchange)[0];
            if (tickerObj) {
                const [quote] = await Promise.all([
                    yahooFinance.quote(tickerObj.symbol as string),
                    // yahooFinance.quoteSummary(tickerObj.symbol as string, { modules: ['assetProfile'] })
                ]);
                const createCompanyDto: CreateCompanyDto = {
                    symbol: company.symbol,
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
                    webUrl: null,
                    logo: null,
                    delisted: false
                };
                await companiesService.upsert(createCompanyDto);
                done++;
                logger.log(`Updated company ${company.symbol}`);
            } else {
                console.log(results);
                logger.log(`Company ${company.symbol} not found`);
            }
        }
        logger.log(`Updated ${done} companies`);
    } catch (e) {
        logger.error("Update company logging error", e);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();