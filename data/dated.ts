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
  { id: 'setsubun-kiyomizu-2027', venue: 'kiyomizudera', title: '節分会', titleEn: 'Setsubun-e', category: 'shrine_temple',
    start: '2027-02-03', price: null, source: 'https://www.kiyomizudera.or.jp/event/', confirmed: '2026-10-13' },

  // 伏見稲荷大社: rules on inari.jp/rite/, worked out for 2027.
  // 初午 = first 午 day of Feb (12-day cycle; 2025-02-06 and 2026-02-01 check out).
  { id: 'hatsuuma-inari-2027', venue: 'fushimi-inari', title: '初午大祭', titleEn: 'Hatsu-uma Festival', category: 'shrine_temple',
    start: '2027-02-08', startTime: '08:00', price: 0, source: 'https://inari.jp/rite/?month=2%E6%9C%88', confirmed: '2026-10-13' },
  { id: 'setsubun-inari-2027', venue: 'fushimi-inari', title: '節分祭', titleEn: 'Setsubun Festival', category: 'shrine_temple',
    start: '2027-02-03', startTime: '09:00', price: 0, source: 'https://inari.jp/rite/?month=2%E6%9C%88', confirmed: '2026-10-13' },
  // 神幸祭 = Sunday nearest Apr 20.
  { id: 'inari-shinkosai-2027', venue: 'fushimi-inari', title: '稲荷祭 神幸祭', titleEn: 'Inari Festival procession', category: 'festival',
    start: '2027-04-18', startTime: '11:00', price: 0, source: 'https://inari.jp/rite/?month=4%E6%9C%88', confirmed: '2026-10-13' },
  // 本宮祭 = first Sunday/holiday after 土用入り (~Jul 20); 宵宮祭 with 万灯神事 the evening before.
  { id: 'inari-yoimiya-2027', venue: 'fushimi-inari', title: '宵宮祭（万灯神事）', titleEn: 'Yoimiya lantern festival', category: 'shrine_temple',
    start: '2027-07-24', startTime: '18:00', price: 0, source: 'https://inari.jp/rite/?month=7%E6%9C%88', confirmed: '2026-10-13' },
  { id: 'inari-motomiya-2027', venue: 'fushimi-inari', title: '本宮祭', titleEn: 'Motomiya Festival', category: 'shrine_temple',
    start: '2027-07-25', startTime: '09:00', price: 0, source: 'https://inari.jp/rite/?month=7%E6%9C%88', confirmed: '2026-10-13' },

  // 節分 2027 = Feb 3. The 2026 notice designated Feb 2–3 (節分の前日・当日) for both.
  { id: 'yoshida-setsubun-2027', venue: 'yoshida', title: '吉田神社節分大祭', titleEn: 'Yoshida Shrine Setsubun Festival', category: 'festival',
    start: '2027-02-02', end: '2027-02-03', price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0801/0116/0116_6.pdf', confirmed: '2026-10-14' },
  { id: 'mibu-setsubun-2027', venue: 'mibudera', title: '壬生寺節分会', titleEn: 'Mibu-dera Setsubun', category: 'festival',
    start: '2027-02-02', end: '2027-02-03', price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0801/0116/0116_6.pdf', confirmed: '2026-10-14' },

  // Autumn 2026 special openings / light-ups (dates change every year)
  { id: 'kiyomizu-night-autumn-2026', venue: 'kiyomizudera', title: '秋の夜間特別拝観', titleEn: 'Autumn night viewing', category: 'shrine_temple',
    start: '2026-11-21', end: '2026-11-30', endTime: '21:30', price: null, source: 'https://www.kiyomizudera.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'jojuin-garden-2026', venue: 'kiyomizudera', title: '成就院庭園特別公開', titleEn: 'Jōju-in garden special opening', category: 'shrine_temple',
    start: '2026-11-21', end: '2026-11-30', startTime: '10:00', endTime: '20:30', price: null, source: 'https://www.kiyomizudera.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'toji-lightup-2026', venue: 'toji', title: '紅葉ライトアップと金堂・講堂夜間特別拝観', titleEn: 'Autumn leaves light-up & night viewing', category: 'shrine_temple',
    start: '2026-10-31', end: '2026-12-13', startTime: '18:00', endTime: '21:30', price: 1000, source: 'https://toji.or.jp/exhibition/2026_autumn/', confirmed: '2026-10-13' },
  { id: 'kitano-momiji-2026', venue: 'kitano', title: '史跡御土居もみじ苑公開', titleEn: 'Momiji-en maple garden opening', category: 'shrine_temple',
    start: '2026-10-31', end: '2026-12-06', price: null, source: 'https://kitanotenmangu.or.jp/', confirmed: '2026-10-13' },
  { id: 'shitennoji-meiho-autumn-2026', venue: 'shitennoji', title: '秋季名宝展', titleEn: 'Autumn Treasures Exhibition', category: 'shrine_temple',
    start: '2026-10-10', end: '2026-11-29', startTime: '08:30', endTime: '16:00', price: 500, source: 'https://www.shitennoji.or.jp/event/index.html', confirmed: '2026-10-13' },
  // 知恩院 deliberately absent: its robots.txt opts out of AI crawlers (ClaudeBot, GPTBot…). Enter by hand only.
];
