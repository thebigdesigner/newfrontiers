/* ==========================================================================
   New Frontiers Ministers' Global Network — global behaviour
   Loaded on every page. Header, drawer, search and reveals live here.
   ========================================================================== */
(function(){
  'use strict';

  var isHome = document.body.classList.contains('home');

  /* ------------------------------------------------------------------
     Header: on the home page it sits transparent over the hero and goes
     solid once you scroll. Everywhere else it is solid already.
     ------------------------------------------------------------------ */
  var head = document.querySelector('.site-head');
  if (head && isHome) {
    var onScroll = function(){ head.classList.toggle('stuck', window.scrollY > 40); };
    addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ------------------------------------------------------------------
     Section links. The header markup is identical on every page and
     points at index.html#id, so it works from any of them. On the home
     page itself, rewrite to bare hashes for smooth in-page scrolling.
     ------------------------------------------------------------------ */
  if (isHome) {
    var links = document.querySelectorAll('.site-head a[href^="index.html#"], .drawer a[href^="index.html#"]');
    Array.prototype.forEach.call(links, function(a){
      a.setAttribute('href', a.getAttribute('href').replace('index.html', ''));
    });
  }

  /* Old WordPress anchors (#AboutUs, #Resources, #Events) still exist in
     the wild — send them to the right section instead of nowhere. */
  var LEGACY = {aboutus:'about', resources:'resources', events:'events', contact:'contact'};
  function fixLegacyHash(){
    var h = (location.hash || '').replace('#','').toLowerCase();
    if (h && LEGACY[h] && !document.getElementById(location.hash.slice(1))) {
      var el = document.getElementById(LEGACY[h]);
      if (el) el.scrollIntoView();
    }
  }
  if (isHome) { addEventListener('hashchange', fixLegacyHash); fixLegacyHash(); }

  /* ------------------------------------------------------------------
     Mobile drawer
     ------------------------------------------------------------------ */
  var drawer = document.getElementById('drawer'),
      menuOpen = document.getElementById('menuOpen'),
      menuClose = document.getElementById('menuClose');

  function setMenu(open){
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (menuOpen) menuOpen.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuOpen) menuOpen.onclick = function(){ setMenu(true); };
  if (menuClose) menuClose.onclick = function(){ setMenu(false); };
  if (drawer) drawer.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });

  /* ------------------------------------------------------------------
     Search. Everything lives on the home page, so a match either scrolls
     (when you are already there) or navigates to the right anchor.
     ------------------------------------------------------------------ */
  var SECTIONS = [
    {id:'pillars',    words:'pillars doctrinal purity ministerial integrity kingdom exploits scripture'},
    {id:'about',      words:'about us story frontier philosophy mission vision nfmgn'},
    {id:'tribe',      words:'who is this for pastors founders youth campus marketplace apostles creative join tribe'},
    {id:'onboarding', words:'onboarding process application vetting induction apply join steps'},
    {id:'resources',  words:'resources exploits lab mentorship archive handbook tech hub htecb downloads'},
    {id:'events',     words:'events frontier calendar scale session online classroom quarterly summit'},
    {id:'contact',    words:'contact fellowship email phone call reach social'}
  ];

  var bar = document.getElementById('searchBar'),
      input = document.getElementById('searchInput'),
      searchOpen = document.getElementById('searchOpen'),
      searchClose = document.getElementById('searchClose');

  if (searchOpen) searchOpen.onclick = function(){ bar.classList.add('open'); input.focus(); };
  if (searchClose) searchClose.onclick = function(){ bar.classList.remove('open'); };

  addEventListener('keydown', function(e){
    if (e.key === 'Escape') { setMenu(false); if (bar) bar.classList.remove('open'); }
  });

  if (bar) bar.addEventListener('submit', function(e){
    e.preventDefault();
    var q = input.value.trim().toLowerCase();
    if (!q) return;

    var hit = null;
    for (var i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].id.indexOf(q) > -1 || SECTIONS[i].words.indexOf(q) > -1) { hit = SECTIONS[i].id; break; }
    }
    if (!hit && isHome) {
      var secs = document.querySelectorAll('section[id],footer[id]');
      for (var j = 0; j < secs.length; j++) {
        if (secs[j].textContent.toLowerCase().indexOf(q) > -1) { hit = secs[j].id; break; }
      }
    }

    if (!hit) {
      input.value = '';
      input.placeholder = 'Nothing matches that. Try "events" or "resources".';
      return;
    }
    bar.classList.remove('open');
    if (isHome) {
      var el = document.getElementById(hit);
      if (el) el.scrollIntoView({behavior:'smooth'});
    } else {
      location.href = 'index.html#' + hit;
    }
  });

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var items = document.querySelectorAll('.rv');
  if (!items.length) return;

  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(items, function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      var sibs = en.target.parentNode.children,
          i = Array.prototype.indexOf.call(sibs, en.target);
      en.target.style.transitionDelay = Math.min(i, 4) * 80 + 'ms';
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, {rootMargin:'0px 0px -8% 0px', threshold:.12});
  Array.prototype.forEach.call(items, function(el){ io.observe(el); });
})();
