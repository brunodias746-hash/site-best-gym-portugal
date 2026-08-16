(function () {
  if (customElements.get('scroll-experience')) return;
  const CSS = `
html { scroll-behavior: smooth; }
.scroll-progress { position: fixed; z-index: 9998; top: 0; left: 0; height: 3px; background: #E30613; pointer-events: none; transition: width 80ms linear; }
.reveal-section { opacity: 0; transform: translateY(65px); transition: opacity 800ms cubic-bezier(0.22,0.61,0.36,1), transform 900ms cubic-bezier(0.22,0.61,0.36,1); }
.reveal-section.revealed { opacity: 1; transform: translateY(0); }
.reveal-section h2 { opacity: 0; transform-origin: top center; transform: perspective(500px) rotateX(-28deg) translateY(28px); transition: transform 800ms 80ms cubic-bezier(0.22,0.61,0.36,1), opacity 650ms 80ms; }
.reveal-section.revealed h2 { opacity: 1; transform: perspective(500px) rotateX(0deg) translateY(0); }
.motion-cursor, .motion-cursor-dot { position: fixed; z-index: 9997; top: 0; left: 0; border-radius: 50%; pointer-events: none; will-change: transform; }
.motion-cursor { width: 38px; height: 38px; margin: -19px 0 0 -19px; border: 1px solid rgba(227,6,19,0.85); transition: width 180ms, height 180ms, margin 180ms, background-color 180ms; }
.motion-cursor-dot { width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; background: #E30613; }
.motion-cursor.is-active { width: 62px; height: 62px; margin: -31px 0 0 -31px; background: rgba(227,6,19,0.13); }
.back-top { position: fixed; z-index: 80; right: 26px; bottom: 26px; width: 62px; height: 62px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #fff; background: #181818; border: 1px solid #444; border-radius: 50%; opacity: 0; visibility: hidden; transform: translateY(16px); transition: opacity 300ms, visibility 300ms, transform 300ms; cursor: pointer; font-family: inherit; }
.back-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
.back-top span { font-size: 20px; line-height: 1; }
.back-top small { font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; }
@media (pointer: fine) { body, a, button { cursor: none; } }
@media (max-width: 900px) {
  .motion-cursor, .motion-cursor-dot { display: none; }
  .back-top { right: 18px; bottom: 80px; width: 50px; height: 50px; }
}
`;
  const REDUCED = false;
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
      this.innerHTML = '<div class="scroll-progress" aria-hidden="true"></div>' +
        '<div class="motion-cursor" aria-hidden="true"></div>' +
        '<div class="motion-cursor-dot" aria-hidden="true"></div>' +
        '<button class="back-top" aria-label="Voltar ao topo"><span>\u2191</span><small>Topo</small></button>';
      const bar = this.querySelector('.scroll-progress');
      const cursor = this.querySelector('.motion-cursor');
      const dot = this.querySelector('.motion-cursor-dot');
      const backTop = this.querySelector('.back-top');
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

      const isHero = (s) => /hero/.test((s.getAttribute('data-screen-label') || '').toLowerCase()) ||
        s.classList.contains('hero') || s.classList.contains('page-hero') || s.classList.contains('campaign-hero');
      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); this._observer.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
      // Count-up: <el data-countup="365"> animates once when visible
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
      this._setup = () => {
        document.querySelectorAll('main section').forEach(s => {
          if (isHero(s) || s.hasAttribute('data-no-reveal') || s.classList.contains('reveal-section')) return;
          s.classList.add('reveal-section'); this._observer.observe(s);
        });
        document.querySelectorAll('[data-countup]:not([data-cu-armed])').forEach(el => { el.setAttribute('data-cu-armed', '1'); this._counters.observe(el); });
      };
      this._setup();
      let tries = 0;
      this._retry = setInterval(() => { this._setup(); if (++tries > 20) clearInterval(this._retry); }, 500);

      this._onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        backTop.classList.toggle('visible', window.scrollY > 620);
        document.documentElement.style.setProperty('--scroll-y', window.scrollY + 'px');
      };
      this._onMove = (e) => {
        const pos = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
        cursor.style.transform = pos;
        dot.style.transform = pos;
      };
      this._onOver = (e) => {
        const t = e.target;
        if (!t || !t.closest) return;
        cursor.classList.toggle('is-active', !!t.closest('a, button, .unit-card, .product, [data-cursor]'));
      };
      this._onScroll();
      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseover', this._onOver);
    }
    disconnectedCallback() {
      if (this._observer) this._observer.disconnect();
      if (this._counters) this._counters.disconnect();
      clearInterval(this._retry);
      window.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('mousemove', this._onMove);
      document.removeEventListener('mouseover', this._onOver);
    }
  }
  customElements.define('scroll-experience', ScrollExperience);
})();
