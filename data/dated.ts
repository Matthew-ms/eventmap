import type { Dated } from './model.ts';

// Events whose date moves each year. Add next year's entry once it is announced.
export const dated: Dated[] = [
  // 節分 = day before 立春 (2027: 立春 is Feb 4).
  { id: 'setsubun-kitano-2027', venue: 'kitano', title: '節分祭・追儺式', titleEn: 'Setsubun Festival', category: 'shrine_temple',
    start: '2027-02-03', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'setsubun-shimogamo-2027', venue: 'shimogamo', title: '節分祭', titleEn: 'Setsubun Festival', category: 'shrine_temple',
    start: '2027-02-03', price: null, source: 'https://www.shimogamo-jinja.or.jp/saiji', confirmed: '2026-10-13' },
];
