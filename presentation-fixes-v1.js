/* BEST GYM — presentation cleanup and non-invasive QA fixes */
(function () {
  'use strict';

  var INSTAGRAM = {
    valongo: 'https://www.instagram.com/bestgymvalongo/',
    famalicao: 'https://www.instagram.com/bestgymfamalicao/'
  };

  var META = {
    '/': ['BEST GYM | Ginásios 24H em Portugal', 'Best Gym: treino 24 horas, performance e comunidade em Portugal.'],
    '/unidades': ['Unidades | BEST GYM', 'Conhece as unidades Best Gym e a estrutura disponível para treinar 24 horas.'],
    '/unidade-valongo': ['BEST GYM Valongo | Ginásio 24H', 'Best Gym Valongo: acesso 24 horas e estrutura para diferentes objetivos de treino.'],
    '/unidade-famalicao': ['BEST GYM Famalicão | Ginásio 24H', 'Best Gym Vila Nova de Famalicão: acesso 24 horas e estrutura de treino.'],
    '/built-by-best': ['Built By Best | BEST GYM', 'Programa de acompanhamento Best Gym orientado para consistência, método e evolução.'],
    '/produtos': ['Produtos | BEST GYM', 'Consulta o catálogo de produtos Best Gym disponível nas unidades.'],
    '/conteudos': ['Conteúdos | BEST GYM', 'Treino, performance, recuperação e comunidade na Best Gym.'],
    '/conteudo-detalhe': ['Conteúdo | BEST GYM', 'Conteúdo Best Gym sobre treino, performance e comunidade.'],
    '/sobre': ['Sobre | BEST GYM', 'Conhece a cultura, missão e visão da Best Gym.'],
    '/contactos': ['Contactos | BEST GYM', 'Contacta a equipa Best Gym de Valongo ou Vila Nova de Famalicão.'],
    '/inscricao': ['Inscrição | BEST GYM', 'Escolhe a tua unidade Best Gym e continua para a plataforma oficial de inscrição.'],
    '/campanha': ['Campanha | BEST GYM', 'Consulta a campanha ativa Best Gym e as condições apresentadas na plataforma oficial.'],
    '/faq': ['FAQ | BEST GYM', 'Respostas rápidas sobre a Best Gym, unidades, horários e inscrição.'],
    '/em-breve': ['São João da Madeira | BEST GYM', 'Novidades sobre a próxima unidade Best Gym em São João da Madeira.']
  };

  function setMeta() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var item = META[path];
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
    fixInstagram(root);
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
