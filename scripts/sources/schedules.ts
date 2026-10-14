// Venue and store schedule pages, scraped daily. Facts only (title, date, start time) + link to the
// official page; user decision 2026-10-14. Each parser is pure (html → events) so it can be tested.
// A parser returning 0 events is reported by fetch-sources.ts: the page layout probably changed.
import type { Category, Dated } from '../../data/model.ts';
import { politeFetch } from '../fetch.ts';

/** What a parser extracts from a page; fetchSchedule adds venue, source and the rest. */
export interface Parsed {
  id: string;
  title: string;
  category: Category;
  start: string;
  end?: string;
  startTime?: string;
  status: Dated['status'];
  url: string; // official page for this event
}

interface Schedule {
  id: string;
  venue: string; // id in data/venues.ts
  urls: (today: string) => string[];
  parse: (html: string, today: string, url: string) => Parsed[];
}

// ---------- helpers ----------

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', yen: '¥', rarr: '→', '#39': "'" };
export const text = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? (e.startsWith('#') ? String.fromCodePoint(Number(e.slice(1))) : m))
    .replace(/[ \t　]+/g, ' ')
    .trim();

const pad = (n: number | string) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

/** Year for a month/day with no year: the next occurrence on or after ~2 months ago. */
export function inferYear(month: number, today: string) {
  const [y, m] = today.split('-').map(Number);
  return month < m - 2 ? y + 1 : y;
}

const hhmm = (s: string | undefined) => {
  const t = s?.match(/(\d{1,2}):(\d{2})/);
  return t ? `${pad(t[1])}:${t[2]}` : undefined;
};

const status = (title: string): Dated['status'] => (/公演中止|開催中止|中止となりました/.test(title) ? 'cancelled' : /延期/.test(title) ? 'postponed' : 'scheduled');

// ---------- parsers ----------

/** あべのハルカス近鉄本店 催事: <a class="event-item" data-expires="2026-10-20 17:00:00">title<br>［10月14日(水)→20日(火)］ */
export function parseKintetsu(html: string, today: string, url: string): Parsed[] {
  const out = new Map<string, Parsed>();
  for (const m of html.matchAll(/<a href="([^"]+)" class="event-item[^"]*"[^>]*data-expires="(\d{4})-(\d{2})-(\d{2})[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, href, ey, em, ed, inner] = m;
    const lines = text(inner).split('\n').map((l) => l.trim()).filter(Boolean);
    const title = lines[0];
    const range = lines.find((l) => l.startsWith('［')) ?? '';
    const end = `${ey}-${em}-${ed}`;
    const s = range.includes('→') ? range.match(/(\d{1,2})月(\d{1,2})日/) : null;
    const start = s ? iso(Number(s[1]) > Number(em) ? Number(ey) - 1 : Number(ey), Number(s[1]), Number(s[2])) : today < end ? today : end;
    const link = new URL(href, url).href;
    out.set(`${link}|${title}`, { id: `kintetsu:${new URL(link).pathname}`, title, category: 'department_store', start, end, status: status(title), url: link });
  }
  return [...out.values()];
}

