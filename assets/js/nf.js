/* New Frontiers — site behaviour: header, mobile drawer, reveals, counters,
   hero slider, nav highlighting. No dependencies. */
(function(){
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- header: solid after scrolling ---- */
  var hd = $('#hd');
  function headState(){ if(hd) hd.classList.toggle('is-solid', window.scrollY > 30); }
  window.addEventListener('scroll', headState, { passive:true });
  headState();

  /* ---- mobile drawer ---- */
  var burger = $('#burger'), drawer = $('#drawer'), closeBtn = $('#drawerClose');
  function openNav(){ if(!drawer) return; drawer.classList.add('is-open'); document.body.classList.add('nav-open'); burger.setAttribute('aria-expanded','true'); (closeBtn||drawer).focus(); }
  function closeNav(){ if(!drawer || !drawer.classList.contains('is-open')) return; drawer.classList.remove('is-open'); document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded','false'); burger.focus(); }
  if(burger) burger.addEventListener('click', openNav);
  if(closeBtn) closeBtn.addEventListener('click', closeNav);
  if(drawer) $$('a', drawer).forEach(function(a){ a.addEventListener('click', function(){ drawer.classList.remove('is-open'); document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded','false'); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });

  /* ---- reveals + counters ---- */
  function count(el){
    if(el.dataset.counted) return; el.dataset.counted = '1';
    var target = +el.dataset.count, cv = $('.cv', el) || el, t0 = performance.now(), dur = reduce ? 0 : 1500;
    if(!dur){ cv.textContent = target; return; }
    (function tick(t){ var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); cv.textContent = Math.round(target * e); if(p < 1) requestAnimationFrame(tick); })(t0);
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(count);
      if(en.target.hasAttribute('data-count')) count(en.target);
      io.unobserve(en.target);
    });
  }, { threshold:.14, rootMargin:'0px 0px -6% 0px' });
  $$('.rv, .rv-stagger, .num').forEach(function(el){ io.observe(el); });
  /* backstop: never leave content invisible */
  function revealAll(){ document.body.classList.add('revealed'); $$('[data-count]').forEach(count); }
  window.addEventListener('load', function(){ setTimeout(revealAll, 2500); });
  setTimeout(revealAll, 6000);

  /* ---- nav highlighting while scrolling the home page ---- */
  var links = $$('.hd-nav a[href^="#"]');
  if(links.length){
    var map = {};
    links.forEach(function(a){ var id = a.getAttribute('href').slice(1), s = document.getElementById(id); if(s) map[id] = a; });
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        links.forEach(function(a){ a.classList.remove('is-active'); });
        map[en.target.id].classList.add('is-active');
      });
    }, { rootMargin:'-40% 0px -55% 0px' });
    Object.keys(map).forEach(function(id){ spy.observe(document.getElementById(id)); });
  }

  /* ---- hero slider ---- */
  var hero = $('#top');
  if(hero){
    var slides = $$('.slide', hero), media = $$('.hero-media > *', hero), dots = $$('.dots button', hero);
    var i = 0, timer = null, DELAY = 7000;
    function show(n){
      i = (n + slides.length) % slides.length;
      slides.forEach(function(s, k){ s.classList.toggle('is-on', k === i); });
      media.forEach(function(m){ m.classList.toggle('is-on', +m.dataset.slide === i); });
      dots.forEach(function(d, k){ d.setAttribute('aria-selected', k === i ? 'true' : 'false'); d.tabIndex = k === i ? 0 : -1; });
      media.forEach(function(m){
        var gb = m.classList.contains('globe-box') ? m : m.querySelector('.globe-box');
        if(!gb) return;
        gb.dataset.on = m.classList.contains('is-on') ? '1' : '0';
        if(gb.dataset.on === '1') gb.dispatchEvent(new Event('globe:resume'));
      });
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function play(){ if(reduce || timer || document.hidden || slides.length < 2) return; timer = setInterval(function(){ show(i + 1); }, DELAY); }
    dots.forEach(function(d, k){
      d.addEventListener('click', function(){ show(k); stop(); play(); });
      d.addEventListener('keydown', function(e){
        if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); show(i + (e.key === 'ArrowRight' ? 1 : -1)); dots[i].focus(); stop(); play();
      });
    });
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop);    hero.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : play(); });
    var x0 = null;
    hero.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, { passive:true });
    hero.addEventListener('touchend', function(e){
      if(x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if(Math.abs(dx) > 50){ show(i + (dx < 0 ? 1 : -1)); stop(); play(); }
    }, { passive:true });
    show(0); play();
  }
})();
