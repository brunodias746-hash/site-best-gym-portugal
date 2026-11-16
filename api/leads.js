const { processLead, configured, recipientFor } = require('../lib/lead-handler.cjs');
const config = require('../lead-config.js');
const buckets = new Map();

module.exports = async function handler(req, res, { env = process.env } = {}) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'GET') {
    const type = req.query && req.query.type;
    if (typeof type !== 'string' || !Object.hasOwn(config.forms, type)) return res.status(400).json({ ready: false });
    const hasRecipient = type === 'contact' || type === 'careers' || Boolean(recipientFor(type));
    return res.status(200).json({ ready: hasRecipient && configured(env) });
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ ok: false }); }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).json({ ok: false });
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) return res.status(403).json({ ok: false }); }
    catch (_) { return res.status(403).json({ ok: false }); }
  }
  const bodySize = Math.max(Number(req.headers['content-length']) || 0, req.rawBody?.length || 0, Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '')));
  if (bodySize > 8 * 1024 * 1024) return res.status(413).json({ ok: false });
  let payload = req.body;
  try { if (typeof payload === 'string') payload = JSON.parse(payload); } catch (_) { return res.status(400).json({ ok: false }); }
  const careers = payload?.type === 'careers';
  if (!careers && bodySize > 16000) return res.status(413).json({ ok: false });
  const ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || 'unknown').split(',')[0];
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.until < now) buckets.delete(key);
  const bucketKey = careers ? ip + '/careers' : ip;
  const bucket = buckets.get(bucketKey) || { count: 0, until: now + 15 * 60 * 1000 };
  if (++bucket.count > (careers ? 3 : 15)) { res.setHeader('Retry-After', '900'); return res.status(429).json({ ok: false, code: 'rate_limit' }); }
  if (buckets.size < 10000) buckets.set(bucketKey, bucket);
  const result = await processLead(payload, { env });
  return res.status(result.status).json(result.body);
};
