import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import { writeJSON } from './util/write-json.js';
import { cleanText } from './util/scraping.js';

const BASE_URL = 'https://steamcommunity.com/';

function getUserUrl(userId: string) {
  return `${BASE_URL}/id/${userId}`;
}

async function scrape(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

const SELECTORS: {
  [key: string]: { selector: string; type: string; attribute?: string };
} = {
  username: {
    selector: '.actual_persona_name',
    type: 'string',
  },
  level: {
    selector: '.persona_level .friendPlayerLevelNum',
    type: 'number',
  },
};

const SPECIAL_SELECTORS = {
  avatar: '.playerAvatarAutoSizeInner > img',
  yearsOfService: '.badge_icon',
};

function getYearsOfService($: cheerio.CheerioAPI) {
  const badgeSrc = $(SPECIAL_SELECTORS.yearsOfService).attr('src');
  const regex = /(?:steamyears)([0-9]+)/;
  const match = badgeSrc?.match(regex);
  return match ? Number(badgeSrc.match(regex)[1]) : null;
}

function getAvatar($: cheerio.CheerioAPI) {
  return $(SPECIAL_SELECTORS.avatar).attr('src');
}

export async function getUserInfo(username: string) {
  const userSelectorEntries = Object.entries(SELECTORS);

  const $ = await scrape(getUserUrl(username));

  const entries = userSelectorEntries.map(([key, { selector, type }]) => {
    const rawValue = $(selector).text();
    const cleanValue = cleanText(rawValue);
    const value = type === 'number' ? Number(cleanValue) : cleanValue;
    return [key, value];
  });

  return Object.fromEntries([
    ...entries,
    ['yearsOfService', getYearsOfService($)],
    ['avatar', getAvatar($)],
  ]);
}

dotenv.config();

console.log(`Scraping data for username: ${process.env.USERNAME}`);
const userInfo = await getUserInfo(process.env.USERNAME);
writeJSON('profile', userInfo);
console.log(userInfo);
