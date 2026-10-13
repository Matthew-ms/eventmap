// Builds public/events.json from hand-entered data and fetched snapshots. Run `npm run check` first.
import { mkdirSync, writeFileSync } from 'node:fs';
import { todayJST, type EventData } from '../data/model.ts';
import { sources } from '../data/sources.ts';
import { dated, recurring, venues } from './load.ts';
import { expand } from './expand.ts';

const events = expand(recurring, dated, todayJST());
const used = new Set(events.map((e) => e.venueId));
const data: EventData = {
  generated: new Date().toISOString(),
  venues: Object.fromEntries(venues.filter((v) => used.has(v.id)).map((v) => [v.id, v])),
  events,
  attribution: sources.flatMap((s) => (s.attribution ? [s.attribution] : [])),
};

mkdirSync('public', { recursive: true });
writeFileSync('public/events.json', JSON.stringify(data));

const count = (key: 'category' | 'sourceType') =>
  events.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e[key]]: (acc[e[key]] ?? 0) + 1 }), {});
console.log(`events.json: ${events.length} occurrences at ${used.size} venues`);
console.log('  by category:', count('category'));
console.log('  by source:  ', count('sourceType'));
