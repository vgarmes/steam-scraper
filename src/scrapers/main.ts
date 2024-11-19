import * as dotenv from 'dotenv';
import { getProfile } from './profile.js';
import { logError, logInfo, logSuccess } from '../util/log.js';
import { DB_PATH, writeJSON } from '../util/write-json.js';
import { parse, type HTMLElement } from 'node-html-parser';

dotenv.config();

const BASE_URL = 'https://steamcommunity.com';

export const SCRAPERS = ['profile'] as const;
export type ScraperKey = (typeof SCRAPERS)[number];

export const SCRAPER_CONFIG: {
  [k in ScraperKey]: {
    url: string;
    scraper: (root: HTMLElement) => Promise<any>;
  };
} = {
  profile: {
    url: `${BASE_URL}/id/${process.env.USERNAME}`,
    scraper: getProfile,
  },
};

async function scrape(url: string) {
  const res = await fetch(url);
  const html = await res.text();

  return parse(html);
}

export async function scrapeAndSave(name: ScraperKey) {
  const start = performance.now();

  try {
    const { scraper, url } = SCRAPER_CONFIG[name];

    logInfo(`Scraping [${name}]...`);
    const root = await scrape(url);

    const content = await scraper(root);

    logSuccess(`[${name}] scraped successfully`);

    logInfo(`Writing [${name}] to ${DB_PATH}${name}.json...`);

    await writeJSON(name, content);
    logSuccess(`[${name}] written successfully`);
  } catch (error) {
    logError(`Error scraping [${name}]`);
    error instanceof Error && logError(error.message);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`[${name}] scraped in ${time} seconds`);
  }
}
