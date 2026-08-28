/* BEST GYM — Campaign Popup V2
   Standalone popup appended directly to document.body.
   It is intentionally outside the reactive DC component tree.
*/
(function () {
  'use strict';

  var KEY = 'bestgym_campaign_popup_ferias_off_gym_on_2026_session';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    /* Safety recovery from the previous popup implementation. */
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (document.getElementById('bestgym-campaign-popup-v2')) return;

    var params = new URLSearchParams(window.location.search);
    var forceOpen = params.get('popup') === '1';

    var alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(KEY) === '1';
    } catch (e) {}

    if (alreadySeen && !forceOpen) return;

    var overlay = document.createElement('div');
    overlay.id = 'bestgym-campaign-popup-v2';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Campanha Férias Off. Gym On.');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:3500;display:flex;align-items:center;justify-content:center;' +
      'padding:clamp(14px,3vw,28px);background:rgba(5,6,8,.74);backdrop-filter:blur(10px);' +
      'opacity:0;visibility:hidden;transition:opacity .32s ease,visibility .32s ease;';

    var card = document.createElement('div');
    card.style.cssText =
      'position:relative;width:min(1040px,100%);max-height:92vh;overflow:auto;' +
      'background:var(--paper,#fff);color:var(--ink,#111);border-radius:24px;' +
      'border:1px solid rgba(225,21,7,.22);box-shadow:0 40px 120px rgba(0,0,0,.42);' +
      'transform:translateY(20px) scale(.985);opacity:0;' +
      'transition:transform .38s cubic-bezier(.2,.8,.2,1),opacity .32s ease;';

    card.innerHTML =
      '<button type="button" data-campaign-close aria-label="Fechar campanha" ' +
      'style="position:absolute;z-index:4;top:16px;right:16px;width:44px;height:44px;border-radius:50%;' +
      'border:1px solid var(--line,#ddd);background:var(--surface-1,#fff);color:var(--ink,#111);' +
      'font-size:24px;line-height:1;cursor:pointer;">×</button>' +

      '<div data-popup-grid style="display:grid;grid-template-columns:.94fr 1.06fr;align-items:stretch;">' +

        '<div style="background:linear-gradient(155deg,#0d0e10,#21181a);display:flex;align-items:center;' +
        'justify-content:center;padding:clamp(18px,3vw,30px);">' +
          '<img src="/campanha-ferias-off-gym-on-2026.png" alt="Campanha Férias Off. Gym On. BEST GYM" ' +
          'style="display:block;width:100%;max-width:440px;height:auto;border-radius:14px;' +
          'box-shadow:0 24px 65px rgba(0,0,0,.38);background:#fff;">' +
        '</div>' +

        '<div data-popup-copy style="padding:clamp(30px,4vw,46px);display:flex;flex-direction:column;' +
        'justify-content:center;gap:18px;">' +
          '<span style="font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;' +
          'color:var(--best-red,#E11507);">Campanha de setembro</span>' +
          '<h2 style="margin:0;padding-right:36px;font-family:var(--font-display,sans-serif);font-weight:400;' +
          'font-size:clamp(44px,5.3vw,72px);line-height:.9;text-transform:uppercase;color:var(--ink,#111);">' +
          'Férias Off.<br><span style="color:var(--best-red,#E11507);">Gym On.</span></h2>' +
          '<p style="margin:0;font-size:16.5px;line-height:1.7;color:var(--text-muted,#666);">' +
          'Este setembro, aproveita <strong>50% de desconto por mês até 2027</strong>, ' +
          '<strong>inscrição grátis</strong> e vagas limitadas.</p>' +

          '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">' +
            '<div style="padding:15px;border:1px solid var(--line,#ddd);border-radius:12px;">' +
              '<strong style="display:block;font-family:var(--font-display,sans-serif);font-size:34px;' +
              'font-weight:400;line-height:.9;color:var(--best-red,#E11507);">50%</strong>' +
              '<span style="display:block;margin-top:8px;font-size:10px;font-weight:800;letter-spacing:.1em;' +
              'text-transform:uppercase;color:var(--text-muted,#666);">Desconto</span>' +
            '</div>' +
            '<div style="padding:15px;border:1px solid var(--line,#ddd);border-radius:12px;">' +
              '<strong style="display:block;font-family:var(--font-display,sans-serif);font-size:34px;' +
              'font-weight:400;line-height:.9;">2027</strong>' +
              '<span style="display:block;margin-top:8px;font-size:10px;font-weight:800;letter-spacing:.1em;' +
              'text-transform:uppercase;color:var(--text-muted,#666);">Até 2027</span>' +
            '</div>' +
            '<div style="padding:15px;border:1px solid var(--line,#ddd);border-radius:12px;">' +
              '<strong style="display:block;font-family:var(--font-display,sans-serif);font-size:25px;' +
              'font-weight:400;line-height:.95;">Grátis</strong>' +
              '<span style="display:block;margin-top:8px;font-size:10px;font-weight:800;letter-spacing:.1em;' +
              'text-transform:uppercase;color:var(--text-muted,#666);">Inscrição</span>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;flex-wrap:wrap;gap:12px;padding-top:4px;">' +
            '<a href="/campanha" style="display:inline-flex;align-items:center;justify-content:center;' +
            'min-height:52px;padding:0 24px;border-radius:9px;background:var(--best-red,#E11507);color:#fff;' +
            'font-size:13px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;text-decoration:none;">' +
            'Ver campanha</a>' +
            '<a href="/inscricao" style="display:inline-flex;align-items:center;justify-content:center;' +
            'min-height:52px;padding:0 24px;border-radius:9px;border:1.5px solid var(--line-strong,#222);' +
            'color:var(--ink,#111);font-size:13px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;' +
            'text-decoration:none;">Inscreve-te</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    var responsive = document.createElement('style');
    responsive.textContent =
      '@media(max-width:820px){' +
        '#bestgym-campaign-popup-v2 [data-popup-grid]{grid-template-columns:1fr!important;}' +
        '#bestgym-campaign-popup-v2 [data-popup-copy]{padding:24px!important;}' +
        '#bestgym-campaign-popup-v2 [data-popup-grid]>div:first-child{padding:16px!important;}' +
        '#bestgym-campaign-popup-v2 [data-popup-grid]>div:first-child img{max-width:310px!important;}' +
      '}' +
      '@media(max-width:520px){' +
        '#bestgym-campaign-popup-v2{padding:10px!important;align-items:flex-end!important;}' +
        '#bestgym-campaign-popup-v2 [data-popup-copy] h2{font-size:42px!important;}' +
        '#bestgym-campaign-popup-v2 [data-popup-copy]>div:nth-of-type(1){grid-template-columns:repeat(3,1fr)!important;}' +
      '}';
    document.head.appendChild(responsive);

    function show() {
      if (!overlay.isConnected) return;
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      /* IMPORTANT: no body/html overflow lock. */
    }

    function close() {
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px) scale(.99)';
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (responsive.parentNode) responsive.parentNode.removeChild(responsive);
      }, 340);
    }

    var closeButton = card.querySelector('[data-campaign-close]');
    if (closeButton) closeButton.addEventListener('click', close);

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) close();
    });

    document.addEventListener('keydown', function onKey(event) {
      if (event.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        close();
      }
    });

    /* Let the DC hero/preloader settle before displaying the independent popup. */
    window.setTimeout(show, 2200);
  });
})();
