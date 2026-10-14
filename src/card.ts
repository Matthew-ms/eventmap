// Event card, shared by the map popup and the list.
// Deliberately plain: the real design comes later.
import type { Event, Venue } from '../data/model.ts';
import { lang, t } from './i18n.ts';

export const CATEGORY_COLORS = {
  festival: '#E69F00',
  fireworks: '#D55E00',
  market: '#009E73',
  shrine_temple: '#CC79A7',
  department_store: '#0072B2',
  concert: '#6A3D9A',
  other: '#7F7F7F',
} as const;

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const safeUrl = (u: string) => (/^https?:\/\//.test(u) ? esc(u) : '#');

export function formatDate(d: string) {
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-GB', {
    month: 'short', day: 'numeric', weekday: 'short', timeZone: 'UTC',
  }).format(new Date(d + 'T00:00:00Z'));
}

export const eventTitle = (e: Event) => (lang === 'en' && e.titleEn) || e.title;
export const venueName = (v: Venue) => (lang === 'en' && v.nameEn) || v.name;

export function renderCard(e: Event, v: Venue, opts: { showVenue?: boolean; distanceKm?: number } = {}) {
  const dates = e.end !== e.start ? `${formatDate(e.start)} – ${formatDate(e.end)}` : formatDate(e.start);
  const time = e.startTime ? ` ${e.startTime}${e.endTime ? '–' + e.endTime : '〜'}` : '';
  const price = e.price === 0 ? `<span class="badge free">${t('free')}</span>` : e.price ? `¥${e.price.toLocaleString()}` : '';
  const status = e.status !== 'scheduled' ? `<span class="badge status">${t(e.status as "cancelled" | "postponed")}</span>` : '';
  const distance = opts.distanceKm !== undefined ? ` · ${opts.distanceKm.toFixed(1)} km` : '';
  return `<article class="card${e.status === 'cancelled' ? ' cancelled' : ''}" data-event="${esc(e.id)}">
  <div class="card-meta"><span class="cat" style="--c:${CATEGORY_COLORS[e.category]}">${t(e.category)}</span>${status}${price}</div>
  <h3>${esc(eventTitle(e))}</h3>
  <p class="when">${dates}${time}</p>
  ${opts.showVenue ? `<p class="where">${esc(venueName(v))}${distance}</p>` : ''}
  <a href="${safeUrl(e.source)}" target="_blank" rel="noopener">${t('officialSite')} ↗</a>
</article>`;
}

const LICENCES: Record<string, string> = {
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
  'CC BY 2.5': 'https://creativecommons.org/licenses/by/2.5/',
  'CC BY-SA 2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
};

/** Venue photo from Wikimedia Commons with the credit its licence requires (author, licence, source). */
export function renderVenuePhoto(v: Venue) {
  if (!v.photo) return '';
  const { file, author, licence } = v.photo;
  const name = encodeURIComponent(file.replaceAll(' ', '_'));
  const licenceLink = LICENCES[licence] ? `<a href="${LICENCES[licence]}" target="_blank" rel="noopener">${esc(licence)}</a>` : esc(licence);
  return `<figure class="venue-photo">
  <img src="https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=640" alt="${esc(venueName(v))}" loading="lazy" width="640" height="360">
  <figcaption>${t('photo')}: <a href="https://commons.wikimedia.org/wiki/File:${name}" target="_blank" rel="noopener">${esc(author)}</a> / ${licenceLink}</figcaption>
</figure>`;
}
