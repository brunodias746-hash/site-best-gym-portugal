// Run after node scripts/generate-localized-pages.mjs.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import '../site-config.js';
import { decode, htmlTokens, localizeEnglish, localizedAttributes } from '../scripts/localize-html.mjs';

const { origin, pages, campaign, englishHref } = globalThis.BGSiteConfig;
const englishFolder = 'public/localized-pages/en';
const routes = new Set(Object.values(pages).map(({ en }) => en));
const properNames = /Vila Nova de Famalicão|São João da Madeira|(?:Avenida|Av\.) Centenário da República, D68, Calendário|Avenida 25 de Abril, 381|Rua Oliveira Júnior, n\.º 630/giu;
const portugueseUi = /(?<![\p{L}\p{M}])(?:inscriç(?:ão|ões)|candidaturas?|escolhe|treina|começa|ginásios?|unidades?|contactos|falar|recebe|em\s+breve|ofertas?|campanhas?|privacidade|perguntas|abrir|fechar|grátis|duração|todos\s+os\s+direitos|falar\s+connosco|conteúdos|horários?|telemóvel|morada|preferências|obrigatórios|musculação|condições|treino|topo|dias)(?![\p{L}\p{M}])/iu;
const obsoleteCampaign = /férias\s+off|holiday\s+mode\s+off|50%\s+(?:de desconto|off)|(?:até|until)\s+2027/iu;
const metadataNames = new Set(['description', 'og:title', 'og:description']);

function scanEnglish(html, route) {
  const metadata = new Map();
  const alternates = new Map();
  const problems = [];
  let tag, language, canonical, title = '', titleCount = 0;
  const checkCopy = (value, where) => {
    const match = value.replace(properNames, '').match(portugueseUi) || value.match(obsoleteCampaign);
    if (match) problems.push(`${where}: "${match[0]}" in "${value.trim()}"`);
  };
  for (const token of htmlTokens(html)) {
    if (token.kind === 'text') {
      const value = decode(token.raw);
      if (tag === 'title') title += value;
      checkCopy(value.replace(/\{\{[^}]*\}\}/g, ''), 'text');
    }
    if (token.kind === 'close') tag = undefined;
    if (token.kind !== 'open') continue;
    const { name, attrs } = token;
    tag = name;
    if (name === 'html') language = attrs.lang;
    if (name === 'title') titleCount += 1;
    for (const key of localizedAttributes) if (attrs[key]) checkCopy(attrs[key], key);
    if (name === 'meta') {
      const key = attrs.name ?? attrs.property;
      if (metadataNames.has(key)) {
        if (metadata.has(key)) problems.push(`Duplicate metadata: ${key}`);
        metadata.set(key, attrs.content);
        checkCopy(attrs.content ?? '', key);
      }
    }
    if (name === 'link' && attrs.rel === 'canonical') canonical = attrs.href;
    if (name === 'link' && attrs.rel === 'alternate' && attrs.hreflang) alternates.set(attrs.hreflang, attrs.href);
    if (name === 'a' && attrs.href && !Object.hasOwn(attrs, 'data-bg-language-link')) {
      const href = attrs.href;
      if (englishHref(href, route) !== href) problems.push(`Unlocalised link: ${href}`);
      const target = href.split(/[?#]/)[0];
      if (target.startsWith('/en/') && !routes.has(target)) problems.push(`Unknown English route: ${href}`);
    }
  }
  return { language, canonical, alternates, metadata, title, titleCount, problems };
}

test('detects Portuguese copy without flagging addresses, scripts or localisation attributes', () => {
  const leaked = ['Inscrição', 'Candidatura', 'Escolhe', 'Treina', 'Começa', 'Ginásio', 'Ginásios', 'Unidade', 'Unidades', 'Contactos', 'Falar', 'Recebe', 'Em breve', 'Oferta', 'Campanha', 'Privacidade', 'Perguntas', 'Abrir', 'Fechar', 'Grátis', 'Duração', 'Todos os direitos'];
  for (const term of leaked) {
    assert.equal(scanEnglish(`<button aria-label="${term}">Continue</button><p>${term}</p>`, '/en/').problems.length, 2, term);
  }
  assert.deepEqual(scanEnglish('<address>Rua Oliveira Júnior, n.º 630 · São João da Madeira</address><script>var pt = "Inscrição";</script><a data-en-aria-label="Choose > Continue" href="/en/join">Join</a>', '/en/').problems, []);
});

test('build generated every English page', async () => {
  assert.equal(routes.size, 23);
  assert.equal((await readdir(englishFolder)).filter(file => file.endsWith('.html')).length, routes.size);
});

test('localising a mixed element preserves links, inline markup and intentional spacing', () => {
  const config = globalThis.BGSiteConfig;
  const source = '<p data-en-text="[&quot;Read&quot;,null]">Lê <a href="/sobre">BEST GYM</a><span data-en=" &amp; learn.">.</span></p>';
  const expected = '<p data-en-text="[&quot;Read&quot;,null]">Read <a href="/en/about">BEST GYM</a><span data-en=" &amp; learn."> &amp; learn.</span></p>';
  assert.equal(localizeEnglish(source, '/en/', config), expected);
  assert.equal(localizeEnglish(expected, '/en/', config), expected);
});

for (const [pt, { source, en, english }] of Object.entries(pages)) {
  test(`${en}: English copy, links and SEO`, async () => {
    const file = path.join(englishFolder, (source || pt.slice(1) || 'index') + '.html');
    const html = await readFile(file, 'utf8');
    const result = scanEnglish(html, en);
    assert.deepEqual(result.problems, []);
    assert.equal(result.language, 'en');
    assert.equal(result.titleCount, 1);
    assert.equal(result.title, english[0]);
    assert.equal(result.metadata.get('description'), english[1]);
    assert.equal(result.metadata.get('og:title'), english[0]);
    assert.equal(result.metadata.get('og:description'), english[1]);
    assert.equal(result.canonical, origin + en);
    assert.deepEqual(Object.fromEntries(result.alternates), { 'pt-PT': origin + pt, en: origin + en, 'x-default': origin + pt });
    if (pt === '/campanha') {
      for (const field of ['label', 'offer', 'summary', 'primaryLabel', 'terms']) assert.ok(html.includes(campaign.en[field]), field);
    }
  });
}
