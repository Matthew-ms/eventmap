# EventMap v1 — refined plan

## Status (update whenever a step finishes or the plan changes)
Live site: https://matthew-ms.github.io/eventmap/ · repo: https://github.com/Matthew-ms/eventmap

| Phase | State | Notes |
|---|---|---|
| A — Map and list view | ✅ Done 2026-10-13 | Seed: 15 recurring + 2 dated events at 6 venues. "Near me" not yet tested on a real phone (user to try). |
| B — Reliable sources | ✅ Built 2026-10-13 | Source registry, Osaka parks CSV (52 events, 15 parks), page-change watcher, `npm run check`. **Open:** first nightly run (03:00 JST 2026-10-14) not yet verified: snapshot commit + issue creation. |
| C — Coverage per type | 🔄 In progress | **Batch 1 markets** pushed 2026-10-13: 11 series + Osaka park markets (target ≥ 20 not met: Osaka market sources thin). **Batch 2 shrine/temple** pushed 2026-10-14: ~53 dates/yr (target ≥ 60, close). **Batch 3 festivals** entered 2026-10-14, **not pushed yet**: 22 festival dates/yr (target ≥ 30 not met). Kyoto festivals come from Fire Bureau notices; a yearly rule is used only where the 2025 and 2026 notices agree. **Missing, no usable official source yet:** 五山送り火 (only 京都観光Navi, which forbids reproduction), 鞍馬の火祭 (由岐神社 site down), 祇園祭 山鉾巡行 (Yasaka 503, gionmatsuri.or.jp down), 岸和田だんじり 2027 (not announced; city page now watched). **Next:** dept stores, then concerts. Osaka under-covered in every type. |
| Images | ⏳ With C | Wikimedia Commons venue photos. Osaka parks `画像` column: licence of images still unconfirmed. |
| Fireworks | ⏳ Apr–Jun 2027 | |

Known follow-ups: Osaka parks category is a keyword guess (`categorize()` in `scripts/sources/osaka-parks.ts`); GitHub warns some Pages actions still target Node 20.

## Context
When this plan was written (2026-10-13) the project held only `CLAUDE.md`. The brief, data-source findings and decisions live there.

The user set the order of work:
1. A map view that works properly and is easy to read.
2. Reliable event sources.
3. Enough events for **every** target type.

After that the app gets strengthened. The app has two views:
- a **map view**
- a **list view**, for finding events nearby, with filters and keyword search

The user will design the event card and the list layout later. For now the card is a deliberately plain placeholder, kept in one file so the redesign touches one place.

Already decided:
- Kansai (Osaka + Kyoto)
- bilingual JA/EN interface
- no database or server in v1
- the recurring-event table is the main data source, plus the Osaka parks CSV
- **public GitHub repository + GitHub Pages**, with the anonymous GitHub commit email set before the first push

What changes from the previous plan: concerts and department store events move *into* this milestone, because "enough events for each type" needs them. Both need small per-site scrapers. Plain code is enough for these, so there are no AI calls at runtime.

## Stack
- TypeScript, run directly by Node 24 (scripts) and built by Vite (site). No framework.
- MapLibre GL JS with the **OpenFreeMap Positron** style: a muted basemap, so coloured pins stand out. MapLibre's own clustering is used, with no `supercluster` package.
- `rrule` for recurrence rules. `node --test` for the one logic test.
- GitHub Actions does a daily build, commits fetched source snapshots to the repo, and deploys to Pages. Git serves as the "last good copy" store, and the regular commits keep scheduled workflows from being auto-disabled after 60 days.

