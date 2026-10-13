import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseOsakaParks } from './osaka-parks.ts';

const HEADER = 'イベント名,コンテンツURL,開始日,終了日,開始時間,終了時間,料金(基本),場所名称,緯度,経度';

test('CSV: quotes, embedded commas, quotes and newlines', () => {
  assert.deepEqual(parseCsv('a,"b,c","d""e"\r\n"multi\nline",x,\n'), [['a', 'b,c', 'd"e'], ['multi\nline', 'x', '']]);
});

test('rows become events; venues dedupe; bad rows skipped', () => {
  const csv = [
    HEADER,
    'ウィークエンドマーケット,https://example.jp/a,2026-10-10,2026-10-10,10:00,15:00,無料,服部緑地,34.77241,135.4917',
    '秋のパークフェスタ,https://example.jp/b,2026/10/11,,9:30,,500円,服部緑地,34.77241,135.4917',
    '秋のパークフェスタ,https://example.jp/b,2026/10/11,,9:30,,500円,服部緑地,34.77241,135.4917',
    '場所なし,https://example.jp/c,2026-10-12,2026-10-12,,,,,,',
    '日付なし,https://example.jp/d,,,,,,住吉公園,34.6,135.4',
  ].join('\n');
  const snap = parseOsakaParks(csv, '2026-10-13');
  assert.equal(snap.venues.length, 1);
  assert.equal(snap.skipped, 2);
  assert.equal(snap.events.length, 2); // verbatim repeat dropped
  const [a, b] = snap.events;
  assert.deepEqual([a.category, a.price, a.startTime, a.endTime], ['market', 0, '10:00', '15:00']);
  assert.deepEqual([b.category, b.price, b.start, b.end, b.startTime], ['festival', 500, '2026-10-11', '2026-10-11', '09:30']);
});

test('a renamed column fails loudly instead of producing garbage', () => {
  assert.throws(() => parseOsakaParks(HEADER.replace('緯度', 'lat') + '\n', '2026-10-13'), /column missing: 緯度/);
});
