// Vercel Function: anonymous live-viewer + total-view counter backed by Upstash Redis (free tier).
// Stores only a random per-tab id for ~45 seconds and a single running total. No IPs, no cookies.
declare const process: { env: Record<string, string | undefined> };
const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const WINDOW_MS = 45_000;

async function redis(commands: (string | number)[][]) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()) as { result: unknown }[];
}

export async function POST(request: Request) {
  if (!URL_ || !TOKEN) return Response.json({ error: "not configured" }, { status: 503 });
  let body: { id?: unknown; hit?: unknown } = {};
  try { body = await request.json(); } catch { /* empty body */ }
  const id = typeof body.id === "string" && /^[a-z0-9]{4,24}$/i.test(body.id) ? body.id : null;
  const now = Date.now();
  const cmds: (string | number)[][] = [];
  if (id) cmds.push(["ZADD", "live", now, id]);
  cmds.push(["ZREMRANGEBYSCORE", "live", 0, now - WINDOW_MS]);
  if (id && body.hit === true) cmds.push(["INCR", "views"]);
  cmds.push(["ZCARD", "live"], ["GET", "views"]);
  try {
    const out = await redis(cmds);
    const online = Number(out[out.length - 2].result) || 0;
    const total = Number(out[out.length - 1].result) || 0;
    return Response.json({ online, total }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
