// The only way scripts fetch other people's sites: honest User-Agent, robots.txt obeyed,
// at most one request per second per host.
import robotsParser from 'robots-parser';

export const USER_AGENT = 'EventMapBot/0.1 (+https://github.com/Matthew-ms/eventmap)';

// Blocking any of these means "no AI collection". Anthropic's older names matter: fmfm.jp blocks anthropic-ai and
// Claude-Web but not ClaudeBot.
const AI_CRAWLERS = ['ClaudeBot', 'anthropic-ai', 'Claude-Web', 'GPTBot'];

const robots = new Map<string, ReturnType<typeof robotsParser>>();
const lastHit = new Map<string, number>();

async function throttle(host: string) {
  const wait = (lastHit.get(host) ?? 0) + 1000 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHit.set(host, Date.now());
}

const get = (url: string) =>
  fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(30_000) });

export async function politeFetch(url: string): Promise<Response> {
  const { origin, host } = new URL(url);
  if (!robots.has(origin)) {
    await throttle(host);
    const res = await get(origin + '/robots.txt').catch(() => null);
    // No robots.txt (or unreachable) means no restrictions.
    robots.set(origin, robotsParser(origin + '/robots.txt', res?.ok ? await res.text() : ''));
  }
  const rules = robots.get(origin)!;
  if (rules.isDisallowed(url, USER_AGENT)) throw new Error(`robots.txt disallows ${url}`);
  // Our data entry is AI-assisted, so a site that blocks AI crawlers is treated as opting out of this project too.
  if (AI_CRAWLERS.some((ua) => rules.isDisallowed(url, ua))) {
    throw new Error(`robots.txt opts out of AI crawlers for ${url}: stop using this source`);
  }
  await throttle(host);
  const res = await get(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res;
}
