/* ============================================================
   Pela Terra Farmland — 2025 Impact Report (Web edition)
   Scroll reveal · parallax · stat count-up · nav overlay
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. SCROLL REVEAL ------------------------------------------------ */
  // Anything tagged .reveal, dark full-bleed sections, AND stagger containers
  // (some of which carry no .reveal of their own — e.g. the KPI-glance table
  // columns and the SDG goal grid) animate in once.
  var STAGGER = '.statgrid, .kpi-glance__cols, .cols-2, .sdg-target, .toc';
  var revealEls = [].slice.call(document.querySelectorAll(
    '.reveal, .divider, .hero, .pullquote, ' + STAGGER
  ));

  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        // stagger the direct children of stagger containers
        if (el.matches(STAGGER)) {
          [].slice.call(el.children).forEach(function (k, i) {
            k.style.transitionDelay = (i * 70) + 'ms';
          });
        }
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // reduced motion / no IO — show everything
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- 1b. CONTINUATION GAPS ------------------------------------------- */
  // Sections that were one logical section split across print pages share a
  // data-section. Tag consecutive prose pairs so they read as one flowing
  // section instead of leaving a double-padded gap.
  function isProse(el) {
    return el && el.classList.contains('section') &&
      !el.classList.contains('pullquote') &&
      !el.classList.contains('statband') &&
      !el.classList.contains('colophon');
  }
  var topSections = [].slice.call(document.querySelectorAll('#report > section'));
  for (var i = 1; i < topSections.length; i++) {
    var cur = topSections[i], prev = topSections[i - 1];
    var ds = cur.getAttribute('data-section');
    if (ds && ds === prev.getAttribute('data-section') && isProse(cur) && isProse(prev)) {
      prev.classList.add('tight-bottom');
      cur.classList.add('tight-top');
    }
  }

  /* ---- 2. PARALLAX on full-bleed backgrounds --------------------------- */
  var parEls = [].slice.call(document.querySelectorAll('.cover__bg, .divider__bg, .hero__bg'));
  var ticking = false;
  function parallax() {
    var vh = window.innerHeight;
    parEls.forEach(function (bg) {
      var host = bg.parentElement;
      var r = host.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return; // off-screen
      // progress -1 .. 1 across viewport
      var prog = (r.top + r.height / 2 - vh / 2) / vh;
      var shift = Math.max(-1, Math.min(1, prog)) * 6; // ±6%
      bg.style.transform = 'translate3d(0,' + shift + '%,0)';
    });
    ticking = false;
  }
  function onScroll() {
    updateProgress();
    updateTopbar();
    if (!reduce && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }

  /* ---- 3. PROGRESS BAR + TOP BAR --------------------------------------- */
  var progress = document.getElementById('progress');
  var topbar = document.getElementById('topbar');
  var current = document.getElementById('tbCurrent');
  var cover = document.querySelector('.cover');

  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }

  function updateTopbar() {
    if (!topbar) return;
    var coverH = cover ? cover.offsetHeight : window.innerHeight;
    if (window.scrollY > coverH * 0.7) topbar.classList.add('show');
    else topbar.classList.remove('show');
  }

  // current-section label: track which [data-section] is in view
  var sectionEls = [].slice.call(document.querySelectorAll('[data-section]'));
  if ('IntersectionObserver' in window && current) {
    var labelIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var lbl = e.target.getAttribute('data-section') || '';
          if (lbl && lbl !== 'Cover' && lbl !== 'Contents') current.textContent = lbl;
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sectionEls.forEach(function (s) { labelIO.observe(s); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { parallax(); updateTopbar(); });

  /* ---- 4. STAT COUNT-UP ------------------------------------------------ */
  // Animate hero .stat and headline .statgrid .num when they enter view,
  // but only when the value is a single clean number (keeps prefix/suffix).
  function setupCountUp(el) {
    var raw = el.textContent.trim();
    // capture: prefix (non-number) | number (with , and .) | suffix
    var m = raw.match(/^([^\d\-−]*)(-?−?[\d.,]+)(.*)$/);
    if (!m) return;
    var prefix = m[1], numStr = m[2], suffix = m[3];
    // reject if suffix contains another digit (multi-number strings like "175 ha · 20%")
    if (/\d/.test(suffix)) return;
    var neg = /^[-−]/.test(numStr);
    var clean = numStr.replace(/[−,-]/g, '');
    var hasDot = clean.indexOf('.') >= 0;
    var decimals = hasDot ? (clean.split('.')[1] || '').length : 0;
    var target = parseFloat(clean);
    if (isNaN(target)) return;
    var hadComma = /,/.test(numStr);

    function fmt(v) {
      var s = v.toFixed(decimals);
      if (hadComma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      return prefix + (neg ? '−' : '') + s + suffix;
    }
    var dur = 1400, t0 = null;
    el.textContent = fmt(0);
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  var countEls = [].slice.call(document.querySelectorAll('.hero .stat, .statband .statgrid .num'));
  if ('IntersectionObserver' in window && !reduce) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        setupCountUp(e.target);
        countIO.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { countIO.observe(el); });
  }

  /* ---- 5. NAV OVERLAY (built from the in-page Contents list) ----------- */
  var overlay = document.getElementById('overlay');
  var menuBtn = document.getElementById('menuBtn');
  var ovClose = document.getElementById('ovClose');
  var ovNav = document.getElementById('ovNav');
  var sourceToc = document.querySelector('#contents .toc');

  if (ovNav && sourceToc) {
    ovNav.innerHTML = sourceToc.innerHTML; // clone the same links (incl. anchors)
  }
  function openMenu() { if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeMenu() { if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; } }
  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (ovClose) ovClose.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeMenu(); });
  if (ovNav) ovNav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (a) closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // initial paint
  updateProgress();
  updateTopbar();
  if (!reduce) parallax();
})();
