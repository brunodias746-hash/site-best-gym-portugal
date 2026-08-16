/* BEST GYM — theme controller (dark / light).
   Priority: saved preference → OS preference → dark.
   Applied on <html data-theme> before paint; persisted in localStorage. */
(function () {
  var KEY = 'bestgym-theme';
  var META = { dark: '#070707', light: '#F6F5F3' };

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function system() {
    try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
    catch (e) { return 'dark'; }
  }
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
      if (img.getAttribute('src') !== want) img.setAttribute('src', want);
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

  apply(stored() || system(), false);

  window.BGTheme = {
    get: current,
    set: function (t) { return apply(t, true); },
    toggle: function () { return apply(current() === 'dark' ? 'light' : 'dark', true); },
    label: function (t) { return (t || current()) === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'; },
    sync: syncLogos
  };

  /* follow the OS while the user has no explicit preference */
  try {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onMQ = function () { if (!stored()) apply(system(), false); };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);
  } catch (e) {}

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
})();
