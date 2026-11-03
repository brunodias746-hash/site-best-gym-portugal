/* Client-confirmed unit order, destinations and real media. No live email is sent. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || '.codex-work';
const signup = 'https://subscribe.mvf.pt/signup/bestgym';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of [390, 768, 1024, 1440]) for (const english of [false, true]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, hasTouch: width < 1000, isMobile: width < 1000 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    async function open(pt, en) {
      await page.goto(base + (english ? en : pt), { waitUntil: 'networkidle' });
      await page.waitForSelector('footer');
      await page.evaluate(() => { window.dispatchEvent(new CustomEvent('bestgym:close-popup')); });
    }
    await open('/unidades', '/en/gyms');
    assert.deepEqual(await page.locator('main article[data-unit]').evaluateAll(cards => cards.map(card => card.dataset.unit)), ['famalicao', 'valongo', 'sao-joao']);
    const labels = await page.locator('main article[data-unit]').evaluateAll(cards => cards.map(card => card.textContent.replace(/\s+/g, ' ')));
    assert.match(labels[0], /01/); assert.match(labels[1], /02/); assert.match(labels[2], /03.*(Em breve|Coming soon)/i);
    await open('/inscricao', '/en/join');
    assert.deepEqual(await page.locator('[data-unit]').evaluateAll(cards => cards.map(card => card.dataset.unit)), ['famalicao', 'valongo']);
    assert.deepEqual(await page.locator('[data-official-signup]').evaluateAll(links => links.map(link => link.href)), [signup, signup]);
    const footerContacts = await page.locator('footer a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
    assert.ok(footerContacts.indexOf('mailto:famalicao@bestgym.pt') < footerContacts.indexOf('mailto:valongo@bestgym.pt'));
    await open('/contactos', '/en/contacts');
    const units = page.locator('best-lead-form select[name=unit] option');
    assert.deepEqual(await units.evaluateAll(options => options.filter(o => o.value).map(o => o.value)), ['famalicao', 'valongo']);
    await open('/lista-vip-sao-joao-da-madeira', '/en/gyms/sao-joao-da-madeira/vip');
    const phone = page.locator('best-lead-form [name=phone]');
    await phone.waitFor();
    assert.equal(await phone.evaluate(input => input.labels[0].textContent.replace('*', '').trim()), english ? 'Mobile phone' : 'Telemóvel');
    for (const [pt, en, unit] of [['/unidade-famalicao', '/en/gyms/famalicao', 'famalicao'], ['/unidade-valongo', '/en/gyms/valongo', 'valongo'], ['/unidade-sao-joao-da-madeira', '/en/gyms/sao-joao-da-madeira', 'sao-joao']]) {
      await open(pt, en);
      await page.locator('footer').scrollIntoViewIfNeeded();
      for (const img of await page.locator('main img[src*="assets/img/units/"]:visible').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(element => element.decode());
      }
      const photos = await page.locator('main img[src*="assets/img/units/"]:visible').evaluateAll(images => images.map(img => {
        const box = img.getBoundingClientRect();
        return { src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0, ratio: box.width / box.height, natural: img.naturalWidth / img.naturalHeight, alt: img.alt, native: img.hasAttribute('data-en-alt') };
      }));
      assert.ok(photos.length >= (unit === 'sao-joao' ? 2 : 3));
      for (const photo of photos) {
        assert.ok(photo.loaded, photo.src);
        assert.ok(photo.src.includes('/' + unit + '-'), 'wrong unit photo');
        // DC image slots intentionally crop cover images. Native gallery/prelaunch images retain their ratio.
        if (photo.native) {
          assert.ok(photo.alt);
          assert.ok(Math.abs(photo.ratio - photo.natural) < .01, 'distorted photo: ' + photo.src);
        }
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(500);
      if (width === 390 || width === 1440) await page.screenshot({ path: output + '/unit-' + unit + '-' + width + (english ? '-en' : '') + '.png', fullPage: true });
    }
    assert.deepEqual(errors, []);
    results.push({ width, language: english ? 'en' : 'pt', ok: true });
    await page.close();
  }
  await browser.close();
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(output + '/units-qa.json', JSON.stringify(results, null, 2));
  console.log('Unit order, official signup, VIP label and photo QA passed:', results.length, 'viewport/language combinations.');
})().catch(error => { console.error(error); process.exit(1); });
