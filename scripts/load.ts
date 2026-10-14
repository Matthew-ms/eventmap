// All event data, hand-entered plus fetched snapshots, in one place for build and check.
import { readdirSync, readFileSync } from 'node:fs';
import type { Dated, Venue } from '../data/model.ts';
import { venues as handVenues } from '../data/venues.ts';
import { recurring } from '../data/recurring.ts';
import { dated as handDated } from '../data/dated.ts';

// One snapshot per automated source, written by scripts/fetch-sources.ts.
const DIR = 'data/fetched/events';
const fetched = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')) as { venues: Venue[]; events: Dated[] });

export const venues: Venue[] = [...handVenues, ...fetched.flatMap((s) => s.venues)];
export const dated: Dated[] = [...handDated, ...fetched.flatMap((s) => s.events)];
export { recurring };
