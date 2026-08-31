/* BEST GYM — presentation cleanup and non-invasive QA fixes */
(function () {
  'use strict';

  var INSTAGRAM = {
    valongo: 'https://www.instagram.com/bestgymvalongo/',
    famalicao: 'https://www.instagram.com/bestgymfamalicao/'
  };

  function setMeta() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var page = window.BGSiteConfig && window.BGSiteConfig.pages[path];
    var item = page && page.pt;
    if (!item) return;
    document.title = item[0];
    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = item[1];
  }

  function cleanupVisibleDraftCopy(root) {
    root = root || document;

    var nodes = root.querySelectorAll ? root.querySelectorAll('span, p, div') : [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length) continue;
      var t = (el.textContent || '').trim();

      if (t.indexOf('Nota de integração:') === 0 ||
          t.indexOf('Nota editável:') === 0) {
        el.style.display = 'none';
      }

      if (t.indexOf('Conteúdos de exemplo — os vídeos oficiais Built By Best') === 0) {
        el.textContent = 'Conteúdos demonstrativos do programa Built By Best.';
      }
    }
  }

  function fixComingSoon(root) {
    root = root || document;
    var labels = root.querySelectorAll ? root.querySelectorAll('span') : [];
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      if ((label.textContent || '').trim() !== 'Cidade') continue;
      var box = label.parentElement;
      if (!box) continue;
      var spans = box.querySelectorAll('span');
      if (spans.length > 1 && (spans[1].textContent || '').trim() === 'A anunciar') {
        spans[1].textContent = 'São João da Madeira';
      }
    }
  }

  function fixCampaignHero(root) {
    root = root || document;
    var candidates = [];
    if (root.querySelectorAll) {
      candidates = root.querySelectorAll('#campanha-hero, [id="campanha-hero"]');
    }
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (!el.getAttribute('src')) {
        el.setAttribute('src', 'assets/img/hero-main-v2.jpg');
      }
    }
  }

  function fixInstagram(root) {
    root = root || document;
    var links = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];

    function genericInstagram(a) {
      var href = (a.getAttribute('href') || '').replace(/\/+$/, '').toLowerCase();
      return href === 'https://instagram.com' ||
             href === 'https://www.instagram.com' ||
             href === 'http://instagram.com' ||
             href === 'http://www.instagram.com';
    }

    function stylePair(wrapper, source) {
      var cs = window.getComputedStyle ? window.getComputedStyle(source) : null;
      wrapper.style.display = 'flex';
      wrapper.style.flexWrap = 'wrap';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = cs && cs.textAlign === 'center' ? 'center' : 'flex-start';
      wrapper.style.gap = '8px 14px';
      wrapper.style.maxWidth = '100%';
    }

    function cloneInstagram(source, href, label) {
      var a = source.cloneNode(true);
      a.setAttribute('href', href);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = label;
      return a;
    }

    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (!genericInstagram(a)) continue;
      if (a.getAttribute('data-best-instagram-fixed') === '1') continue;

      var path = location.pathname.toLowerCase();
      var nearby = a.closest('section, footer, aside, article, div');
      var context = ((nearby && nearby.textContent) || '').toLowerCase();

      if (path.indexOf('unidade-famalicao') !== -1 ||
          (context.indexOf('famalicão') !== -1 && context.indexOf('valongo') === -1)) {
        a.href = INSTAGRAM.famalicao;
        if ((a.textContent || '').trim().toLowerCase() === 'instagram') a.textContent = 'Instagram Famalicão';
        a.setAttribute('data-best-instagram-fixed', '1');
        continue;
      }

      if (path.indexOf('unidade-valongo') !== -1 ||
          (context.indexOf('valongo') !== -1 && context.indexOf('famalicão') === -1)) {
        a.href = INSTAGRAM.valongo;
        if ((a.textContent || '').trim().toLowerCase() === 'instagram') a.textContent = 'Instagram Valongo';
        a.setAttribute('data-best-instagram-fixed', '1');
        continue;
      }

      /* Network-level placements must expose both official unit profiles. */
      var wrapper = document.createElement('span');
      wrapper.className = 'best-instagram-pair';
      wrapper.setAttribute('data-best-instagram-fixed', '1');
      stylePair(wrapper, a);

      var originalText = (a.textContent || '').trim().toLowerCase();
      var shortLabels = originalText === 'instagram';
      var v = cloneInstagram(a, INSTAGRAM.valongo, shortLabels ? 'Instagram Valongo' : 'Valongo →');
      var f = cloneInstagram(a, INSTAGRAM.famalicao, shortLabels ? 'Instagram Famalicão' : 'Famalicão →');

      /* Avoid two giant button-like links inside the red community tile. */
      if (a.closest('section[data-screen-label="Comunidade"]')) {
        wrapper.style.flexDirection = 'column';
        wrapper.style.justifyContent = 'center';
        wrapper.style.gap = '8px';
        v.style.fontSize = '16px';
        f.style.fontSize = '16px';
        v.style.padding = '2px 8px';
        f.style.padding = '2px 8px';
      }

      a.replaceWith(wrapper);
      wrapper.appendChild(v);
      wrapper.appendChild(f);
    }
  }



  function removeGroupClassPhotos(root) {
    root = root || document;
    if (!root.querySelectorAll) return;

    var selectors = [
      '[src*="area-aulas"]',
      '[src*="comunidade-grupo"]',
      '[src*="comunidade-evento"]',
      '[src*="artigo-checkin"]',
      '[src*="equipa.jpg"]'
    ];

    var replacements = {
      'area-aulas': 'assets/img/area-personal-training.jpg',
      'comunidade-grupo': 'assets/img/editorial-membro.jpg',
      'comunidade-evento': 'assets/img/area-personal-training.jpg',
      'artigo-checkin': 'assets/img/area-personal-training.jpg',
      'equipa.jpg': 'assets/img/editorial-membro.jpg'
    };

    var nodes = root.querySelectorAll(selectors.join(','));
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var src = el.getAttribute('src') || '';
      var next = '';

      for (var key in replacements) {
        if (src.indexOf(key) !== -1) {
          next = replacements[key];
          break;
        }
      }

      if (!next || src === next) continue;
      el.setAttribute('src', next);
      el.setAttribute('data-best-no-group-class-photo', '1');

      /* image-slot may already have rendered a child image. */
      var imgs = el.querySelectorAll ? el.querySelectorAll('img, source') : [];
      for (var j = 0; j < imgs.length; j++) {
        if (imgs[j].tagName === 'SOURCE') {
          imgs[j].removeAttribute('srcset');
        } else {
          imgs[j].setAttribute('src', next);
        }
      }
    }
  }

  function animateInstitutionalMascot(root) {
    root = root || document;
    if (!root.querySelector) return;

    var stage = root.querySelector('[data-best-mascot-stage]');
    if (!stage || stage._bestMascotArmed) return;

    var mascot = stage.querySelector('[data-best-mascot]');
    var aura = stage.querySelector('[data-best-mascot-aura]');
    if (!mascot) return;

    stage._bestMascotArmed = true;

    var targetX = 0, targetY = 0;
    var x = 0, y = 0;
    var raf = 0;
    var start = performance.now();

    function pointerMove(e) {
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      targetX = nx * 8;
      targetY = ny * 5;
    }

    function pointerLeave() {
      targetX = 0;
      targetY = 0;
    }

    function frame(now) {
      if (document.hidden) {
        raf = requestAnimationFrame(frame);
        return;
      }
      x += (targetX - x) * 0.055;
      y += (targetY - y) * 0.055;

      var t = (now - start) / 1000;
      var breathe = Math.sin(t * 1.55);
      var floatY = Math.sin(t * 1.02) * 4.2;
      var scale = 1 + breathe * 0.009;

      mascot.style.setProperty(
        'transform',
        'translate3d(calc(-50% + ' + x.toFixed(2) + 'px),' +
          (y + floatY).toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')',
        'important'
      );

      if (aura) {
        var auraScale = 1.01 + (breathe + 1) * 0.018;
        var auraOpacity = 0.66 + (breathe + 1) * 0.07;
        aura.style.setProperty('transform', 'scale(' + auraScale.toFixed(4) + ')', 'important');
        aura.style.setProperty('opacity', auraOpacity.toFixed(3), 'important');
      }

      raf = requestAnimationFrame(frame);
    }

    stage.addEventListener('pointermove', pointerMove, { passive: true });
    stage.addEventListener('pointerleave', pointerLeave, { passive: true });
    raf = requestAnimationFrame(frame);

    window.addEventListener('pagehide', function () {
      if (raf) cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', pointerMove);
      stage.removeEventListener('pointerleave', pointerLeave);
    }, { once: true });
  }



  function injectFranchisingNav(root) {
    root = root || document;
    if (!root.querySelectorAll) return;

    function addTo(nav, drawer) {
      var english = !!(window.BGPageLocale && window.BGPageLocale.english);
      var franchisingHref = english ? '/en/franchising' : '/franchising';
      var contactsHref = english ? '/en/contacts' : '/contactos';
      var aboutHref = english ? '/en/about' : '/sobre';
      if (!nav || nav.querySelector('a[href="' + franchisingHref + '"]')) return;

      var links = nav.querySelectorAll('a[href]');
      var model = null;
      var before = null;
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === contactsHref) model = links[i];
        if (links[i].getAttribute('href') === aboutHref) before = links[i];
      }
      if (!model && links.length) model = links[links.length - 1];
      if (!model) return;

      var a = model.cloneNode(true);
      a.setAttribute('href', franchisingHref);
      a.textContent = 'Franchising';

      if (location.pathname.replace(/\/+$/, '') === franchisingHref) {
        a.style.color = 'var(--best-red)';
        if (!drawer) {
          a.style.borderBottomColor = 'var(--best-red)';
          a.style.fontWeight = '600';
        }
      } else {
        a.style.color = 'var(--ink)';
        if (!drawer) a.style.borderBottomColor = 'transparent';
      }

      if (before && before.parentNode === nav) nav.insertBefore(a, before);
      else nav.appendChild(a);

      if (!drawer) nav.style.gap = 'clamp(12px, 1.45vw, 22px)';
    }

    addTo(root.querySelector('nav[data-bg-desknav]'), false);
    addTo(root.querySelector('aside[aria-label="Menu"] nav[aria-label="Menu completo"]'), true);
  }



  function syncMonthlyCampaignCopy(root) {
    root = root || document;
    if (!root.querySelectorAll) return;

    var nodes = root.querySelectorAll('span, p, div, h1, h2, h3, strong, a');

    function normalized(value) {
      return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length) continue;

      var raw = (el.textContent || '').trim();
      var text = normalized(raw);

      if (text === '3 meses de oferta + inscrição grátis') {
        el.textContent = '50% DE DESCONTO POR MÊS ATÉ 2027 + INSCRIÇÃO GRÁTIS';
        /* Prevent the longer current offer from overflowing narrow campaign cards. */
        el.style.fontSize = 'clamp(18px, 2.2vw, 30px)';
        el.style.lineHeight = '1.02';
      }

      if (text === 'campanha do mês · olá verão, olá descontos' ||
          text === 'campanha do mês · ola verão, ola descontos' ||
          text === 'campanha do mês · ola verao, ola descontos') {
        el.textContent = 'CAMPANHA DO MÊS · FÉRIAS OFF. GYM ON.';
      }

      if (text === 'olá verão, olá descontos' ||
          text === 'ola verão, ola descontos' ||
          text === 'ola verao, ola descontos') {
        el.textContent = 'FÉRIAS OFF. GYM ON.';
      }
    }
  }


  function normalizeBrandLogos(root) {
    root = root || document;
    var logos = root.querySelectorAll ? root.querySelectorAll('img[data-theme-logo][alt="Best Gym"]') : [];
    for (var i = 0; i < logos.length; i++) {
      var img = logos[i];
      if (img.closest && img.closest('aside[aria-label="Menu"]')) {
        img.classList.add('best-logo-drawer');
      } else {
        img.classList.add('best-logo-header');
      }
    }
  }

  function treatBuiltByBest(root) {
    root = root || document;
    var owl = root.querySelector ? root.querySelector('[data-owl-parallax]') : null;
    if (!owl) return;

    owl.classList.add('best-bbb-owl');

    var section = owl.closest ? owl.closest('section[data-screen-label="Built By Best"]') : null;
    if (section) section.classList.add('best-bbb-section');

    var content = owl.nextElementSibling;
    if (!content) return;
    content.classList.add('best-bbb-content');

    /* Mobile mascot must live in normal document flow, not behind the copy. */
    if (!content.querySelector('.best-bbb-mobile-stage')) {
      var stage = document.createElement('div');
      stage.className = 'best-bbb-mobile-stage';
      stage.setAttribute('aria-hidden', 'true');

      var mascot = document.createElement('img');
      mascot.className = 'best-bbb-mobile-mascot';
      mascot.src = owl.getAttribute('src') || 'assets/img/mascot-owl-body-v2.png';
      mascot.alt = '';
      mascot.loading = 'lazy';
      mascot.decoding = 'async';

      stage.appendChild(mascot);

      /* The last content child is the CTA wrapper. Put the stage immediately before it. */
      var cta = content.lastElementChild;
      if (cta) content.insertBefore(stage, cta);
      else content.appendChild(stage);
    }
  }

  function injectBlessCredit(root) {
    root = root || document;
    var footer = root.querySelector ? root.querySelector('footer') : null;
    if (!footer || footer.querySelector('.bless-credit')) return;

    var rows = footer.querySelectorAll('div');
    var legalRow = null;

    for (var i = rows.length - 1; i >= 0; i--) {
      var text = (rows[i].textContent || '');
      if (text.indexOf('Todos os direitos reservados') !== -1 &&
          text.indexOf('Privacidade') !== -1) {
        legalRow = rows[i];
        break;
      }
    }

    if (!legalRow) return;

    var credit = document.createElement('div');
    credit.className = 'bless-credit';
    credit.setAttribute('aria-label', 'Design e desenvolvimento por Bless');

    var label = document.createElement('span');
    label.className = 'bless-credit__label';
    label.textContent = 'Design & desenvolvimento';

    var logo = document.createElement('img');
    logo.className = 'bless-credit__logo';
    logo.src = '/bless-white.png';
    logo.alt = 'Bless — Creative Content Motion';
    logo.loading = 'lazy';
    logo.decoding = 'async';

    var link = document.createElement('a');
    link.href = 'https://www.instagram.com/bless.pt/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Bless no Instagram');
    link.style.display = 'inline-flex';
    link.style.alignItems = 'center';
    link.style.textDecoration = 'none';

    link.appendChild(logo);

    credit.appendChild(label);
    credit.appendChild(link);
    legalRow.appendChild(credit);
  }

  function hardenLinks(root) {
    root = root || document;
    var links = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (href === 'conteudo-detalhe.dc.html' || href === './conteudo-detalhe.dc.html') {
        a.setAttribute('href', '/conteudo-detalhe');
      }
      if (a.getAttribute('target') === '_blank') {
        var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        if (rel.indexOf('noopener') === -1) rel.push('noopener');
        if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
        a.setAttribute('rel', rel.join(' '));
      }
    }
  }

  function tuneMedia() {
    var mobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (!mobile) return;
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      videos[i].setAttribute('playsinline', '');
      videos[i].setAttribute('preload', 'metadata');
    }
  }

  function run(root) {
    setMeta();
    cleanupVisibleDraftCopy(root);
    fixComingSoon(root);
    fixCampaignHero(root);
    syncMonthlyCampaignCopy(root);
    fixInstagram(root);
    injectFranchisingNav(root);
    removeGroupClassPhotos(root);
    animateInstitutionalMascot(root);
    normalizeBrandLogos(root);
    treatBuiltByBest(root);
    injectBlessCredit(root);
    hardenLinks(root);
    tuneMedia();
  }

  function ready() {
    run(document);

    var queued = false;
    var stopTimer = null;
    var mo = new MutationObserver(function (records) {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        run(document);
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    /* DC components settle quickly; stop the presentation observer after 12s. */
    stopTimer = setTimeout(function () { mo.disconnect(); }, 12000);
    window.addEventListener('pagehide', function () {
      clearTimeout(stopTimer);
      mo.disconnect();
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready, { once: true });
  } else {
    ready();
  }
})();
