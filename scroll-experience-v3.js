(function () {
  if (customElements.get('scroll-experience')) return;
  const CSS = `
html { scroll-behavior: smooth; }
html, body { cursor: auto !important; }
a, button, [role="button"], summary, input[type="button"], input[type="submit"] { cursor: pointer !important; }
.motion-cursor, .motion-cursor-dot { display: none !important; }

.best-cursor-spotlight {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1990;
  pointer-events: none;
  opacity: 1;
}

.scroll-progress { position: fixed; z-index: 9998; top: 0; left: 0; height: 3px; background: #E30613; pointer-events: none; transition: width 80ms linear; }
.reveal-section { opacity: 0; transform: translateY(65px); transition: opacity 800ms cubic-bezier(0.22,0.61,0.36,1), transform 900ms cubic-bezier(0.22,0.61,0.36,1); }
.reveal-section.revealed { opacity: 1; transform: translateY(0); }
.reveal-section h2 { opacity: 0; transform-origin: top center; transform: perspective(500px) rotateX(-28deg) translateY(28px); transition: transform 800ms 80ms cubic-bezier(0.22,0.61,0.36,1), opacity 650ms 80ms; }
.reveal-section.revealed h2 { opacity: 1; transform: perspective(500px) rotateX(0deg) translateY(0); }

.back-top { position: fixed; z-index: 80; right: 26px; bottom: 26px; width: 62px; height: 62px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #fff; background: #181818; border: 1px solid #444; border-radius: 50%; opacity: 0; visibility: hidden; transform: translateY(16px); transition: opacity 300ms, visibility 300ms, transform 300ms; cursor: pointer; font-family: inherit; }
.back-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
.back-top span { font-size: 20px; line-height: 1; }
.back-top small { font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; }

/* BEST GYM — Specular + Magic Bento adaptation */
.best-fx-card {
  --best-x: 50%;
  --best-y: 50%;
  --best-glow: 0;
  --best-rx: 0deg;
  --best-ry: 0deg;
  --best-tx: 0px;
  --best-ty: 0px;
  --best-lift: 0px;
  position: relative;
  isolation: isolate;
  transform-style: preserve-3d;
  transition:
    transform 260ms cubic-bezier(0.22,0.61,0.36,1),
    box-shadow 300ms ease,
    border-color 300ms ease;
  will-change: transform;
}
.best-fx-card > * { position: relative; z-index: 2; }
.best-fx-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  border-radius: inherit;
  padding: 1.4px;
  background:
    radial-gradient(
      170px circle at var(--best-x) var(--best-y),
      rgba(255,255,255,0.98) 0%,
      rgba(225,21,7,0.95) 14%,
      rgba(142,9,0,0.72) 34%,
      rgba(225,21,7,0.20) 52%,
      transparent 72%
    ),
    linear-gradient(
      135deg,
      rgba(225,21,7,0.24),
      rgba(64,4,2,0.48) 45%,
      rgba(255,255,255,0.10) 72%,
      rgba(225,21,7,0.22)
    );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: calc(0.18 + (var(--best-glow) * 0.82));
  transition: opacity 220ms ease;
}
.best-fx-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  background:
    radial-gradient(
      300px circle at var(--best-x) var(--best-y),
      rgba(225,21,7,0.18) 0%,
      rgba(142,9,0,0.09) 30%,
      transparent 68%
    );
  opacity: calc(var(--best-glow) * 0.95);
  mix-blend-mode: screen;
  transition: opacity 260ms ease;
}
.best-fx-card.best-transform-safe {
  transform:
    perspective(1100px)
    translate3d(var(--best-tx), calc(var(--best-ty) + var(--best-lift)), 0)
    rotateX(var(--best-rx))
    rotateY(var(--best-ry));
}
.best-fx-card:hover {
  --best-lift: -2px;
  border-color: rgba(225,21,7,0.48) !important;
  box-shadow:
    0 14px 36px rgba(0,0,0,0.22),
    0 0 28px rgba(225,21,7,0.10);
}
.best-particle {
  position: absolute !important;
  z-index: 4 !important;
  left: var(--best-px);
  top: var(--best-py);
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  background: #E11507;
  box-shadow: 0 0 8px rgba(225,21,7,0.70);
}
.best-fx-card:hover .best-particle {
  animation: bestParticleFloat var(--best-pdur) ease-in-out var(--best-pdelay) infinite alternate;
}
@keyframes bestParticleFloat {
  0% { opacity: 0; transform: translate3d(0,0,0) scale(0.45); }
  25% { opacity: 0.8; }
  100% { opacity: 0.22; transform: translate3d(var(--best-pdx),var(--best-pdy),0) scale(1.12); }
}
.best-ripple {
  position: absolute !important;
  z-index: 6 !important;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255,70,54,0.34) 0%, rgba(225,21,7,0.18) 38%, transparent 70%);
  transform: scale(0);
  opacity: 1;
  animation: bestRipple 720ms cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes bestRipple {
  to { transform: scale(1); opacity: 0; }
}
.best-global-spotlight {
  position: fixed;
  z-index: 32;
  width: 620px;
  height: 620px;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(circle,
      rgba(225,21,7,0.12) 0%,
      rgba(142,9,0,0.07) 22%,
      rgba(225,21,7,0.025) 45%,
      transparent 70%);
  mix-blend-mode: screen;
  transition: opacity 260ms ease;
  will-change: left, top, opacity;
}

/* BEST GYM — Chroma photo treatment */
.best-chroma {
  --best-cx: 50%;
  --best-cy: 50%;
  isolation: isolate;
  transition: box-shadow 320ms ease, border-color 320ms ease;
}
.best-chroma::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  border-radius: inherit;
  background: rgba(5,6,8,0.012);
  -webkit-backdrop-filter: grayscale(0.72) brightness(0.84) saturate(0.72);
  backdrop-filter: grayscale(0.72) brightness(0.84) saturate(0.72);
  opacity: 0.94;
  transition: opacity 360ms ease;
}
.best-chroma.best-chroma-active::after {
  -webkit-mask-image: radial-gradient(
    circle 220px at var(--best-cx) var(--best-cy),
    transparent 0%,
    transparent 18%,
    rgba(0,0,0,0.12) 34%,
    rgba(0,0,0,0.42) 58%,
    rgba(0,0,0,0.72) 78%,
    #000 100%
  );
  mask-image: radial-gradient(
    circle 220px at var(--best-cx) var(--best-cy),
    transparent 0%,
    transparent 18%,
    rgba(0,0,0,0.12) 34%,
    rgba(0,0,0,0.42) 58%,
    rgba(0,0,0,0.72) 78%,
    #000 100%
  );
}
.best-chroma.best-chroma-active {
  box-shadow:
    inset 0 0 0 1px rgba(225,21,7,0.52),
    0 0 28px rgba(225,21,7,0.10);
}

@media (max-width: 900px) {
  .back-top { right: 18px; bottom: 80px; width: 50px; height: 50px; }
}
@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .best-cursor-spotlight,
  .best-global-spotlight,
  .best-particle,
  .best-fx-card::after { display: none !important; }
  .best-fx-card,
  .best-fx-card.best-transform-safe {
    transform: none !important;
    transition: box-shadow 220ms ease, border-color 220ms ease;
  }
  .best-fx-card::before { opacity: 0.22; }
  .best-chroma::after { display: none !important; }
}
`;
  const REDUCED = false;
  const FX_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  class ScrollExperience extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      const old = document.getElementById('scroll-experience-css');
      if (old) old.remove();
      const st = document.createElement('style');
      st.id = 'scroll-experience-css';
      st.textContent = CSS;
      document.head.appendChild(st);
      this.style.display = 'contents';
      this.innerHTML = '<canvas class="best-cursor-spotlight" aria-hidden="true"></canvas>' +
        '<div class="scroll-progress" aria-hidden="true"></div>' +
        '<button class="back-top" aria-label="Voltar ao topo"><span>\u2191</span><small>Topo</small></button>';
      const cursorSpotCanvas = this.querySelector('.best-cursor-spotlight');
      const bar = this.querySelector('.scroll-progress');
      const backTop = this.querySelector('.back-top');
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

      /* ---------- BEST cursor spotlight: adapted from the supplied React canvas component ---------- */
      this._cursorSpotRAF = 0;
      this._cursorSpotMove = null;
      this._cursorSpotLeave = null;
      this._cursorSpotResize = null;
      if (cursorSpotCanvas && FINE_POINTER && !FX_REDUCED) {
        const ctx = cursorSpotCanvas.getContext('2d', { alpha: true });
        if (ctx) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const radius = 240;
          const brightness = 0.11;
          const smoothing = 0.16;
          let targetX = -1000, targetY = -1000;
          let currentX = -1000, currentY = -1000;
          let visible = false;

          this._cursorSpotResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            cursorSpotCanvas.width = Math.max(1, Math.round(w * dpr));
            cursorSpotCanvas.height = Math.max(1, Math.round(h * dpr));
            cursorSpotCanvas.style.width = w + 'px';
            cursorSpotCanvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          };

          this._cursorSpotMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!visible) {
              currentX = targetX;
              currentY = targetY;
              visible = true;
            }
          };

          this._cursorSpotLeave = () => {
            visible = false;
            targetX = -1000;
            targetY = -1000;
          };

          const drawCursorSpotlight = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            if (visible) {
              currentX += (targetX - currentX) * smoothing;
              currentY += (targetY - currentY) * smoothing;

              const gradient = ctx.createRadialGradient(
                currentX, currentY, 0,
                currentX, currentY, radius
              );
              gradient.addColorStop(0, `rgba(225,21,7,${brightness})`);
              gradient.addColorStop(0.28, `rgba(225,21,7,${brightness * 0.62})`);
              gradient.addColorStop(0.58, `rgba(142,9,0,${brightness * 0.26})`);
              gradient.addColorStop(1, 'rgba(0,0,0,0)');

              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, w, h);
            }

            this._cursorSpotRAF = requestAnimationFrame(drawCursorSpotlight);
          };

          this._cursorSpotResize();
          window.addEventListener('resize', this._cursorSpotResize, { passive: true });
          window.addEventListener('mousemove', this._cursorSpotMove, { passive: true });
          document.addEventListener('mouseleave', this._cursorSpotLeave, { passive: true });
          this._cursorSpotRAF = requestAnimationFrame(drawCursorSpotlight);
        }
      }

      const isHero = (s) => /hero/.test((s.getAttribute('data-screen-label') || '').toLowerCase()) ||
        s.classList.contains('hero') || s.classList.contains('page-hero') || s.classList.contains('campaign-hero');
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); this._observer.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });

      this._counters = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          this._counters.unobserve(e.target);
          const target = parseInt(e.target.getAttribute('data-countup'), 10) || 0;
          if (REDUCED) { e.target.textContent = target; return; }
          const t0 = performance.now(), dur = 1300;
          const tick = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            e.target.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });

      /* ---------- BEST effects: vanilla adaptation of Specular / Magic Bento / Chroma ---------- */
      this._fxCards = new WeakSet();
      this._fxMedia = new WeakSet();
      this._fxSpot = null;

      const getSpotlight = () => {
        if (!FINE_POINTER || FX_REDUCED) return null;
        if (this._fxSpot && this._fxSpot.isConnected) return this._fxSpot;
        const spot = document.createElement('div');
        spot.className = 'best-global-spotlight';
        spot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(spot);
        this._fxSpot = spot;
        return spot;
      };

      const addParticles = (card) => {
        if (!FINE_POINTER || FX_REDUCED || card.querySelector('.best-particle')) return;
        for (let i = 0; i < 7; i++) {
          const p = document.createElement('span');
          p.className = 'best-particle';
          p.setAttribute('aria-hidden', 'true');
          p.style.setProperty('--best-px', (10 + Math.random() * 80).toFixed(1) + '%');
          p.style.setProperty('--best-py', (10 + Math.random() * 80).toFixed(1) + '%');
          p.style.setProperty('--best-pdx', ((Math.random() - 0.5) * 58).toFixed(0) + 'px');
          p.style.setProperty('--best-pdy', ((Math.random() - 0.5) * 58).toFixed(0) + 'px');
          p.style.setProperty('--best-pdur', (2.2 + Math.random() * 1.8).toFixed(2) + 's');
          p.style.setProperty('--best-pdelay', (Math.random() * 0.8).toFixed(2) + 's');
          card.appendChild(p);
        }
      };

      const addRipple = (card, e) => {
        if (!FINE_POINTER || FX_REDUCED) return;
        const r = card.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const far = Math.max(
          Math.hypot(x, y),
          Math.hypot(r.width - x, y),
          Math.hypot(x, r.height - y),
          Math.hypot(r.width - x, r.height - y)
        );
        const ripple = document.createElement('span');
        ripple.className = 'best-ripple';
        ripple.setAttribute('aria-hidden', 'true');
        ripple.style.width = ripple.style.height = (far * 2) + 'px';
        ripple.style.left = (x - far) + 'px';
        ripple.style.top = (y - far) + 'px';
        card.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      };

      const armCard = (card) => {
        if (!card || this._fxCards.has(card)) return;
        this._fxCards.add(card);
        card.classList.add('best-fx-card');

        const computed = getComputedStyle(card);
        const transformSafe = computed.transform === 'none' || computed.transform === 'matrix(1, 0, 0, 1, 0, 0)';
        if (transformSafe) card.classList.add('best-transform-safe');
        addParticles(card);

        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const nx = (x / r.width) - 0.5;
          const ny = (y / r.height) - 0.5;
          card.style.setProperty('--best-x', x.toFixed(1) + 'px');
          card.style.setProperty('--best-y', y.toFixed(1) + 'px');
          card.style.setProperty('--best-glow', '1');

          if (FINE_POINTER && !FX_REDUCED && card.classList.contains('best-transform-safe')) {
            card.style.setProperty('--best-rx', (-ny * 5.2).toFixed(2) + 'deg');
            card.style.setProperty('--best-ry', (nx * 5.2).toFixed(2) + 'deg');
            card.style.setProperty('--best-tx', (nx * 4.0).toFixed(2) + 'px');
            card.style.setProperty('--best-ty', (ny * 3.0).toFixed(2) + 'px');
          }

          const spot = getSpotlight();
          if (spot) {
            spot.style.left = e.clientX + 'px';
            spot.style.top = e.clientY + 'px';
            spot.style.opacity = '0.9';
          }
        };
        const onEnter = (e) => {
          card.style.setProperty('--best-glow', '1');
          onMove(e);
        };
        const onLeave = () => {
          card.style.setProperty('--best-glow', '0');
          card.style.setProperty('--best-rx', '0deg');
          card.style.setProperty('--best-ry', '0deg');
          card.style.setProperty('--best-tx', '0px');
          card.style.setProperty('--best-ty', '0px');
          if (this._fxSpot) this._fxSpot.style.opacity = '0';
        };

        card.addEventListener('pointermove', onMove, { passive: true });
        card.addEventListener('pointerenter', onEnter, { passive: true });
        card.addEventListener('pointerleave', onLeave, { passive: true });

        const interactive = card.matches('a, button, [role="button"]') || !!card.querySelector('a, button, [role="button"]');
        if (interactive) card.addEventListener('pointerdown', (e) => addRipple(card, e), { passive: true });
      };

      const findMediaWrapper = (slot) => {
        let p = slot && slot.parentElement;
        for (let i = 0; p && i < 5; i++, p = p.parentElement) {
          if (p.tagName === 'SECTION') break;
          const s = p.getAttribute('style') || '';
          if (s.includes('aspect-ratio') && (s.includes('overflow') || parseFloat(getComputedStyle(p).borderRadius) >= 6)) return p;
        }
        return null;
      };

      const armMedia = (slot) => {
        const wrapper = findMediaWrapper(slot);
        if (!wrapper || this._fxMedia.has(wrapper)) return;
        this._fxMedia.add(wrapper);
        wrapper.classList.add('best-chroma');

        const onMove = (e) => {
          const r = wrapper.getBoundingClientRect();
          if (!r.width || !r.height) return;
          wrapper.style.setProperty('--best-cx', (e.clientX - r.left).toFixed(1) + 'px');
          wrapper.style.setProperty('--best-cy', (e.clientY - r.top).toFixed(1) + 'px');
          wrapper.classList.add('best-chroma-active');
        };
        wrapper.addEventListener('pointerenter', onMove, { passive: true });
        wrapper.addEventListener('pointermove', onMove, { passive: true });
        wrapper.addEventListener('pointerleave', () => wrapper.classList.remove('best-chroma-active'), { passive: true });
      };

      this._armEffects = () => {
        document.querySelectorAll(
          'main article[style*="border-radius"], main figure[style*="border-radius"], main a[style*="border-radius"]'
        ).forEach((el) => {
          const hasMedia = !!el.querySelector('x-import[component-from-global-scope="image-slot"], image-slot');
          if (el.matches('article, figure') || hasMedia) armCard(el);
        });

        document.querySelectorAll(
          'main x-import[component-from-global-scope="image-slot"], main image-slot'
        ).forEach((slot) => armMedia(slot));
      };

      this._setup = () => {
        document.querySelectorAll('main section').forEach(s => {
          if (isHero(s) || s.hasAttribute('data-no-reveal') || s.classList.contains('reveal-section')) return;
          s.classList.add('reveal-section'); this._observer.observe(s);
        });
        document.querySelectorAll('[data-countup]:not([data-cu-armed])').forEach(el => {
          el.setAttribute('data-cu-armed', '1');
          this._counters.observe(el);
        });
        this._armEffects();
      };

      this._setup();
      this._fxMO = new MutationObserver(() => {
        if (this._fxRAF) return;
        this._fxRAF = requestAnimationFrame(() => {
          this._fxRAF = 0;
          this._armEffects();
        });
      });
      this._fxMO.observe(document.body, { childList: true, subtree: true });

      let tries = 0;
      this._retry = setInterval(() => { this._setup(); if (++tries > 20) clearInterval(this._retry); }, 500);

      this._onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        backTop.classList.toggle('visible', window.scrollY > 620);
        document.documentElement.style.setProperty('--scroll-y', window.scrollY + 'px');
      };
      this._onScroll();
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }

    disconnectedCallback() {
      if (this._observer) this._observer.disconnect();
      if (this._counters) this._counters.disconnect();
      if (this._fxMO) this._fxMO.disconnect();
      if (this._fxRAF) cancelAnimationFrame(this._fxRAF);
      clearInterval(this._retry);
      window.removeEventListener('scroll', this._onScroll);
      if (this._cursorSpotRAF) cancelAnimationFrame(this._cursorSpotRAF);
      if (this._cursorSpotResize) window.removeEventListener('resize', this._cursorSpotResize);
      if (this._cursorSpotMove) window.removeEventListener('mousemove', this._cursorSpotMove);
      if (this._cursorSpotLeave) document.removeEventListener('mouseleave', this._cursorSpotLeave);
      if (this._fxSpot && this._fxSpot.parentNode) this._fxSpot.parentNode.removeChild(this._fxSpot);
    }
  }

  customElements.define('scroll-experience', ScrollExperience);
})();
