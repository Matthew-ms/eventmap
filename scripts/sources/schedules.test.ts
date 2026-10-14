// Each fixture is a trimmed copy of the real page markup (2026-10-14).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inferYear, parseBigcat, parseFestivalHall, parseIcal, parseJanus, parseJohall, parseSymphony, parseKintetsu, parseQuattro, parseRohm, parseZepp, text } from './schedules.ts';

test('text(): tags, <br> and entities', () => {
  assert.equal(text('A<br>B &amp; C&nbsp;&yen;9,700 &rarr; &#12354;'), 'A\nB & C ¥9,700 → あ');
});

test('inferYear: months well before today roll into next year', () => {
  assert.equal(inferYear(11, '2026-10-14'), 2026);
  assert.equal(inferYear(1, '2026-10-14'), 2027);
});

test('近鉄: range with →, "まで" only, and a range across New Year', () => {
  const html = `
    <a href="/pages/202610kyushu/" class="event-item -red" data-expires="2026-10-20 17:00:00"><span><p>九州大物産展<br>［10月14日(水)&rarr;20日(火)］<br>※初日は正午開場</p></span></a>
    <a href="/pages/202610kyushu/" class="event-item -red" data-expires="2026-10-20 17:00:00"><span><p>九州大物産展<br>［10月14日(水)&rarr;20日(火)］</p></span></a>
    <a href="https://www.t-event.jp/conan/" class="event-item" data-expires="2026-11-29 17:00:00"><p>名探偵コナンプラザ<br>［11月29日(日)まで］</p></a>
    <a href="/pages/newyear/" class="event-item" data-expires="2027-01-05 17:00:00"><p>新春初売り<br>［12月26日(土)&rarr;1月5日(火)］</p></a>`;
  const out = parseKintetsu(html, '2026-10-14', 'https://abenoharukas.d-kintetsu.co.jp/eventschedule/');
  assert.equal(out.length, 3); // the calendar repeats an event once per week row
  assert.deepEqual([out[0].title, out[0].start, out[0].end], ['九州大物産展', '2026-10-14', '2026-10-20']);
  assert.equal(out[0].url, 'https://abenoharukas.d-kintetsu.co.jp/pages/202610kyushu/');
  assert.deepEqual([out[1].start, out[1].end], ['2026-10-14', '2026-11-29']); // already running
  assert.deepEqual([out[2].start, out[2].end], ['2026-12-26', '2027-01-05']);
});

test('Zepp: title falls back to performer; start time', () => {
  const html = `
    <a class="sch-content " href="https://www.zepp.co.jp/hall/namba/schedule/single/?rid=160396"><p class="sch-content-date__year">2026</p><p class="sch-content-date__month">10.14</p>
      <h2 class="sch-content-text__performer">Tomohiro Kamiyama</h2><h3 class="sch-content-text__ttl">1st LIVE TOUR 2026</h3>
      <span class="sch-content-text-date__start">19:00</span></a>
    <a class="sch-content " href="https://www.zepp.co.jp/hall/namba/schedule/single/?rid=2"><p class="sch-content-date__year">2026</p><p class="sch-content-date__month">10.15</p>
      <h2 class="sch-content-text__performer">【公演中止】Band</h2><h3 class="sch-content-text__ttl"></h3></a>`;
  const [a, b] = parseZepp(html);
  assert.deepEqual([a.id, a.start, a.startTime, a.title], ['zepp:160396', '2026-10-14', '19:00', '1st LIVE TOUR 2026']);
  assert.deepEqual([b.title, b.status], ['【公演中止】Band', 'cancelled']);
});

test('QUATTRO: 開演 is the second time; <br> in titles becomes a space', () => {
  const html = `<li id="event-14" data-event-date="2026-10-14" class="list-item "><div class="event-box"><a href="/umeda/schedule/detail/?cd=018425">
    <p class="txt-01"><span class="hv-elm">YĪN YĪN<br /> 〈イン・イン〉</span></p><dl><div class="bundle"><dt>開場/開演</dt> <dd> 18:00 / 19:00 </dd></div></dl></a></div></li>`;
  const [e] = parseQuattro(html, '2026-10-14', 'https://www.club-quattro.com/umeda/schedule/?ym=202610');
  assert.deepEqual([e.title, e.start, e.startTime, e.url], ['YĪN YĪN 〈イン・イン〉', '2026-10-14', '19:00', 'https://www.club-quattro.com/umeda/schedule/detail/?cd=018425']);
});

test('フェスティバルホール: date and time from the 日時 row', () => {
  const html = `<li><div class="performance-info"><h2 class="_title"><a href="https://www.festivalhall.jp/events/6573/">ビッケブランカ Tour</a></h2>
    <table class="tbl-perform-info"> <tr><th>日時</th><td>2026年10月14日（水） 19:00</td></tr><tr><th>料金</th><td>7,700円</td></tr> </table></div></li>`;
  const [e] = parseFestivalHall(html);
  assert.deepEqual([e.title, e.start, e.startTime], ['ビッケブランカ Tour', '2026-10-14', '19:00']);
});

