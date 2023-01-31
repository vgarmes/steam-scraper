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
  recentPlaytime: {
    selector: '.recentgame_recentplaytime > h2',
    type: 'string',
  },
};

const SPECIAL_SELECTORS = {
  avatar: '.playerAvatarAutoSizeInner > img',
  yearsOfService: '.badge_icon',
  recentGames: '.recent_game',
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

function getRecentGames($: CheerioAPI) {
  return $(SPECIAL_SELECTORS.recentGames)
    .map((_index, el) => {
      const game = $(el);
      const linkElement = game.find('.game_name > a');
      const title = linkElement.text();
      const link = linkElement.attr('href');
      const details = game.find('.game_info_details').html().split('<br>');
      const imgSrc = game.find('.game_capsule').attr('src');
      return {
        title,
        link,
        playtime: cleanText(details[0]),
        lastPlayed: cleanText(details[1]),
        imgSrc,
      };
    })
    .toArray();
}

function getStatsEntries($: CheerioAPI) {
  const statNames = [
    'badges',
    'games',
    'inventory',
    'reviews',
    'groups',
    'friends',
  ];

  const stats = [];
  $('.profile_count_link').each((index, el) => {
    stats.push([
      statNames[index],
      Number(cleanText($(el).find('.profile_count_link_total').text() || '0')),
    ]);
  });
  return stats;
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
    ...getStatsEntries($),
    ['yearsOfService', getYearsOfService($)],
    ['avatar', getAvatar($)],
    ['recentGames', getRecentGames($)],
    ['createdAt', datetime.toISOString()],
  ]);
}
