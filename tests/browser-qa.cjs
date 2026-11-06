/* Run after the static build and scripts/serve-local.cjs. Requires Playwright + Chrome. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('../site-config.js');
const config = globalThis.BGSiteConfig;
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || '.codex-work';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [], failures = [];
  const changed = ['/', '/inscricao', '/unidades', '/unidade-famalicao', '/unidade-valongo', '/unidade-sao-joao-da-madeira', '/lista-vip-sao-joao-da-madeira', '/built-by-best/candidatura', '/personal-trainers/candidatura', '/built-by-best', '/franchising', '/contactos', '/produtos', '/campanha', '/em-breve'];
  for (const width of [390, 430, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 1000 : 844 }, hasTouch: width < 1000, isMobile: width < 1000 });
    const routes = width === 390 ? Object.keys(config.pages) : changed;
    for (let offset = 0; offset < routes.length; offset += 3) {
      await Promise.all(routes.slice(offset, offset + 3).flatMap(pt => [pt, config.pages[pt].en]).map(async route => {
        const page = await context.newPage(); const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForSelector('footer', { timeout: 15000 });
          await page.waitForTimeout(500);
          const english = route.startsWith('/en');
          const info = await page.evaluate(() => ({
            width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
            canvas: !!document.querySelector('canvas.best-cursor-spotlight'),
            lang: document.documentElement.lang,
            canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
            alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
            heading: document.querySelector('main h1')?.textContent,
            images: Array.from(document.querySelectorAll('img')).filter(img => img.complete && !img.naturalWidth && img.getAttribute('src')).map(img => img.getAttribute('src')),
            logos: Array.from(document.querySelectorAll('img[data-bg-headerlogo],img[data-footer-logo]')).filter(img => img.naturalWidth).map(img => { const r=img.getBoundingClientRect(); return { ratio:r.width/r.height, natural:img.naturalWidth/img.naturalHeight }; }),
            text: document.querySelector('main')?.innerText || '',
            motion: window.BGMotion && window.BGMotion.enabled,
            overflow: getComputedStyle(document.body).overflowY
          }));
          assert.equal(response.status(), 200); assert.ok(info.heading, 'missing main heading');
          assert.ok(info.scrollWidth <= width + 1, 'horizontal overflow: ' + info.scrollWidth);
          assert.equal(info.lang, english ? 'en' : 'pt-PT'); assert.equal(info.canonical, config.origin + route);
          assert.equal(info.alternates, 3); assert.equal(info.canvas, width >= 1000); assert.equal(info.motion, true);
          assert.deepEqual(info.images, [], 'broken images');
          info.logos.forEach(logo => assert.ok(Math.abs(logo.ratio - logo.natural) < .1, 'distorted logo'));
          assert.ok(!info.text.includes('Burn Zone')); assert.notEqual(info.overflow, 'hidden');
          assert.deepEqual(errors, [], 'console exception');
          if (english) assert.ok(!/Cerca de 2\.000|Entrar na lista VIP|Produtos disponíveis|Enviar candidatura|O teu treino|Treino com direção/.test(info.text), 'untranslated new content');
          assert.ok(!/férias off|gym on\.|50% de desconto|50% off each month|até 2027|until 2027/i.test(info.text), 'obsolete campaign');
          const key = width + '-' + route.replace(/\W/g, '-');
          if (changed.includes(route) && [390, 1440].includes(width)) await page.screenshot({ path: output + '/' + key + '.png', fullPage: true });
          results.push({ width, route, status: 'pass' });
        } catch (error) { failures.push({ width, route, error: error.message, exceptions: errors }); }
        finally { await page.close(); }
      }));
      console.log(JSON.stringify({ viewport: width, completed: results.length + failures.length, failed: failures.length }));
    }
    await context.close();
  }
  fs.writeFileSync(output + '/browser-results.json', JSON.stringify({ base, results, failures }, null, 2));
  await browser.close();
  console.log(JSON.stringify({ passed: results.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
