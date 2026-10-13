import type { Venue } from './model.ts';

// Coordinates: official address → GSI address search (msearch.gsi.go.jp).
export const venues: Venue[] = [
  { id: 'toji', name: '東寺', nameEn: 'Tō-ji', aliases: ['教王護国寺', 'Toji'], lat: 34.982113, lon: 135.746933, url: 'https://toji.or.jp/' },
  { id: 'kitano', name: '北野天満宮', nameEn: 'Kitano Tenmangū', aliases: ['天神さん', 'Kitano Tenmangu'], lat: 35.033539, lon: 135.735458, url: 'https://kitanotenmangu.or.jp/' },
  { id: 'shimogamo', name: '下鴨神社', nameEn: 'Shimogamo Shrine', aliases: ['賀茂御祖神社'], lat: 35.038692, lon: 135.772964, url: 'https://www.shimogamo-jinja.or.jp/' },
  { id: 'heian', name: '平安神宮', nameEn: 'Heian Shrine', aliases: ['Heian Jingu'], lat: 35.015724, lon: 135.782562, url: 'https://www.heianjingu.or.jp/' },
  { id: 'shitennoji', name: '四天王寺', nameEn: 'Shitennō-ji', aliases: ['Shitennoji'], lat: 34.654602, lon: 135.518204, url: 'https://www.shitennoji.or.jp/' },
  { id: 'chionji', name: '百萬遍知恩寺', nameEn: 'Chion-ji (Hyakumanben)', aliases: ['知恩寺', '百万遍'], lat: 35.029804, lon: 135.78093, url: 'https://www.tedukuri-ichi.com/access_hyakumanben' },
  { id: 'umekoji-park', name: '梅小路公園', nameEn: 'Umekōji Park', aliases: ['Umekoji Park'], lat: 34.987286, lon: 135.744644 },
  { id: 'okazaki-park', name: '岡崎公園', nameEn: 'Okazaki Park', aliases: ['平安神宮前'], lat: 35.014297, lon: 135.781815 },
  { id: 'higashihonganji-ryokuchi', name: '東本願寺前市民緑地', nameEn: 'Higashi Honganji front garden', aliases: ['東本願寺'], lat: 34.991413, lon: 135.758575 },
  { id: 'kiyomizuyaki-danchi', name: '清水焼団地', nameEn: 'Kiyomizu-yaki Danchi', aliases: ['清水焼の郷'], lat: 34.979778, lon: 135.794296 },
  { id: 'kiyomizudera', name: '清水寺', nameEn: 'Kiyomizu-dera', aliases: ['Kiyomizudera'], lat: 34.99588, lon: 135.783142, url: 'https://www.kiyomizudera.or.jp/' },
  { id: 'sumiyoshi', name: '住吉大社', nameEn: 'Sumiyoshi Taisha', aliases: ['すみよっさん', 'Sumiyoshi'], lat: 34.612617, lon: 135.491318, url: 'https://www.sumiyoshitaisha.net/' },
  { id: 'imamiya', name:'今宮戎神社', nameEn: 'Imamiya Ebisu Shrine', aliases: ['えべっさん'], lat: 34.654907, lon: 135.502472, url: 'https://www.imamiya-ebisu.jp/' },
  { id: 'kamigamo', name: '上賀茂神社', nameEn: 'Kamigamo Shrine', aliases: ['賀茂別雷神社'], lat: 35.060097, lon: 135.751495, url: 'https://www.kamigamojinja.jp/' },
  { id: 'fushimi-inari', name: '伏見稲荷大社', nameEn: 'Fushimi Inari Taisha', aliases: ['お稲荷さん', 'Fushimi Inari'], lat: 34.967037, lon: 135.773499, url: 'https://inari.jp/' },
  { id: 'namba-yasaka', name: '難波八阪神社', nameEn: 'Namba Yasaka Shrine', aliases: ['Namba Yasaka'], lat: 34.661442, lon: 135.496399, url: 'https://nambayasaka.jp/' },
];
