const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { processLead, validate } = require('../lib/lead-handler.cjs');
const config = require('../lead-config.js');
function application(type = 'builtByBest') {
  const data = Object.fromEntries(config.forms[type].fields.map(field => [field.name, field.options ? field.options[0][0] : field.type === 'email' ? 'qa@example.com' : field.type === 'tel' ? '+351 900 000 000' : field.type === 'number' ? '25' : field.type === 'date' ? '' : 'QA synthetic data']));
  return { type, requestId: randomUUID(), data: { ...data, privacy: true, website: '' } };
}
test('each lead type enforces consent and mandatory fields on the server', () => {
  for (const type of Object.keys(config.forms)) {
    const p = application(type); assert.equal(validate(p).error, undefined);
    p.data.privacy = false; assert.equal(validate(p).error, 'invalid_consent');
    p.data.privacy = true; p.data.name = ''; assert.equal(validate(p).field, 'name');
  }
});
test('invalid emails, telephones, options, dates and forged types are rejected', () => {
  const p = application(); p.data.email = 'invalid'; assert.equal(validate(p).field, 'email');
  p.data.email = 'qa@example.com'; p.data.phone = 'letters'; assert.equal(validate(p).field, 'phone');
  p.data.phone = '+351 900000000'; p.data.competed = 'maybe'; assert.equal(validate(p).field, 'competed');
  p.data.competed = 'Sim'; p.data.goalDate = '2026-02-30'; assert.equal(validate(p).field, 'goalDate');
  p.type = '__proto__'; assert.equal(validate(p).error, 'invalid_request');
});
test('missing transport never becomes a success for any configured recipient', async () => {
  const send = () => { throw Error('must not send'); };
  for (const type of Object.keys(config.forms)) {
    const result = await processLead(application(type), { env: {}, fetcher: send });
    assert.equal(result.status, 503);
    assert.equal(result.body.code, 'transport_pending');
  }
});
test('PT and VIP applications go only to the confirmed client recipients', async () => {
  for (const [type, recipient] of [['personalTrainer', 'partners@bestgym.pt'], ['saoJoaoVip', 'Saojoaodamadeira@bestgym.pt']]) {
    const p = application(type); p.data.recipient = 'forged@example.com';
    let message;
    const result = await processLead(p, {
      env: { RESEND_API_KEY: 'test-only', FORM_EMAIL_FROM: 'qa@example.com' },
      fetcher: async (_, request) => { message = JSON.parse(request.body); return { ok: true, json: async () => ({ id: 'test-confirmed-id' }) }; }
    });
    assert.equal(result.status, 200);
    assert.deepEqual(message.to, [recipient]);
    assert.ok(!message.text.includes('forged@example.com'));
  }
});
test('success requires a confirmed provider ID and preserves idempotency on retries', async () => {
  const p = application(); const requests = [];
  const options = { env: { RESEND_API_KEY: 'test-only', FORM_EMAIL_FROM: 'qa@example.com' }, fetcher: async (_, req) => { requests.push(req); return { ok: true, json: async () => ({ id: 'confirmed-test-id' }) }; } };
  assert.equal((await processLead(p, options)).body.id, 'confirmed-test-id');
  await processLead(p, options);
  assert.equal(requests[0].headers['Idempotency-Key'], requests[1].headers['Idempotency-Key']);
  assert.equal(requests[0].body, requests[1].body);
  assert.deepEqual(JSON.parse(requests[0].body).to, ['rhvalongo@bestgym.pt']);
  options.fetcher = async () => ({ ok: true, json: async () => ({}) }); assert.equal((await processLead(p, options)).status, 502);
  options.fetcher = async () => { throw Error('timeout'); }; assert.equal((await processLead(p, options)).status, 502);
});