## Files
```
index.html, src/style.css
src/main.ts      map, layers, filters, search, list panel
src/card.ts      renderCard(event): shared by map popup and list ← user's redesign target
src/i18n.ts      ja/en strings + map-label language switch
data/venues.ts   venue table (id, name, nameEn, aliases, lat, lon, url)
data/recurring.ts  rule-based events (rrule, days, times, price, source, confirmed, cancelled[])
data/dated.ts    events whose date changes yearly (start/end, status)
data/sources.ts  source registry: url, type, termsCheckedOn, robotsOk, method, notes
scripts/expand.ts (+ expand.test.ts)   rules → dated occurrences, next 12 months
scripts/sources/<name>.ts              one fetch+parse function per automated source
scripts/build-data.ts                  runs everything → public/events.json
scripts/check.ts                       data sanity check (npm run check)
.github/workflows/deploy.yml
```
Each source is a plain function that returns events. There's no adapter interface. If one source fails, the build keeps that source's last committed snapshot and logs the failure.

### Event shape (build output)
`{ id, title, titleEn?, category, start, end, startTime?, endTime?, price (number | null = unknown), venueId, source, sourceType: manual|opendata|scraped, status: scheduled|postponed|cancelled, confirmed }`

Categories:
- `fireworks`
- `festival`
- `market`
- `shrine_temple`
- `department_store`
- `concert`
- `other`

"Free entry" is the `price === 0` filter, not a category. Dates are plain Japan dates. The client works out "today" in Asia/Tokyo time and hides past events.

## Phase A — Map and list view (the current focus)
Starts with a seed of about 15 real events (monthly markets plus the big Kyoto festivals) so the map can be tested.
1. **Scaffold:** Vite + TS + MapLibre, map framed on Kansai.
2. **Data model + expansion:** `expand.ts` turns rules into dated occurrences, with a test covering monthly, yearly and nth-weekday rules, cancelled dates, and multi-day events. `build-data.ts` writes `public/events.json`.
3. **Pins:**
   - The client groups filtered events **by venue**, so one pin stands for one place. Events at the same venue don't stack on top of each other.
   - Pins are coloured by category, with a white outline.
   - Clusters are neutral circles showing a count. Tapping a cluster zooms in.
   - Title labels appear at zoom 13 and above.
4. **Popup:** the venue name, then that venue's upcoming events sorted by date, each drawn with `renderCard`. The placeholder card shows title, date/range, time, venue, a price or 無料 badge, a category tag, and a link to the official source.
5. **Filters:**
   - date chips: 今日, 今週末, 7日, 30日, plus a native `<input type="date">`
   - category chips, coloured to match the pins with a text label, which also makes them the map legend
   - free only
   - Filtering runs in JavaScript and then the source data is replaced. Layer filters can't be used because they don't recompute clusters.
