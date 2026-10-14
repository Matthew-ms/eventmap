// Data-entry helper: `node scripts/venue-photo.ts 東寺 北野天満宮 …` (Japanese Wikipedia titles).
// Prints the article's lead photo from Wikimedia Commons with its author and licence, ready to paste
// into data/venues.ts as `photo`. Reads only normal /wiki/ pages: Wikimedia's robots.txt closes its APIs to bots.
import { politeFetch } from './fetch.ts';

const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

for (const title of process.argv.slice(2)) {
  try {
    const article = await (await politeFetch(`https://ja.wikipedia.org/wiki/${encodeURIComponent(title)}`)).text();
    const og = article.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    const file = og?.match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/)?.[1];
    if (!file) { console.log(`${title}\tno Commons lead photo`); continue; }
    const page = (await (await politeFetch(`https://commons.wikimedia.org/wiki/File:${file}`)).text()).replaceAll('&#95;', '_');
    const licence = [...new Set([...page.matchAll(/class="licensetpl_short[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1].trim()))];
    const author = strip(page.match(/id="fileinfotpl_aut"[^>]*>[\s\S]*?<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1] ?? '');
    console.log(JSON.stringify({ title, file: decodeURIComponent(file), author: author.slice(0, 80), licence }));
  } catch (e) {
    console.log(`${title}\t${e instanceof Error ? e.message : e}`);
  }
}