test('ロームシアター: range vs list of days; genre music → concert; sub-title and note dropped', () => {
  const html = `
    <a href="https://rohmtheatrekyoto.jp/event/148485/"><h3> KYOTO EXPERIMENT 2026</h3><p class="date"> 2026年10月3日（土）～ 10月25日（日） </p><span class="genre music">音楽</span></a>
    <a href="https://rohmtheatrekyoto.jp/event/154124/"><h3> <span class="sub-ttl">OKAZAKI PARK STAGE 2026</span> 焚き火の会</h3>
      <p class="date"> 2026年10月4日（日）、10月17日（土）<span class="d-note">※11月1日（日）予備日</span> </p></a>
    <a href="https://rohmtheatrekyoto.jp/event/9/"><h3>年末年始</h3><p class="date">2026年12月28日（月）～ 1月3日（日）</p></a>`;
  const out = parseRohm(html);
  assert.deepEqual([out[0].start, out[0].end, out[0].category], ['2026-10-03', '2026-10-25', 'concert']);
  assert.deepEqual(out.slice(1, 3).map((e) => [e.title, e.start, e.category]), [['焚き火の会', '2026-10-04', 'other'], ['焚き火の会', '2026-10-17', 'other']]);
  assert.deepEqual([out[3].start, out[3].end], ['2026-12-28', '2027-01-03']);
});

test('BIGCAT: M/D with inferred year; links to the schedule page itself', () => {
  const html = `<li><div class="info"><p class="date orb fw500">10/24</p><p class="week"><span>SAT</span></p><h3 class="ttl">monobright TAIBAN</h3></div></li>
    <li><div class="info"><p class="date orb fw500">1/9</p><h3 class="ttl">新年ライブ</h3></div></li>`;
  const out = parseBigcat(html, '2026-10-14', 'https://bigcat-live.com/');
  assert.deepEqual(out.map((e) => [e.title, e.start, e.url]), [['monobright TAIBAN', '2026-10-24', 'https://bigcat-live.com/'], ['新年ライブ', '2027-01-09', 'https://bigcat-live.com/']]);
});

test('iCal: folding, escapes, all-nighter stays on its start date, all-day DTEND is exclusive', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'DTSTART;TZID=Asia/Tokyo:20261016T220000',
    'DTEND;TZID=Asia/Tokyo:20261017T050000',
    'UID:23004-1@www.metro.ne.jp',
    'SUMMARY:Connected Underground with Stefan Goldmann (Macro\\, from',
    '  Berlin)',
    'URL:https://www.metro.ne.jp/schedule/261016/',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART;TZID=Asia/Tokyo:20261015T190000',
    'SUMMARY:10/15 (thu) RE:DIAL',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'DTSTART;VALUE=DATE:20261231',
    'DTEND;VALUE=DATE:20270102',
    'SUMMARY:年越し',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const [a, c, b] = parseIcal(ics, '2026-10-14', 'https://www.metro.ne.jp/');
  assert.equal(c.title, 'RE:DIAL'); // leading date stripped
  assert.deepEqual([a.title, a.start, a.end, a.startTime, a.url],
    ['Connected Underground with Stefan Goldmann (Macro, from Berlin)', '2026-10-16', undefined, '22:00', 'https://www.metro.ne.jp/schedule/261016/']);
  assert.deepEqual([b.start, b.end, b.startTime, b.url], ['2026-12-31', '2027-01-01', undefined, 'https://www.metro.ne.jp/']);
});

test('JANUS: title + act, 開演 time, links to the month page', () => {
  const html = `<article class="c-scheduleList" id="01"><div class="c-scheduleList__date--month">10/</div><div class="c-scheduleList__date--date">01</div>
    <div class="c-scheduleList__head--title"> Osaka Acoload 2026 </div><div class="c-scheduleList__head--act"> 石坪日菜 / 蒔音 </div>
    <dl><dt>OPEN/START</dt> <dd> 18:30 / 19:00 </dd></dl></article>`;
  const [e] = parseJanus(html, '2026-10-14', 'https://janusosaka.com/schedule/2026-10/');
  assert.deepEqual([e.title, e.start, e.startTime, e.url], ['Osaka Acoload 2026（石坪日菜 / 蒔音）', '2026-10-01', '19:00', 'https://janusosaka.com/schedule/2026-10/']);
});

test('ザ・シンフォニーホール: <time> with weekday and 開演', () => {
  const html = `<li><a href="https://www.symphonyhall.jp/event/2024138845" class=""> <article> <time>2026年10月1日(木) 19:00 開演</time>
    <h3>特別演奏会<br>ラフマニノフ・チクルス</h3> </article> </a></li>`;
  const [e] = parseSymphony(html);
  assert.deepEqual([e.id, e.title, e.start, e.startTime], ['symphony:2024138845', '特別演奏会 ラフマニノフ・チクルス', '2026-10-01', '19:00']);
});

test('大阪城ホール: genre decides category; links to the event site', () => {
  const html = `<dl> <dt class="event-genre"> <span class="date">2026/10/14</span> <span class="bg">音楽・芸能</span> </dt>
      <dt class="event-ttl"><a href="https://tour.mrchildren.jp/" target="_blank">Mr.Children【振替公演】</a></dt>
      <dd><ul><li><span class="d-ttl">開場</span> <span class="d-txt">17:30</span></li><li><span class="d-ttl">開演</span> <span class="d-txt">18:30</span></li></ul></dd> </dl>
    <dl> <dt class="event-genre"> <span class="date">2026/10/20</span> <span class="bg">スポーツ</span> </dt><dt class="event-ttl"><a href="/event/1">バスケ</a></dt></dl>`;
  const [a, b] = parseJohall(html, '2026-10-14', 'https://www.osaka-johall.com/event/');
  assert.deepEqual([a.start, a.startTime, a.category, a.url], ['2026-10-14', '18:30', 'concert', 'https://tour.mrchildren.jp/']);
  assert.deepEqual([b.category, b.url], ['other', 'https://www.osaka-johall.com/event/']);
});
