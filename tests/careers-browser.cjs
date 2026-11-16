/* Full UI -> real validation/email composition -> intercepted provider.
   Never sends real email. Run after build and local preview. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { processLead } = require('../lib/lead-handler.cjs');
const { cv } = require('./helpers/cv-fixtures.cjs');
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.QA_OUTPUT || '.codex-work/careers-qa';
fs.mkdirSync(out, { recursive: true });
const upload = kind => { const f = cv(kind); return { name: f.name, mimeType: f.type, buffer: Buffer.from(f.content, 'base64') }; };
const widths = [390, 430, 768, 820, 834, 1024, 1440, 1680, 1920];
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [], failures = [];
  try {
    for (const width of widths) for (const en of [false, true]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: width <= 1024, isMobile: width <= 1024 });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/status of (?:400|502)/.test(m.text())) errors.push(m.text()); });
      let state = 'internal-fail', posted = null, sent = [];
      await page.route('**/api/leads*', async route => {
        if (route.request().method() === 'GET') return route.fulfill({ json: { ready: true } });
        posted = route.request().postDataJSON(); sent = [];
        if (state === 'file-invalid') return route.fulfill({ status: 400, json: { ok: false, code: 'file_invalid', field: 'cv' } });
        const result = await processLead(posted, {
          env: { RESEND_API_KEY: 'local-intercept-only', FORM_EMAIL_FROM: 'test@example.invalid' },
          fetcher: async (url, request) => {
            assert.equal(url, 'https://api.resend.com/emails'); sent.push(JSON.parse(request.body));
            const ok = state === 'success' || (state === 'confirmation-fail' && sent.length === 1);
            return { ok, json: async () => ok ? { id: 'intercepted-provider-' + sent.length } : { error: 'controlled failure' } };
          }
        });
        await route.fulfill({ status: result.status, json: result.body });
      });
      try {
        await page.goto(base + (en ? '/en/work-with-us' : '/trabalhe-connosco'), { waitUntil: 'networkidle' });
        const host = page.locator('best-lead-form'), submit = host.locator('[type=submit]'), input = host.locator('[name=cv]');
        await host.locator('form').waitFor(); await page.locator('footer').waitFor();
        assert.equal(await page.locator('[data-bg-desknav]').isVisible(), width >= 1680);
        await page.locator('[data-bg-menu-trigger]').click();
        const links = await page.locator('[data-bg-drawernav] a').allTextContents();
        const normalize = s => s.trim().replace(/\s+/g, ' ').toLowerCase();
        const labels = links.map(normalize), about = labels.indexOf(en ? 'about' : 'sobre');
        assert.ok(about >= 0, labels.join('|'));
        assert.equal(labels[about + 1], en ? 'work with us' : 'trabalhe connosco');
        assert.equal(labels[about + 2], en ? 'contacts' : 'contactos');
        const careersLink = page.locator('[data-bg-drawernav] a').filter({ hasText: en ? 'Work With Us' : 'Trabalhe Connosco' });
        assert.equal(await careersLink.getAttribute('href'), en ? '/en/work-with-us' : '/trabalhe-connosco');
        await page.keyboard.press('Escape');
        if (width >= 1680) {
          const boxes = await page.locator('[data-bg-desknav], [data-bg-headeractions], [data-bg-headerlogo]').evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right }; }));
          boxes.sort((a,b) => a.left-b.left);
          for (let i=1;i<boxes.length;i++) assert.ok(boxes[i].left >= boxes[i-1].right - 1, 'desktop header overlap');
          assert.equal(await page.locator('[data-bg-desknav] a').evaluateAll(links => links.some(a => a.scrollWidth > a.clientWidth + 1)), false, 'clipped desktop label');
        }
        assert.equal(await page.locator('.bless-credit').count(), 0);
        assert.ok((await page.locator('link[rel=icon]').getAttribute('href')).includes('favicon-best-gym-square-v1.png'));
        assert.ok((await page.locator('[data-bg-headerlogo]').getAttribute('src')).includes('logo-'));
        const layout = await host.evaluate(el => {
          const r = el.shadowRoot, rect = selector => { const b = r.querySelector(selector).getBoundingClientRect(); return { left: b.left, width: b.width, top: b.top }; };
          return { total: document.documentElement.scrollWidth, grid: rect('.bg-form-grid'), name: rect('[name=name]'), email: rect('[name=email]'), cv: rect('.bg-file-picker'), message: rect('[name=message]') };
        });
        assert.ok(layout.total <= width + 1, 'horizontal overflow');
        assert.ok(Math.abs(layout.message.width - layout.grid.width) < 2, 'message not full width');
        if (width <= 430) assert.ok(layout.email.top > layout.name.top, 'mobile fields not single column');
        assert.ok(await input.getAttribute('required') !== null);
        const described = await input.getAttribute('aria-describedby'); assert.ok(described.includes('-help') && described.includes('-error'));
        assert.equal(await host.locator('[data-consent] a').getAttribute('href'), en ? '/en/privacy' : '/privacidade');
        await submit.click(); assert.equal(posted, null);
        assert.equal(await host.locator('[name=name]').getAttribute('aria-invalid'), 'true');
        await host.locator('[name=name]').fill('TESTE TECNICO — ignorar candidatura');
        await host.locator('[name=email]').fill('qa@example.invalid');
        await host.locator('[name=phone]').fill('+351 900 000 000');
        await host.locator('[name=unit]').selectOption('valongo');
        await host.locator('[name=role]').selectOption('spontaneous');
        await host.locator('[name=message]').fill(en ? 'Controlled local UI test.' : 'Teste local controlado.');
        await input.setInputFiles({ name: 'cv.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('invalid') });
        assert.equal(await input.getAttribute('aria-invalid'), 'true');
        await submit.click(); assert.equal(posted, null);
        await input.setInputFiles({ name: 'cv.pdf', mimeType: 'text/plain', buffer: Buffer.from('invalid') });
        assert.equal(await input.getAttribute('aria-invalid'), 'true');
        await input.setInputFiles({ name: 'empty.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(0) });
        assert.equal(await input.getAttribute('aria-invalid'), 'true');
        await input.setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(5*1024*1024+1) });
        assert.equal(await input.getAttribute('aria-invalid'), 'true');
        assert.match(await host.locator('#bg-careers-cv-error').innerText(), /5 MB/);
        await input.setInputFiles(upload('pdf'));
        assert.equal(await input.getAttribute('aria-invalid'), null);
        assert.equal(await host.locator('[data-file-name]').innerText(), cv('pdf').name);
        await host.locator('[data-file-remove]').click();
        assert.equal(await input.evaluate(el => el.files.length), 0);
        await submit.click(); assert.equal(posted, null);
        await input.setInputFiles(upload('docx'));
        assert.equal(await input.getAttribute('aria-invalid'), null);
        await submit.click(); assert.equal(posted, null, 'submitted without consent');
        await host.locator('[name=privacy]').check();
        state = 'file-invalid'; await submit.click();
        await host.locator('#bg-careers-cv-error').filter({ hasText: en ? 'valid' : 'válido' }).waitFor();
        assert.equal(await host.locator('.bg-form-success').isVisible(), false);
        assert.equal(await host.locator('[name=unit]').inputValue(), 'valongo');
        assert.equal(await input.evaluate(el => el.files[0].name), cv('docx').name);
        await input.setInputFiles(upload('pdf'));
        state = 'internal-fail'; await submit.click();
        await page.waitForFunction(() => document.querySelector('best-lead-form').sending === false);
        assert.equal(await host.locator('.bg-form-success').isVisible(), false);
        assert.equal(sent.length, 1);
        const firstId = posted.requestId;
        state = 'confirmation-fail'; await submit.click();
        await page.waitForFunction(() => document.querySelector('best-lead-form').sending === false);
        assert.equal(sent.length, 2);
        assert.equal(await host.locator('.bg-form-success').isVisible(), false);
        assert.match(await host.locator('[data-form-status]').innerText(), en ? /confirmation email/ : /e-mail de confirmação/);
        assert.equal(await host.locator('[name=name]').inputValue(), 'TESTE TECNICO — ignorar candidatura');
        if ([390,834,1440].includes(width)) await page.screenshot({ path: out + '/' + width + '-' + (en ? 'en' : 'pt') + '.png', fullPage: true });
        state = 'success'; await submit.click();
        await host.locator('.bg-form-success').waitFor({ state: 'visible' });
        assert.equal(posted.requestId, firstId);
        assert.deepEqual(sent[0].to, ['rhvalongo@bestgym.pt']); assert.equal(sent[0].attachments[0].content, cv('pdf').content);
        assert.deepEqual(sent[1].to, ['qa@example.invalid']); assert.equal(sent[1].attachments, undefined);
        assert.match(await host.locator('.bg-form-success h2').innerText(), en ? /Application sent/i : /Candidatura enviada/i);
        if (en) assert.ok(!/Nome completo|Política de|Candidatura espontânea|Anexe|Máximo|Enviar/.test(await host.evaluate(el => el.shadowRoot.textContent)));
        assert.deepEqual(errors, []); results.push({ width, language: en ? 'en' : 'pt-PT', status: 'pass' });
      } catch (error) { failures.push({ width, en, message: error.message, errors }); }
      finally { await page.close(); }
      console.log(JSON.stringify({ width, en, passed: results.length, failed: failures.length }));
    }
  } finally { await browser.close(); }
  fs.writeFileSync(out + '/results.json', JSON.stringify({ base, results, failures, realEmailsSent: 0 }, null, 2));
  if (failures.length) { console.error(failures); process.exitCode = 1; }
})().catch(error => { console.error(error); process.exitCode = 1; });
