import * as dotenv from 'dotenv';
import { scrapeAndSave, ScraperKey, SCRAPERS } from './scrapers/main.js';
import { logInfo } from './util/log.js';

dotenv.config();

const scraper = process.argv.at(-1);

if (scraper in SCRAPERS) {
  await scrapeAndSave(scraper as ScraperKey);
} else {
  logInfo('Scraping all data...');

  for (const scraperKey of SCRAPERS) {
    await scrapeAndSave(scraperKey);
  }
}
