import * as maplibregl from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { CATEGORIES, addDays, todayJST, type Category, type Event, type EventData } from '../data/model.ts';
import { CATEGORY_COLORS, esc, eventTitle, renderCard, renderVenuePhoto, venueName } from './card.ts';
import { applyMapLanguage, countLabel, lang, setLang, t } from './i18n.ts';

type DateMode = 'today' | 'weekend' | 'days7' | 'days30' | 'pick';

const state = {
  mode: 'days30' as DateMode,
  pick: '',
  cats: new Set<Category>(), // empty = all categories
  free: false,
  q: '',
  user: null as [number, number] | null, // [lon, lat] after "near me"
};

const data: EventData = await (await fetch('events.json')).json();
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const listEl = $('list');

// ---------- Filtering ----------

function dateRange(): [string, string] {
  const today = todayJST();
  switch (state.mode) {
    case 'today': return [today, today];
    case 'weekend': {
      const dow = new Date(today + 'T00:00:00Z').getUTCDay(); // 0 = Sunday
      const sat = addDays(today, 6 - dow);
      return dow === 0 ? [today, today] : [sat, addDays(sat, 1)];
    }
    case 'days7': return [today, addDays(today, 6)];
    case 'days30': return [today, addDays(today, 29)];
    case 'pick': return [state.pick || today, state.pick || today];
  }
}

// NFKD + drop Latin accents so 'kobo' finds 'Kōbō'; full-width/half-width forms fold too.
const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

function filtered(): Event[] {
  const [from, to] = dateRange();
  const q = norm(state.q.trim());
  return data.events.filter((e) => {
    if (e.start > to || e.end < from) return false;
    if (state.cats.size && !state.cats.has(e.category)) return false;
    if (state.free && e.price !== 0) return false;
    if (!q) return true;
    const v = data.venues[e.venueId];
    return norm([e.title, e.titleEn, v.name, v.nameEn, ...(v.aliases ?? [])].join(' ')).includes(q);
  });
}

let current: Event[] = [];
let byVenue = new Map<string, Event[]>();

/** One map point per venue, so events at the same place never stack on top of each other. */
function venueFeatures(): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [...byVenue].map(([id, evs]) => {
      const v = data.venues[id];
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [v.lon, v.lat] },
        properties: {
          venueId: id,
          count: evs.length,
          color: CATEGORY_COLORS[evs[0].category],
          label: eventTitle(evs[0]) + (evs.length > 1 ? ` +${evs.length - 1}` : ''),
        },
      };
    }),
  };
}

function update() {
  current = filtered();
  byVenue = new Map();
  for (const e of current) byVenue.set(e.venueId, [...(byVenue.get(e.venueId) ?? []), e]);
  map.getSource<GeoJSONSource>('events')?.setData(venueFeatures());
  popup?.remove();
  renderList();
}

// ---------- Map ----------

maplibregl.setWorkerUrl(workerUrl); // Vite's pre-bundling breaks MapLibre's own worker path

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/positron',
  bounds: [[135.35, 34.55], [135.85, 35.1]], // Osaka ↔ Kyoto
  fitBoundsOptions: { padding: 20 },
  attributionControl: { compact: true, customAttribution: data.attribution },
});
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
const geolocate = new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } });
map.addControl(geolocate, 'top-right');
geolocate.on('geolocate', (p) => {
  state.user = [p.coords.longitude, p.coords.latitude];
  renderList();
});

// 'style.load' fires before tiles finish, so pins show without waiting for the whole basemap.
map.once('style.load', () => {
  map.addSource('events', {
    type: 'geojson',
    data: venueFeatures(),
    cluster: true,
    clusterRadius: 40,
    clusterMaxZoom: 13,
    clusterProperties: { count: ['+', ['get', 'count']] }, // clusters show events, not venues
  });
  map.addLayer({
    id: 'clusters', type: 'circle', source: 'events', filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#2b2b2b', 'circle-opacity': 0.88,
      'circle-radius': ['step', ['get', 'count'], 15, 10, 19, 50, 24],
      'circle-stroke-color': '#fff', 'circle-stroke-width': 2,
    },
  });
  map.addLayer({
    id: 'cluster-count', type: 'symbol', source: 'events', filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'count'], 'text-font': ['Noto Sans Bold'], 'text-size': 13 },
    paint: { 'text-color': '#fff' },
  });
  map.addLayer({
    id: 'pins', type: 'circle', source: 'events', filter: ['!', ['has', 'point_count']],
    paint: { 'circle-color': ['get', 'color'], 'circle-radius': 9, 'circle-stroke-color': '#fff', 'circle-stroke-width': 2.5 },
  });
  map.addLayer({
    id: 'pin-labels', type: 'symbol', source: 'events', filter: ['!', ['has', 'point_count']], minzoom: 13,
    layout: {
      'text-field': ['get', 'label'], 'text-font': ['Noto Sans Regular'], 'text-size': 12,
      'text-anchor': 'top', 'text-offset': [0, 1.1], 'text-max-width': 10,
    },
    paint: { 'text-color': '#1d1d1f', 'text-halo-color': '#fff', 'text-halo-width': 1.5 },
  });
  // Invisible, larger circle so pins are easy to tap with a finger.
  map.addLayer({
    id: 'pins-hit', type: 'circle', source: 'events', filter: ['!', ['has', 'point_count']],
    paint: { 'circle-radius': 20, 'circle-opacity': 0 },
  });
  applyMapLanguage(map);
  renderList();
});

