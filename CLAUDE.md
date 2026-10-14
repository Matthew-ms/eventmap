# Japan Event Map App — Project Brief

## Working rules for Claude (read first)
- **Keep the planning files current without being asked.** Whenever a phase or step finishes, the user adds or changes steps, or a plan decision is made, update in the same session:
  - `PLAN.md` → the **Status** table at the top (state, date, what is still open) and any changed phase steps.
  - `CLAUDE.md` → **Decisions** (decision + why) and **Data source findings** (anything learned about a source).
- Do it before reporting the work as done, so the next session can start from these files alone.
- Use absolute dates (e.g. 2026-10-13), never "today" or "next week".

## Goal
A map app showing events across Japan as pins, so users can find events they're interested in without searching site by site. Focus includes small/indie events that big aggregators miss.

Target event types:
- 花火大会 (fireworks festivals)
- 夏祭り (summer festivals)
- Free-entry festivals
- Second-hand markets (フリマ, 骨董市, 蚤の市)
- Seasonal shrine/temple events
- Department store / mall events (催事, 物産展, sales)
- Music concerts and tours

## Data collection: three layers
All sources are normalized into one event schema.

### 1. Base layer — official sources (most reliable, highest priority)
- Official APIs, e.g. connpass (API key required; apply via their help page; their ToS bans scraping).
- Municipal open data in the Digital Agency's 自治体標準オープンデータセット "イベント一覧" format (CSV). BODIK aggregates many municipal catalogs.
- schema.org `Event` JSON-LD embedded in event pages.

### 2. Long-tail layer — LLM scraping
- Only crawl a curated list of sites whose terms allow it.
- Flow: fetch (Playwright if JS-rendered) → strip to text/Markdown → LLM extracts fixed JSON via structured output → validate.
- Prompt rule: return `null` for any field not on the page (prevents hallucination).
- Large consistent sites: LLM writes selectors/scraper once; plain code runs daily; LLM fallback when layout breaks.
- Re-crawl on schedule; call the LLM only when a page's content hash changes.
- Use a vision model for schedules posted as images/flyers.
- Ready-made options: Firecrawl, Crawl4AI.

