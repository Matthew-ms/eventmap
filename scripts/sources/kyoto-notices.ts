// Finds new Kyoto City Fire Bureau 指定催し notices in the city gazette (京都市公報).
// The PDFs are entered by hand; this only tells us when a new one appears.
// Cost: the month index pages plus each new day's contents page, ~2–3 requests a day.
import { politeFetch } from '../fetch.ts';

const BASE = 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/';

export interface NoticeState {
  seenDays: string[]; // 'r0810/1013'
  notices: string[]; // PDF URLs found so far
}

const sjis = async (url: string) => new TextDecoder('shift_jis').decode(await (await politeFetch(url)).arrayBuffer());

/** Gazette month folder: Reiwa year + month, e.g. 2026-10 → 'r0810'. */
export function monthFolder(date: Date) {
  const reiwa = date.getUTCFullYear() - 2018;
  return `r${String(reiwa).padStart(2, '0')}${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function findNoticeLinks(tocHtml: string): string[] {
  return [...tocHtml.matchAll(/href="?([^\s>"]+\.pdf)[^>]*>([\s\S]*?)<\/a>/g)]
    .filter((m) => m[2].includes('指定催し'))
    .map((m) => m[1]);
}

/** Returns notices not seen before, and updates `state` in place. */
export async function checkKyotoNotices(state: NoticeState, now = new Date()): Promise<string[]> {
  const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const found: string[] = [];
  for (const month of [monthFolder(lastMonth), monthFolder(now)]) {
    let index: string;
    try {
      index = await sjis(`${BASE}${month}/kensaku2.html`);
    } catch (e) {
      if (month === monthFolder(now)) continue; // the new month's page may not exist on the 1st
      throw e;
    }
    const days = [...new Set([...index.matchAll(/href="?(\d{4})\/mokuji2\.html/g)].map((m) => m[1]))];
    for (const day of days) {
      const key = `${month}/${day}`;
      if (state.seenDays.includes(key)) continue;
      for (const pdf of findNoticeLinks(await sjis(`${BASE}${key}/mokuji2.html`))) {
        const url = `${BASE}${key}/${pdf}`;
        if (!state.notices.includes(url)) { state.notices.push(url); found.push(url); }
      }
      state.seenDays.push(key);
    }
  }
  return found;
}
