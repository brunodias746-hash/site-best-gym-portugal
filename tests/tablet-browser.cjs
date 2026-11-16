/* Static-only regression QA: tablet layout, approved artwork and hidden unit photos.
   Run after the normal build with BASE_URL pointing to the Hosting emulator or site.
   Requires Playwright + Chrome. Sends no form submissions. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('../site-config.js');
const base = process.env.BASE_URL || 'http://127.0.0.1:5000';
const output = process.env.QA_OUTPUT || '.codex-work/tablet-qa';
fs.mkdirSync(output, { recursive: true });
const widths = [390, 430, 768, 820, 834, 1024, 1440];
const photo = 'assets/img/units/valongo-exterior-corrected-2026.webp';
const results = [], failures = [];

async function checkLogo(locator) {
  await locator.evaluate(img => img.decode());
  const size = await locator.evaluate(img => {
    const r = img.getBoundingClientRect();
    return { width: r.width, height: r.height, ratio: r.width / r.height, natural: img.naturalWidth / img.naturalHeight, src: img.getAttribute('src') };
  });
  assert.ok(['assets/logo-red.png', 'assets/logo-white.png'].includes(size.src), 'main logo must use the approved horizontal artwork');
  assert.ok(size.height >= 16 && size.height <= 36, JSON.stringify(size));
  assert.ok(size.ratio > 3 && Math.abs(size.ratio - size.natural) < .01, 'distorted website logo');
}

async function checkPhoto(locator, fullFrame) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(img => img.decode());
  const media = await locator.evaluate(img => {
    const r = img.getBoundingClientRect(), frame = img.parentElement;
    return {
      src: img.getAttribute('src'), width: r.width, height: r.height,
      natural: img.naturalWidth / img.naturalHeight,
      clip: getComputedStyle(frame).clipPath,
      frame: frame.getBoundingClientRect().width / frame.getBoundingClientRect().height,
      fit: getComputedStyle(img).objectFit
    };
  });
  assert.equal(media.src, photo);
  assert.ok(media.width > 200 && media.height > 100, 'empty photo');
  assert.ok(!/100%/.test(media.clip), 'photo is completely clipped');
  assert.equal(media.fit, 'cover');
  if (fullFrame) assert.ok(Math.abs(media.width / media.height - media.natural) < .01, 'exterior cropped at touch width');
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const jobs = widths.flatMap(width => [false, true].map(english => ({ width, english })));
  try {
    for (let offset = 0; offset < jobs.length; offset += 2) {
      await Promise.all(jobs.slice(offset, offset + 2).map(async ({ width, english }) => {
        const page = await browser.newPage({
          viewport: { width, height: width >= 768 && width <= 1060 ? 1112 : 900 },
          hasTouch: width <= 1060, isMobile: width <= 1060
        });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
        page.on('response', r => { if (r.url().startsWith(base + '/') && r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
        try {
          for (const pt of ['/', '/unidades', '/unidade-valongo']) {
            const route = english ? globalThis.BGSiteConfig.pages[pt].en : pt;
            const response = await page.goto(base + route + (pt === '/' ? '?popup=1' : ''), { waitUntil: 'networkidle' });
            assert.equal(response.status(), 200);
            await page.locator('footer .bless-credit').waitFor();
            if (pt === '/') {
              const popup = page.locator('#bestgym-campaign-popup-v2');
              await popup.waitFor({ state: 'visible' });
              await popup.locator('[data-campaign-close]').click();
              await popup.waitFor({ state: 'detached' });
            }
            await checkLogo(page.locator('[data-bg-headerlogo]'));
            assert.equal(await page.locator('[data-bg-desknav]').isVisible(), width > 1060);
            await page.locator('[data-bg-menu-trigger]').click();
            await page.waitForFunction(() => document.activeElement?.hasAttribute('data-bg-menu-close'));
            await checkLogo(page.locator('#bestgym-main-menu .best-logo-drawer'));
            if (pt === '/' && width === 834) await page.screenshot({ path: output + '/834-menu-' + (english ? 'en' : 'pt') + '.png' });
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('[data-bg-menu-trigger]').getAttribute('aria-expanded'), 'false');
            await page.evaluate(() => window.BGTheme.set('light'));
            await checkLogo(page.locator('[data-bg-headerlogo]'));
            await page.evaluate(() => window.BGTheme.set('dark'));

            if (pt === '/') {
              if (width > 1060) await page.locator('[data-unit-tabs] button').nth(1).click();
              const img = page.locator('img#home-unit-valongo');
              await checkPhoto(img, width <= 1060);
              if (width <= 1060) assert.equal(await page.locator('[data-unit-card]:visible').count(), 2);
              assert.equal(await page.locator('[data-hero-slide]').evaluateAll(slides => slides.filter(el => getComputedStyle(el).visibility !== 'hidden' && Number(getComputedStyle(el).opacity) > 0).length), 1);
              await page.evaluate(() => scrollTo(0, 0));
              if ([834, 1024].includes(width)) await page.screenshot({ path: output + '/' + width + '-home-' + (english ? 'en' : 'pt') + '.png' });
            } else if (pt === '/unidades') {
              await checkPhoto(page.locator('img#unidades-valongo'), width <= 1060);
              if (width === 834) await page.locator('[data-unit="valongo"]').screenshot({ path: output + '/834-valongo-card-' + (english ? 'en' : 'pt') + '.png' });
            } else {
              await checkPhoto(page.locator('img#valongo-hero'), width <= 1060);
              for (const img of await page.locator('main img[src*="valongo"]:visible').all()) {
                await img.scrollIntoViewIfNeeded();
                await img.evaluate(el => el.decode());
              }
              await page.locator('#valongo-acesso').scrollIntoViewIfNeeded();
              const access = await page.locator('#valongo-acesso').evaluate(el => ({
                h: el.getBoundingClientRect().height, loaded: el.shadowRoot.querySelector('.frame img').naturalWidth > 0
              }));
              assert.ok(access.h > 100 && access.loaded, 'missing access photo');
              await page.locator('footer').scrollIntoViewIfNeeded();
              await page.locator('footer [data-footer-logo]').evaluate(img => img.decode());
              await page.evaluate(() => scrollTo(0, 0));
              if ([390, 834, 1024, 1440].includes(width)) await page.screenshot({ path: output + '/' + width + '-valongo-' + (english ? 'en' : 'pt') + '.png', fullPage: true });
            }
            const layout = await page.evaluate(() => {
              const header = document.querySelector('[data-bg-headerbar]').getBoundingClientRect();
              const logo = document.querySelector('[data-bg-headerlogo]').getBoundingClientRect();
              const sections = [...document.querySelectorAll('main > section, footer')].filter(el => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && (r.x < -1 || r.right > innerWidth + 1);
              }).map(el => el.dataset.screenLabel || el.tagName);
              return { width: document.documentElement.scrollWidth, sections, logoInside: logo.top >= header.top && logo.bottom <= header.bottom };
            });
            assert.ok(layout.width <= width + 1, 'horizontal page overflow');
            assert.deepEqual(layout.sections, [], 'section content clipped offscreen');
            assert.ok(layout.logoInside, 'logo exceeds header');
            assert.deepEqual(errors, []);
            results.push({ width, route, status: 'pass' });
          }
          console.log('Tablet/artwork QA passed: ' + width + 'px ' + (english ? 'EN' : 'PT'));
        } catch (e) {
          failures.push({ width, english, error: e.message, errors });
        } finally { await page.close(); }
      }));
    }
  } finally { await browser.close(); }
  fs.writeFileSync(output + '/tablet-results.json', JSON.stringify({ base, results, failures }, null, 2));
  console.log(JSON.stringify({ passed: results.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
