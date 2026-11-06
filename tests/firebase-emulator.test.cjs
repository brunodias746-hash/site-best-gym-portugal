const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const firebase = require('../firebase.json');
const vercel = require('../vercel.json');
const leads = require('../lead-config.js');
require('../site-config.js');

const base = 'http://127.0.0.1:5000';
const endpoint = base + '/api/leads';
const { pages, origin } = globalThis.BGSiteConfig;

test('Firebase Hosting maps only the approved site and mirrors Vercel routes', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const rc = JSON.parse(fs.readFileSync(path.join(__dirname, '../.firebaserc'), 'utf8'));
  assert.equal(rc.projects.default, 'bestgym-pt');
  assert.deepEqual(rc.targets['bestgym-pt'].hosting, { bestgym: ['bestgym'] });
  assert.equal(firebase.hosting.length, 1);
  const hosting = firebase.hosting[0];
  assert.equal(hosting.target, 'bestgym');
  assert.deepEqual(hosting.rewrites, [
    { source: '/api/leads', function: { functionId: 'bestgymLeads', region: 'europe-west1' } },
    ...vercel.rewrites
  ]);
});

test('Hosting serves every direct PT/EN route with canonical and security metadata', async () => {
  for (const [pt, page] of Object.entries(pages)) {
    for (const [route, lang] of [[pt, 'pt-PT'], [page.en, 'en']]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get('x-frame-options'), 'DENY', route);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff', route);
      assert.equal(response.headers.get('content-security-policy'), vercel.headers[0].headers[0].value, route);
      const html = await response.text();
      assert.ok(html.includes(`<html lang="${lang}"`), route);
      assert.ok(html.includes(`<link rel="canonical" href="${origin}${route}">`), route);
      assert.ok(html.includes(`<link rel="alternate" hreflang="en" href="${origin}${page.en}">`), route);
    }
  }
  for (const { source, destination } of vercel.redirects) {
    const response = await fetch(base + source, { redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(new URL(response.headers.get('location'), base).pathname, destination);
  }
  assert.equal((await fetch(base + '/unknown-test-route')).status, 404);
  assert.equal((await fetch(base + '/en/unknown-test-route')).status, 404);
  assert.equal((await fetch(base + '/.image-slots.state.json')).status, 200);
  const asset = await fetch(base + '/assets/logo-red.png');
  assert.equal(asset.status, 200);
  assert.equal(asset.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
  const design = await fetch(base + '/_ds/best-gym-6952b02b-78bb-4eae-84e8-9e416c3c4bb1/tokens/fonts.css');
  assert.equal(design.status, 200);
  assert.equal(design.headers.get('cache-control'), 'public, max-age=31536000, immutable');
});

test('Hosting rewrites lead requests to the HTTPS function and enforces the API contract', async () => {
  for (const type of Object.keys(leads.forms)) {
    const response = await fetch(endpoint + '?type=' + type);
    assert.equal(response.status, 200, type);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.deepEqual(await response.json(), { ready: false }, 'emulator must never send real mail');
  }
  assert.equal((await fetch(endpoint + '?type=unknown')).status, 400);
  assert.equal((await fetch(endpoint, { method: 'PUT' })).status, 405);

  const lead = {
    type: 'saoJoaoVip', requestId: randomUUID(), language: 'pt-PT',
    data: { name: 'Local emulator test', email: 'qa@example.com', phone: '912345678', website: '', privacy: true }
  };
  const post = (payload, headers = {}) => fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base, 'Sec-Fetch-Site': 'same-origin', ...headers },
    body: JSON.stringify(payload)
  });
  assert.equal((await post(lead, { Origin: 'https://outside.example' })).status, 403);
  assert.equal((await post(lead, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal((await post(lead, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post({ ...lead, data: { ...lead.data, extra: 'á'.repeat(9000) } })).status, 413);
  const invalid = await post({ ...lead, data: { ...lead.data, privacy: false } });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).code, 'invalid_consent');
  const unavailable = await post(lead);
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { ok: false, code: 'transport_pending' });

  let limited;
  for (let attempt = 0; attempt < 16; attempt++) {
    const response = await post(lead);
    if (response.status === 429) { limited = response; break; }
    assert.equal(response.status, 503);
  }
  assert.ok(limited, 'per-instance limiter must reject repeated submissions');
  assert.equal(limited.headers.get('retry-after'), '900');
});
