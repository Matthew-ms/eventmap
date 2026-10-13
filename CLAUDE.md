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
- **Plan lives in `PLAN.md`.** Phases A (map/list) → B (reliable sources) → C (coverage per type).
- **v1 has no database or server.** A scheduled job builds one data file, the map reads it directly. Add PostgreSQL when user submissions arrive (first time the app must save user input).
