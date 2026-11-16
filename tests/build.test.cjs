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
    const icons = content.match(/<link\b[^>]*\brel="(?:shortcut )?icon"[^>]*>/g) || [];
    assert.deepEqual(icons, ['<link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-best-gym-square-v1.png">'], route);
    assert.ok(fs.existsSync(path.join(__dirname, '../public', route.replace(/^\/+|\/+$/g, ''), 'index.html')), route);
  }
  const sitemap = fs.readFileSync(path.join(__dirname, '../public/sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<url>/g) || []).length, Object.keys(pages).length * 2);
});
test('favicon assets have genuine PNG/ICO formats and visible pages retain the horizontal logo', () => {
  const output = path.join(__dirname, '../public');
  const png = fs.readFileSync(path.join(output, 'assets/favicon-best-gym-square-v1.png'));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 48);
  assert.equal(png.readUInt32BE(20), 48);
  const ico = fs.readFileSync(path.join(output, 'favicon.ico'));
  assert.equal(ico.subarray(0, 4).toString('hex'), '00000100');
  assert.equal(ico.readUInt16LE(4), 4);
  assert.deepEqual(ico, fs.readFileSync(path.join(output, 'assets/favicon-best-gym-square-v1.ico')));
  for (const name of ['Header.dc.html', 'localized-pages/pt/index.html', 'localized-pages/en/index.html']) {
    const html = fs.readFileSync(path.join(output, name), 'utf8');
    assert.ok(!html.includes('logo-square-approved.png'), name);
    assert.ok(html.includes('assets/logo-red.png') && html.includes('assets/logo-white.png'), name);
  }
});
test('deployment includes no source-only backend, instructions or credential files in public output', () => {
  for (const name of ['AGENTS.md', 'vercel.json', '.env', 'api', 'lib', 'tests', 'lead-handler.cjs']) assert.equal(fs.existsSync(path.join(__dirname, '../public', name)), false, name);
});
test('official signup and current campaign configuration remain explicit', () => {
  const signup = fs.readFileSync(path.join(__dirname, '../public/localized-pages/pt/inscricao.html'), 'utf8');
  assert.equal((signup.match(/https:\/\/subscribe\.mvf\.pt\/signup\/bestgym/g) || []).length, 2);
  assert.ok(!signup.includes('subscribe.myf.pt'));
  assert.ok(signup.includes('/lista-vip-sao-joao-da-madeira'));
  const campaign = globalThis.BGSiteConfig.campaign;
  assert.equal(campaign.pt.offer, '14,90€ por mês durante 4 meses + inscrição grátis');
  assert.equal(campaign.en.offer, '€14.90 a month for 4 months + no joining fee');
  for (const artwork of [campaign.artwork, campaign.mobileArtwork].filter(Boolean)) {
    assert.ok(fs.existsSync(path.join(__dirname, '../public', artwork)), artwork);
  }
});
