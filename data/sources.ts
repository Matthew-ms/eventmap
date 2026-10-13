// Every source the map uses. An event's `source` URL must appear here (npm run check enforces it).
//
// kind 'page':     official page read by hand. Facts only, linked back. The daily job hashes the
//                  page text and opens a GitHub issue when it changes, so the entry gets re-checked.
// kind 'opendata': machine-readable dataset fetched daily by scripts/sources/<id>.ts.
// kind 'notice':   fixed official notice (e.g. Kyoto gazette PDF). Never changes, so not watched.
//
// `checked`: date the robots.txt and terms/licence were last reviewed.

export interface Source {
  id: string;
  url: string;
  name: string;
  kind: 'page' | 'opendata' | 'notice';
  licence?: string; // only for open data; pages are used for facts only
  attribution?: string; // HTML shown in the map credits, if the licence requires it
  checked: string;
}

export const sources: Source[] = [
  // --- Open data ---
  { id: 'osaka-parks', kind: 'opendata', name: '大阪府 イベント一覧 (府営公園)',
    url: 'https://data.bodik.jp/dataset/270008_event', licence: 'CC BY 4.0',
    attribution: '<a href="https://data.bodik.jp/dataset/270008_event" target="_blank" rel="noopener">大阪府 イベント一覧</a> (CC BY 4.0)',
    checked: '2026-10-13' },

  // --- Official pages, read by hand ---
  { id: 'toji-mieku', kind: 'page', name: '東寺 御影供と弘法市', url: 'https://toji.or.jp/mieku/', checked: '2026-10-13' },
  { id: 'kitano-event', kind: 'page', name: '北野天満宮 年中行事・御縁日', url: 'https://kitanotenmangu.or.jp/event/', checked: '2026-10-13' },
  { id: 'shitennoji-event', kind: 'page', name: '四天王寺 行事', url: 'https://www.shitennoji.or.jp/event/index.html', checked: '2026-10-13' },
  { id: 'heian-jidai', kind: 'page', name: '平安神宮 時代祭', url: 'https://www.heianjingu.or.jp/ritual/jidaimatsuri/', checked: '2026-10-13' },
  { id: 'imamiya-toka', kind: 'page', name: '今宮戎神社 十日戎', url: 'https://www.imamiya-ebisu.jp/tokaebisu', checked: '2026-10-13' },
  { id: 'shimogamo-saiji', kind: 'page', name: '下鴨神社 祭事', url: 'https://www.shimogamo-jinja.or.jp/saiji', checked: '2026-10-13' },
  { id: 'shimogamo-eto', kind: 'page', name: '下鴨神社 えと祈願祭', url: 'https://www.shimogamo-jinja.or.jp/saiji/etokigansai', checked: '2026-10-13' },

  // --- Markets (batch 1, 2026-10-13) ---
  { id: 'tedukuri-ichi', kind: 'page', name: '手づくり市 (百万遍・梅小路)', url: 'https://www.tedukuri-ichi.com/', checked: '2026-10-13' },
  { id: 'heian-nominoichi', kind: 'page', name: '平安蚤の市', url: 'https://www.heiannominoichi.jp/', checked: '2026-10-13' },

  // --- Kyoto City Fire Bureau 指定催し notices (京都市公報). Official list of large events with stalls. ---
  { id: 'kyoto-notice-r080821', kind: 'notice', name: '京都市消防局告示第6号 (2026-08-21)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0808/0821/0821_3.pdf', checked: '2026-10-13' },
  { id: 'kyoto-notice-r080918', kind: 'notice', name: '京都市消防局告示第7号 (2026-09-18)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0809/0918/0918_12.pdf', checked: '2026-10-13' },
];
