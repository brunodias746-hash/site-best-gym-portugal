const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret, defineString } = require('firebase-functions/params');
const handler = require('./shared/api/leads.js');

const resendKey = defineSecret('RESEND_API_KEY');
const sender = defineString('FORM_EMAIL_FROM', { default: 'BEST GYM <formularios@forms.bestgym.pt>' });
const hostingHosts = new Set(['bestgym.web.app', 'bestgym.firebaseapp.com']);

function matchesHostingOrigin(headers, emulator) {
  const { origin, host } = headers;
  const forwardedHost = headers['x-forwarded-host'];
  const fetchSite = headers['sec-fetch-site'];
  if (fetchSite && fetchSite !== 'same-origin') return false;

  try {
    const url = new URL(origin);
    if (url.origin !== origin) return false;
    if (emulator) {
      return url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname) &&
        (url.host === host || url.host === forwardedHost);
    }
    if (url.protocol !== 'https:' || !hostingHosts.has(url.host)) return false;
    if (hostingHosts.has(host)) return url.host === host;
    if (hostingHosts.has(forwardedHost)) return url.host === forwardedHost;
    // Hosting may replace Host when proxying to Functions. Browsers provide
    // Fetch Metadata for same-origin requests and cannot forge that header.
    return fetchSite === 'same-origin';
  } catch {
    return false;
  }
}

exports.bestgymLeads = onRequest({
  region: 'europe-west1',
  secrets: [resendKey],
  cors: false,
  timeoutSeconds: 20,
  maxInstances: 5
}, (req, res) => {
  const emulator = process.env.FUNCTIONS_EMULATOR === 'true';
  const env = {
    RESEND_API_KEY: emulator ? undefined : process.env.RESEND_API_KEY,
    FORM_EMAIL_FROM: sender.value()
  };
  if (req.method !== 'POST' || !req.headers.origin) return handler(req, res, { env });

  if (!matchesHostingOrigin(req.headers, emulator)) {
    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');
    return res.status(403).json({ ok: false });
  }

  return handler({
    method: req.method,
    headers: { ...req.headers, host: new URL(req.headers.origin).host },
    query: req.query,
    body: req.body,
    rawBody: req.rawBody,
    socket: req.socket
  }, res, { env });
});
