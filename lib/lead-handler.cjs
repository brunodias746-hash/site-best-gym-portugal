/* Portable request processing. Vercel/Firebase adapters only translate HTTP. */
const config = require('../lead-config.js');
const { createHash } = require('node:crypto');

function recipientFor(type, data = {}) {
  const form = Object.hasOwn(config.forms, type) && config.forms[type];
  return type === 'contact' ? config.contactRecipients[data.unit] : form && config[form.recipientKey];
}
function configured(env) { return Boolean(env.RESEND_API_KEY && env.FORM_EMAIL_FROM); }
function validate(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return { error: 'invalid_request' };
  const { type, data, requestId } = payload;
  const form = typeof type === 'string' && Object.hasOwn(config.forms, type) && config.forms[type];
  if (!form || !data || typeof data !== 'object' || Array.isArray(data) || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(requestId || '')) return { error: 'invalid_request' };
  if (data.website || data.privacy !== true) return { error: 'invalid_consent' };
  const cleaned = {};
  for (const field of form.fields) {
    const value = data[field.name] == null ? '' : data[field.name];
    if (typeof value !== 'string' || value.length > (field.max || 300)) return { error: 'invalid_field', field: field.name };
    cleaned[field.name] = value.trim();
    if (field.required && !cleaned[field.name]) return { error: 'required_field', field: field.name };
    if (value && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) return { error: 'invalid_email', field: field.name };
    if (value && field.type === 'tel' && (!/^[+\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length < 7)) return { error: 'invalid_phone', field: field.name };
    if (field.options && value && !field.options.some(option => option[0] === value)) return { error: 'invalid_option', field: field.name };
    if (field.type === 'number' && (!Number.isInteger(Number(value)) || Number(value) < field.min || Number(value) > field.maxValue)) return { error: 'invalid_number', field: field.name };
    if (field.type === 'date' && value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) return { error: 'invalid_date', field: field.name };
  }
  return { type, data: cleaned, requestId, form, language: payload.language === 'en' ? 'en' : 'pt-PT' };
}

async function processLead(payload, { env = process.env, fetcher = fetch } = {}) {
  const input = validate(payload);
  if (input.error) return { status: 400, body: { ok: false, code: input.error, field: input.field } };
  const recipient = recipientFor(input.type, input.data);
  if (!recipient || !configured(env)) return { status: 503, body: { ok: false, code: !recipient ? 'recipient_pending' : 'transport_pending' } };
  const text = ['BEST GYM — ' + input.form.title, '', ...input.form.fields.map(field => field.label[0] + ': ' + (input.data[field.name] || '—')), '', 'Consentimento: aceite', 'Política: ' + config.privacyPath, 'Referência: ' + input.requestId, 'Idioma: ' + input.language].join('\n');
  const digest = createHash('sha256').update(JSON.stringify([input.type, input.data])).digest('hex');
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': 'bestgym/' + input.requestId + '/' + digest },
      body: JSON.stringify({ from: env.FORM_EMAIL_FROM, to: [recipient], reply_to: input.data.email, subject: '[BEST GYM] ' + input.form.title + ' — ' + input.data.name.replace(/[\r\n]/g, ' '), text }),
      signal: AbortSignal.timeout(12000)
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) return { status: 502, body: { ok: false, code: 'delivery_not_confirmed' } };
    return { status: 200, body: { ok: true, id: result.id } };
  } catch (_) { return { status: 502, body: { ok: false, code: 'delivery_not_confirmed' } }; }
}
module.exports = { processLead, validate, configured, recipientFor };