/** Zepp: <a class="sch-content" href="…?rid=1"> …__year">2026 …__month">10.14 … __ttl">title … __start">19:00 */
export function parseZepp(html: string): Parsed[] {
  return [...html.matchAll(/<a class="sch-content[^"]*" href="([^"]+)">([\s\S]*?)<\/a>/g)].flatMap(([, href, b]) => {
    const year = b.match(/__year">(\d{4})</)?.[1];
    const md = b.match(/__month">(\d{1,2})\.(\d{1,2})</);
    const performer = text(b.match(/__performer">([\s\S]*?)<\/h2>/)?.[1] ?? '');
    const title = text(b.match(/__ttl">([\s\S]*?)<\/h3>/)?.[1] ?? '') || performer;
    if (!year || !md || !title) return [];
    const start = iso(Number(year), Number(md[1]), Number(md[2]));
    return [{ id: `zepp:${href.match(/rid=(\d+)/)?.[1] ?? start + title}`, title, category: 'concert', start,
      startTime: hhmm(b.match(/__start">([^<]*)</)?.[1]), status: status(title), url: href }];
  });
}

/** CLUB QUATTRO: <li data-event-date="2026-10-14"> <a href="/umeda/schedule/detail/?cd=1"> txt-01">title … 開場/開演 18:00 / 19:00 */
export function parseQuattro(html: string, _today: string, url: string): Parsed[] {
  return [...html.matchAll(/<li[^>]*data-event-date="(\d{4}-\d{2}-\d{2})"[^>]*>([\s\S]*?)<\/li>/g)].flatMap(([, start, b]) => {
    const href = b.match(/<a href="([^"]+)"/)?.[1];
    const title = text(b.match(/class="txt-01">([\s\S]*?)<\/p>/)?.[1] ?? '').replace(/\n\s*/g, ' ');
    if (!href || !title) return [];
    const times = b.match(/開場\/開演<\/dt>\s*<dd>([^<]*)</)?.[1];
    return [{ id: `quattro:${href.match(/cd=(\d+)/)?.[1] ?? start}`, title, category: 'concert', start,
      startTime: hhmm(times?.split('/')[1]), status: status(title), url: new URL(href, url).href }];
  });
}

/** フェスティバルホール: <h2 class="_title"><a href="…">title</a></h2> … 日時</th><td>2026年10月14日（水） 19:00 */
export function parseFestivalHall(html: string): Parsed[] {
  return [...html.matchAll(/<div class="performance-info">([\s\S]*?)<\/table>/g)].flatMap(([, b]) => {
    const a = b.match(/class="_title"><a href="([^"]+)">([\s\S]*?)<\/a>/);
    const d = b.match(/日時<\/th><td>(\d{4})年(\d{1,2})月(\d{1,2})日[^<]*?(\d{1,2}:\d{2})?\s*</);
    if (!a || !d) return [];
    const title = text(a[2]);
    const start = iso(Number(d[1]), Number(d[2]), Number(d[3]));
    return [{ id: `festivalhall:${a[1].match(/events\/(\d+)/)?.[1]}:${start}`, title, category: 'concert', start,
      startTime: hhmm(d[4]), status: status(title), url: a[1] }];
  });
}

/**
 * ロームシアター京都: <a href="…"> … <h3>title</h3><p class="date">2026年10月3日（土）～ 10月25日（日）</p> … genre music
 * Date text is either a range (～) or a list of days (、); a list becomes one event per day.
 */
export function parseRohm(html: string): Parsed[] {
  return [...html.matchAll(/<a href="(https:\/\/rohmtheatrekyoto\.jp\/[^"]+)">([\s\S]*?)<\/a>/g)].flatMap(([, href, b]) => {
    const h3 = b.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
    const date = text(b.match(/<p class="date">([\s\S]*?)<\/p>/)?.[1]?.replace(/<span class="d-note">[\s\S]*?<\/span>/, '') ?? '');
    const year = Number(date.match(/(\d{4})年/)?.[1]);
    if (!h3 || !year) return [];
    const title = text(h3.replace(/<span class="sub-ttl">[\s\S]*?<\/span>/, '')).replace(/\n\s*/g, ' ');
    const cat: Category = /genre music/.test(b) ? 'concert' : 'other';
    let y = year, prev = 0;
    const days = [...date.matchAll(/(\d{1,2})月(\d{1,2})日/g)].map(([, m, d]) => {
      if (Number(m) < prev) y++;
      prev = Number(m);
      return iso(y, Number(m), Number(d));
    });
    if (!days.length) return [];
    const base = { title, category: cat, status: status(title), url: href };
    const id = href.match(/\/(\d+)\/?$/)?.[1] ?? title;
    return /～|〜/.test(date) && days.length === 2
      ? [{ ...base, id: `rohm:${id}`, start: days[0], end: days[1] }]
      : days.map((start) => ({ ...base, id: `rohm:${id}:${start}`, start }));
  });
}

/** 心斎橋BIGCAT (homepage list, no per-event pages): <p class="date …">10/24</p> … <h3 class="ttl">title</h3> */
export function parseBigcat(html: string, today: string, url: string): Parsed[] {
  return [...html.matchAll(/<p class="date[^"]*">(\d{1,2})\/(\d{1,2})<\/p>[\s\S]*?<h3 class="ttl">([\s\S]*?)<\/h3>/g)].map(([, m, d, t]) => {
    const title = text(t).replace(/\n\s*/g, ' ');
    const start = iso(inferYear(Number(m), today), Number(m), Number(d));
    return { id: `bigcat:${start}:${title}`, title, category: 'concert', start, status: status(title), url };
  });
}

/**
 * iCalendar feed (RFC 5545), e.g. WordPress "The Events Calendar" ?ical=1. The format is meant for machines,
 * so it is the preferred source whenever a venue offers one. Folded lines are joined; \, \; \n unescaped.
 * An all-night event (ends before 06:00 the next morning) stays on its start date.
 */
export function parseIcal(ics: string, _today: string, url: string): Parsed[] {
  const unfolded = ics.replace(/\r?\n[ \t]/g, '');
  return [...unfolded.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)].flatMap(([, b]) => {
    const prop = (name: string) => b.match(new RegExp('^' + name + '(?:;[^:\\r\\n]*)?:(.*)$', 'm'))?.[1]?.trim();
    const unescape = (v = '') => v.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim();
    const dt = (v?: string) => v?.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
    const s = dt(prop('DTSTART'));
    // Some venues prefix titles with the date ("10/15 (thu) RE:DIAL"); the card shows the date already.
    const title = unescape(prop('SUMMARY')).replace(/^\d{1,2}\/\d{1,2}\s*[(（][^)）]*[)）]\s*/, '');
    if (!s || !title) return [];
    const start = iso(Number(s[1]), Number(s[2]), Number(s[3]));
    const e = dt(prop('DTEND'));
    let end = e ? iso(Number(e[1]), Number(e[2]), Number(e[3])) : start;
    if (e && !e[4] && end > start) end = new Date(Date.parse(end + 'T00:00:00Z') - 86400000).toISOString().slice(0, 10); // all-day DTEND is exclusive
    if (e?.[4] && Number(e[4]) < 6 && end > start) end = start; // all-nighter
    return [{
      id: 'ical:' + (prop('UID') ?? start + title), title, category: 'concert', start, ...(end > start ? { end } : {}),
      startTime: s[4] ? s[4] + ':' + s[5] : undefined, status: status(title), url: unescape(prop('URL')) || url,
    }];
  });
}

/** 心斎橋JANUS monthly page: <article class="c-scheduleList"> date--month">10/ … date--date">01 … head--title"> title … OPEN/START 18:30 / 19:00 */
export function parseJanus(html: string, today: string, url: string): Parsed[] {
  return [...html.matchAll(/<article class="c-scheduleList"[^>]*>([\s\S]*?)<\/article>/g)].flatMap(([, b]) => {
    const m = b.match(/date--month">\s*(\d{1,2})\//)?.[1];
    const d = b.match(/date--date">\s*(\d{1,2})\s*</)?.[1];
    const title = text(b.match(/head--title">([\s\S]*?)<\/div>/)?.[1] ?? '');
    const act = text(b.match(/head--act">([\s\S]*?)<\/div>/)?.[1] ?? '');
    if (!m || !d || !(title || act)) return [];
    const start = iso(inferYear(Number(m), today), Number(m), Number(d));
    const name = title && act ? title + '（' + act + '）' : title || act;
    const times = b.match(/OPEN\/START<\/dt>\s*<dd>([^<]*)</)?.[1];
    return [{ id: 'janus:' + start + ':' + name, title: name, category: 'concert', start, startTime: hhmm(times?.split('/')[1]), status: status(name), url }];
  });
}

/** ザ・シンフォニーホール ?ym=: <a href="…/event/123"><article><time>2026年10月1日(木) 19:00 開演</time> … <h3>title</h3> */
export function parseSymphony(html: string): Parsed[] {
  return [...html.matchAll(/<a href="(https:\/\/www\.symphonyhall\.jp\/event\/\d+)"[^>]*>\s*<article>([\s\S]*?)<\/article>/g)].flatMap(([, href, b]) => {
    const t = b.match(/<time>(\d{4})年(\d{1,2})月(\d{1,2})日([^<]*)<\/time>/);
    const title = text(b.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? '').replace(/\n\s*/g, ' ');
    if (!t || !title) return [];
    const start = iso(Number(t[1]), Number(t[2]), Number(t[3]));
    return [{ id: 'symphony:' + href.match(/\d+$/)?.[0], title, category: 'concert', start, startTime: hhmm(t[4]), status: status(title), url: href }];
  });
}

/** 大阪城ホール (upcoming list): <span class="date">2026/10/14</span><span class="bg">音楽・芸能</span> … event-ttl"><a href>title</a> … 開演 18:30 */
export function parseJohall(html: string, _today: string, url: string): Parsed[] {
  return [...html.matchAll(/<dl>\s*<dt class="event-genre">([\s\S]*?)<\/dl>/g)].flatMap(([, b]) => {
    const d = b.match(/class="date">(\d{4})\/(\d{1,2})\/(\d{1,2})</);
    const a = b.match(/event-ttl"><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!d || !a) return [];
    const title = text(a[2]);
    const start = iso(Number(d[1]), Number(d[2]), Number(d[3]));
    return [{
      id: 'johall:' + start + ':' + title, title, category: /音楽/.test(b) ? 'concert' : 'other', start,
      startTime: hhmm(b.match(/開演<\/span>\s*<span class="d-txt">([^<]*)</)?.[1]), status: status(title), url: /^https?:/.test(a[1]) ? a[1] : url,
    }];
  });
}

// ---------- sources ----------

/** This month and the next two, as [year, month]. */
const months = (today: string) => {
  const [y, m] = today.split('-').map(Number);
  return [0, 1, 2].map((k) => {
    const d = new Date(Date.UTC(y, m - 1 + k, 1));
    return [d.getUTCFullYear(), d.getUTCMonth() + 1] as const;
  });
};
const zepp = (hall: string) => (today: string) =>
  months(today).map(([y, m]) => `https://www.zepp.co.jp/hall/${hall}/schedule/?_y=${y}&_m=${m}`);

export const SCHEDULES: Schedule[] = [
  { id: 'kintetsu-abeno', venue: 'kintetsu-abeno', urls: () => ['https://abenoharukas.d-kintetsu.co.jp/eventschedule/'], parse: parseKintetsu },
  { id: 'zepp-namba', venue: 'zepp-namba', urls: zepp('namba'), parse: parseZepp },
  { id: 'zepp-osakabayside', venue: 'zepp-osakabayside', urls: zepp('osakabayside'), parse: parseZepp },
  { id: 'quattro-umeda', venue: 'quattro-umeda', urls: (t) => months(t).map(([y, m]) => `https://www.club-quattro.com/umeda/schedule/?ym=${y}${pad(m)}`), parse: parseQuattro },
  { id: 'festivalhall', venue: 'festivalhall', // ~10 events a page, soonest first; 5 pages covers roughly two months.
    urls: () => [1, 2, 3, 4, 5].map((n) => `https://www.festivalhall.jp/events/${n > 1 ? `page/${n}/` : ''}`), parse: parseFestivalHall },
  { id: 'bigcat', venue: 'bigcat', urls: () => ['https://bigcat-live.com/'], parse: parseBigcat },
  { id: 'metro-kyoto', venue: 'metro-kyoto', urls: () => ['https://www.metro.ne.jp/schedule/?ical=1'], parse: parseIcal },
  { id: 'urbanguild', venue: 'urbanguild', urls: () => ['https://urbanguild.net/?ical=1'], parse: parseIcal },
  { id: 'janus', venue: 'janus', urls: (t) => months(t).map(([y, m]) => 'https://janusosaka.com/schedule/' + y + '-' + pad(m) + '/'), parse: parseJanus },
  { id: 'symphonyhall', venue: 'symphonyhall', urls: (t) => months(t).map(([y, m]) => 'https://www.symphonyhall.jp/event?ym=' + y + '-' + pad(m)), parse: parseSymphony },
  { id: 'osaka-johall', venue: 'osaka-johall', urls: () => ['https://www.osaka-johall.com/event/'], parse: parseJohall },
  { id: 'rohm-theatre', venue: 'rohm-theatre', urls: () => ['https://rohmtheatrekyoto.jp/program/'], parse: parseRohm },
];

/** Fetch and parse one schedule. Events are deduped by id and given the shared fields. */
export async function fetchSchedule(s: Schedule, today: string): Promise<Dated[]> {
  const byId = new Map<string, Dated>();
  for (const url of s.urls(today)) {
    const html = await (await politeFetch(url)).text();
    for (const { url: link, ...e } of s.parse(html, today, url)) {
      if ((e.end ?? e.start) < today) continue;
      byId.set(e.id, { ...e, venue: s.venue, price: null, source: link, sourceType: 'scraped', confirmed: today });
    }
  }
  return [...byId.values()];
}