### 3. Indie layer — user/organizer submissions
- User pastes a link or uploads a flyer photo → LLM pre-fills the form → human confirms.
- Covers events that only exist on X/Instagram/paper flyers (don't scrape those platforms: ToS bans it, login walls, X API is expensive).

When the same event comes from multiple sources, prefer the official/API version.

## Key principle: track places and organizers, not individual events
Venues, shrines, malls, and market organizers publish schedule pages with a known location. One page yields many events, no geocoding needed.

## Methods by event type
| Event type | Main method | Notes |
|---|---|---|
| 花火大会 | LLM scraping of 実行委員会 / 観光協会 pages (curated list) | Dates announced in spring; status field for 雨天順延・中止, re-check near the day; pin the main viewing area |
| 夏祭り | Municipal open data + city/観光協会 pages + submissions | Neighborhood/商店街 festivals mostly via submissions |
| Free-entry festivals | LLM scraping of organizer/city pages + submissions | Store `price = 0` for filtering |
| Second-hand markets | Scrape organizer schedule pages | Many are fixed recurring dates → recurrence rule; scrape only for changes/cancellations |
| Shrine/temple events | Recurring-event table, re-confirmed yearly | Locations from open data (観光施設一覧, 文化財一覧) or OpenStreetMap; traditional/calculated dates (節分, 七五三, 酉の市) |
| Dept store/mall events | Scrape each store's 催事・イベント情報 page | Date range events; fixed location; check each chain's terms |
| Concerts | Venue schedule pages (base) + artist tour pages | See below |

### Concerts
- Venue (live house/hall) monthly スケジュール pages as base: known location, includes indie acts with no official site.
- Artist tour pages for artists users follow: one tour → many shows (date, venue, open/start time).
- Tour pages give venue names, not addresses → match against own venue table.
- Extract ticket phases (FC先行, 抽選, 一般発売); re-check tour pages often.
- Avoid ticketing sites (e+, ぴあ, ローチケ) — ToS generally forbids scraping. Songkick/Bandsintown access has been restricted and Japan coverage is thin.
- Dedupe concerts by date + venue.

## Shared pipeline
1. **Ingest** — scheduled jobs (cron / GitHub Actions / Cloud Run Jobs).
2. **Normalize** — into the common schema.
3. **Validate** — dates parse, address geocodes, event not already over.
4. **Geocode** — clean with `@geolonia/normalize-japanese-addresses`, then GSI (国土地理院) address API. Avoid Google Geocoding (terms limit storing results).
5. **Deduplicate** — date + location proximity + title similarity.
6. **Store** — PostgreSQL + PostGIS (radius / viewport queries).
7. **Display** — MapLibre GL + `supercluster` for pin clustering.

## Schema requirements
- Event: title, start/end datetime, **date range** (`start_date`, `end_date`), venue ref, address, category, price, source URL, source type, confidence.
- **Recurrence rule** for yearly/monthly events.
- **Status**: scheduled / postponed / cancelled.
- **Tour → shows** relation for concerts.
- **Venue table** shared by shrines, malls, live houses, market sites: name, aliases, coordinates.

## Ground rules
- Store only facts (title, date, venue, times, price) + link back to the source.
- Never copy event descriptions or photos.
- Throttle requests; respect robots.txt and each site's terms.

## Suggested first version
One region, using connpass + municipal open data (no legal grey areas), then expand.

## Data source findings (checked 2026-10-11)
- **Osaka Prefecture イベント一覧** (BODIK id `270008_event`): ~67 events, prefectural parks only, all with lat/lon, last updated 2026-10-05, covers ~2.5 months ahead (update frequency unknown). Shift-JIS CSV. Usable. Fetched daily since 2026-10-13 (`scripts/sources/osaka-parks.ts`); on that date: 52 events at 15 parks, and the CSV contained one row repeated verbatim (now dropped). Price column is empty → price unknown.
- **Higashiōsaka イベント一覧** (BODIK `272272_12`): 24 rows, mostly seminars, no location. Not useful.
- No other Osaka/Kyoto municipality publishes イベント一覧 on BODIK or the national e-Gov catalog. Kyoto City portal has only a children's-centre calendar; Kyoto Prefecture has no event dataset.
- **ORDEN / ODPO** (Osaka platform with prefecture + municipal events): registration is for businesses/organizations; API spec not public. Unexplored.
- **京都観光Navi** (ja.kyoto.travel): 700+ recurring events/year. Not open data; terms not yet checked.
- **Kyoto City Fire Bureau 指定催し notices** (京都市公報, checked 2026-10-13): the city gazette publishes a 消防局告示 every month or so, listing each large event with stalls (markets, festivals, 縁日) with exact dates or monthly rule, validity window and address. Official, and the best Kyoto source found. Path `www2.city.kyoto.lg.jp/somu/bunsyo/kouhou/r{Reiwa YY}{MM}/{MMDD}/mokuji2.html`; robots.txt allows all; the default curl UA gets 403, our EventMapBot UA works. PDFs need reading by eye (pdftotext fails on the fonts). The monthly 弘法市/天神市 designations are renewed each July (2026: notice 第4号 of 2026-07-24).
- **手づくり市** (tedukuri-ichi.com): official organiser of 百万遍 (15th, not Aug) and 梅小路 (1st Sat, not Jan/May/Aug). **平安蚤の市** (heiannominoichi.jp): date moves monthly, published on the homepage. Osaka has no equivalent gazette source found yet.
- **AI opt-out** (checked 2026-10-13): 知恩院 (chion-in.or.jp) robots.txt blocks ClaudeBot/GPTBot/CCBot etc. → not used. All other sites used so far allow it.
- **More shrine/temple sources** (2026-10-13): 清水寺 /event/ has a full 年中行事 list incl. night-viewing dates; 上賀茂神社 homepage 祭事暦; 伏見稲荷 /rite/?month=N月 gives rules (初午 = first 午 day of Feb; 神幸祭 = Sunday nearest Apr 20; 本宮祭 = first Sun/holiday after 土用入り), worked out per year in dated.ts; 住吉大社 /events/special.html; 難波八阪 綱引神事 = 3rd Sun Jan. 壬生寺 publishes no dates; 生國魂神社 domain did not resolve; 八坂神社 still 503.
- **Festival sources** (2026-10-14): Kyoto gazette notices back to 2025-04 scanned; fixed-date festivals (same dates in 2025 and 2026): 祇園祭 宵山 stalls 7/15–16, 城南宮例祭 7/20, 藤森祭 5/1–5, 御霊祭 5/17–18, 吉祥院天満宮夏季大祭 8/25, 八朔祭 8/31, 五条若宮陶器祭 8/7–10. Weekend-based ones vary (下御霊, 梛ノ宮, 春日祭, 御香宮, 嵯峨天皇祭) and are entered only per year from the notice. 京都観光Navi footer: 「転載を固くお断り」, so not used as a source. 大阪観光局 osaka-info.jp: official, no robots restrictions, states 天神祭 = 7/24–25 every year. 岸和田市 danjiri page has 2026 dates only, no stated rule. `scripts/geocode.ts` wraps the GSI geocoder (it sometimes returns an empty body; the script retries).
- **Department stores** (2026-10-14): robots.txt allows 阪急, 阪神, 大丸 (dmdepart.jp), 近鉄 (abeno-harukas.d-kintetsu.co.jp/eventschedule/ lists 催事 with dates), 京阪, 藤井大丸, JR京都伊勢丹 (mistore.jp). 阪急 page renders by JavaScript (empty to a plain fetch). 近鉄 siteinfo: no scraping clause, but "any information… may not be used beyond private use without permission" and links should point to the top page.
- **Osaka City 指定催し** (2026-10-14): list at city.osaka.lg.jp/shobo/page/0000460231.html, one or two big events at a time (2026-10-14: 第38回なにわ淀川花火大会 10/17). PDFs live under /shobo/cmsfiles/… (the page sets <base href="/shobo/">). Watched as a page source.
- **More shrine calendars** (2026-10-14): 松尾大社 /event (current year's calendar; weekday-based dates such as 神幸祭 skipped), 晴明神社 /event/ (晴明祭 = 秋分日), 貴船神社 /event/ (full fixed-date list), 平野神社 /home/gaiyo/nentyugyoji. 今宮神社, 三十三間堂, 大報恩寺 don't answer our bot.
- **iCal feeds** (2026-10-14): WordPress "The Events Calendar" sites expose `?ical=1` (CLUB METRO, UrBANGUILD). Prefer these over HTML parsing: one generic `parseIcal`, config line only.
- **Concert venues** (2026-10-14): robots.txt allows ロームシアター京都, 京都コンサートホール, フェスティバルホール, 大阪城ホール, ザ・シンフォニーホール, CLUB QUATTRO, Zepp, 京都MUSE, Billboard Live; none embed schema.org Event JSON-LD. ロームシアター site-policy forbids secondary use (複製・転用・要約…) of content without permission; Zepp and Festival Hall publish no terms page.
- **Wikimedia**: robots.txt disallows /w/ (API) and query.wikidata.org/sparql for bots; /wiki/ article and File pages are allowed (also for ClaudeBot).
- **Shrine/temple official sites** (checked 2026-10-13): 東寺, 北野天満宮, 四天王寺, 平安神宮, 今宮戎, 下鴨神社 all allow crawling in robots.txt. 北野天満宮 `/event/` and 下鴨神社 `/saiji` list many fixed-date annual events: good Phase C material. 八坂神社 (503) and 大阪天満宮 tenjinsan.com (403) refused automated reads: verify by hand.

## Decisions
Filled in during planning. Each entry: the decision, and why.

- **v1 region: Kansai (Osaka + Kyoto).** Many shrine/temple events and markets, so it tests the recurring-event table early.
- **v1 sources: hand-built recurring-event table + hand-entered dated events + Osaka Prefecture parks CSV.** Kansai open data is too thin to carry the map (see findings above); most target events recur on fixed dates. connpass dropped: almost all IT meetups. Fireworks list deferred to spring 2027, when that year's dates are announced.
- **UI is bilingual (Japanese/English toggle).** Event titles stay in their original Japanese; translation is a later option.
- **Public GitHub repo + GitHub Pages.** Free; nothing in the repo is secret. Git commit email is already the GitHub noreply address.
- **Stack: TypeScript (Node 24 runs scripts directly, Vite builds the site), MapLibre GL + OpenFreeMap Positron, `rrule`.** No UI framework.
- **Two views: map + list**, sharing one filtered set (date, category, free, keyword). List follows the map area.
- **Event card design belongs to the user.** `src/card.ts` is a plain placeholder until they redesign it.
- **No scraped or hotlinked event posters/photos.** Images only from Wikimedia Commons (venue photos, with credit), licensed open data, or organiser uploads.
- **Every source is registered in `data/sources.ts`; all fetching goes through `scripts/fetch.ts`** (honest User-Agent, robots.txt, 1 req/s/host). Other sites are fetched only by the daily scheduled job, never on push. Snapshots are committed to `data/fetched/` (git = last good copy); problems and changed source pages become a GitHub issue.
- **Sites whose robots.txt blocks AI crawlers (ClaudeBot, GPTBot) are not used at all**, even though our own bot's UA is allowed: data entry is AI-assisted, so this respects the owner's stated wish. `scripts/fetch.ts` enforces it; check robots.txt before entering any new site by hand. (2026-10-13: 知恩院 removed for this reason.)
- **Rules with a known end use `UNTIL`** (e.g. a fire-designation window). `npm run check` warns when one has run out instead of failing the build.
- **`price: 0` means open-access** (temple grounds, public parks/streets): free to attend even if stalls sell things. Use `null` when the source gives no basis.
- **Dept store and concert schedules are scraped as facts only** (title, date, start time) with a link to each event's official page, even though those sites' terms forbid "secondary use" of content (user decision 2026-10-14). Still obey robots.txt and AI opt-outs, skip any site that blocks our bot (e.g. 大丸 403), and drop a site at once if it objects. Prices are not scraped. Parsers live in `scripts/sources/schedules.ts`, each with a fixture test.
- **No scraping of ticketing sites (e+, ぴあ, ローチケ)** (confirmed 2026-10-14): e+ terms 第10条 limit use to private use and 第9条(7) bans commercial use without consent; their catalogue is a compiled database; ローチケ doesn't answer our bot. Official route if EventMap becomes a company: チケットぴあ Web API (法人 only, paid, apply via pia-api-inquiry@pia.co.jp). A "find tickets" search link on cards is fine.
- **Common-knowledge dates are allowed for major festivals with no reachable official source** (user decision 2026-10-14): mark them `// COMMON KNOWLEDGE` in the data and register the link as source kind `link`. Applied to 五山送り火, 祇園祭 山鉾巡行, 岸和田だんじり 2027.
- **Venue photos come only from Wikimedia Commons**, stored per venue (`photo: { file, author, licence }`) and credited in the popup. Pick the simplest licence to honour (CC0 > CC BY > CC BY-SA, never GFDL). Images load via Special:FilePath in the viewer's browser.
- **Line endings are LF** (`.gitattributes`), so scripted edits never meet mixed CRLF/LF files again.
- **Plan lives in `PLAN.md`.** Phases A (map/list) → B (reliable sources) → C (coverage per type).
- **v1 has no database or server.** A scheduled job builds one data file, the map reads it directly. Add PostgreSQL when user submissions arrive (first time the app must save user input).
