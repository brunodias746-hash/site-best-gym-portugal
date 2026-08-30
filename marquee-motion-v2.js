/* BEST GYM — Marquee Motion V2
   Definitive JS-driven continuous ticker.
   Uses requestAnimationFrame and inline !important transform so it
   cannot be frozen by coarse-pointer/reduced-motion CSS overrides. */
(function () {
  'use strict';

  var selector = 'section[data-screen-label="Marquee"] > div';
  var track = null;
  var firstCopy = null;
  var loopWidth = 0;
  var offset = 0;
  var lastTime = 0;
  var raf = 0;
  var resizeObserver = null;
  var retryTimer = null;

  function measure() {
    if (!track) return;
    firstCopy = track.querySelector('span');
    var width = firstCopy ? firstCopy.getBoundingClientRect().width : 0;
    if (!width || width < 10) width = track.scrollWidth / 2;
    loopWidth = Math.max(1, width);
    offset = offset % loopWidth;
  }

  function frame(now) {
    if (!track || !track.isConnected) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      track = null;
      lastTime = 0;
      setTimeout(init, 250);
      return;
    }

    if (document.hidden) {
      lastTime = 0;
      raf = requestAnimationFrame(frame);
      return;
    }

    if (!lastTime) lastTime = now;
    var dt = Math.min(64, Math.max(0, now - lastTime));
    lastTime = now;

    if (loopWidth > 1) {
      /* One complete duplicate-width traversal every 26 seconds,
         matching the original intended CSS duration. */
      var speed = loopWidth / 26000;
      offset = (offset + speed * dt) % loopWidth;
      track.style.setProperty(
        'transform',
        'translate3d(' + (-offset).toFixed(2) + 'px,0,0)',
        'important'
      );
    }

    raf = requestAnimationFrame(frame);
  }

  function init() {
    var found = document.querySelector(selector);
    if (!found) return false;

    if (track === found && found.getAttribute('data-best-marquee-js') === '1') {
      return true;
    }

    if (raf) cancelAnimationFrame(raf);
    if (resizeObserver) {
      try { resizeObserver.disconnect(); } catch (_) {}
    }

    track = found;
    track.setAttribute('data-best-marquee-js', '1');

    /* Kill the CSS animation itself; JS owns transform from here. */
    track.style.setProperty('animation', 'none', 'important');
    track.style.setProperty('animation-name', 'none', 'important');
    track.style.setProperty('transition', 'none', 'important');
    track.style.setProperty('will-change', 'transform', 'important');

    offset = 0;
    lastTime = 0;
    measure();

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(function () {
        measure();
      });
      resizeObserver.observe(track);
      if (firstCopy) resizeObserver.observe(firstCopy);
    }

    document.addEventListener('visibilitychange', function () {
      /* Avoid a large visual jump after returning to the tab. */
      lastTime = 0;
    });

    raf = requestAnimationFrame(frame);
    return true;
  }

  function boot() {
    if (init()) return;

    var attempts = 0;
    retryTimer = setInterval(function () {
      attempts++;
      if (init() || attempts > 48) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
