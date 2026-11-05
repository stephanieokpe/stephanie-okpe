/* ==========================================================================
   Stephanie Okpe | Portfolio
   Vanilla JS: placeholders, hero intro, floating squares, scroll reveal.
   Smooth scrolling is handled in CSS (scroll-behavior).
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const rand = (min, max) => Math.random() * (max - min) + min;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. IMAGE PLACEHOLDERS ----------
     If an image file is missing, hide the broken icon so the dashed
     placeholder (with its file path label) shows instead. */
  function initPlaceholders() {
    $$('.ph').forEach((box) => {
      const img = $('img', box);
      if (!img) return;

      const markLoaded  = () => box.classList.add('is-loaded');
      const markMissing = () => { img.hidden = true; box.classList.remove('is-loaded'); };

      if (img.complete) {
        img.naturalWidth > 0 ? markLoaded() : markMissing();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markMissing, { once: true });
      }
    });
  }

  /* ---------- 2. FLOATING SQUARES ---------- */
  function initSquares() {
    $$('.square').forEach((sq) => {
      sq.style.setProperty('--fd', `${rand(5, 9).toFixed(2)}s`);
      sq.style.setProperty('--fdelay', `${(-rand(0, 6)).toFixed(2)}s`);
      sq.style.setProperty('--fx', `${rand(-10, 10).toFixed(1)}px`);
      sq.style.setProperty('--fy', `${rand(-18, -8).toFixed(1)}px`);
      sq.style.setProperty('--fr', `${rand(-12, 12).toFixed(1)}deg`);
    });
  }

  /* ---------- 3. HERO INTRO ----------
     Text items fade up in order, the portrait slides/scales in alongside,
     then the squares pop in. CSS reads --i to stagger the delay. */
  function initHero() {
    const textItems = $$('.hero__text [data-hero]');
    textItems.forEach((el, i) => el.style.setProperty('--i', i));

    const portrait = $('[data-hero="portrait"]');
    if (portrait) portrait.style.setProperty('--i', 1);

    $$('.hero [data-hero="square"]').forEach((sq, i) => {
      sq.style.setProperty('--i', textItems.length + i);
    });

    const start = () => requestAnimationFrame(() =>
      document.documentElement.classList.add('hero-ready'));

    if (reduceMotion) { start(); return; }

    // Wait for web fonts (max 1.2s) so the intro doesn't play on fallback text
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(start);
  }

  /* ---------- 4. SCROLL REVEAL ----------
     Headings, cards, boxes and every gallery image fade/slide up as they
     enter the viewport. Gallery tiles get a small stagger per row. */
  function initReveal() {
    const items = $$('[data-reveal], .gallery .media, .samples__grid .media');

    $$('.gallery, .samples__grid').forEach((group) => {
      $$('.media', group).forEach((tile, i) => {
        tile.style.setProperty('--reveal-delay', `${(i % 3) * 0.09}s`);
      });
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- INIT ---------- */
  initPlaceholders();
  initSquares();
  initHero();
  initReveal();
})();
