const { test } = require('node:test');
const assert = require('node:assert/strict');
const { processLead, validate, recipientFor } = require('../lib/lead-handler.cjs');
const { validateCv, MAX_CV_BYTES, crc32 } = require('../lib/cv-validation.cjs');
const { cv, careers, zip, docxBytes } = require('./helpers/cv-fixtures.cjs');
const env = { RESEND_API_KEY: 'test-only-never-used-on-network', FORM_EMAIL_FROM: 'test@example.invalid' };
const routing = { famalicao: 'rhfamalicao@bestgym.pt', valongo: 'rhvalongo@bestgym.pt', 'sao-joao-da-madeira': 'rhsaojoaodamadeira@bestgym.pt' };

test('PDF and genuine DOCX pass extension, MIME and content validation', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
  for (const kind of ['pdf', 'docx']) {
    assert.equal(validate(careers('famalicao', kind)).error, undefined);
    const file = cv(kind); file.type = ''; assert.equal(validateCv(file).error, undefined);
  }
  assert.equal(validateCv(cv('docx', docxBytes(true))).error, undefined, 'compressed DOCX from Word');
});
test('reject oversized, forged, mismatched and damaged files; sanitise filenames', () => {
  const tooBig = cv(); tooBig.size = MAX_CV_BYTES + 1; assert.equal(validateCv(tooBig).error, 'file_too_large');
  const wrongMime = cv(); wrongMime.type = 'text/plain'; assert.equal(validateCv(wrongMime).error, 'file_type');
  const wrongName = cv(); wrongName.name = 'cv.exe'; assert.equal(validateCv(wrongName).error, 'file_type');
  const disguised = cv('docx', Buffer.from('not a Word file')); assert.equal(validateCv(disguised).error, 'file_invalid');
  const zipOnly = cv('docx', zip({ 'hello.txt': 'not a Word file' })); assert.equal(validateCv(zipOnly).error, 'file_invalid');
  const pdfOnly = cv('pdf', Buffer.from('not a PDF file')); assert.equal(validateCv(pdfOnly).error, 'file_invalid');
  const corrupt = cv('docx'); const bytes = Buffer.from(corrupt.content, 'base64'); bytes[bytes.indexOf(Buffer.from('Technical'))] ^= 1; corrupt.content = bytes.toString('base64'); assert.equal(validateCv(corrupt).error, 'file_invalid');
  const badSize = cv(); badSize.size--; assert.equal(validateCv(badSize).error, 'file_invalid');
  const badBase64 = cv(); badBase64.content += '!'; assert.equal(validateCv(badBase64).error, 'file_invalid');
  const name = cv(); name.name = '../../CV\r\n.inject.pdf';
  const safe = validateCv(name); assert.equal(safe.error, undefined); assert.ok(!/[\r\n/\\]/.test(safe.filename)); assert.ok(safe.filename.endsWith('.pdf'));
});
test('exactly 5 MB is accepted and a larger decoded CV is rejected', () => {
  const bytes = Buffer.alloc(MAX_CV_BYTES, 32); Buffer.from('%PDF-1.4\n').copy(bytes); Buffer.from('%%EOF\n').copy(bytes, bytes.length - 6);
  assert.equal(validateCv(cv('pdf', bytes)).error, undefined);
  assert.equal(validateCv(cv('pdf', Buffer.concat([bytes, Buffer.from(' ')]))).error, 'file_too_large');
});
test('required fields, consent, unit and role allowlists are enforced by the backend', () => {
  for (const key of ['name', 'email', 'phone', 'unit', 'role', 'cv']) {
    const p = careers(); delete p.data[key]; assert.ok(validate(p).error, key);
  }
  const noConsent = careers(); noConsent.data.privacy = false; assert.equal(validate(noConsent).error, 'invalid_consent');
  const noFile = careers(); noFile.data.cv = null; assert.equal(validate(noFile).error, 'file_required');
  for (const unit of ['unknown', '__proto__', 'constructor', 'rhfamalicao@bestgym.pt']) {
    const p = careers(unit); assert.equal(validate(p).field, 'unit'); assert.equal(recipientFor('careers', p.data), undefined);
  }
  const role = careers(); role.data.role = 'invented-job'; assert.equal(validate(role).field, 'role');
  const forged = careers(); forged.data.recipient = 'attacker@example.invalid'; assert.equal(validate(forged).error, 'invalid_field');
  const badEmail = careers(); badEmail.data.email = 'bad\r\n@example.invalid'; assert.equal(validate(badEmail).field, 'email');
  const future = careers(); future.submittedAt = '2099-01-01T00:00:00.000Z'; assert.equal(validate(future).error, 'invalid_request');
});
test('all 3 units receive their CV internally; confirmation goes only to the applicant', async () => {
  for (const [unit, recipient] of Object.entries(routing)) for (const language of ['pt-PT', 'en']) {
    const input = careers(unit); input.language = language;
    const sent = [];
    const fetcher = async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); sent.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ id: 'provider-id-' + sent.length }) }; };
    const result = await processLead(input, { env, fetcher });
    assert.deepEqual(result, { status: 200, body: { ok: true, id: 'provider-id-1' } });
    assert.deepEqual(sent[0].to, [recipient]); assert.equal(sent[0].reply_to, input.data.email);
    assert.equal(sent[0].attachments[0].content, input.data.cv.content);
    assert.equal(sent[0].attachments[0].content_type, 'application/pdf');
    assert.ok(sent[0].subject.startsWith('Nova candidatura · '));
    assert.ok(sent[0].text.includes('Candidatura espontânea'));
    assert.ok(sent[0].text.includes(input.submittedAt));
    assert.ok(!sent[0].text.includes(input.requestId) && !sent[0].text.includes('spontaneous'));
    assert.deepEqual(sent[1].to, [input.data.email]); assert.equal(sent[1].reply_to, recipient); assert.equal(sent[1].attachments, undefined);
    assert.equal(sent[1].from, env.FORM_EMAIL_FROM);
    assert.match(sent[1].subject, language === 'en' ? /We have received/ : /Recebemos a tua candidatura/);
  }
});
test('both provider acceptances are required; retries use identical internal and confirmation payloads', async () => {
  const input = careers(), requests = [];
  const fetcher = async (_, req) => { requests.push(req); return { ok: true, json: async () => ({ id: 'confirmed-id' }) }; };
  await processLead(input, { env, fetcher }); await processLead(input, { env, fetcher });
  for (const i of [0, 1]) { assert.equal(requests[i].body, requests[i + 2].body); assert.equal(requests[i].headers['Idempotency-Key'], requests[i + 2].headers['Idempotency-Key']); }
  assert.notEqual(requests[0].headers['Idempotency-Key'], requests[1].headers['Idempotency-Key']);
  let count = 0;
  const failing = async () => ({ ok: ++count === 1, json: async () => ({ id: 'id' }) });
  assert.equal((await processLead(input, { env, fetcher: failing })).body.code, 'confirmation_not_confirmed');
  count = 0;
  assert.equal((await processLead(input, { env, fetcher: async () => ({ ok: true, json: async () => ({}) }) })).status, 502);
  assert.equal((await processLead(input, { env: {}, fetcher: () => { throw Error('must never call network'); } })).status, 503);
});
