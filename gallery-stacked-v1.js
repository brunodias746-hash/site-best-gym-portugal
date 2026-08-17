/* BEST GYM — Stacked Areas Carousel V2
   Keeps original DC DOM intact; transforms cards in place. */
(function () {
  'use strict';

  var SECTION = 'section[data-screen-label="Áreas de treino"]';
  var timer = null;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function cfg() {
    var w = window.innerWidth || 1200;
    if (w < 640) return { x: 88, y: 16, r: 6.5, s: .052, visible: 2.2, sensitivity: 150 };
    if (w < 1024) return { x: 138, y: 24, r: 8, s: .07, visible: 2.45, sensitivity: 190 };
    return { x: 215, y: 32, r: 8.5, s: .082, visible: 2.7, sensitivity: 235 };
  }

  function wrapDiff(index, progress, total) {
    var d = (index - progress) % total;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function titleOf(card) {
    var content = card.children && card.children[1];
    if (!content) return '';
    var spans = content.querySelectorAll('span');
    return spans[1] ? spans[1].textContent.trim() : '';
  }

  function init() {
    var section = document.querySelector(SECTION);
    if (!section || section.getAttribute('data-best-stack-v2') === '1') return false;

    var rail = section.querySelector('[aria-label="Áreas de treino — carrossel"]');
    if (!rail) return false;

    var track = rail.firstElementChild;
    if (!track) return false;

    var all = Array.prototype.slice.call(track.querySelectorAll(':scope > article'));
    if (all.length < 6) return false;

    /* Existing data is duplicated for the old infinite rail.
       Keep the first occurrence of each title and hide the second set. */
    var seen = {};
    var cards = [];
    all.forEach(function (card) {
      var key = titleOf(card);
      if (key && !seen[key]) {
        seen[key] = true;
        cards.push(card);
        card.classList.add('best-stack-card');
        card.removeAttribute('aria-hidden');
      } else {
        card.classList.add('best-stack-duplicate');
      }
    });

    if (cards.length < 4) return false;

    section.setAttribute('data-best-stack-v2', '1');
    section.classList.add('best-stack-v2');

    var header = rail.previousElementSibling;
    if (header) {
      var oldPrev = header.querySelector('button[aria-label="Anterior"]');
      if (oldPrev && oldPrev.parentElement) oldPrev.parentElement.classList.add('best-stack-original-controls');
    }

    /* Disable the legacy transform directly in case DC logic updates it. */
    track.style.transform = 'none';

    var nav = document.createElement('div');
    nav.className = 'best-stack-v2-nav';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'best-stack-v2-btn';
    prev.setAttribute('aria-label', 'Área anterior');
    prev.textContent = '←';

    var dots = document.createElement('div');
    dots.className = 'best-stack-v2-dots';

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'best-stack-v2-btn';
    next.setAttribute('aria-label', 'Área seguinte');
    next.textContent = '→';

    nav.appendChild(prev);
    nav.appendChild(dots);
    nav.appendChild(next);
    rail.appendChild(nav);

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'best-stack-v2-dot';
      dot.setAttribute('aria-label', 'Ir para área ' + (i + 1));
      dot.addEventListener('click', function () {
        animateTo(nearestRaw(i, current));
      });
      dots.appendChild(dot);
    });

    var current = 0;
    var rendered = 0;
    var raf = 0;
    var dragging = false;
    var startX = 0;
    var lastX = 0;
    var lastT = 0;
    var velocity = 0;
    var startProgress = 0;

    function nearestRaw(index, around) {
      var total = cards.length;
      var k = Math.round((around - index) / total);
      var arr = [
        index + (k - 1) * total,
        index + k * total,
        index + (k + 1) * total
      ];
      arr.sort(function (a, b) {
        return Math.abs(a - around) - Math.abs(b - around);
      });
      return arr[0];
    }

    function render(progress) {
      rendered = progress;
      var c = cfg();
      var total = cards.length;

      /* DC may keep writing legacy translateX; cancel it each frame while interacting. */
      if (track.style.transform !== 'none') track.style.transform = 'none';

      cards.forEach(function (card, i) {
        var o = wrapDiff(i, progress, total);
        var a = Math.abs(o);

        var x = o * c.x;
        var y = a < .04 ? 0 : a * c.y;
        var r = a < .04 ? 0 : o * c.r;
        var s = Math.max(.69, 1 - a * c.s);
        var opacity = a > c.visible ? 0 : Math.max(.16, 1 - Math.max(0, a - 1.2) * .48);
        var z = Math.round(100 - a * 11);

        card.style.setProperty('--x', x.toFixed(2) + 'px');
        card.style.setProperty('--y', y.toFixed(2) + 'px');
        card.style.setProperty('--r', r.toFixed(2) + 'deg');
        card.style.setProperty('--s', s.toFixed(3));
        card.style.setProperty('--o', opacity.toFixed(3));
        card.style.setProperty('--z', String(z));

        var active = a < .38;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      var activeIndex = ((Math.round(progress) % total) + total) % total;
      var dotEls = dots.querySelectorAll('.best-stack-v2-dot');
      for (var d = 0; d < dotEls.length; d++) {
        var on = d === activeIndex;
        dotEls[d].classList.toggle('is-active', on);
        dotEls[d].setAttribute('aria-current', on ? 'true' : 'false');
      }
    }

    function animateTo(target) {
      cancelAnimationFrame(raf);
      var from = rendered;
      var start = performance.now();
      var duration = 480;
      current = target;

      function tick(now) {
        var t = clamp((now - start) / duration, 0, 1);
        var eased = 1 - Math.pow(1 - t, 4);
        render(from + (target - from) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
        else render(target);
      }
      raf = requestAnimationFrame(tick);
    }

    prev.addEventListener('click', function () { animateTo(current - 1); });
    next.addEventListener('click', function () { animateTo(current + 1); });

    nav.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
    });

    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        animateTo(current - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        animateTo(current + 1);
      }
    });

    rail.addEventListener('pointerdown', function (e) {
      /* Navigation controls must behave like normal buttons.
         Do not start/capture drag when clicking arrows or dots. */
      if (e.target && e.target.closest && e.target.closest('.best-stack-v2-nav, button')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true;
      startX = lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      startProgress = current;
      rail.classList.add('is-dragging');
      try { rail.setPointerCapture(e.pointerId); } catch (_) {}
    });

    rail.addEventListener('pointermove', function (e) {
      if (!dragging) return;

      var now = performance.now();
      var frameDx = e.clientX - lastX;
      var dt = Math.max(8, now - lastT);
      velocity = frameDx / dt;
      lastX = e.clientX;
      lastT = now;

      var dx = e.clientX - startX;
      render(startProgress - dx / cfg().sensitivity);
    });

    function finish(e) {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-dragging');

      var dx = e.clientX - startX;
      var c = cfg();
      var dist = -dx / (c.sensitivity * .72);
      var momentum = -velocity * 1.7;
      var shift = clamp(Math.round(dist + momentum), -3, 3);

      if (shift === 0 && Math.abs(dx) > 38) shift = dx < 0 ? 1 : -1;
      animateTo(Math.round(startProgress) + shift);

      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    rail.addEventListener('pointerup', finish);
    rail.addEventListener('pointercancel', finish);

    window.addEventListener('resize', function () {
      render(current);
    }, { passive: true });

    /* Keep cancelling legacy rail transform if its old logic still runs. */
    var observer = new MutationObserver(function () {
      if (track.style.transform !== 'none') track.style.transform = 'none';
    });
    observer.observe(track, { attributes: true, attributeFilter: ['style'] });

    render(0);
    return true;
  }

  function boot() {
    var tries = 0;
    if (init()) return;

    timer = setInterval(function () {
      tries++;
      if (init() || tries > 40) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
