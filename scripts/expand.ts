import rrulePkg from 'rrule';
import { addDays, type Dated, type Event, type Recurring } from '../data/model.ts';

const { RRule } = rrulePkg;

/** Turn rules and dated entries into occurrences that overlap [from, from + months). */
export function expand(recurring: Recurring[], dated: Dated[], from: string, months = 12): Event[] {
  const to = new Date(Date.parse(from + 'T00:00:00Z'));
  to.setUTCMonth(to.getUTCMonth() + months);
  const out: Event[] = [];

  for (const r of recurring) {
    const days = r.days ?? 1;
    // Start the search early enough to catch a multi-day occurrence already in progress.
    const searchFrom = new Date(Date.parse(addDays(from, -(days - 1)) + 'T00:00:00Z'));
    const rule = new RRule({ ...RRule.parseString(r.rrule), dtstart: searchFrom });
    for (const d of rule.between(searchFrom, new Date(to.getTime() - 1), true)) {
      const start = d.toISOString().slice(0, 10);
      if (r.cancelled?.includes(start)) continue;
      out.push(occurrence(r, start, addDays(start, days - 1), 'scheduled'));
    }
  }

  const toDay = to.toISOString().slice(0, 10);
  for (const e of dated) {
    const end = e.end ?? e.start;
    if (end >= from && e.start < toDay) out.push(occurrence(e, e.start, end, e.status ?? 'scheduled'));
  }

  return out.sort((a, b) => a.start.localeCompare(b.start));
}

function occurrence(e: Recurring | Dated, start: string, end: string, status: Event['status']): Event {
  return {
    id: `${e.id}-${start}`,
    venueId: e.venue,
    title: e.title,
    titleEn: e.titleEn,
    category: e.category,
    start,
    end,
    startTime: e.startTime,
    endTime: e.endTime,
    price: e.price,
    source: e.source,
    sourceType: 'manual',
    status,
    confirmed: e.confirmed,
  };
}
