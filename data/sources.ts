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

  // --- Shrine / temple (batch 2, 2026-10-13) ---
  { id: 'kiyomizu-event', kind: 'page', name: '清水寺 年中行事', url: 'https://www.kiyomizudera.or.jp/event/', checked: '2026-10-13' },
  { id: 'sumiyoshi-special', kind: 'page', name: '住吉大社 特別な祭', url: 'https://www.sumiyoshitaisha.net/events/special.html', checked: '2026-10-13' },
  { id: 'toji-autumn-2026', kind: 'page', name: '東寺 紅葉ライトアップ 2026', url: 'https://toji.or.jp/exhibition/2026_autumn/', checked: '2026-10-13' },
  // ponytail: homepage, so the watcher may report news churn; switch to a dedicated もみじ苑 page if it does.
  { id: 'kitano-home', kind: 'page', name: '北野天満宮 トップ (もみじ苑)', url: 'https://kitanotenmangu.or.jp/', checked: '2026-10-13' },
  { id: 'kamigamo-home', kind: 'page', name: '上賀茂神社 祭事暦', url: 'https://www.kamigamojinja.jp/', checked: '2026-10-13' },
  { id: 'inari-rite', kind: 'page', name: '伏見稲荷大社 祭事', url: 'https://inari.jp/rite/', checked: '2026-10-13' },
  { id: 'inari-rite-02', kind: 'page', name: '伏見稲荷大社 祭事 2月', url: 'https://inari.jp/rite/?month=2%E6%9C%88', checked: '2026-10-13' },
  { id: 'inari-rite-04', kind: 'page', name: '伏見稲荷大社 祭事 4月', url: 'https://inari.jp/rite/?month=4%E6%9C%88', checked: '2026-10-13' },
  { id: 'inari-rite-07', kind: 'page', name: '伏見稲荷大社 祭事 7月', url: 'https://inari.jp/rite/?month=7%E6%9C%88', checked: '2026-10-13' },
  { id: 'namba-yasaka-tsunahiki', kind: 'page', name: '難波八阪神社 綱引神事', url: 'https://nambayasaka.jp/?page_id=145', checked: '2026-10-13' },
];
