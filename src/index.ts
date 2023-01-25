import * as cheerio from 'cheerio';

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
  const match = badgeSrc.match(regex);
  return match ? Number(badgeSrc.match(regex)[1]) : null;
}

function getAvatar($: cheerio.CheerioAPI) {
  return $(SPECIAL_SELECTORS.avatar).attr('src');
}

async function getUserInfo() {
  const userSelectorEntries = Object.entries(SELECTORS);

  const $ = await scrape(getUserUrl('vgmestre'));

  console.log('scraping..');

  const entries = userSelectorEntries.map(([key, { selector, type }]) => {
    const rawValue = $(selector).text();
    const value = type === 'number' ? Number(rawValue) : rawValue;

    return [key, value];
  });

  return Object.fromEntries([
    ...entries,
    ['yearsOfService', getYearsOfService($)],
    ['avatar', getAvatar($)],
  ]);
}

const userInfo = await getUserInfo();
console.log(userInfo);
