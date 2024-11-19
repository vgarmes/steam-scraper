import { scrapeAndSave, ScraperKey, SCRAPERS } from './scrapers/main.js';
import { logInfo } from './util/log.js';

const scraper = process.argv.at(-1);

if (scraper && scraper in SCRAPERS) {
  await scrapeAndSave(scraper as ScraperKey);
} else {
  logInfo('Scraping all data...');

  for (const scraperKey of SCRAPERS) {
    await scrapeAndSave(scraperKey);
  }
}
