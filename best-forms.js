/* Native, portable forms. DC renders the host; input values stay in the DOM. */
(function () {
  'use strict';
  if (customElements.get('best-lead-form')) return;
  var config = window.BGLeadsConfig;
  var en = !!(window.BGPageLocale && window.BGPageLocale.english);
  var ix = en ? 1 : 0;
  var copy = {
    required: ['Preenche este campo.', 'Please complete this field.'],
    email: ['Indica um e-mail válido.', 'Enter a valid email address.'],
    phone: ['Indica um telefone válido.', 'Enter a valid phone number.'],
    consent: ['É necessário aceitar a utilização dos dados.', 'Please consent to the use of your data.'],
    check: ['Revê os campos assinalados.', 'Please check the highlighted fields.'],
    unavailable: ['O envio online está temporariamente indisponível. Os teus dados não foram enviados.', 'Online submission is temporarily unavailable. Your details have not been sent.'],
    failure: ['Não foi possível confirmar o envio. Os dados foram mantidos; podes tentar novamente.', 'We could not confirm submission. Your details have been kept; you can try again.'],
    emailFallback: ['Continuar no meu programa de e-mail', 'Continue in my email app'],
    emailNote: ['O envio só fica concluído depois de enviares a mensagem no teu programa de e-mail.', 'Submission is only complete after you send the message in your email app.'],
    next: ['Continuar', 'Continue'], back: ['Voltar', 'Back'], sending: ['A enviar…', 'Sending…'],
    privacy: ['Li a Política de Privacidade e autorizo a utilização dos meus dados para este contacto.', 'I have read the Privacy Policy and consent to the use of my details for this enquiry.'],
    policy: ['Política de Privacidade', 'Privacy Policy'], choose: ['Seleciona uma opção', 'Choose an option'],
    note: ['* Campos obrigatórios. Os dados são utilizados para tratar este pedido.', '* Required fields. Your details are used to process this enquiry.'],
    review: ['Confirma os teus dados', 'Review your details'], reference: ['Referência', 'Reference'],
    upload: ['Anexe o seu currículo', 'Upload your CV'],
    replaceFile: ['Substituir currículo', 'Replace CV'],
    removeFile: ['Remover ficheiro', 'Remove file'],
    fileRequired: ['Anexa o teu currículo em PDF ou DOCX.', 'Upload your CV as a PDF or DOCX file.'],
    fileType: ['Seleciona um ficheiro PDF ou DOCX.', 'Choose a PDF or DOCX file.'],
    fileLarge: ['O ficheiro excede o limite de 5 MB.', 'The file exceeds the 5 MB limit.'],
    fileInvalid: ['O ficheiro não é um PDF ou DOCX válido. Seleciona outro currículo.', 'The file is not a valid PDF or DOCX document. Choose another CV.'],
    confirmationFailure: ['A candidatura foi recebida, mas o e-mail de confirmação não foi confirmado. Podes voltar a tentar.', 'Your application was received, but the confirmation email could not be confirmed. You can try again.']
  };
  function t(key) { return copy[key][ix]; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function optionLabel(option) { return option.length === 3 ? option[ix + 1] : option[ix]; }
  var titles = { contact: ['Contacto BEST GYM', 'Contact BEST GYM'], saoJoaoVip: ['Lista VIP São João da Madeira', 'São João da Madeira VIP list'], franchising: ['Franchising', 'Franchising'] };

  class BestLeadForm extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;
      this.root = this.attachShadow({ mode: 'open' });
      this.kind = this.getAttribute('form-type');
      this.definition = config && config.forms[this.kind];
      if (!this.definition) { this.textContent = t('unavailable'); return; }
      this.step = 0;
      this.requestId = null;
      var def = this.definition;
      var count = def.steps ? def.steps.length : 1;
      const privacyLink = '<a href="' + (en ? '/en/privacy' : '/privacidade') + '" target="_blank" rel="noopener noreferrer">' + t('policy') + '</a>';
      const consentCopy = def.consent ? esc(def.consent[ix]).replace(t('policy'), privacyLink) : t('privacy') + ' ' + privacyLink;
      var fields = def.fields.map((field, index) => {
        var id = 'bg-' + this.kind + '-' + field.name;
        var attrs = ' id="' + id + '" name="' + field.name + '"' + (field.required ? ' required' : '') +
          ' aria-describedby="' + id + '-error"' + (field.autocomplete ? ' autocomplete="' + field.autocomplete + '"' : '') +
          (field.max ? ' maxlength="' + field.max + '"' : '') + (field.inputmode ? ' inputmode="' + field.inputmode + '"' : '');
        var control;
        if (field.type === 'file') {
          return '<div class="bg-field bg-field--wide" data-field-step="0"><label for="' + id + '"><span>' + esc(field.label[ix]) + ' *</span></label>' +
            '<div class="bg-file-picker"><input' + attrs.replace('-error"', '-help ' + id + '-error"') + ' class="bg-file-input" type="file" accept="' + esc(field.accept) + '">' +
            '<label for="' + id + '" class="bg-button bg-button--outline" data-file-label>' + t('upload') + '</label></div>' +
            '<span class="bg-file-help" id="' + id + '-help">' + esc(field.help[ix]) + '</span>' +
            '<div class="bg-file-selection" data-file-selection hidden><span data-file-name role="status"></span><button type="button" data-file-remove>' + t('removeFile') + '</button></div>' +
            '<span class="bg-field-error" id="' + id + '-error" aria-live="polite"></span></div>';
        }
        if (field.type === 'select') control = '<select' + attrs + '><option value="">' + esc(field.placeholder ? field.placeholder[ix] : t('choose')) + '</option>' + field.options.map(function (option) { return '<option value="' + esc(option[0]) + '">' + esc(optionLabel(option)) + '</option>'; }).join('') + '</select>';
        else if (field.type === 'textarea') control = '<textarea' + attrs + ' rows="5"></textarea>';
        else control = '<input' + attrs + ' type="' + field.type + '"' + (field.min != null ? ' min="' + field.min + '" max="' + field.maxValue + '" step="1"' : '') + '>';
        return '<label class="bg-field' + (field.type === 'textarea' || field.wide ? ' bg-field--wide' : '') + '" data-field-step="' + (field.step || 0) + '" for="' + id + '"><span>' + esc(field.label[ix]) + (field.required ? ' *' : '') + '</span>' + control + '<span class="bg-field-error" id="' + id + '-error" aria-live="polite"></span></label>';
      }).join('');
      this.root.innerHTML = '<link rel="stylesheet" href="/best-forms.css"><form class="bg-form" novalidate>' +
        (def.steps ? '<nav class="bg-form-steps" aria-label="' + (en ? 'Application steps' : 'Etapas da candidatura') + '">' + def.steps.map(function (label, i) { return '<span data-step-label="' + i + '">' + (i + 1) + ' / ' + esc(label[ix]) + '</span>'; }).join('') + '</nav>' : '') +
        '<fieldset><legend data-form-legend>' + esc(def.steps ? def.steps[0][ix] : this.title()) + '</legend><div class="bg-form-grid">' + fields + '</div></fieldset>' +
        '<section data-review hidden><h3>' + t('review') + '</h3><dl class="bg-form-review"></dl></section>' +
        '<div data-consent' + (count > 1 ? ' hidden' : '') + '><label class="bg-consent"><input type="checkbox" name="privacy" required aria-describedby="bg-' + this.kind + '-privacy-error"><span>' + consentCopy + ' *</span></label><span class="bg-field-error" id="bg-' + this.kind + '-privacy-error" aria-live="polite"></span></div>' +
        '<label class="bg-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>' +
        '<p class="bg-form-note">' + t('note') + '</p><div class="bg-form-status" data-form-status role="status" aria-live="polite" hidden></div>' +
        '<div class="bg-form-actions"><button class="bg-button bg-button--outline" data-back type="button" hidden>' + t('back') + '</button><button class="bg-button" data-next type="button"' + (count === 1 ? ' hidden' : '') + '>' + t('next') + ' →</button><button class="bg-button" type="submit"' + (count > 1 ? ' hidden' : '') + '>' + esc(def.submit[ix]) + '</button></div></form>' +
        '<section class="bg-form-success" tabindex="-1" hidden><span class="bg-eyebrow">BEST GYM</span><h2>' + esc(def.success[ix]) + '</h2><p>' + esc(def.support[ix]) + '</p><p data-reference></p></section>';
      this.form = this.root.querySelector('form');
      this.form.addEventListener('submit', (event) => { event.preventDefault(); this.submit(); });
      this.root.querySelector('[data-next]').addEventListener('click', () => { if (this.validate(this.step)) this.setStep(this.step + 1); });
      this.root.querySelector('[data-back]').addEventListener('click', () => this.setStep(this.step - 1));
      this.form.addEventListener('input', (event) => { this.clearError(event.target); });
      this.form.addEventListener('change', (event) => {
        this.clearError(event.target);
        if (event.target.type === 'file') this.updateFile(event.target);
      });
      const remove = this.root.querySelector('[data-file-remove]');
      if (remove) remove.addEventListener('click', () => {
        const input = this.form.elements.cv;
        input.value = ''; this.clearError(input); this.updateFile(input); input.focus();
      });
      this.form.addEventListener('focusin', () => document.documentElement.classList.add('bg-form-focused'));
      this.form.addEventListener('focusout', () => setTimeout(() => {
        if (!document.activeElement || !document.activeElement.closest('best-lead-form')) document.documentElement.classList.remove('bg-form-focused');
      }, 80));
      this.setStep(0, false);
      fetch(config.endpoint + '?type=' + encodeURIComponent(this.kind), { headers: { Accept: 'application/json' }, cache: 'no-store' })
        .then(function (response) { if (!response.ok) throw Error(); return response.json(); })
        .then((result) => { if (!result.ready) this.status(t('unavailable')); }).catch(() => this.status(t('unavailable')));
    }
    disconnectedCallback() { document.documentElement.classList.remove('bg-form-focused'); }
    clearError(input) {
      if (!input || !input.name) return;
      input.removeAttribute('aria-invalid');
      var error = this.root.querySelector('#bg-' + this.kind + '-' + input.name + '-error');
      if (error) error.textContent = '';
    }
    fileError(input) {
      const file = input.files[0];
      if (!file) return t('fileRequired');
      if (file.size > this.definition.fields.find(field => field.name === input.name).maxBytes) return t('fileLarge');
      if (!file.size) return t('fileInvalid');
      const ext = file.name.split('.').at(-1).toLowerCase();
      const types = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
      if (!Object.hasOwn(types, ext) || (file.type && file.type !== types[ext])) return t('fileType');
      return '';
    }
    updateFile(input) {
      const file = input.files[0];
      this.root.querySelector('[data-file-selection]').hidden = !file;
      this.root.querySelector('[data-file-name]').textContent = file ? file.name : '';
      this.root.querySelector('[data-file-label]').textContent = file ? t('replaceFile') : t('upload');
      const error = file ? this.fileError(input) : '';
      if (error) {
        input.setAttribute('aria-invalid', 'true');
        this.root.querySelector('#bg-' + this.kind + '-cv-error').textContent = error;
      }
    }
    validate(step) {
      var first = null;
      var specs = this.definition.fields.filter(function (f) { return step == null || (f.step || 0) === step; });
      specs.forEach((field) => {
        var input = this.form.elements.namedItem(field.name);
        this.clearError(input);
        var value = input.value.trim();
        var message = '';
        if (field.type === 'file') message = this.fileError(input);
        else if (field.required && !value) message = t('required');
        else if (value && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) message = t('email');
        else if (value && field.type === 'tel' && (!/^[+\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length < 7)) message = t('phone');
        else if (!input.validity.valid) message = t('check');
        if (message) { input.setAttribute('aria-invalid', 'true'); this.root.querySelector('#bg-' + this.kind + '-' + field.name + '-error').textContent = message; if (!first) first = input; }
      });
      var finalStep = this.definition.steps ? this.definition.steps.length - 1 : 0;
      if ((step == null || step === finalStep) && !this.form.elements.privacy.checked) {
        this.form.elements.privacy.setAttribute('aria-invalid', 'true');
        this.root.querySelector('#bg-' + this.kind + '-privacy-error').textContent = t('consent');
        if (!first) first = this.form.elements.privacy;
      }
      if (first) {
        var spec = this.definition.fields.find(function (field) { return field.name === first.name; });
        if (spec && (spec.step || 0) !== this.step) this.setStep(spec.step || 0, false);
        if (first === this.form.elements.privacy && this.step !== finalStep) this.setStep(finalStep, false);
        first.focus({ preventScroll: true }); first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      return true;
    }
    setStep(step, focus) {
      var def = this.definition, count = def.steps ? def.steps.length : 1;
      this.step = Math.max(0, Math.min(step, count - 1));
      this.root.querySelectorAll('[data-field-step]').forEach((el) => { el.hidden = Number(el.getAttribute('data-field-step')) !== this.step; });
      this.root.querySelectorAll('[data-step-label]').forEach((el) => { if (Number(el.getAttribute('data-step-label')) === this.step) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
      var finalStep = this.step === count - 1;
      this.root.querySelector('[data-back]').hidden = this.step === 0;
      this.root.querySelector('[data-next]').hidden = finalStep;
      this.root.querySelector('[type="submit"]').hidden = !finalStep;
      this.root.querySelector('[data-consent]').hidden = !finalStep;
      this.root.querySelector('[data-review]').hidden = !(def.steps && finalStep);
      this.root.querySelector('[data-form-legend]').textContent = def.steps ? def.steps[this.step][ix] : this.title();
      if (def.steps && finalStep) this.root.querySelector('.bg-form-review').innerHTML = def.fields.map((field) => {
        var input = this.form.elements.namedItem(field.name);
        var value = input.type === 'select-one' && input.value ? input.selectedOptions[0].textContent : input.value.trim();
        return '<div><dt>' + esc(field.label[ix]) + '</dt><dd>' + esc(value || '—') + '</dd></div>';
      }).join('');
      if (focus !== false) { var legend = this.root.querySelector('[data-form-legend]'); legend.tabIndex = -1; legend.focus({ preventScroll: true }); legend.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    status(message, fallback) {
      var box = this.root.querySelector('[data-form-status]');
      box.hidden = false; box.textContent = message;
      if (fallback) {
        var a = document.createElement('a'); a.href = fallback; a.textContent = t('emailFallback'); box.appendChild(document.createElement('br')); box.appendChild(a);
        var note = document.createElement('p'); note.textContent = t('emailNote'); box.appendChild(note);
      }
    }
    title() {
      return titles[this.kind]?.[ix] || (en && this.definition.titleEn) || this.definition.title;
    }
    fallback(data) {
      var recipient = this.kind === 'contact' ? config.contactRecipients[data.unit] : config[this.definition.recipientKey];
      if (!recipient) return null;
      var body = this.definition.fields.map(function (field) {
        var value = data[field.name];
        var option = en && field.options?.find(function (item) { return item[0] === value; });
        return field.label[ix] + ': ' + (option ? optionLabel(option) : value || '—');
      });
      body.push('', en ? 'Consent: accepted' : 'Consentimento: aceite', (en ? 'Source: ' : 'Origem: ') + location.href);
      return 'mailto:' + recipient + '?subject=' + encodeURIComponent('[BEST GYM] ' + this.title() + ' — ' + data.name) + '&body=' + encodeURIComponent(body.join('\n'));
    }
    async submit() {
      if (this.sending || !this.validate(null)) return;
      var data = Object.fromEntries(new FormData(this.form)); data.privacy = this.form.elements.privacy.checked;
      var button = this.root.querySelector('[type="submit"]');
      this.sending = true; this.form.setAttribute('aria-busy', 'true'); button.disabled = true; button.textContent = t('sending');
      try {
        if (this.kind === 'careers') {
          const file = this.form.elements.cv.files[0];
          const content = await new Promise((resolve, reject) => {
            const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file);
          });
          data.cv = { name: file.name, type: file.type, size: file.size, content };
        }
        var signature = JSON.stringify(data);
        if (this.signature !== signature) { this.requestId = crypto.randomUUID(); this.signature = signature; this.submittedAt = new Date().toISOString(); }
        const payload = { type: this.kind, language: en ? 'en' : 'pt-PT', data: data, requestId: this.requestId };
        if (this.kind === 'careers') payload.submittedAt = this.submittedAt;
        var response = await fetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(this.kind === 'careers' ? 40000 : 20000) });
        var result = await response.json();
        if (!response.ok || result.ok !== true || !result.id) {
          const fileMessage = { file_required: 'fileRequired', file_too_large: 'fileLarge', file_type: 'fileType', file_invalid: 'fileInvalid' }[result.code];
          if (fileMessage && this.form.elements.cv) {
            const input = this.form.elements.cv; input.setAttribute('aria-invalid', 'true');
            this.root.querySelector('#bg-' + this.kind + '-cv-error').textContent = t(fileMessage); input.focus();
          }
          this.status(fileMessage ? t(fileMessage) : result.code === 'confirmation_not_confirmed' ? t('confirmationFailure') : response.status === 503 ? t('unavailable') : t('failure'), this.fallback(data)); return;
        }
        this.form.hidden = true;
        var success = this.root.querySelector('.bg-form-success'); success.hidden = false;
        this.root.querySelector('[data-reference]').textContent = t('reference') + ': ' + result.id;
        document.documentElement.classList.remove('bg-form-focused'); success.focus({ preventScroll: true }); success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (_) { this.status(t('failure'), this.fallback(data)); }
      finally { this.sending = false; this.form.removeAttribute('aria-busy'); button.disabled = false; button.textContent = this.definition.submit[ix]; }
    }
  }
  customElements.define('best-lead-form', BestLeadForm);
})();
