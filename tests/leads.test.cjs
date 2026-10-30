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
test('missing transport or recipient never becomes a success', async () => {
  const send = () => { throw Error('must not send'); };
  assert.equal((await processLead(application(), { env: {}, fetcher: send })).status, 503);
  assert.equal((await processLead(application('personalTrainer'), { env: { RESEND_API_KEY: 'test', FORM_EMAIL_FROM: 'test@example.com' }, fetcher: send })).body.code, 'recipient_pending');
  assert.equal((await processLead(application('saoJoaoVip'), { env: {}, fetcher: send })).body.code, 'recipient_pending');
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
