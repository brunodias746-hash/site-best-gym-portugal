/* Portable request processing. Vercel/Firebase adapters only translate HTTP. */
const config = require('../lead-config.js');
const { createHash } = require('node:crypto');
const { validateCv } = require('./cv-validation.cjs');
const CAREERS_RECIPIENTS = Object.freeze({
  famalicao: 'rhfamalicao@bestgym.pt',
  valongo: 'rhvalongo@bestgym.pt',
  'sao-joao-da-madeira': 'rhsaojoaodamadeira@bestgym.pt'
});

function recipientFor(type, data = {}) {
  if (type === 'careers') return Object.hasOwn(CAREERS_RECIPIENTS, data.unit) ? CAREERS_RECIPIENTS[data.unit] : undefined;
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
    if (field.type === 'file') {
      const cv = validateCv(data[field.name]);
      if (cv.error) return cv;
      cleaned[field.name] = cv;
      continue;
    }
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
  let submittedAt;
  if (type === 'careers') {
    if (Object.keys(data).some(key => !['privacy', 'website', ...form.fields.map(field => field.name)].includes(key))) return { error: 'invalid_field' };
    submittedAt = payload.submittedAt;
    if (typeof submittedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(submittedAt) ||
      !Number.isFinite(Date.parse(submittedAt)) || Date.parse(submittedAt) > Date.now() + 300000 ||
      Date.parse(submittedAt) < Date.now() - 24 * 60 * 60 * 1000) return { error: 'invalid_request' };
  }
  return { type, data: cleaned, requestId, form, submittedAt, language: payload.language === 'en' ? 'en' : 'pt-PT' };
}

async function processCareers(input, recipient, env, fetcher) {
  const digest = createHash('sha256').update(JSON.stringify([input.data, input.language, input.submittedAt])).digest('hex');
  const unit = input.form.fields.find(field => field.name === 'unit').options.find(option => option[0] === input.data.unit)[1];
  const role = input.form.fields.find(field => field.name === 'role').options.find(option => option[0] === input.data.role)[1];
  const text = [
    'Nova candidatura — BEST GYM', '',
    'Nome completo: ' + input.data.name,
    'Endereço de e-mail: ' + input.data.email,
    'Contacto telefónico: ' + input.data.phone,
    'Unidade pretendida: ' + unit,
    'Função pretendida: ' + role,
    'Mensagem de apresentação: ' + (input.data.message || '—'), '',
    'Data e hora de submissão (UTC): ' + input.submittedAt,
    'Consentimento para gestão da candidatura: aceite',
    'Política de Privacidade: ' + config.privacyPath,
    'Currículo: em anexo'
  ].join('\n');
  async function send(message, phase) {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': 'bestgym/careers/' + input.requestId + '/' + digest + '/' + phase },
      body: JSON.stringify({ from: env.FORM_EMAIL_FROM, ...message }),
      signal: AbortSignal.timeout(12000)
    });
    const result = await response.json();
    return response.ok && typeof result.id === 'string' && result.id ? result.id : null;
  }
  try {
    const id = await send({
      to: [recipient], reply_to: input.data.email,
      subject: 'Nova candidatura · ' + unit + ' · ' + input.data.name.replace(/[\r\n]/g, ' '),
      text, attachments: [input.data.cv]
    }, 'internal');
    if (!id) return { status: 502, body: { ok: false, code: 'delivery_not_confirmed' } };
    const english = input.language === 'en';
    const confirmationId = await send({
      to: [input.data.email], reply_to: recipient,
      subject: english ? 'We have received your application — BEST GYM' : 'Recebemos a tua candidatura — BEST GYM',
      text: english
        ? 'Hello, ' + input.data.name + '.\n\nWe have received your application for ' + unit + '. Thank you for your interest in joining BEST GYM.\n\nBEST GYM'
        : 'Olá, ' + input.data.name + '.\n\nRecebemos a tua candidatura para ' + unit + '. Obrigado pelo teu interesse em fazer parte do BEST GYM.\n\nBEST GYM'
    }, 'confirmation');
    if (!confirmationId) return { status: 502, body: { ok: false, code: 'confirmation_not_confirmed' } };
    return { status: 200, body: { ok: true, id } };
  } catch { return { status: 502, body: { ok: false, code: 'delivery_not_confirmed' } }; }
}

async function processLead(payload, { env = process.env, fetcher = fetch } = {}) {
  const input = validate(payload);
  if (input.error) return { status: 400, body: { ok: false, code: input.error, field: input.field } };
  const recipient = recipientFor(input.type, input.data);
  if (!recipient || !configured(env)) return { status: 503, body: { ok: false, code: !recipient ? 'recipient_pending' : 'transport_pending' } };
  if (input.type === 'careers') return processCareers(input, recipient, env, fetcher);
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
