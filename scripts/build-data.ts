// Builds public/events.json from the hand-entered data files.
import { mkdirSync, writeFileSync } from 'node:fs';
import { todayJST, type EventData } from '../data/model.ts';
import { venues } from '../data/venues.ts';
import { recurring } from '../data/recurring.ts';
import { dated } from '../data/dated.ts';
import { expand } from './expand.ts';

const byId = Object.fromEntries(venues.map((v) => [v.id, v]));
const unknown = [...recurring, ...dated].filter((e) => !byId[e.venue]).map((e) => `${e.id} → ${e.venue}`);
if (unknown.length) throw new Error(`Unknown venue: ${unknown.join(', ')}`);

const events = expand(recurring, dated, todayJST());
const data: EventData = { generated: new Date().toISOString(), venues: byId, events };

mkdirSync('public', { recursive: true });
writeFileSync('public/events.json', JSON.stringify(data));

const counts: Record<string, number> = {};
for (const e of events) counts[e.category] = (counts[e.category] ?? 0) + 1;
console.log(`events.json: ${events.length} occurrences at ${venues.length} venues`, counts);
