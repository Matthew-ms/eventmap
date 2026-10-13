// Osaka Prefecture イベント一覧 (prefectural parks), CC BY 4.0, via BODIK.
// Format: Digital Agency 自治体標準オープンデータセット "イベント一覧".
import type { Category, Dated, Venue } from '../../data/model.ts';
import { politeFetch } from '../fetch.ts';

export interface Snapshot {
  venues: Venue[];
  events: Dated[];
  skipped: number; // rows dropped for missing/invalid date or location
}

const DATASET_API = 'https://data.bodik.jp/api/3/action/package_show?id=270008_event';

export async function fetchOsakaParks(): Promise<Snapshot> {
  // Resolve the CSV URL through the catalog each time: the file URL changes when it is replaced.
  const meta = await (await politeFetch(DATASET_API)).json();
  const csv = meta.result.resources.find((r: { format: string }) => r.format.toUpperCase() === 'CSV');
  if (!csv) throw new Error('no CSV resource in dataset');
  const bytes = new Uint8Array(await (await politeFetch(csv.url)).arrayBuffer());
  return parseOsakaParks(decode(bytes), today());
}

const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });

/** Currently Shift-JIS; accept UTF-8 too in case the prefecture switches. */
function decode(bytes: Uint8Array) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('shift_jis').decode(bytes);
  }
}

export function parseOsakaParks(text: string, confirmed: string): Snapshot {
  const [header, ...rows] = parseCsv(text.replace(/^﻿/, ''));
  const col = (name: string) => {
    const i = header.indexOf(name);
    if (i < 0) throw new Error(`column missing: ${name}`); // format changed: fail loudly, keep last snapshot
    return i;
  };
  const c = {
    title: col('イベント名'), url: col('コンテンツURL'), start: col('開始日'), end: col('終了日'),
    startTime: col('開始時間'), endTime: col('終了時間'), price: col('料金(基本)'),
    place: col('場所名称'), lat: col('緯度'), lon: col('経度'),
  };

  const venues = new Map<string, Venue>();
  const events: Dated[] = [];
  let skipped = 0;
  for (const r of rows) {
    const start = isoDate(r[c.start]);
    const end = isoDate(r[c.end]) ?? start;
    const lat = Number(r[c.lat]);
    const lon = Number(r[c.lon]);
    const place = r[c.place]?.trim();
    const title = r[c.title]?.trim();
    if (!start || !end || !title || !place || !lat || !lon) { skipped++; continue; }

    const id = `opark:${start}:${place}:${title}`;
    if (events.some((e) => e.id === id)) continue; // the CSV sometimes repeats a row verbatim
    const venueId = `opark:${place}`;
    if (!venues.has(venueId)) venues.set(venueId, { id: venueId, name: place, lat, lon });
    events.push({
      id,
      venue: venueId,
      title,
      category: categorize(title),
      start,
      end,
      startTime: hhmm(r[c.startTime]),
      endTime: hhmm(r[c.endTime]),
      price: price(r[c.price]),
      source: /^https?:\/\//.test(r[c.url]) ? r[c.url] : 'https://data.bodik.jp/dataset/270008_event',
      sourceType: 'opendata',
      confirmed,
    });
  }
  return { venues: [...venues.values()], events, skipped };
}

// ponytail: keyword guess; good enough for ~70 park events, replace if categories look wrong on the map.
function categorize(title: string): Category {
  if (/マーケット|フリマ|蚤の市|朝市|手づくり市|クラフト市/.test(title)) return 'market';
  if (/花火/.test(title)) return 'fireworks';
  if (/祭|まつり|フェスタ|フェス|フェスティバル/.test(title)) return 'festival';
  if (/コンサート|ライブ|ミュージック|音楽/.test(title)) return 'concert';
  return 'other';
}

/** '2026-10-11' or '2026/10/11' or '2026/1/5' → '2026-01-05'. */
function isoDate(s: string | undefined) {
  const m = s?.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : undefined;
}

function hhmm(s: string | undefined) {
  const m = s?.trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : undefined;
}

/** Empty = unknown (null). '無料' = 0. Otherwise the first yen amount. */
function price(s: string | undefined): number | null {
  const v = s?.normalize('NFKC').trim();
  if (!v) return null;
  if (/^無料|^0円?$/.test(v)) return 0;
  const m = v.match(/(\d[\d,]*)\s*円/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}

/** RFC 4180 CSV: quoted fields may contain commas, quotes ("") and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim()));
}
