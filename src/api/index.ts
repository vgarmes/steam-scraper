import { parse } from 'node-html-parser';
import json from '../../db/profile.json';
import { getProfile } from '../scrapers/profile';

const BASE_URL = 'https://steamcommunity.com';

async function scrape(url: string) {
  const res = await fetch(url);
  const html = await res.text();

  return parse(html);
}

export default {
  async fetch(_request, env, _ctx) {
    const { scraper, url } = {
      url: `${BASE_URL}/id/${env.USERNAME}`,
      scraper: getProfile,
    };
    const root = await scrape(url);

    const content = await scraper(root);

    return new Response(JSON.stringify(content), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  },
};
