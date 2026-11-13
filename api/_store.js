// Tiny storage for ticket check-ins, using an Upstash Redis database (free plan is plenty).
// Vercel -> your project -> Storage -> Create -> Upstash Redis (Marketplace) -> Connect to project.
// That adds the two variables below automatically.
// Finds the database address and token even if Vercel added a prefix (e.g. STORAGE_KV_REST_API_URL).
const find = (re) => { const k = Object.keys(process.env).find((n) => re.test(n) && process.env[n]); return k ? process.env[k] : undefined; };
const URL_ = find(/(^|_)(KV_REST_API_URL|UPSTASH_REDIS_REST_URL)$/);
const TOKEN = find(/(^|_)(KV_REST_API_TOKEN|UPSTASH_REDIS_REST_TOKEN)$/); // never the READ_ONLY token
const KEY = "bme:checkins";

const configured = () => Boolean(URL_ && TOKEN);

async function cmd(args) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args)
  });
  const d = await r.json();
  if (!r.ok || d.error) throw new Error(d.error || "Storage error");
  return d.result;
}

// { reference: { at, by } }
async function allCheckins() {
  const flat = (await cmd(["HGETALL", KEY])) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) { try { out[flat[i]] = JSON.parse(flat[i + 1]); } catch { out[flat[i]] = { at: null }; } }
  return out;
}

// Atomic: only the FIRST caller wins, so one ticket can never be checked in twice.
// Returns { ok: true } or { ok: false, existing }.
async function checkIn(reference, info) {
  const won = await cmd(["HSETNX", KEY, reference, JSON.stringify(info)]);
  if (won === 1) return { ok: true };
  const existing = await cmd(["HGET", KEY, reference]);
  let parsed = {}; try { parsed = JSON.parse(existing); } catch {}
  return { ok: false, existing: parsed };
}

const undoCheckIn = (reference) => cmd(["HDEL", KEY, reference]);

module.exports = { configured, allCheckins, checkIn, undoCheckIn };
