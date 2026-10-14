import type { ExpressionSpecification, Map as MapLibreMap } from 'maplibre-gl';
import type { Category } from '../data/model.ts';

export type Lang = 'ja' | 'en';

const dict = {
  ja: {
    search: 'イベント・場所を検索', today: '今日', weekend: '今週末', days7: '7日間', days30: '30日間', pickDate: '日付',
    freeOnly: '無料のみ', map: '地図', list: 'リスト', free: '無料', officialSite: '公式サイト',
    cancelled: '中止', postponed: '延期', noEvents: 'この範囲に該当するイベントはありません。地図を動かすか、条件を変えてください。',
    otherLang: 'EN', photo: '写真',
    festival: '祭り', fireworks: '花火', market: '市・マーケット', shrine_temple: '寺社行事', department_store: '催事', concert: 'ライブ', other: 'その他',
  },
  en: {
    search: 'Search events or places', today: 'Today', weekend: 'This weekend', days7: '7 days', days30: '30 days', pickDate: 'Date',
    freeOnly: 'Free only', map: 'Map', list: 'List', free: 'Free', officialSite: 'Official site',
    cancelled: 'Cancelled', postponed: 'Postponed', noEvents: 'No events match here. Move the map or change the filters.',
    otherLang: '日本語', photo: 'Photo',
    festival: 'Festival', fireworks: 'Fireworks', market: 'Market', shrine_temple: 'Shrine & temple', department_store: 'Store event', concert: 'Concert', other: 'Other',
  },
} satisfies Record<Lang, Record<string, string>>;

type Key = keyof typeof dict.ja;

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'ja' || saved === 'en') return saved;
  } catch {}
  return navigator.language.startsWith('ja') ? 'ja' : 'en';
}

export let lang: Lang = initialLang();
export const t = (k: Key | Category) => dict[lang][k];

export function setLang(l: Lang) {
  lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem('lang', l); } catch {}
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n as Key)));
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder as Key)));
}

/** Point every basemap label at the chosen language, falling back to the local name. */
export function applyMapLanguage(map: MapLibreMap) {
  const field: ExpressionSpecification = lang === 'ja'
    ? ['coalesce', ['get', 'name:ja'], ['get', 'name']]
    : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'symbol' || layer.source === 'events') continue;
    const current = JSON.stringify(map.getLayoutProperty(layer.id, 'text-field') ?? '');
    if (current.includes('name')) map.setLayoutProperty(layer.id, 'text-field', field);
  }
}

export const countLabel = (n: number) => (lang === 'ja' ? `${n}件` : `${n} event${n === 1 ? '' : 's'}`);
