// All event data, hand-entered plus fetched snapshots, in one place for build and check.
import { existsSync, readFileSync } from 'node:fs';
import type { Dated, Venue } from '../data/model.ts';
import { venues as handVenues } from '../data/venues.ts';
import { recurring } from '../data/recurring.ts';
import { dated as handDated } from '../data/dated.ts';

const SNAPSHOTS = ['data/fetched/osaka-parks.json'];

const fetched = SNAPSHOTS.filter(existsSync).map((f) => JSON.parse(readFileSync(f, 'utf8')) as { venues: Venue[]; events: Dated[] });

export const venues: Venue[] = [...handVenues, ...fetched.flatMap((s) => s.venues)];
export const dated: Dated[] = [...handDated, ...fetched.flatMap((s) => s.events)];
export { recurring };
