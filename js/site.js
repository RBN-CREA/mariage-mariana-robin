/* Mariana & Robin — scripts partagés */
(function () {
  'use strict';

  var WEDDING = new Date('2027-05-15T12:00:00');
  var MAPS_DEST = 'Domaine+de+Montmanoir+Montlignon+95680';
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav scroll + active link ── */
  function initNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var path = (location.pathname.split('/').pop() || '').toLowerCase();
    if (!path) return;
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path) a.setAttribute('aria-current', 'page');
    });
  }

  /* ── Countdown ── */
  function initCountdown() {
    var dEl = document.getElementById('cd-d');
    if (!dEl) return;
    var hEl = document.getElementById('cd-h');
    var mEl = document.getElementById('cd-m');
    var sEl = document.getElementById('cd-s');
    var prev = { d: null, h: null, m: null, s: null };

    function setVal(el, key, val) {
      if (!el) return;
      if (prev[key] !== null && prev[key] !== val && !prefersReduced) {
        el.classList.add('is-tick');
        window.setTimeout(function () {
          el.textContent = val;
          el.classList.remove('is-tick');
        }, 120);
      } else {
        el.textContent = val;
      }
      prev[key] = val;
    }

    function tick() {
      var diff = WEDDING - new Date();
      if (diff <= 0) {
        setVal(dEl, 'd', '0');
        setVal(hEl, 'h', '00');
        setVal(mEl, 'm', '00');
        setVal(sEl, 's', '00');
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      setVal(dEl, 'd', String(d));
      setVal(hEl, 'h', String(h).padStart(2, '0'));
      setVal(mEl, 'm', String(m).padStart(2, '0'));
      setVal(sEl, 's', String(s).padStart(2, '0'));
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* ── Timeline + generic reveals ── */
  function initReveals() {
    var nodes = document.querySelectorAll('.tl-row, .reveal, .reveal-scale');
    if (!nodes.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) {
        el.classList.add('vis', 'is-in');
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('vis', 'is-in');
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 0.08, 0.48) + 's';
      obs.observe(el);
    });
  }

  /* ── Maps CTA ── */
  function initMaps() {
    var btn = document.querySelector('[data-open-maps]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url =
        'https://www.google.com/maps/dir/?api=1&destination=' + MAPS_DEST;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ── Sakura petals ── */
  function initPetals() {
    var section = document.getElementById('pg-voyage');
    if (!section || prefersReduced) return;

    var MAX_ALIVE = 28;
    var alive = 0;
    var ground = [];
    var MAX_GROUND = 24;
    var timer = null;

    function spawn() {
      if (alive >= MAX_ALIVE) return;
      alive += 1;

      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.setAttribute('aria-hidden', 'true');

      var isFg = Math.random() > 0.45;
      petal.classList.add(isFg ? 'is-fg' : 'is-bg');

      var size = isFg
        ? 10 + Math.random() * 8
        : 6 + Math.random() * 6;
      petal.style.width = size + 'px';
      petal.style.height = size * 0.85 + 'px';
      petal.style.left = Math.random() * 100 + '%';

      var fall =
        section.offsetHeight + 40 - Math.random() * 24;
      petal.style.setProperty('--fall-distance', fall + 'px');
      petal.style.animationDuration =
        (isFg ? 6 + Math.random() * 4 : 8 + Math.random() * 5) + 's';

      section.appendChild(petal);

      petal.addEventListener('animationend', function () {
        alive -= 1;
        ground.push(petal);
        if (ground.length > MAX_GROUND) {
          var old = ground.shift();
          if (old && old.parentNode) old.parentNode.removeChild(old);
        }
      });
    }

    function loop() {
      if (document.hidden) return;
      spawn();
      timer = window.setTimeout(loop, 380 + Math.random() * 520);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (timer) window.clearTimeout(timer);
        timer = null;
        return;
      }
      if (!timer) loop();
    });

    loop();
  }

  /* ── Cagnotte placeholder ── */
  function initCagnotte() {
    var btn = document.querySelector('[data-cagnotte]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var msg =
        btn.getAttribute('data-cagnotte-msg') ||
        'Le lien de la cagnotte sera bientôt disponible.';
      window.alert(msg);
    });
  }

  function boot() {
    initNav();
    initCountdown();
    initReveals();
    initMaps();
    initPetals();
    initCagnotte();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
