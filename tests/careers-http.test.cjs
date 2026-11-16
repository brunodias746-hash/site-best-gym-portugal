const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/leads.js');
const { careers } = require('./helpers/cv-fixtures.cjs');
let sequence = 0;
async function request(body, headers = {}, ip) {
  const result = { headers: {} };
  const req = { method: 'POST', headers: { host: 'bestgym.web.app', origin: 'https://bestgym.web.app', 'content-type': 'application/json', 'x-forwarded-for': ip || 'test-' + ++sequence, ...headers }, body };
  const res = { setHeader: (k, v) => { result.headers[k] = v; }, status: n => { result.status = n; return res; }, json: value => { result.body = value; return res; } };
  await handler(req, res, { env: {} }); return result;
}
test('careers HTTP contract rejects bad origin/content and preserves the old request-size limit', async () => {
  assert.equal((await request(careers(), { origin: 'https://outside.example' })).status, 403);
  assert.equal((await request(careers(), { 'content-type': 'text/plain' })).status, 415);
  assert.equal((await request('{')).status, 400);
  assert.equal((await request(careers(), { 'content-length': String(8 * 1024 * 1024 + 1) })).status, 413);
  assert.equal((await request({ type: 'contact', padding: 'x'.repeat(16001) })).status, 413);
  const big = careers(); big.data.message = 'x'.repeat(20000);
  assert.equal((await request(big)).body.code, 'invalid_field');
  const unavailable = await request(careers());
  assert.equal(unavailable.status, 503); assert.equal(unavailable.body.code, 'transport_pending');
  assert.equal(unavailable.headers['Cache-Control'], 'no-store');
});
test('careers rate limit is separate from the existing forms and never claims success', async () => {
  for (let i = 0; i < 3; i++) assert.equal((await request(careers(), {}, 'limited-careers')).status, 503);
  const limited = await request(careers(), {}, 'limited-careers');
  assert.equal(limited.status, 429); assert.equal(limited.headers['Retry-After'], '900');
  assert.notEqual((await request({ type: 'contact' }, {}, 'limited-careers')).status, 429);
});
