import type { Recurring } from './model.ts';

// Each entry: facts only, checked against `source` on the `confirmed` date.
// price: 0 = free to attend/watch (paid seating may exist), null = unknown.
export const recurring: Recurring[] = [
  // --- Markets ---
  { id: 'kobo-ichi', venue: 'toji', title: '弘法市', titleEn: 'Kōbō-ichi Market', category: 'market',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=21', price: 0, source: 'https://toji.or.jp/mieku/', confirmed: '2026-10-13' },
  { id: 'tenjin-ichi', venue: 'kitano', title: '天神市', titleEn: 'Tenjin-ichi Market', category: 'market',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=25', price: 0, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'daishi-e', venue: 'shitennoji', title: '大師会', titleEn: 'Daishi-e Fair', category: 'market',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=21', price: 0, source: 'https://www.shitennoji.or.jp/event/index.html', confirmed: '2026-10-13' },
  { id: 'taishi-e', venue: 'shitennoji', title: '太子会', titleEn: 'Taishi-e Fair', category: 'market',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=22', price: 0, source: 'https://www.shitennoji.or.jp/event/index.html', confirmed: '2026-10-13' },
  // UNTIL = end of the Kyoto Fire Bureau designation; renew from the next year's notice.
  { id: 'garakuta-ichi', venue: 'toji', title: '東寺ガラクタ市', titleEn: 'Tō-ji Garakuta Flea Market', category: 'market',
    rrule: 'FREQ=MONTHLY;BYDAY=1SU;UNTIL=20270801', price: 0,
    source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0808/0821/0821_3.pdf', confirmed: '2026-10-13' },
  { id: 'hyakumanben-tezukuri', venue: 'chionji', title: '百万遍さんの手づくり市', titleEn: 'Hyakumanben Handicraft Market', category: 'market',
    rrule: 'FREQ=MONTHLY;BYMONTHDAY=15;BYMONTH=1,2,3,4,5,6,7,9,10,11,12', startTime: '08:00', endTime: '16:00', price: 0, // no market in August
    source: 'https://www.tedukuri-ichi.com/', confirmed: '2026-10-13' },
  { id: 'umekoji-tezukuri', venue: 'umekoji-park', title: '梅小路公園手づくり市', titleEn: 'Umekōji Park Handicraft Market', category: 'market',
    rrule: 'FREQ=MONTHLY;BYDAY=1SA;BYMONTH=2,3,4,6,7,9,10,11,12', startTime: '09:00', endTime: '16:00', price: 0, // not Jan, May, Aug
    source: 'https://www.tedukuri-ichi.com/', confirmed: '2026-10-13' },

  // --- Festivals ---
  { id: 'jidai-matsuri', venue: 'heian', title: '時代祭', titleEn: 'Jidai Matsuri', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=22', startTime: '12:00', price: 0,
    source: 'https://www.heianjingu.or.jp/ritual/jidaimatsuri/', confirmed: '2026-10-13' },
  { id: 'kitano-matsuri', venue: 'kitano', title: '北野祭 神幸祭・還幸祭', titleEn: 'Kitano Festival processions', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=1', days: 5, price: 0, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'toka-ebisu', venue: 'imamiya', title: '十日戎', titleEn: 'Tōka Ebisu', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=9', days: 3, price: 0, source: 'https://www.imamiya-ebisu.jp/tokaebisu', confirmed: '2026-10-13' },
  { id: 'aoi-matsuri', venue: 'shimogamo', title: '葵祭', titleEn: 'Aoi Matsuri', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=15', price: 0, source: 'https://www.shimogamo-jinja.or.jp/saiji', confirmed: '2026-10-13' },
  { id: 'mikage-sai', venue: 'shimogamo', title: '御蔭祭', titleEn: 'Mikage Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=12', startTime: '09:00', price: 0, source: 'https://www.shimogamo-jinja.or.jp/saiji', confirmed: '2026-10-13' },

  // --- Shrine / temple ---
  { id: 'baika-sai', venue: 'kitano', title: '梅花祭', titleEn: 'Plum Blossom Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=25', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'kyokusui-kitano', venue: 'kitano', title: '曲水の宴', titleEn: 'Kyokusui-no-Utage poetry banquet', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=3', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'ochatsubo', venue: 'kitano', title: '御茶壷奉献祭・口切式', titleEn: 'Tea Jar Offering', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=26', startTime: '10:45', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'kencha-kitano', venue: 'kitano', title: '献茶祭', titleEn: 'Tea Offering Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=1', price: null, source: 'https://kitanotenmangu.or.jp/event/', confirmed: '2026-10-13' },
  { id: 'yabusame-shimogamo', venue: 'shimogamo', title: '騎射流鏑馬神事', titleEn: 'Yabusame horseback archery', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=3', price: null, source: 'https://www.shimogamo-jinja.or.jp/saiji', confirmed: '2026-10-13' },
  { id: 'eto-kigansai', venue: 'shimogamo', title: 'えと祈願祭', titleEn: 'Eto Prayer Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYDAY=3SU', price: null, source: 'https://www.shimogamo-jinja.or.jp/saiji/etokigansai', confirmed: '2026-10-13' },
];
