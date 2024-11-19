import { cleanText } from '../util/formatters.js';
import type { HTMLElement } from 'node-html-parser';

const SELECTORS: {
  [key: string]: { selector: string; type: string; attribute?: string };
} = {
  username: {
    selector: '.actual_persona_name',
    type: 'string',
  },
  level: {
    selector: '.friendPlayerLevelNum',
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

function getYearsOfService(root: HTMLElement) {
  const badgeSrc = root.querySelector(SPECIAL_SELECTORS.yearsOfService)
    ?.attributes.src;
  const regex = /(?:steamyears)([0-9]+)/;
  const match = badgeSrc?.match(regex);
  return match ? Number(badgeSrc?.match(regex)?.[1]) : null;
}

function getAvatar(root: HTMLElement) {
  return root.querySelector(SPECIAL_SELECTORS.avatar)?.attributes.src;
}

function getRecentGames(root: HTMLElement) {
  return root.querySelectorAll(SPECIAL_SELECTORS.recentGames)?.map((game) => {
    const linkElement = game.querySelector('.game_name > a');
    const title = linkElement?.textContent;
    const link = linkElement?.attributes.href;
    const details = game
      .querySelector('.game_info_details')
      ?.innerHTML.split('<br>');

    const imgSrc = game.querySelector('.game_capsule')?.attributes.src;
    return {
      title,
      link,
      playtime: details ? cleanText(details[0]) : '',
      lastPlayed: details ? cleanText(details[1]) : '',
      imgSrc,
    };
  });
}

function getStatsEntries(root: HTMLElement) {
  const statNames = [
    'badges',
    'games',
    'inventory',
    'reviews',
    'groups',
    'friends',
  ];

  const stats: [string, string][] = [];
  root.querySelectorAll('.profile_count_link').forEach((el, index) => {
    const label = el
      .querySelector('.count_link_label')
      ?.textContent.toLowerCase();

    if (!label) return;

    const value = cleanText(
      el.querySelector('.profile_count_link_total')?.textContent ?? ''
    );

    stats.push([label, value]);
  });
  return stats;
}

export async function getProfile(root: HTMLElement) {
  const userSelectorEntries = Object.entries(SELECTORS);

  const entries = userSelectorEntries.map(([key, { selector, type }]) => {
    const rawValue = root.querySelector(selector)?.textContent ?? '';
    const cleanValue = cleanText(rawValue);
    const value = type === 'number' ? Number(cleanValue) : cleanValue;
    return [key, value];
  });

  const datetime = new Date(Date.now());
  return Object.fromEntries([
    ...entries,
    ...getStatsEntries(root),
    ['yearsOfService', getYearsOfService(root)],
    ['avatar', getAvatar(root)],
    ['recentGames', getRecentGames(root)],
    ['createdAt', datetime.toISOString()],
  ]);
}
