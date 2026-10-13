import type { Venue } from './model.ts';

// Coordinates: official address → GSI address search (msearch.gsi.go.jp).
export const venues: Venue[] = [
  { id: 'toji', name: '東寺', nameEn: 'Tō-ji', aliases: ['教王護国寺', 'Toji'], lat: 34.982113, lon: 135.746933, url: 'https://toji.or.jp/' },
  { id: 'kitano', name: '北野天満宮', nameEn: 'Kitano Tenmangū', aliases: ['天神さん', 'Kitano Tenmangu'], lat: 35.033539, lon: 135.735458, url: 'https://kitanotenmangu.or.jp/' },
  { id: 'shimogamo', name: '下鴨神社', nameEn: 'Shimogamo Shrine', aliases: ['賀茂御祖神社'], lat: 35.038692, lon: 135.772964, url: 'https://www.shimogamo-jinja.or.jp/' },
  { id: 'heian', name: '平安神宮', nameEn: 'Heian Shrine', aliases: ['Heian Jingu'], lat: 35.015724, lon: 135.782562, url: 'https://www.heianjingu.or.jp/' },
  { id: 'shitennoji', name: '四天王寺', nameEn: 'Shitennō-ji', aliases: ['Shitennoji'], lat: 34.654602, lon: 135.518204, url: 'https://www.shitennoji.or.jp/' },
  { id: 'imamiya', name: '今宮戎神社', nameEn: 'Imamiya Ebisu Shrine', aliases: ['えべっさん'], lat: 34.654907, lon: 135.502472, url: 'https://www.imamiya-ebisu.jp/' },
];
