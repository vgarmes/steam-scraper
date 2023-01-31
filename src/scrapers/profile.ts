import { CheerioAPI } from 'cheerio';
import { cleanText } from '../util/formatters.js';

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

function getYearsOfService($: CheerioAPI) {
  const badgeSrc = $(SPECIAL_SELECTORS.yearsOfService).attr('src');
  const regex = /(?:steamyears)([0-9]+)/;
  const match = badgeSrc?.match(regex);
  return match ? Number(badgeSrc.match(regex)[1]) : null;
}

function getAvatar($: CheerioAPI) {
  return $(SPECIAL_SELECTORS.avatar).attr('src');
}

export async function getProfile($: CheerioAPI) {
  const userSelectorEntries = Object.entries(SELECTORS);

  const entries = userSelectorEntries.map(([key, { selector, type }]) => {
    const rawValue = $(selector).text();
    const cleanValue = cleanText(rawValue);
    const value = type === 'number' ? Number(cleanValue) : cleanValue;
    return [key, value];
  });

  const datetime = new Date(Date.now());
  return Object.fromEntries([
    ...entries,
    ['yearsOfService', getYearsOfService($)],
    ['avatar', getAvatar($)],
    ['createdAt', datetime.toISOString()],
  ]);
}
