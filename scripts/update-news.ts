import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NewsService } from '../src/news/news.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const newsService = app.get(NewsService);
    const httpService = app.get(HttpService);

    try {
        console.log('Fetching news from Finnhub...');
        const response = await lastValueFrom(
            httpService.get('https://finnhub.io/api/v1/news', {
                params: {
                    category: 'general',
                    token: 'd2us6ppr01qq994h2oegd2us6ppr01qq994h2of0'
                }
            })
        );

        const newsItems = response.data;
        console.log(`Fetched ${newsItems.length} news items`);

        let createdCount = 0;
        for (const item of newsItems) {
            try {
                await newsService.create({
                    symbol: item.symbol,
                    headline: item.headline,
                    source: item.source,
                    summary: item.summary || '',
                    url: item.url,
                    image: item.image || null,
                    datetime: new Date(item.datetime * 1000),
                    category: item.category,
                    finnhubID: item.id,
                });
                createdCount++;
            } catch (error) {
                // Skip duplicate entries
                if (error.code !== '23505') {
                    console.error('Error creating news item:', error.message);
                }
            }
        }

        console.log(`Successfully created/updated ${createdCount} news items`);
    } catch (error) {
        console.error('Error fetching news:', error.message);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();
