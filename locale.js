/* BEST GYM — maintainable PT/EN locale layer for the static DC runtime. */
(function () {
  'use strict';

  var config = window.BGSiteConfig;
  if (!config) return;
  var ROUTES = {};
  Object.keys(config.pages).forEach(function (pt) { ROUTES[pt] = config.pages[pt].en; });
  var REVERSE = {};
  Object.keys(ROUTES).forEach(function (pt) { REVERSE[ROUTES[pt]] = pt; });
  REVERSE['/en'] = '/';

  var detected = window.BGPageLocale || {};
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var english = typeof detected.english === 'boolean' ? detected.english : path === '/en' || path.indexOf('/en/') === 0;
  var ptPath = detected.ptPath || (english ? (REVERSE[path] || '/') : path);
  var enPath = detected.enPath || ROUTES[ptPath] || '/en/';
  document.documentElement.lang = english ? 'en' : 'pt-PT';
  document.documentElement.setAttribute('data-locale', english ? 'en' : 'pt');

  var attributes = ['aria-label', 'aria-description', 'title', 'placeholder', 'alt', 'cursor'];
  var selector = ['[data-en]', '[data-en-text]', 'a[href]:not([data-bg-language-link])']
    .concat(attributes.map(function (attr) { return '[data-en-' + attr + ']'; })).join(',');

  function translate(root) {
    if (!english || !root) return;
    var elements = Array.prototype.slice.call(root.querySelectorAll ? root.querySelectorAll(selector) : []);
    if (root.matches && root.matches(selector)) elements.unshift(root);
    elements.forEach(function (el) {
      var direct = el.getAttribute('data-en');
      var parts = el.getAttribute('data-en-text');
      var translations = parts ? JSON.parse(parts) : [direct];
      var index = 0;
      if (parts || direct !== null) {
        el.childNodes.forEach(function (node) {
          if (node.nodeType !== 3 || !node.nodeValue.trim()) return;
          var copy = translations[index++];
          if (copy == null) return;
          var raw = node.nodeValue;
          if (raw.trim() === copy.trim()) return;
          var text = raw.match(/^\s*/)[0] + copy + raw.match(/\s*$/)[0];
          if (raw !== text) node.nodeValue = text;
        });
      }
      attributes.forEach(function (attr) {
        var value = el.getAttribute('data-en-' + attr);
        var target = attr === 'cursor' ? 'data-cursor' : attr;
        if (value !== null && value !== el.getAttribute(target)) el.setAttribute(target, value);
      });
      if (el.matches('a[href]:not([data-bg-language-link])')) {
        var href = el.getAttribute('href');
        var localized = config.englishHref(href, enPath);
        if (href !== localized) el.setAttribute('href', localized);
      }
    });
  }

  function addSwitchers() {
    var headerButton = document.querySelector('button[data-theme-toggle]');
    if (headerButton && headerButton.parentElement && !headerButton.parentElement.querySelector('[data-bg-language-switcher]')) {
      var wrap = document.createElement('nav');
      wrap.className = 'bg-language-switcher'; wrap.setAttribute('data-bg-language-switcher', ''); wrap.setAttribute('aria-label', english ? 'Language' : 'Idioma');
      wrap.innerHTML = '<a data-bg-language-link href="' + ptPath + '" lang="pt-PT"' + (!english ? ' aria-current="page"' : '') + '>PT</a><span aria-hidden="true">/</span><a data-bg-language-link href="' + enPath + '" lang="en"' + (english ? ' aria-current="page"' : '') + '>EN</a>';
      headerButton.parentElement.insertBefore(wrap, headerButton);
    }
    var drawer = document.getElementById('bestgym-main-menu');
    if (drawer && !drawer.querySelector('[data-bg-language-switcher]')) {
      var inner = drawer.children[1];
      if (inner) {
        var mobile = document.createElement('nav'); mobile.className = 'bg-language-switcher bg-language-switcher--drawer'; mobile.setAttribute('data-bg-language-switcher', ''); mobile.setAttribute('aria-label', english ? 'Language' : 'Idioma');
        mobile.innerHTML = '<span>' + (english ? 'Language' : 'Idioma') + '</span><div><a data-bg-language-link href="' + ptPath + '" lang="pt-PT"' + (!english ? ' aria-current="page"' : '') + '>PT</a><span aria-hidden="true">/</span><a data-bg-language-link href="' + enPath + '" lang="en"' + (english ? ' aria-current="page"' : '') + '>EN</a></div>';
        inner.insertBefore(mobile, inner.children[1] || null);
      }
    }
  }

  function run(root) { if (root) translate(root); addSwitchers(); document.documentElement.setAttribute('data-locale-ready', 'true'); }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('[data-bg-language-switcher] a[lang]');
    if (link) localStorage.setItem('bestgym-language', link.getAttribute('lang') === 'en' ? 'en' : 'pt-PT');
  });
  if (document.body) run(document.body); else document.addEventListener('DOMContentLoaded', function () { run(document.body); }, { once: true });
  new MutationObserver(function (records) {
    var pending = new Set();
    records.forEach(function (record) {
      if (record.type === 'childList') record.addedNodes.forEach(function (node) { if (node.nodeType === 1) pending.add(node); else if (node.nodeType === 3 && node.parentElement) pending.add(node.parentElement); });
      else if (record.type === 'characterData' && record.target.parentElement) pending.add(record.target.parentElement);
      else if (record.target && record.target.nodeType === 1) pending.add(record.target);
    });
    pending.forEach(function (root) {
      if (!root.isConnected) return;
      for (var parent = root.parentElement; parent; parent = parent.parentElement) if (pending.has(parent)) return;
      translate(root);
    });
    addSwitchers();
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href'] });

  window.BGLocale = Object.freeze({ language: english ? 'en' : 'pt-PT', isEnglish: english, ptPath: ptPath, enPath: enPath, routes: ROUTES });
})();
