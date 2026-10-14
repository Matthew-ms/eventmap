import type { Recurring } from './model.ts';

// Each entry: facts only, checked against `source` on the `confirmed` date.
// price: 0 = free to attend/watch (paid seating may exist), null = unknown.
const KITANO = 'https://kitanotenmangu.or.jp/event/';
const KIYOMIZU = 'https://www.kiyomizudera.or.jp/event/';
const KAMIGAMO = 'https://www.kamigamojinja.jp/';
const MATSUNOO = 'https://www.matsunoo.or.jp/event';
const SEIMEI = 'https://www.seimeijinja.jp/event/';
const KIFUNE = 'https://kifunejinja.jp/event/';
const HIRANO = 'https://www.hiranojinja.com/home/gaiyo/nentyugyoji';
const SUMIYOSHI = 'https://www.sumiyoshitaisha.net/events/special.html';

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
  // 北野天満宮 (batch 2)
  { id: 'saitan-kitano', venue: 'kitano', title: '歳旦祭', titleEn: 'New Year Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'raijo-kitano', venue: 'kitano', title: '雷除大祭', titleEn: 'Thunder Protection Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=1', startTime: '04:00', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'gotanshin-kitano', venue: 'kitano', title: '御誕辰祭・大茅の輪くぐり', titleEn: 'Birthday Festival & giant Chinowa ring', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=25', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'nagoshi-kitano', venue: 'kitano', title: '夏越の大祓', titleEn: 'Summer Purification', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=30', startTime: '16:00', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'reisai-kitano', venue: 'kitano', title: '例祭（北野祭）', titleEn: 'Kitano Grand Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=4', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'yoko-sai', venue: 'kitano', title: '余香祭', titleEn: 'Yokō Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=29', price: 0, source: KITANO, confirmed: '2026-10-13' },
  { id: 'ofukuume-kitano', venue: 'kitano', title: '大福梅の授与（事始め）', titleEn: 'Ōfuku-ume plum charm distribution', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=13', price: null, source: KITANO, confirmed: '2026-10-13' },

  // 清水寺: dates from its 2026 年中行事 list
  { id: 'shusho-e-kiyomizu', venue: 'kiyomizudera', title: '修正会', titleEn: 'New Year Shushō-e', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1', days: 7, price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'shuni-e-kiyomizu', venue: 'kiyomizudera', title: '修二会', titleEn: 'Shuni-e', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=1', days: 3, price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'nehan-e-kiyomizu', venue: 'kiyomizudera', title: '涅槃会', titleEn: 'Nirvana Day', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=15', price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  ...[['03', 15], ['04', 3], ['10', 15]].map(([m, d]): Recurring => ({
    id: `seiryu-e-${m}`, venue: 'kiyomizudera', title: '青龍会', titleEn: 'Seiryū-e Blue Dragon procession', category: 'shrine_temple',
    rrule: `FREQ=YEARLY;BYMONTH=${Number(m)};BYMONTHDAY=${d}`, startTime: '14:00', endTime: '15:30', price: 0,
    source: KIYOMIZU, confirmed: '2026-10-13' })),
  { id: 'kotan-e-kiyomizu', venue: 'kiyomizudera', title: '降誕会', titleEn: "Buddha's Birthday", category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=8', price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'sennichi-kiyomizu', venue: 'kiyomizudera', title: '千日詣り・本堂内々陣特別拝観', titleEn: 'Sennichi-mairi & inner sanctum viewing', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=9', days: 8, startTime: '09:00', endTime: '17:00', price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'jizobon-kiyomizu', venue: 'kiyomizudera', title: '地蔵盆会', titleEn: 'Jizō-bon', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=23', price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'butsumyo-kiyomizu', venue: 'kiyomizudera', title: '仏名会', titleEn: 'Butsumyō-e', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=1', days: 3, price: null, source: KIYOMIZU, confirmed: '2026-10-13' },
  { id: 'joya-kiyomizu', venue: 'kiyomizudera', title: '除夜の鐘', titleEn: "New Year's Eve bell", category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=31', price: null, source: KIYOMIZU, confirmed: '2026-10-13' },

  // 住吉大社
  { id: 'otaue-sumiyoshi', venue: 'sumiyoshi', title: '御田植神事', titleEn: 'Rice Planting Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=14', startTime: '13:00', price: 0, source: SUMIYOSHI, confirmed: '2026-10-13' },
  { id: 'sumiyoshi-matsuri', venue: 'sumiyoshi', title: '住吉祭（宵宮祭・例大祭・頓宮祭）', titleEn: 'Sumiyoshi Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=30', days: 3, price: 0, source: SUMIYOSHI, confirmed: '2026-10-13' },
  { id: 'takaranoichi', venue: 'sumiyoshi', title: '宝之市神事', titleEn: 'Takara-no-ichi Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=17', price: 0, source: SUMIYOSHI, confirmed: '2026-10-13' },

  // 上賀茂神社 (祭事暦 on the homepage)
  { id: 'hakuba-kamigamo', venue: 'kamigamo', title: '白馬奏覧神事', titleEn: 'White Horse Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=7', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'busha-kamigamo', venue: 'kamigamo', title: '武射神事', titleEn: 'Busha archery ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=16', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'kyokusui-kamigamo', venue: 'kamigamo', title: '賀茂曲水宴', titleEn: 'Kamo Kyokusui poetry banquet', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=4;BYDAY=2SU', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'kurabeuma-kamigamo', venue: 'kamigamo', title: '賀茂競馬', titleEn: 'Kamo Horse Race', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=5', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'nagoshi-kamigamo', venue: 'kamigamo', title: '夏越大祓式', titleEn: 'Summer Purification', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=30', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'mitoshiro-kamigamo', venue: 'kamigamo', title: '賀茂御戸代能', titleEn: 'Mitoshiro Noh', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=1', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'kanname-kamigamo', venue: 'kamigamo', title: '神嘗奉祝祭', titleEn: 'Kanname celebration', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=17', startTime: '10:00', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'kasagake-kamigamo', venue: 'kamigamo', title: '笠懸神事', titleEn: 'Kasagake horseback archery', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYDAY=3SU', startTime: '13:00', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  { id: 'niiname-kamigamo', venue: 'kamigamo', title: '新嘗祭', titleEn: 'Niiname harvest festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=23', price: null, source: KAMIGAMO, confirmed: '2026-10-13' },
  // 伏見稲荷大社 (fixed-date rites; rule-based ones are in dated.ts)
  { id: 'kanko-inari', venue: 'fushimi-inari', title: '稲荷祭 還幸祭', titleEn: 'Inari Festival return procession', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=3', price: 0, source: 'https://inari.jp/rite/', confirmed: '2026-10-13' },
  { id: 'hitaki-inari', venue: 'fushimi-inari', title: '火焚祭', titleEn: 'Hitaki Fire Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=8', price: null, source: 'https://inari.jp/rite/', confirmed: '2026-10-13' },
  // 難波八阪神社
  { id: 'tsunahiki-namba', venue: 'namba-yasaka', title: '綱引神事', titleEn: 'Tug-of-war ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYDAY=3SU', price: null, source: 'https://nambayasaka.jp/?page_id=145', confirmed: '2026-10-13' },

  { id: 'eto-kigansai', venue: 'shimogamo', title: 'えと祈願祭', titleEn: 'Eto Prayer Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYDAY=3SU', price: null, source: 'https://www.shimogamo-jinja.or.jp/saiji/etokigansai', confirmed: '2026-10-13' },

  // --- Festivals from Kyoto Fire Bureau 指定催し notices ---
  // Yearly rules only where the 2025 and 2026 notices give the same dates.
  { id: 'gion-yoiyama', venue: 'gion-yamaboko', title: '祇園祭（山鉾町 露店・宵山）', titleEn: 'Gion Matsuri: Yoiyama street stalls', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=15', days: 2, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0806/0626/0626_6.pdf', confirmed: '2026-10-14' },
  { id: 'jonangu-reisai', venue: 'jonangu', title: '城南宮例祭', titleEn: 'Jōnangū Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=20', price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0806/0626/0626_6.pdf', confirmed: '2026-10-14' },
  { id: 'fujinomori-matsuri', venue: 'fujinomori', title: '藤森祭', titleEn: 'Fujinomori Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=1', days: 5, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0804/0415/0415_8.pdf', confirmed: '2026-10-14' },
  { id: 'goryo-matsuri', venue: 'goryo', title: '御霊祭', titleEn: 'Goryō Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=17', days: 2, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0804/0415/0415_8.pdf', confirmed: '2026-10-14' },
  { id: 'kisshoin-summer', venue: 'kisshoin-tenmangu', title: '吉祥院天満宮 夏季大祭', titleEn: 'Kisshōin Tenmangū Summer Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=25', price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0807/0724/0724_14.pdf', confirmed: '2026-10-14' },
  { id: 'hassaku-zaogongen', venue: 'kofukuji-zaodo', title: '八朔祭（蔵王権現）', titleEn: 'Hassaku Festival (Zaō Gongen)', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=31', price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0807/0724/0724_14.pdf', confirmed: '2026-10-14' },
  { id: 'gojo-toukimatsuri', venue: 'gojo-wakamiya', title: '五条若宮陶器祭', titleEn: 'Gojō Wakamiya Pottery Fair', category: 'market',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=7', days: 4, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0807/0724/0724_14.pdf', confirmed: '2026-10-14' },
  // New Year: designated Dec 31 – Jan 5 (2025-26 notice); 十日ゑびす Jan 8–11 (2026 notice).
  { id: 'kitano-hatsumode', venue: 'kitano', title: '火縄授与・初詣', titleEn: 'New Year visit & sacred fire rope', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=31', days: 6, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0711/1121/1121_16.pdf', confirmed: '2026-10-14' },
  { id: 'yasaka-okera', venue: 'yasaka', title: 'をけら詣り・初詣', titleEn: 'Okera-mairi & New Year visit', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=31', days: 6, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0711/1121/1121_16.pdf', confirmed: '2026-10-14' },
  { id: 'inari-hatsumode', venue: 'fushimi-inari', title: '初詣', titleEn: 'New Year visit', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=31', days: 6, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0711/1121/1121_16.pdf', confirmed: '2026-10-14' },
  { id: 'kyoto-ebisu-toka', venue: 'kyoto-ebisu', title: '十日ゑびす', titleEn: 'Tōka Ebisu (Kyoto)', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=8', days: 4, price: 0, source: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0712/1212/1212_7.pdf', confirmed: '2026-10-14' },

  // --- Osaka festivals ---
  // Page says "令和7年は 6月30日（火）…" but those weekdays are 2026's: a typo; the festival is 6/30–7/2 every year.
  { id: 'aizen-matsuri', venue: 'aizendo', title: '愛染まつり', titleEn: 'Aizen Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=30', days: 3, startTime: '12:00', price: 0, source: 'http://www.aizendo.com/festival.htm', confirmed: '2026-10-14' },
  { id: 'tenjin-matsuri', venue: 'osaka-tenmangu', title: '天神祭', titleEn: 'Tenjin Matsuri', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=24', days: 2, price: 0, source: 'https://osaka-info.jp/spot/osakatenmangu/', confirmed: '2026-10-14' },

  // --- Major festivals added 2026-10-14 at the user's request ---
  { id: 'kurama-hi-matsuri', venue: 'yuki-jinja', title: '鞍馬の火祭', titleEn: 'Kurama Fire Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=22', price: 0, source: 'https://www.kuramadera.or.jp/gyouji.html', confirmed: '2026-10-14' },
  // COMMON KNOWLEDGE, not stated on the linked page (best available official link; user decision 2026-10-14).
  { id: 'gozan-okuribi', venue: 'daimonji', title: '京都五山送り火', titleEn: 'Gozan no Okuribi bonfires', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=16', startTime: '20:00', price: 0, source: 'https://www.gozan-okuribi.com/', confirmed: '2026-10-14' },
  { id: 'gion-saki-junko', venue: 'gion-yamaboko', title: '祇園祭 前祭 山鉾巡行', titleEn: 'Gion Matsuri float parade (Saki Matsuri)', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=17', startTime: '09:00', price: 0, source: 'https://www.yasaka-jinja.or.jp/', confirmed: '2026-10-14' },
  { id: 'gion-ato-junko', venue: 'gion-yamaboko', title: '祇園祭 後祭 山鉾巡行', titleEn: 'Gion Matsuri float parade (Ato Matsuri)', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=24', startTime: '09:30', price: 0, source: 'https://www.yasaka-jinja.or.jp/', confirmed: '2026-10-14' },

  // --- Shrine batch 2b (2026-10-14): fixed calendar dates only; weekday/lunar/equinox ones are in dated.ts or skipped ---
  // 松尾大社
  { id: 'matsunoo-saitan', venue: 'matsunoo', title: '歳旦祭', titleEn: 'New Year Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1', startTime: '06:00', price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  { id: 'matsunoo-reisai', venue: 'matsunoo', title: '例祭', titleEn: 'Annual Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=2', startTime: '10:00', price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  { id: 'matsunoo-yamabuki', venue: 'matsunoo', title: '山吹まつり', titleEn: 'Yamabuki (kerria) Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=10', days: 26, price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  { id: 'matsunoo-koinobori', venue: 'matsunoo', title: 'こいのぼり こどもまつり', titleEn: "Carp Streamer Children's Festival", category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=5', startTime: '10:00', price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  { id: 'matsunoo-oharae', venue: 'matsunoo', title: '大祓式', titleEn: 'Summer Purification', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=30', startTime: '15:00', price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  { id: 'matsunoo-tanabata', venue: 'matsunoo', title: '七夕まつり', titleEn: 'Tanabata Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=7', startTime: '18:30', price: 0, source: MATSUNOO, confirmed: '2026-10-14' },
  // 晴明神社 (晴明祭 follows the autumn equinox: see dated.ts)
  { id: 'seimei-saitan', venue: 'seimei', title: '歳旦祭', titleEn: 'New Year Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1', startTime: '08:00', price: 0, source: SEIMEI, confirmed: '2026-10-14' },
  { id: 'seimei-ohitaki', venue: 'seimei', title: '御火焚祭', titleEn: 'Ohitaki Fire Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=23', price: 0, source: SEIMEI, confirmed: '2026-10-14' },
  // 貴船神社
  { id: 'kifune-wakana', venue: 'kifune', title: '若菜神事', titleEn: 'Young Greens Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=7', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-touka', venue: 'kifune', title: '桃花神事', titleEn: 'Peach Blossom Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=3', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-amagoi', venue: 'kifune', title: '雨乞祭', titleEn: 'Rain Prayer Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=9', startTime: '10:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-shobu', venue: 'kifune', title: '菖蒲神事', titleEn: 'Iris Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=5;BYMONTHDAY=5', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-matsuri', venue: 'kifune', title: '貴船祭（例祭）', titleEn: 'Kifune Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=1', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-mizumatsuri', venue: 'kifune', title: '貴船の水まつり・七夕神事', titleEn: 'Water Festival & Tanabata', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=7;BYMONTHDAY=7', startTime: '10:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-kikka', venue: 'kifune', title: '菊花神事', titleEn: 'Chrysanthemum Ritual', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=9', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  { id: 'kifune-ohitaki', venue: 'kifune', title: '御火焚祭', titleEn: 'Ohitaki Fire Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=7', startTime: '11:00', price: 0, source: KIFUNE, confirmed: '2026-10-14' },
  // 平野神社
  { id: 'hirano-saitan', venue: 'hirano', title: '歳旦祭', titleEn: 'New Year Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1', startTime: '07:00', price: 0, source: HIRANO, confirmed: '2026-10-14' },
  { id: 'hirano-oukasai', venue: 'hirano', title: '桜花祭（神幸祭）', titleEn: 'Ōka-sai Cherry Blossom Festival', category: 'festival',
    rrule: 'FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=10', startTime: '10:00', price: 0, source: HIRANO, confirmed: '2026-10-14' },
  { id: 'hirano-nagoshi', venue: 'hirano', title: '夏越大祓式', titleEn: 'Summer Purification', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=30', startTime: '16:00', price: 0, source: HIRANO, confirmed: '2026-10-14' },
  { id: 'hirano-houtou', venue: 'hirano', title: '奉灯祭', titleEn: 'Lantern Festival', category: 'shrine_temple',
    rrule: 'FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=14', startTime: '18:00', price: 0, source: HIRANO, confirmed: '2026-10-14' },
];