map.on('click', 'clusters', async (e) => {
  const f = e.features![0];
  const zoom = await map.getSource<GeoJSONSource>('events')!.getClusterExpansionZoom(f.properties.cluster_id);
  map.easeTo({ center: (f.geometry as Point).coordinates as [number, number], zoom });
});
map.on('click', 'pins-hit', (e) => openVenue(e.features![0].properties.venueId));
for (const id of ['clusters', 'pins-hit']) {
  map.on('mouseenter', id, () => (map.getCanvas().style.cursor = 'pointer'));
  map.on('mouseleave', id, () => (map.getCanvas().style.cursor = ''));
}
map.on('moveend', renderList);

let popup: maplibregl.Popup | null = null;

function openVenue(id: string) {
  const v = data.venues[id];
  const evs = byVenue.get(id) ?? [];
  popup?.remove();
  popup = new maplibregl.Popup({ maxWidth: '320px', className: 'venue-popup' })
    .setLngLat([v.lon, v.lat])
    .setHTML(`${renderVenuePhoto(v)}<h2>${esc(venueName(v))}</h2><p class="count">${countLabel(evs.length)}</p>${evs.map((e) => renderCard(e, v)).join('')}`)
    .addTo(map);
}

// ---------- List ----------

function km([lon1, lat1]: [number, number], lon2: number, lat2: number) {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

function renderList() {
  const bounds = map.getBounds();
  const rows = current
    .map((e) => {
      const v = data.venues[e.venueId];
      return { e, v, d: state.user ? km(state.user, v.lon, v.lat) : undefined };
    })
    .filter(({ v }) => bounds.contains([v.lon, v.lat]));
  if (state.user) rows.sort((a, b) => a.d! - b.d! || a.e.start.localeCompare(b.e.start));
  listEl.innerHTML = rows.length
    ? rows.map(({ e, v, d }) => renderCard(e, v, { showVenue: true, distanceKm: d })).join('')
    : `<p class="empty">${t('noEvents')}</p>`;
  $('list-count').textContent = `(${rows.length})`;
}

listEl.addEventListener('click', (ev) => {
  const target = ev.target as HTMLElement;
  const card = target.closest<HTMLElement>('.card');
  if (!card || target.closest('a')) return;
  const e = current.find((x) => x.id === card.dataset.event);
  if (!e) return;
  const v = data.venues[e.venueId];
  setView('map');
  map.flyTo({ center: [v.lon, v.lat], zoom: Math.max(map.getZoom(), 15) });
  map.once('moveend', () => openVenue(v.id));
});

// ---------- Controls ----------

function chip(label: string, attrs: Record<string, string>, onClick: (b: HTMLButtonElement) => void) {
  const b = document.createElement('button');
  b.className = 'chip';
  b.type = 'button';
  for (const [k, v] of Object.entries(attrs)) b.setAttribute(k, v);
  b.dataset.i18n = label;
  b.addEventListener('click', () => onClick(b));
  return b;
}

const press = (b: HTMLElement, on: boolean) => b.setAttribute('aria-pressed', String(on));

const datesEl = $('dates');
const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.className = 'chip';
dateInput.min = todayJST();
dateInput.addEventListener('change', () => {
  state.mode = dateInput.value ? 'pick' : 'days30';
  state.pick = dateInput.value;
  syncDateChips();
  update();
});
const dateChips = (['today', 'weekend', 'days7', 'days30'] as const).map((m) =>
  chip(m, { 'aria-pressed': String(state.mode === m) }, () => {
    state.mode = m;
    dateInput.value = '';
    syncDateChips();
    update();
  }),
);
function syncDateChips() {
  dateChips.forEach((b) => press(b, b.dataset.i18n === state.mode));
  dateInput.toggleAttribute('data-active', state.mode === 'pick');
}
const freeChip = chip('freeOnly', { 'aria-pressed': 'false', class: 'chip free-chip' }, (b) => {
  state.free = !state.free;
  press(b, state.free);
  update();
});
datesEl.append(...dateChips, dateInput, freeChip);

$('cats').append(
  ...CATEGORIES.map((c) =>
    chip(c, { 'aria-pressed': 'false', class: 'chip cat', style: `--c:${CATEGORY_COLORS[c]}` }, (b) => {
      if (state.cats.has(c)) state.cats.delete(c);
      else state.cats.add(c);
      press(b, state.cats.has(c));
      update();
    }),
  ),
);

$<HTMLInputElement>('q').addEventListener('input', (ev) => {
  state.q = (ev.target as HTMLInputElement).value;
  update();
});

$('lang').addEventListener('click', () => {
  setLang(lang === 'ja' ? 'en' : 'ja');
  dateInput.setAttribute('aria-label', t('pickDate'));
  if (map.isStyleLoaded()) applyMapLanguage(map);
  update();
});

function setView(view: 'map' | 'list') {
  document.body.dataset.view = view;
  document.querySelectorAll<HTMLElement>('#views button').forEach((b) => press(b, b.dataset.view === view));
  if (view === 'map') map.resize();
}
document.querySelectorAll<HTMLElement>('#views button').forEach((b) =>
  b.addEventListener('click', () => setView(b.dataset.view as 'map' | 'list')),
);

setLang(lang);
dateInput.setAttribute('aria-label', t('pickDate'));
setView('map');
update();
