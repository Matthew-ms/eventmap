// Every source the map uses. An event's `source` URL must appear here (npm run check enforces it).
//
// kind 'page':     official page read by hand. Facts only, linked back. The daily job hashes the
//                  page text and opens a GitHub issue when it changes, so the entry gets re-checked.
// kind 'opendata': machine-readable dataset fetched daily by scripts/sources/<id>.ts.
// kind 'scraper':  schedule page scraped daily by scripts/sources/schedules.ts (facts + link only).
// kind 'link':     best available official link for a common-knowledge date; the page itself doesn't state it
//                  (or blocks bots). Not watched.
// kind 'notice':   fixed official notice (e.g. Kyoto gazette PDF). Never changes, so not watched.
//
// `checked`: date the robots.txt and terms/licence were last reviewed.

export interface Source {
  id: string;
  url: string;
  name: string;
  kind: 'page' | 'opendata' | 'notice' | 'scraper' | 'link';
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

  // --- Festivals (batch 3, 2026-10-14) ---
  { id: 'kyoto-notice-r070411', kind: 'notice', name: '京都市消防局告示第1号 (2025-04-11)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0704/0411/0411_9.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r070620', kind: 'notice', name: '京都市消防局告示第5号 (2025-06-20)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0706/0620/0620_21.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r070708', kind: 'notice', name: '京都市消防局告示第6号 (2025-07-08)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0707/0708/0708_4.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r071121', kind: 'notice', name: '京都市消防局告示第12号 (2025-11-21)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0711/1121/1121_16.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r071212', kind: 'notice', name: '京都市消防局告示第13号 (2025-12-12)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0712/1212/1212_7.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r080116', kind: 'notice', name: '京都市消防局告示第14号 (2026-01-16)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0801/0116/0116_6.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r080415', kind: 'notice', name: '京都市消防局告示第1号 (2026-04-15)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0804/0415/0415_8.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r080626', kind: 'notice', name: '京都市消防局告示第3号 (2026-06-26)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0806/0626/0626_6.pdf', checked: '2026-10-14' },
  { id: 'kyoto-notice-r080724', kind: 'notice', name: '京都市消防局告示第4号 (2026-07-24)', url: 'https://www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r0807/0724/0724_14.pdf', checked: '2026-10-14' },
  { id: 'osaka-info-tenmangu', kind: 'page', name: '大阪観光局 大阪天満宮 (天神祭)', url: 'https://osaka-info.jp/spot/osakatenmangu/', checked: '2026-10-14' },
  // No current events: watched so the 2027 schedule announcement opens an issue.
  { id: 'kishiwada-danjiri', kind: 'page', name: '岸和田市 だんじり祭', url: 'https://www.city.kishiwada.lg.jp/site/danjiri/', checked: '2026-10-14' },
  { id: 'aizendo-festival', kind: 'page', name: '愛染堂 愛染まつり', url: 'http://www.aizendo.com/festival.htm', checked: '2026-10-14' },

  // --- Scraped schedules (2026-10-14). Terms forbid "secondary use" of content; user decided facts + link only.
  { id: 'kintetsu-abeno', kind: 'scraper', name: 'あべのハルカス近鉄本店 催事', url: 'https://abenoharukas.d-kintetsu.co.jp/eventschedule/', checked: '2026-10-14' },
  { id: 'zepp-namba', kind: 'scraper', name: 'Zepp Namba スケジュール', url: 'https://www.zepp.co.jp/hall/namba/schedule/', checked: '2026-10-14' },
  { id: 'zepp-osakabayside', kind: 'scraper', name: 'Zepp Osaka Bayside スケジュール', url: 'https://www.zepp.co.jp/hall/osakabayside/schedule/', checked: '2026-10-14' },
  { id: 'quattro-umeda', kind: 'scraper', name: '梅田CLUB QUATTRO スケジュール', url: 'https://www.club-quattro.com/umeda/schedule/', checked: '2026-10-14' },
  { id: 'festivalhall', kind: 'scraper', name: 'フェスティバルホール 公演', url: 'https://www.festivalhall.jp/events/', checked: '2026-10-14' },
  { id: 'rohm-theatre', kind: 'scraper', name: 'ロームシアター京都 プログラム', url: 'https://rohmtheatrekyoto.jp/program/', checked: '2026-10-14' },
  { id: 'bigcat', kind: 'scraper', name: '心斎橋BIGCAT スケジュール', url: 'https://bigcat-live.com/', checked: '2026-10-14' },

  // --- Major festivals (2026-10-14, user request) ---
  { id: 'kuramadera-gyouji', kind: 'page', name: '鞍馬寺 年中行事 (鞍馬の火祭 10/22)', url: 'https://www.kuramadera.or.jp/gyouji.html', checked: '2026-10-14' },
  { id: 'gozan-okuribi', kind: 'link', name: '京都五山送り火連合会', url: 'https://www.gozan-okuribi.com/', checked: '2026-10-14' },
  { id: 'yasaka-home', kind: 'link', name: '八坂神社 (blocks bots: 503)', url: 'https://www.yasaka-jinja.or.jp/', checked: '2026-10-14' },

  // --- Concert venues, second pass (2026-10-14) ---
  { id: 'metro-kyoto', kind: 'scraper', name: 'CLUB METRO iCal feed', url: 'https://www.metro.ne.jp/schedule/?ical=1', checked: '2026-10-14' },
  { id: 'janus', kind: 'scraper', name: '心斎橋JANUS スケジュール', url: 'https://janusosaka.com/schedule', checked: '2026-10-14' },
  { id: 'symphonyhall', kind: 'scraper', name: 'ザ・シンフォニーホール 公演', url: 'https://www.symphonyhall.jp/event', checked: '2026-10-14' },
  { id: 'osaka-johall', kind: 'scraper', name: '大阪城ホール イベント', url: 'https://www.osaka-johall.com/event/', checked: '2026-10-14' },
  { id: 'urbanguild', kind: 'scraper', name: 'UrBANGUILD iCal feed', url: 'https://urbanguild.net/?ical=1', checked: '2026-10-14' },

  // --- Shrine batch 2b (2026-10-14) ---
  { id: 'matsunoo-event', kind: 'page', name: '松尾大社 年間祭儀予定', url: 'https://www.matsunoo.or.jp/event', checked: '2026-10-14' },
  { id: 'seimei-event', kind: 'page', name: '晴明神社 年中行事', url: 'https://www.seimeijinja.jp/event/', checked: '2026-10-14' },
  { id: 'kifune-event', kind: 'page', name: '貴船神社 祭典・神事', url: 'https://kifunejinja.jp/event/', checked: '2026-10-14' },
  { id: 'hirano-nenchu', kind: 'page', name: '平野神社 年中行事', url: 'https://www.hiranojinja.com/home/gaiyo/nentyugyoji', checked: '2026-10-14' },

  // --- Osaka City Fire Bureau 指定催し (far fewer than Kyoto: one or two at a time) ---
  // The list page is watched so each new designation opens an issue.
  { id: 'osaka-shitei-list', kind: 'page', name: '大阪市 指定催し一覧', url: 'https://www.city.osaka.lg.jp/shobo/page/0000460231.html', checked: '2026-10-14' },
  { id: 'osaka-notice-r081009', kind: 'notice', name: '大阪市（消）告示第28号 (2026-10-09)', url: 'https://www.city.osaka.lg.jp/shobo/cmsfiles/contents/0000460/460231/naniwayodogawa.pdf', checked: '2026-10-14' },
];
