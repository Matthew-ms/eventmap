import type { Dated } from './model.ts';

// Events whose date moves each year. Add next year's entry once it is announced.
const KYOTO_NOTICE_0918 = 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0809/0918/0918_12.pdf';
const heianNomi = (start: string): Dated => ({
  id: `heian-nominoichi-${start}`, venue: 'okazaki-park', title: '平安蚤の市', titleEn: 'Heian Flea Market', category: 'market',
  start, startTime: '09:00', endTime: '16:00', price: 0, source: 'https://www.heiannominoichi.jp/', confirmed: '2026-10-13',
});

export const dated: Dated[] = [
  // --- Markets ---
  // 平安蚤の市: date moves each month (none in Nov 2026); cancelled in rain.
  ...['2026-10-14', '2026-12-01', '2026-12-16', '2027-01-19'].map(heianNomi),
  { id: 'mori-tezukuri-aki-2026', venue: 'shimogamo', title: '森の手づくり市 ～秋の特別編2026～', titleEn: 'Forest Handicraft Market (autumn)', category: 'market',
    start: '2026-10-18', price: 0, source: KYOTO_NOTICE_0918, confirmed: '2026-10-13' },
  { id: 'kyopo-2026', venue: 'kiyomizuyaki-danchi', title: 'KYOPO 2026（第50回清水焼の郷まつり）', titleEn: 'KYOPO 2026 Kiyomizu-yaki Pottery Festival', category: 'market',
    start: '2026-10-16', end: '2026-10-18', price: 0, source: KYOTO_NOTICE_0918, confirmed: '2026-10-13' },
  { id: 'higashihonganji-marche-8', venue: 'higashihonganji-ryokuchi', title: '第8回東本願寺前マルシェ～ものづくりRyokuchi～', titleEn: 'Higashi Honganji Marche', category: 'market',
    start: '2026-10-31', price: 0, source: KYOTO_NOTICE_0918, confirmed: '2026-10-13' },

  // --- Shrine / temple ---
  // 節分 = day before 立春 (2027: 立春 is Feb 4).
  { id: 'setsubun-kitano-2027', venue: 'kitano', title: '節分祭・追儺式', titleEn: 'Setsubun Festival', category: 'shrine_temple',
    start: '2027-02-03', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'setsubun-shimogamo-2027', venue: 'shimogamo', title: '節分祭', titleEn: 'Setsubun Festival', category: 'shrine_temple',
    start: '2027-02-03', price: null, source: 'https://www.shimogamo-jinja.or.jp/saiji', confirmed: '2026-10-13' },
];
