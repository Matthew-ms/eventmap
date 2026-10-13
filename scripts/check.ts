// Data sanity check: `npm run check`. Errors fail the build; warnings are printed only.
import rrulePkg from 'rrule';
import { addDays, todayJST } from '../data/model.ts';
import { sources } from '../data/sources.ts';
import { dated, recurring, venues } from './load.ts';

const { RRule } = rrulePkg;
const errors: string[] = [];
const warnings: string[] = [];
const today = todayJST();

// Osaka + Kyoto prefectures, with a little margin.
const inKansai = (lat: number, lon: number) => lat > 34.2 && lat < 35.85 && lon > 134.8 && lon < 136.1;
const isDate = (s: string | undefined) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
const isTime = (s: string | undefined) => s === undefined || /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

const venueIds = new Set<string>();
for (const v of venues) {
  if (venueIds.has(v.id)) errors.push(`venue ${v.id}: duplicate id`);
  venueIds.add(v.id);
  if (!inKansai(v.lat, v.lon)) errors.push(`venue ${v.id}: ${v.lat},${v.lon} is outside Osaka/Kyoto`);
}

const sourceUrls = new Set(sources.map((s) => s.url));
const ids = new Set<string>();
for (const e of [...recurring, ...dated]) {
  const where = `${e.id}`;
  if (ids.has(e.id)) errors.push(`${where}: duplicate id`);
  ids.add(e.id);
  if (!venueIds.has(e.venue)) errors.push(`${where}: unknown venue "${e.venue}"`);
  if (!isTime(e.startTime) || !isTime(e.endTime)) errors.push(`${where}: time must be HH:MM`);
  if (!isDate(e.confirmed)) errors.push(`${where}: confirmed must be YYYY-MM-DD`);
  else if (e.confirmed < addDays(today, -396)) warnings.push(`${where}: last confirmed ${e.confirmed}, over 13 months ago`);
  const opendata = 'sourceType' in e && e.sourceType === 'opendata';
  if (!opendata && !sourceUrls.has(e.source)) errors.push(`${where}: source ${e.source} is not in data/sources.ts`);
}

for (const r of recurring) {
  try {
    const rule = new RRule({ ...RRule.parseString(r.rrule), dtstart: new Date(today + 'T00:00:00Z') });
    if (!rule.after(new Date(today + 'T00:00:00Z'), true)) errors.push(`${r.id}: rule "${r.rrule}" never occurs again`);
  } catch (e) {
    errors.push(`${r.id}: rule "${r.rrule}" does not parse (${e instanceof Error ? e.message : e})`);
  }
  if (r.cancelled?.some((d) => !isDate(d))) errors.push(`${r.id}: cancelled dates must be YYYY-MM-DD`);
}

for (const d of dated) {
  if (!isDate(d.start) || (d.end !== undefined && !isDate(d.end))) errors.push(`${d.id}: start/end must be YYYY-MM-DD`);
  else if (d.end && d.end < d.start) errors.push(`${d.id}: end is before start`);
}

for (const w of warnings) console.warn('warning:', w);
for (const e of errors) console.error('error:', e);
console.log(`check: ${venues.length} venues, ${recurring.length} recurring, ${dated.length} dated — ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) process.exit(1);
