/* BEST GYM — stacked training areas carousel, native JS */
(function () {
  'use strict';

  var SELECTOR = 'section[data-screen-label="Áreas de treino"]';
  var bootTimer = null;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function wrapDiff(index, progress, total) {
    var d = (index - progress) % total;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function config() {
    var w = window.innerWidth || 1200;
    if (w < 640) {
      return { x: 88, y: 18, rotate: 7, scale: .055, visible: 2.15, sensitivity: 145 };
    }
    if (w < 1024) {
      return { x: 132, y: 27, rotate: 9, scale: .075, visible: 2.35, sensitivity: 185 };
    }
    return { x: 178, y: 38, rotate: 10.5, scale: .095, visible: 2.55, sensitivity: 230 };
  }

  function cardKey(article, i) {
    var body = article.children && article.children[1];
    var spans = body ? body.querySelectorAll('span') : [];
    var title = spans[1] ? spans[1].textContent.trim() : '';
    return title || ('card-' + i);
  }

  function init() {
    var section = document.querySelector(SELECTOR);
    if (!section || section.getAttribute('data-best-stack-ready') === '1') return false;

    var originalRail = section.querySelector('[aria-label="Áreas de treino — carrossel"]');
    if (!originalRail) return false;

    var all = Array.prototype.slice.call(originalRail.querySelectorAll('article'));
    if (all.length < 3) return false;

    var seen = {};
    var cards = [];
    for (var i = 0; i < all.length; i++) {
      var key = cardKey(all[i], i);
      if (!seen[key]) {
        seen[key] = true;
        cards.push(all[i]);
      }
    }

    if (cards.length < 3) return false;

    section.setAttribute('data-best-stack-ready', '1');
    section.classList.add('best-stack-ready');
    originalRail.classList.add('best-stack-original-rail');

    var header = originalRail.previousElementSibling;
    var oldPrev = header && header.querySelector('button[aria-label="Anterior"]');
    if (oldPrev && oldPrev.parentElement) {
      oldPrev.parentElement.classList.add('best-stack-original-controls');
    }

    var shell = document.createElement('div');
    shell.className = 'best-stack-shell';

    var stage = document.createElement('div');
    stage.className = 'best-stack-stage';
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', 'Áreas de treino — arrasta para explorar');

    var nav = document.createElement('div');
    nav.className = 'best-stack-nav';

    var prev = document.createElement('button');
    prev.className = 'best-stack-btn';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Área anterior');
    prev.textContent = '←';

    var dots = document.createElement('div');
    dots.className = 'best-stack-dots';

    var next = document.createElement('button');
    next.className = 'best-stack-btn';
    next.type = 'button';
    next.setAttribute('aria-label', 'Área seguinte');
    next.textContent = '→';

    nav.appendChild(prev);
    nav.appendChild(dots);
    nav.appendChild(next);

    shell.appendChild(stage);
    shell.appendChild(nav);
    section.insertBefore(shell, originalRail);

    cards.forEach(function (card, i) {
      card.classList.add('best-stack-card');
      card.removeAttribute('aria-hidden');
      card.setAttribute('data-stack-index', String(i));
      stage.appendChild(card);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'best-stack-dot';
      dot.setAttribute('aria-label', 'Ir para área ' + (i + 1));
      dot.addEventListener('click', function () {
        animateTo(nearestRawFor(i, currentRaw));
      });
      dots.appendChild(dot);
    });

    var currentRaw = 0;
    var renderedProgress = 0;
    var raf = 0;
    var dragging = false;
    var startX = 0;
    var lastX = 0;
    var lastT = 0;
    var velocity = 0;
    var startProgress = 0;

    function nearestRawFor(index, around) {
      var total = cards.length;
      var base = Math.round((around - index) / total);
      var candidates = [
        index + (base - 1) * total,
        index + base * total,
        index + (base + 1) * total
      ];
      candidates.sort(function (a, b) {
        return Math.abs(a - around) - Math.abs(b - around);
      });
      return candidates[0];
    }

    function render(progress) {
      renderedProgress = progress;
      var cfg = config();
      var total = cards.length;

      cards.forEach(function (card, i) {
        var o = wrapDiff(i, progress, total);
        var abs = Math.abs(o);
        var x = o * cfg.x;
        var y = abs < .04 ? 0 : abs * cfg.y;
        var r = abs < .04 ? 0 : o * cfg.rotate;
        var s = Math.max(.66, 1 - abs * cfg.scale);
        var opacity = abs > cfg.visible ? 0 : Math.max(.12, 1 - Math.max(0, abs - 1.25) * .5);
        var z = Math.round(100 - abs * 12);

        card.style.setProperty('--stack-x', x.toFixed(2) + 'px');
        card.style.setProperty('--stack-y', y.toFixed(2) + 'px');
        card.style.setProperty('--stack-r', r.toFixed(2) + 'deg');
        card.style.setProperty('--stack-s', s.toFixed(3));
        card.style.setProperty('--stack-opacity', opacity.toFixed(3));
        card.style.setProperty('--stack-z', String(z));

        var active = abs < .38;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      var activeIndex = ((Math.round(progress) % total) + total) % total;
      var dotEls = dots.querySelectorAll('.best-stack-dot');
      for (var d = 0; d < dotEls.length; d++) {
        dotEls[d].classList.toggle('is-active', d === activeIndex);
        dotEls[d].setAttribute('aria-current', d === activeIndex ? 'true' : 'false');
      }
    }

    function animateTo(target) {
      cancelAnimationFrame(raf);
      var from = renderedProgress;
      var start = performance.now();
      var duration = 480;

      currentRaw = target;

      function tick(now) {
        var t = clamp((now - start) / duration, 0, 1);
        var eased = 1 - Math.pow(1 - t, 4);
        render(from + (target - from) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
        else render(target);
      }
      raf = requestAnimationFrame(tick);
    }

    function step(delta) {
      animateTo(currentRaw + delta);
    }

    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    });

    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true;
      startX = lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      startProgress = currentRaw;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    });

    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now();
      var dxFrame = e.clientX - lastX;
      var dt = Math.max(8, now - lastT);
      velocity = dxFrame / dt;
      lastX = e.clientX;
      lastT = now;

      var dx = e.clientX - startX;
      var p = startProgress - dx / config().sensitivity;
      render(p);
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');

      var dx = e.clientX - startX;
      var cfg = config();
      var distanceShift = -dx / (cfg.sensitivity * .72);
      var velocityShift = -velocity * 1.8;
      var shift = Math.round(distanceShift + velocityShift);
      shift = clamp(shift, -3, 3);

      if (shift === 0 && Math.abs(dx) > 38) shift = dx < 0 ? 1 : -1;

      animateTo(Math.round(startProgress) + shift);
      try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    window.addEventListener('resize', function () {
      render(currentRaw);
    }, { passive: true });

    render(0);
    return true;
  }

  function boot() {
    if (init()) {
      if (bootTimer) clearInterval(bootTimer);
      return;
    }
    var attempts = 0;
    bootTimer = setInterval(function () {
      attempts++;
      if (init() || attempts > 40) clearInterval(bootTimer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
