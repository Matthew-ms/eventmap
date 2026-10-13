import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expand } from './expand.ts';
import type { Dated, Recurring } from '../data/model.ts';

const base = { venue: 'v', category: 'market', price: 0, source: 'https://example.jp', confirmed: '2026-10-01' } as const;
const starts = (rs: Recurring[], from: string, months = 12) => expand(rs, [], from, months).map((e) => e.start);

test('monthly on a fixed day', () => {
  assert.deepEqual(starts([{ ...base, id: 'a', title: 'a', rrule: 'FREQ=MONTHLY;BYMONTHDAY=21' }], '2026-10-13', 3), [
    '2026-10-21', '2026-11-21', '2026-12-21',
  ]);
});

test('includes an occurrence on the from date itself', () => {
  assert.deepEqual(starts([{ ...base, id: 'a', title: 'a', rrule: 'FREQ=MONTHLY;BYMONTHDAY=21' }], '2026-10-21', 1), ['2026-10-21']);
});

test('nth weekday: first Sunday of the month', () => {
  assert.deepEqual(starts([{ ...base, id: 'a', title: 'a', rrule: 'FREQ=MONTHLY;BYDAY=1SU' }], '2026-10-13', 3), [
    '2026-11-01', '2026-12-06', '2027-01-03',
  ]);
});

test('yearly multi-day, already in progress on the from date', () => {
  const [e] = expand([{ ...base, id: 'g', title: 'g', rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=1', days: 31 }], [], '2027-07-10', 1);
  assert.equal(e.start, '2027-07-01');
  assert.equal(e.end, '2027-07-31');
});

test('cancelled dates are skipped', () => {
  const r: Recurring = { ...base, id: 'a', title: 'a', rrule: 'FREQ=MONTHLY;BYMONTHDAY=21', cancelled: ['2026-11-21'] };
  assert.deepEqual(starts([r], '2026-10-13', 3), ['2026-10-21', '2026-12-21']);
});

test('dated events: past dropped, ongoing kept, status carried', () => {
  const dated: Dated[] = [
    { ...base, id: 'past', title: 'p', start: '2026-10-01' },
    { ...base, id: 'on', title: 'o', start: '2026-10-10', end: '2026-10-20', status: 'postponed' },
  ];
  const out = expand([], dated, '2026-10-13');
  assert.deepEqual(out.map((e) => [e.id, e.status]), [['on-2026-10-10', 'postponed']]);
});
