const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
require('../site-config.js');
const { pages, origin } = globalThis.BGSiteConfig;
test('all PT/EN routes have generated pages, portable indexes and correct SEO', () => {
  for (const [pt, def] of Object.entries(pages)) for (const [locale, route] of [['pt', pt], ['en', def.en]]) {
    const basename = def.source || (pt === '/' ? 'index' : pt.slice(1));
    const content = fs.readFileSync(path.join(__dirname, '../public/localized-pages', locale, basename + '.html'), 'utf8');
    assert.ok(content.includes('<link rel="canonical" href="' + origin + route + '">'), route);
    assert.equal((content.match(/hreflang=/g) || []).length, 3, route);
    assert.ok(content.includes('lang="' + (locale === 'pt' ? 'pt-PT' : 'en') + '"'), route);
    assert.ok(fs.existsSync(path.join(__dirname, '../public', route.replace(/^\/+|\/+$/g, ''), 'index.html')), route);
  }
  const sitemap = fs.readFileSync(path.join(__dirname, '../public/sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<url>/g) || []).length, Object.keys(pages).length * 2);
});
test('deployment includes no source-only backend, instructions or credential files in public output', () => {
  for (const name of ['AGENTS.md', 'vercel.json', '.env', 'api', 'lib', 'tests', 'lead-handler.cjs']) assert.equal(fs.existsSync(path.join(__dirname, '../public', name)), false, name);
});
test('official signup and current campaign configuration remain explicit', () => {
  const signup = fs.readFileSync(path.join(__dirname, '../public/localized-pages/pt/inscricao.html'), 'utf8');
  assert.equal((signup.match(/https:\/\/subscribe\.mvf\.pt\/signup\/bestgym/g) || []).length, 2);
  assert.ok(!signup.includes('subscribe.myf.pt'));
  assert.ok(signup.includes('/lista-vip-sao-joao-da-madeira'));
  assert.equal(globalThis.BGSiteConfig.campaign.pt.offer, '50% de desconto por mês até 2027 + inscrição grátis');
});
