const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const schema = require('../lead-config.js');
const routes = { builtByBest: '/built-by-best/candidatura', personalTrainer: '/personal-trainers/candidatura', saoJoaoVip: '/lista-vip-sao-joao-da-madeira', franchising: '/franchising', contact: '/contactos' };
const englishRoutes = { builtByBest: '/en/built-by-best/apply', personalTrainer: '/en/personal-trainers/apply', saoJoaoVip: '/en/gyms/sao-joao-da-madeira/vip', franchising: '/en/franchising', contact: '/en/contacts' };
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }); const results = [];
  for (const width of [390, 430, 768, 1440]) {
    for (const english of [false, true]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: width < 1000, isMobile: width < 1000 });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      for (const type of Object.keys(routes)) {
        let submitted = null, state = 'failure';
        await page.route('**/api/leads*', async route => {
          if (route.request().method() === 'GET') return route.fulfill({ json: { ready: true } });
          submitted = route.request().postDataJSON();
          return route.fulfill({ status: state === 'failure' ? 503 : 200, json: state === 'failure' ? { ok: false } : { ok: true, id: 'qa-confirmed-provider-id' } });
        });
        await page.goto('http://127.0.0.1:4173' + (english ? englishRoutes[type] : routes[type]));
        const host = page.locator('best-lead-form'); const form = host.locator('form');
        await form.waitFor();
        const def = schema.forms[type];
        await host.locator(def.steps ? '[data-next]' : '[type=submit]').click();
        assert.equal(await host.locator('[name=name]').getAttribute('aria-invalid'), 'true');
        assert.equal(await host.locator('[name=name]').evaluate(el => el.getRootNode().activeElement === el), true);
        for (let step = 0; step < (def.steps ? 2 : 1); step++) {
          for (const field of def.fields.filter(f => (f.step || 0) === step)) {
            const input = host.locator('[name="' + field.name + '"]');
            if (field.options) await input.selectOption(field.options[0][0]);
            else await input.fill(field.type === 'email' ? 'qa@example.com' : field.type === 'tel' ? '+351 900 000 000' : field.type === 'number' ? '25' : field.type === 'date' ? '' : 'QA synthetic data');
          }
          if (def.steps) {
            if (step === 0) {
              await host.locator('[name=email]').fill('invalid'); await host.locator('[data-next]').click();
              assert.equal(await host.locator('[name=email]').getAttribute('aria-invalid'), 'true');
              await host.locator('[name=email]').fill('qa@example.com');
              if (width < 1000) assert.equal(await page.locator('[data-bg-mobilecta]').isVisible(), false, 'sticky CTA overlaps focused form');
            }
            await host.locator('[data-next]').click();
          }
        }
        if (def.steps) {
          assert.ok((await host.locator('[data-review]').innerText()).includes('qa@example.com'));
          await host.locator('[data-back]').click(); await host.locator('[data-back]').click();
          assert.equal(await host.locator('[name=name]').inputValue(), 'QA synthetic data');
          await host.locator('[data-next]').click(); await host.locator('[data-next]').click();
        }
        await host.locator('[type=submit]').click();
        assert.equal(submitted, null, 'submitted without consent');
        await host.locator('[name=privacy]').check();
        await host.locator('[type=submit]').click();
        await host.locator('[data-form-status]').waitFor();
        assert.equal(await host.locator('.bg-form-success').isVisible(), false, 'false success after error');
        assert.equal(await host.locator('[name=name]').inputValue(), 'QA synthetic data');
        const firstId = submitted.requestId;
        if (def.recipientKey && !schema[def.recipientKey]) assert.equal(await host.locator('[data-form-status] a').count(), 0, 'invented recipient');
        else assert.ok((await host.locator('[data-form-status] a').getAttribute('href')).startsWith('mailto:'));
        state = 'success'; await host.locator('[type=submit]').click();
        await host.locator('.bg-form-success').waitFor({ state: 'visible' });
        assert.equal(submitted.requestId, firstId, 'retry changed idempotency ID');
        assert.ok((await host.locator('.bg-form-success').innerText()).includes('qa-confirmed-provider-id'));
        if (english) assert.ok(!/Campos obrigatórios|Preenche|Candidatura recebida|Enviar|Nome completo|Política de/.test(await host.evaluate(el => el.shadowRoot.textContent)));
        assert.deepEqual(errors, []); results.push({ type, width, language: english ? 'en' : 'pt-PT', status: 'pass' });
        await page.unroute('**/api/leads*');
      }
      await page.close(); console.log('Form flows passed at ' + width + 'px / ' + (english ? 'EN' : 'PT'));
    }
  }
  await browser.close(); fs.writeFileSync('.codex-work/form-results.json', JSON.stringify(results, null, 2)); console.log('Passed ' + results.length + ' complete form flows with mocked transport; no live emails sent.');
})().catch(error => { console.error(error); process.exit(1); });
