import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findNoticeLinks, monthFolder } from './kyoto-notices.ts';

test('gazette month folder uses the Reiwa year', () => {
  assert.equal(monthFolder(new Date(Date.UTC(2026, 9, 13))), 'r0810');
  assert.equal(monthFolder(new Date(Date.UTC(2027, 0, 5))), 'r0901');
});

test('only 指定催し notices are picked from a contents page', () => {
  const toc = `<a href=0821_2.pdf  onClick=openWindow() target=naiyo>特定調達契約の相手方等</a>
    <a href=0821_3.pdf  onClick=openWindow() target=naiyo><font size=3>第6号</font><br>京都市火災予防条例第５４条の１０第１項に基づく指定催しの指定 </a>`;
  assert.deepEqual(findNoticeLinks(toc), ['0821_3.pdf']);
});
