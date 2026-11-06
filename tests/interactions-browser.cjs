const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }); const results = [];
  for (const width of [390, 430, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: width < 1000, isMobile: width < 1000 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/?popup=1');
    const popup = page.locator('#bestgym-campaign-popup-v2'); await popup.waitFor({ state: 'visible' });
    assert.match(await popup.innerText(), /14,90€/);
    assert.match(await popup.innerText(), /4 meses/i);
    assert.equal(await popup.locator('[data-campaign-cta="primary"]').getAttribute('href'), '/inscricao');
    const box = await popup.locator(':scope > div').boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width + 1 && box.y >= 0 && box.y + box.height <= 901, 'popup clipping');
    assert.ok(Math.abs(box.y + box.height / 2 - 450) < 25, 'popup not centered');
    await page.keyboard.press('Escape'); await popup.waitFor({ state: 'detached' });
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflowY), 'hidden');
    const visibleSlides = () => page.locator('[data-hero-slide]').evaluateAll(slides => slides.filter(el => getComputedStyle(el).visibility !== 'hidden' && Number(getComputedStyle(el).opacity) > 0).length);
    assert.equal(await visibleSlides(), 1);
    await page.getByRole('button', { name: 'Slide seguinte', exact: true }).click(); await page.waitForTimeout(120);
    assert.equal(await visibleSlides(), 1, 'overlapping hero slides');
    if (width < 1000) assert.equal(await page.locator('canvas.best-cursor-spotlight').count(), 0);
    else { await page.mouse.move(500, 400); assert.equal(await page.locator('canvas.best-cursor-spotlight').count(), 1); }
    const marquee = page.locator('section[data-screen-label="Marquee"] > div');
    const before = await marquee.evaluate(el => getComputedStyle(el).transform); await page.waitForTimeout(250);
    assert.notEqual(await marquee.evaluate(el => getComputedStyle(el).transform), before, 'static marquee');
    const rail = page.locator('.best-stack-v2'); await rail.scrollIntoViewIfNeeded();
    const dot = page.locator('.best-stack-v2-dot[aria-current="true"]');
    const oldIndex = await dot.getAttribute('aria-label');
    await page.locator('.best-stack-v2-btn').last().click(); await page.waitForTimeout(600);
    assert.notEqual(await dot.getAttribute('aria-label'), oldIndex, 'carousel arrow failed');
    const dragStart = await page.locator('[aria-label="Áreas de treino — carrossel"]').evaluate(el => {
      const r = el.getBoundingClientRect();
      for (let fy = .05; fy < .85; fy += .05) for (let fx = .8; fx > .2; fx -= .05) {
        const x = r.x + r.width * fx, y = r.y + r.height * fy;
        const hit = document.elementFromPoint(x, y);
        if (hit && el.contains(hit) && !hit.closest('.best-stack-v2-nav,a,button,input,select,textarea,image-slot,x-import,[contenteditable="true"]')) return { x, y, endX: Math.max(r.x + 5, x - Math.min(350, r.width * .55)) };
      }
      return null;
    });
    assert.ok(dragStart, 'no safe drag surface');
    const dragBefore = await dot.getAttribute('aria-label');
    await page.mouse.move(dragStart.x, dragStart.y);
    await page.mouse.down(); await page.mouse.move(dragStart.endX, dragStart.y, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(600);
    assert.notEqual(await dot.getAttribute('aria-label'), dragBefore, 'carousel drag failed');
    const productRail = page.locator('[data-home-products-rail]'); await productRail.scrollIntoViewIfNeeded();
    const product = await productRail.evaluate(el => { const before=el.scrollLeft; el.scrollLeft += 260; return { before, after:el.scrollLeft, scroll:el.scrollWidth, width:el.clientWidth }; });
    if (width < 1000) assert.ok(product.scroll > product.width && product.after > product.before, 'product rail not scrollable');
    assert.equal(await page.locator('[data-campaign-copy] [data-campaign-cta-row] a').count(), 1, 'home campaign has secondary action');
    await page.locator('footer').scrollIntoViewIfNeeded(); assert.ok(await page.evaluate(() => scrollY > innerHeight));
    assert.equal(await page.locator('.bless-credit').count(), 1);
    await page.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }); await page.waitForTimeout(300);
    const menu = page.locator('button[aria-label="Abrir menu"]'); await menu.click();
    await page.waitForTimeout(300); await page.locator('button[aria-label="Fechar menu"]').click();
    await page.waitForTimeout(300);
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflowY), 'hidden');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: '.codex-work/home-' + width + '-viewport.png' });
    results.push({ width, status: 'pass', popup: true, hero: true, marquee: true, arrows: true, drag: true, products: true, menu: true, footer: true });
    await page.close(); console.log('Interactions passed at ' + width + 'px');
  }
  await browser.close(); fs.writeFileSync('.codex-work/interaction-results.json', JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
