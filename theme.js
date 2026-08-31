/* BEST GYM — theme controller (dark / light).
   Presentation-safe version: saved preference → dark-first default.
   Applied on <html data-theme> before paint; persisted in localStorage. */
(function () {
  document.documentElement.lang = 'pt-PT';
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

  /* The approved BEST GYM motion language is controlled by the site, not by
     the operating-system reduced-motion preference. Keep this policy global
     so every presentation module makes the same decision. */
  var systemReducedMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  document.documentElement.setAttribute('data-best-motion', 'full');
  window.BGMotion = Object.freeze({
    enabled: true,
    force: true,
    systemReduced: systemReducedMotion
  });

  var KEY = 'bestgym-theme';
  var META = { dark: '#070707', light: '#F6F5F3' };

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function current() { return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }

  function syncLogos(theme) {
    var t = theme || current();
    var imgs = document.querySelectorAll('img[data-theme-logo]');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var dark = img.getAttribute('data-theme-logo');
      var light = img.getAttribute('data-theme-logo-light');
      if (!light) { light = img.getAttribute('src'); img.setAttribute('data-theme-logo-light', light); }
      var want = t === 'dark' ? dark : light;
      if (want && img.getAttribute('src') !== want) img.setAttribute('src', want);
    }
  }

  function themeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      if (document.head) document.head.appendChild(meta);
    }
    meta.setAttribute('content', META[theme]);
  }

  function apply(theme, persist) {
    var t = theme === 'light' ? 'light' : 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.style.colorScheme = t;
    if (persist) { try { localStorage.setItem(KEY, t); } catch (e) {} }
    themeColor(t);
    syncLogos(t);
    try { window.dispatchEvent(new CustomEvent('bg-theme-change', { detail: { theme: t } })); } catch (e) {}
    return t;
  }

  // BEST GYM is dark-first: fresh visitors start in dark mode.
  apply(stored() || 'dark', false);

  window.BGTheme = {
    get: current,
    set: function (t) { return apply(t, true); },
    toggle: function () { return apply(current() === 'dark' ? 'light' : 'dark', true); },
    label: function (t) { return (t || current()) === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'; },
    sync: syncLogos
  };

  /* components render after this script — keep logos in sync, cheaply */
  function watch() {
    var queued = false;
    new MutationObserver(function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; syncLogos(); });
    }).observe(document.body, { childList: true, subtree: true });
    syncLogos();
  }
  if (document.body) watch();
  else document.addEventListener('DOMContentLoaded', watch);

  /* Global presentation layer. Versioned names avoid stale browser/CDN copies. */
  function loadPresentationLayer() {
    if (!document.querySelector('link[data-best-mobile-experience]')) {
      var mobile = document.createElement('link');
      mobile.rel = 'stylesheet';
      mobile.href = '/mobile-experience.css';
      mobile.setAttribute('data-best-mobile-experience', '1');
      document.head.appendChild(mobile);
    }
    if (!document.querySelector('script[data-best-locale]')) {
      var locale = document.createElement('script');
      locale.src = '/locale.js';
      locale.defer = true;
      locale.setAttribute('data-best-locale', '1');
      document.head.appendChild(locale);
    }
    if (!document.querySelector('link[data-best-presentation-css]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/presentation-responsive-v1.css';
      link.setAttribute('data-best-presentation-css', '1');
      document.head.appendChild(link);
    }
    if (!document.querySelector('script[data-best-presentation-js]')) {
      var s = document.createElement('script');
      s.src = '/presentation-fixes-v1.js';
      s.defer = true;
      s.setAttribute('data-best-presentation-js', '1');
      document.head.appendChild(s);
    }

    /* Isolated experiment: stacked training-areas carousel. */
    if (!document.querySelector('link[data-best-stacked-gallery-css]')) {
      var gcss = document.createElement('link');
      gcss.rel = 'stylesheet';
      gcss.href = '/gallery-stacked-v1.css';
      gcss.setAttribute('data-best-stacked-gallery-css', '1');
      document.head.appendChild(gcss);
    }
    if (!document.querySelector('script[data-best-stacked-gallery-js]')) {
      var gjs = document.createElement('script');
      gjs.src = '/gallery-stacked-v1.js';
      gjs.defer = true;
      gjs.setAttribute('data-best-stacked-gallery-js', '1');
      document.head.appendChild(gjs);
    }

    /* Restore continuous marquee on touch-capable notebooks/mobile. */
    if (!document.querySelector('link[data-best-marquee-fix]')) {
      var mcss = document.createElement('link');
      mcss.rel = 'stylesheet';
      mcss.href = '/marquee-motion-v1.css';
      mcss.setAttribute('data-best-marquee-fix', '1');
      document.head.appendChild(mcss);
    }

    /* Definitive JS marquee driver: bypasses CSS animation conflicts. */
    if (!document.querySelector('script[data-best-marquee-js]')) {
      var mjs = document.createElement('script');
      mjs.src = '/marquee-motion-v2.js';
      mjs.defer = true;
      mjs.setAttribute('data-best-marquee-js', '1');
      document.head.appendChild(mjs);
    }
  }
  loadPresentationLayer();
})();
