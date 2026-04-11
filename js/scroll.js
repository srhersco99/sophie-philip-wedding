/* ═══════════════════════════════════════════════════════════════
   SCROLL.JS — Reveal animations, SVG draw, timeline line, parallax
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Respect prefers-reduced-motion ─────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Generic reveal (fade + slide up) ───────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0 && !prefersReduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── SVG draw animation (wreath & sprig elements) ───────── */
  const svgDrawEls = document.querySelectorAll('.svg-draw');

  if (svgDrawEls.length > 0 && !prefersReduced) {
    const svgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          svgObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    svgDrawEls.forEach(el => svgObserver.observe(el));
  } else if (prefersReduced) {
    svgDrawEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Timeline line reveal ────────────────────────────────── */
  const timeline = document.querySelector('.timeline');

  if (timeline && !prefersReduced) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-revealed');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    timelineObserver.observe(timeline);
  } else if (timeline && prefersReduced) {
    timeline.classList.add('line-revealed');
  }

  /* ── Parallax on hero Palm House illustration ────────────── */
  const palmHouse = document.querySelector('.hero__palm-house');

  if (palmHouse && !prefersReduced) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxShift = 40;
          const shift = Math.min(scrollY * 0.15, maxShift);
          palmHouse.style.transform = `translateX(-50%) translateY(${shift}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Lazy-load Google Maps iframe ────────────────────────── */
  const mapWrapper = document.querySelector('.map-wrapper');
  const mapPlaceholder = document.querySelector('[data-map-src]');

  if (mapPlaceholder && !prefersReduced) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const src = mapPlaceholder.getAttribute('data-map-src');
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.title = 'Cambridge Cottage, Kew Gardens — Map';
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.setAttribute('allowfullscreen', '');
          mapPlaceholder.replaceWith(iframe);
          mapObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });

    mapObserver.observe(mapWrapper);
  } else if (mapPlaceholder) {
    // Load immediately if reduced motion (no lazy trick needed)
    const src = mapPlaceholder.getAttribute('data-map-src');
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Cambridge Cottage, Kew Gardens — Map';
    iframe.setAttribute('loading', 'lazy');
    mapPlaceholder.replaceWith(iframe);
  }

})();