6. **Keyword search:** NFKC-normalised, case-insensitive substring match on title, English title, venue name and aliases. The same filtered set drives both the map and the list.
7. **List view:**
   - It shows the filtered events inside the current map area, sorted by date.
   - After "Near me" (MapLibre's GeolocateControl) is used, it sorts by distance instead.
   - Tapping a list item flies the map to that event and opens its popup.
   - Layout: on mobile there's a Map/List toggle at the bottom. At 900px and wider, the list sits in a side panel next to the map.
8. **i18n:**
   - The interface text comes from a ja/en dictionary.
   - Map labels switch between `name:ja` and `name:en` with a fallback to `name`.
   - The `<html lang>` attribute is updated to match.
   - The chosen language is remembered in localStorage.
9. **Deploy:** Pages workflow. The user does three steps: create a public repo, set the anonymous email, and set Pages source to "GitHub Actions". I'll write a click-by-click walkthrough for these at the time, following the user's CLAUDE.md rules.

**Done when:** on a phone-width screen, the live site shows seed pins, filters and search narrow both views, the list follows the map area, "Near me" works, and JA/EN switches all interface text and map labels.

## Phase B — Reliable sources
1. Fill in `data/sources.ts`. Before any automated source is added, record its terms and robots.txt check. A site whose terms forbid scraping is entered by hand or skipped.
2. Rules for automated fetching:
   - At most one fetch per page per day.
   - 1 request per second per host.
   - A User-Agent that names the project and links to the repo.
   - Store facts only, never descriptions or photos.
3. **Osaka parks CSV** source: Shift-JIS decoding and licence attribution in the page footer.
4. **Change watcher:** for hand-entered sources, compare a hash of each page's text with the saved one. If it changed, open a GitHub issue, which emails the user. For scraped sources, open an issue when a parser returns zero events or throws.
5. `npm run check` catches:
   - an unknown venue
   - coordinates outside the Kansai bounds
   - a rule that doesn't parse
   - `confirmed` older than 13 months
   - a source with no registry entry

## Phase C — Coverage for each type
Proposed targets for "enough". The user can adjust them.

| Type | Method | Target |
|---|---|---|
| Markets (骨董市, 手づくり市, フリマ) | recurring table; organiser schedule pages where scraping is allowed | ≥ 20 recurring markets |
| Shrine/temple | recurring + dated (節分, 七五三, light-ups) | ≥ 60 events |
| Festivals incl. 夏祭り | recurring (fixed dates such as 天神祭 or 祇園祭) + dated | ≥ 30 |
| Department store/mall 催事 | per-store scraper, daily | 6–8 major stores (e.g. 阪急うめだ, 大丸, 髙島屋, あべのハルカス近鉄, ジェイアール京都伊勢丹), subject to terms |
| Concerts | per-venue schedule scraper, using schema.org JSON-LD when present | 15–20 live houses and halls across Osaka/Kyoto, subject to terms; venues whose schedule only loads with JavaScript are skipped in v1 |
| Free-entry | the `price` field across everything + Osaka parks CSV | the free filter returns results every weekend |
| Fireworks | dated, hand-entered | ≥ 30, **April–June 2027** once dates are announced |

Work order:
1. markets
2. shrine/temple
3. festivals: all hand-entered, and the user spot-checks the first batch
4. department stores
5. concerts: scrapers, one site at a time, each with a terms check first

**Done when:** every type meets its target, `npm run check` passes, and every weekend in the next 3 months has events in each city.

## Images
Posters and photos taken from event pages are copyrighted, so they are **not scraped and not hotlinked**, in line with the brief's ground rules. The card shows a picture only from these sources:
1. **Venue photo from Wikimedia Commons:**
   - Add an optional `wikidata` field to each venue (for example the Wikidata item for 東寺).
   - The build reads the venue's image property (P18) through the Commons API and saves the thumbnail URL, author and licence.
   - The card shows the photo with a credit line.
   - Shrines, temples, halls and department stores are well covered on Commons.
2. **Osaka parks CSV `画像` column:** it holds one park photo per row, for all 67 rows. The dataset is CC BY 4.0, but the per-image licence field is blank, so check the prefecture's site terms before showing these photos.
3. **Organiser-supplied posters:** these come later, through submissions, where the organiser confirms they have the right to share.

Events without a permitted image show a category icon. The "公式サイト" link takes users to the real poster. Add this in Phase C, alongside the venue data entry.

## Not in this milestone
- Event card and list design: the user's next step, in `src/card.ts`.
- Database and user submissions.
- AI scraping.
- ORDEN.
- 京都観光Navi, until its terms have been checked.
- Concert tour pages and ticket phases.
- Duplicate detection across sources: concerts get a date+venue id, which is enough for now.
- Translating titles beyond hand-filled `titleEn`.

## Verification
- `node --test`: the recurrence expansion test.
- `npm run check`: the data sanity check.
- `npm run build`: prints a count of events per category and per source.
- `npm run dev`, then drive the site in the in-app browser:
  - at 375px width and at desktop width
  - each filter, keyword search, list↔map sync, and the language switch
  - the console shows no errors
- After deploy: the live github.io address loads, and the Actions run log shows the daily job passing.

## At the start of implementation
Copy this plan into the repo as `PLAN.md`. Add these decisions to the Decisions section of `CLAUDE.md`:
- public repo + GitHub Pages
- the stack
- map + list views
- the card design belongs to the user
