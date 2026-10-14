// Shared types for hand-entered data, the build script and the site.

export const CATEGORIES = ['festival', 'fireworks', 'market', 'shrine_temple', 'department_store', 'concert', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];
export type Status = 'scheduled' | 'postponed' | 'cancelled';

export interface Venue {
  id: string;
  name: string;
  nameEn?: string;
  aliases?: string[];
  lat: number;
  lon: number;
  url?: string;
  photo?: { file: string; author: string; licence: string }; // Wikimedia Commons file name
}

interface EventFields {
  id: string;
  venue: string; // Venue id
  title: string;
  titleEn?: string;
  category: Category;
  startTime?: string; // 'HH:MM', Japan time
  endTime?: string;
  price: number | null; // yen; 0 = free, null = unknown
  source: string; // official page the facts came from
  confirmed: string; // 'YYYY-MM-DD' the facts were last checked against source
}

/** Event on a rule, e.g. 'FREQ=MONTHLY;BYMONTHDAY=21'. Expanded into dated occurrences at build time. */
export interface Recurring extends EventFields {
  rrule: string;
  days?: number; // length of each occurrence, default 1
  cancelled?: string[]; // occurrence start dates to skip
}

/** Event whose date changes every year, entered with its actual dates. */
export interface Dated extends EventFields {
  start: string;
  end?: string;
  status?: Status;
  sourceType?: Event['sourceType']; // default 'manual'
}

/** One occurrence, as written to public/events.json. Dates are Japan dates 'YYYY-MM-DD'. */
export interface Event {
  id: string;
  venueId: string;
  title: string;
  titleEn?: string;
  category: Category;
  start: string;
  end: string;
  startTime?: string;
  endTime?: string;
  price: number | null;
  source: string;
  sourceType: 'manual' | 'opendata' | 'scraped';
  status: Status;
  confirmed: string;
}

export interface EventData {
  generated: string;
  venues: Record<string, Venue>;
  events: Event[];
  attribution: string[]; // HTML credits required by source licences
}

/** Today's date in Japan, whatever the viewer's timezone. */
export const todayJST = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });

/** 'YYYY-MM-DD' + n days. Works in UTC so no DST/timezone drift. */
export const addDays = (d: string, n: number) =>
  new Date(Date.parse(d + 'T00:00:00Z') + n * 86400000).toISOString().slice(0, 10);
