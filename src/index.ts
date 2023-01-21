import cheerio from 'cheerio';

const BASE_URL = 'https://steamcommunity.com/';

function getUserUrl(userId: string) {
  return `${BASE_URL}/id/${userId}`;
}

async function scrape(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  return cheerio.load(html);
}

/* const $ = cheerio.load(html);
console.log('started scraping');
console.log(html);
$('.recent_game_content .game_info .game_name a').each((index, el) =>
  console.log($(el).text())
); */

export {};
