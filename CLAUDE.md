# Japan Event Map App — Project Brief

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
- **Osaka Prefecture イベント一覧** (BODIK id `270008_event`): ~67 events, prefectural parks only, all with lat/lon, last updated 2026-10-05, covers ~2.5 months ahead (update frequency unknown). Shift-JIS CSV. Usable.
- **Higashiōsaka イベント一覧** (BODIK `272272_12`): 24 rows, mostly seminars, no location. Not useful.
- No other Osaka/Kyoto municipality publishes イベント一覧 on BODIK or the national e-Gov catalog. Kyoto City portal has only a children's-centre calendar; Kyoto Prefecture has no event dataset.
- **ORDEN / ODPO** (Osaka platform with prefecture + municipal events): registration is for businesses/organizations; API spec not public. Unexplored.
- **京都観光Navi** (ja.kyoto.travel): 700+ recurring events/year. Not open data; terms not yet checked.

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
- **Plan lives in `PLAN.md`.** Phases A (map/list) → B (reliable sources) → C (coverage per type).
- **v1 has no database or server.** A scheduled job builds one data file, the map reads it directly. Add PostgreSQL when user submissions arrive (first time the app must save user input).
