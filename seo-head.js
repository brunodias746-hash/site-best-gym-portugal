/* Runs synchronously in <head> so localized metadata is ready before the DC runtime. */
(function () {
  'use strict';
  var config = window.BGSiteConfig;
  if (!config) return;
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var ptPath = path;
  var page = config.pages[path];
  var english = false;
  if (!page) Object.keys(config.pages).some(function (candidate) {
    if (config.pages[candidate].en.replace(/\/+$/, '') === path) { ptPath = candidate; page = config.pages[candidate]; english = true; return true; }
    return false;
  });
  if (!page) { ptPath = '/'; page = config.pages['/']; }
  var enPath = page.en;
  var seo = english ? page.english : page.pt;
  document.documentElement.lang = english ? 'en' : 'pt-PT';
  document.documentElement.setAttribute('data-locale', english ? 'en' : 'pt');
  document.title = seo[0];

  function meta(selector, attr, value) {
    var el = document.querySelector(selector) || document.createElement('meta');
    if (!el.parentNode) document.head.appendChild(el);
    Object.keys(attr).forEach(function (key) { el.setAttribute(key, attr[key]); });
    el.setAttribute('content', value);
  }
  function link(rel, hreflang, href) {
    var selector = 'link[rel="' + rel + '"]' + (hreflang ? '[hreflang="' + hreflang + '"]' : '');
    var el = document.querySelector(selector) || document.createElement('link');
    el.rel = rel; if (hreflang) el.hreflang = hreflang; el.href = config.origin + href;
    if (!el.parentNode) document.head.appendChild(el);
  }
  meta('meta[name="description"]', { name: 'description' }, seo[1]);
  meta('meta[property="og:title"]', { property: 'og:title' }, seo[0]);
  meta('meta[property="og:description"]', { property: 'og:description' }, seo[1]);
  meta('meta[property="og:url"]', { property: 'og:url' }, config.origin + (english ? enPath : ptPath));
  meta('meta[property="og:locale"]', { property: 'og:locale' }, english ? 'en_GB' : 'pt_PT');
  meta('meta[property="og:locale:alternate"]', { property: 'og:locale:alternate' }, english ? 'pt_PT' : 'en_GB');
  link('canonical', '', english ? enPath : ptPath);
  link('alternate', 'pt-PT', ptPath);
  link('alternate', 'en', enPath);
  link('alternate', 'x-default', ptPath);
  window.BGPageLocale = Object.freeze({ english: english, ptPath: ptPath, enPath: enPath });
})();
