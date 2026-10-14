// Daily job (GitHub Actions, schedule only):
//  1. refresh open-data snapshots in data/fetched/ (on failure the last committed snapshot stays)
//  1b. scrape venue/store schedule pages (scripts/sources/schedules.ts)
//  2. look for new Kyoto 指定催し notices in the city gazette
//  3. hash the text of each hand-read source page; report pages that changed since last run
// Anything worth a human look is written to source-report.md, which the workflow turns into an issue.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { sources } from '../data/sources.ts';
import { politeFetch } from './fetch.ts';
import { fetchOsakaParks } from './sources/osaka-parks.ts';
import { checkKyotoNotices, type NoticeState } from './sources/kyoto-notices.ts';
import { SCHEDULES, fetchSchedule } from './sources/schedules.ts';
import { todayJST } from '../data/model.ts';

const DIR = 'data/fetched';
const HASHES = `${DIR}/page-hashes.json`;
const EVENTS = `${DIR}/events`;
mkdirSync(EVENTS, { recursive: true });
const snapshot = (id: string, data: object) => writeFileSync(`${EVENTS}/${id}.json`, JSON.stringify(data, null, 1) + '\n');
const report: string[] = [];
const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

// --- 1. Open data ---
try {
  const snap = await fetchOsakaParks();
  if (!snap.events.length) throw new Error('0 events parsed');
  snapshot('osaka-parks', { venues: snap.venues, events: snap.events });
  console.log(`osaka-parks: ${snap.events.length} events, ${snap.venues.length} venues, ${snap.skipped} rows skipped`);
  if (snap.skipped) report.push(`- **osaka-parks**: ${snap.skipped} rows skipped (missing date or location).`);
} catch (e) {
  report.push(`- **osaka-parks** fetch failed, last snapshot kept: ${message(e)}`);
}

// --- 1b. Scraped venue/store schedules ---
for (const s of SCHEDULES) {
  try {
    const events = await fetchSchedule(s, todayJST());
    if (!events.length) throw new Error('0 events parsed: page layout may have changed');
    snapshot(s.id, { venues: [], events });
    console.log(`${s.id}: ${events.length} events`);
  } catch (e) {
    report.push(`- **${s.id}** scrape failed, last snapshot kept: ${message(e)}`);
  }
}

// --- 2. New Kyoto 指定催し notices (entered by hand) ---
const NOTICES = `${DIR}/kyoto-notices.json`;
const noticeState: NoticeState = existsSync(NOTICES) ? JSON.parse(readFileSync(NOTICES, 'utf8')) : { seenDays: [], notices: [] };
try {
  for (const url of await checkKyotoNotices(noticeState)) {
    report.push(`- **New Kyoto 指定催し notice**: ${url}. Add its events, registering the PDF as kind 'notice' in data/sources.ts.`);
  }
  writeFileSync(NOTICES, JSON.stringify(noticeState, null, 1) + '\n');
} catch (e) {
  report.push(`- **Kyoto gazette** could not be checked: ${message(e)}`);
}

// --- 3. Hand-read pages ---
const hashes: Record<string, string> = existsSync(HASHES) ? JSON.parse(readFileSync(HASHES, 'utf8')) : {};
for (const s of sources.filter((s) => s.kind === 'page')) {
  try {
    const hash = createHash('sha256').update(pageText(await (await politeFetch(s.url)).text())).digest('hex');
    if (hashes[s.id] && hashes[s.id] !== hash) {
      report.push(`- **${s.name}** changed: ${s.url}. Re-check the entries that cite it, then update their \`confirmed\` date.`);
    }
    hashes[s.id] = hash;
  } catch (e) {
    report.push(`- **${s.name}** could not be checked: ${message(e)}`);
  }
}
writeFileSync(HASHES, JSON.stringify(hashes, null, 1) + '\n');

if (report.length) {
  writeFileSync('source-report.md', `The daily source check found:\n\n${report.join('\n')}\n`);
  console.log(report.join('\n'));
} else {
  console.log('All sources fetched; no page changes.');
}

/** Visible text only, so markup/script churn (nonces, cache-busting) doesn't count as a change. */
// ponytail: whole-page text; pages with rotating news blocks will report noise — narrow to a selector if one does.
function pageText(html: string) {
  return html
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
