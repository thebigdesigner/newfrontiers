/* New Frontiers — navigation, reveals, parallax (from the D-Vine build, unchanged) */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const head=document.getElementById('head'), hero=document.getElementById('top'), prog=document.getElementById('prog');
function headState(){ if(!head) return; head.classList.toggle('scrolled', window.scrollY>40 || document.body.classList.contains('solid-head')); }
function lightHero(){ if(hero) hero.classList.add('lit'); }
window.addEventListener('load',()=>requestAnimationFrame(lightHero));
setTimeout(lightHero,300);
function runCounter(el){
  if(el.dataset.counted) return; el.dataset.counted='1';
  const target=+el.dataset.count, cv=el.querySelector('.cv'), dur=1600, t0=performance.now();
  function tick(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);cv.textContent=Math.round(target*e);if(p<1)requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
}
function corners(){ document.querySelectorAll('.ccard').forEach(c=>{ if(c.querySelector('.corner')) return; const s=document.createElement('span');s.className='corner';s.textContent='↗';c.appendChild(s); }); }
corners();
const io=new IntersectionObserver((es)=>{es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in');
    e.target.querySelectorAll && e.target.querySelectorAll('[data-count]').forEach(runCounter);
    io.unobserve(e.target);
  }});},{threshold:.14, rootMargin:'0px 0px -7% 0px'});
document.querySelectorAll('.r,.stagger,.rvimg').forEach(el=>io.observe(el));
/* content injected after load (cards, lists) still needs the reveal + corners */
window.Reveal = { scan(){ corners(); document.querySelectorAll('.r,.stagger,.rvimg').forEach(el=>{ if(!el.classList.contains('in')) io.observe(el); }); } };
/* Backstop: if IntersectionObserver never fires for something — an odd viewport,
   a zero-height box at observe time, a browser quirk — reveal it anyway rather
   than leaving it invisible. */
function revealAll(){ document.body.classList.add('revealed');
  document.querySelectorAll('[data-count]').forEach(runCounter); }
window.addEventListener('load', ()=>setTimeout(revealAll, 2500));
setTimeout(revealAll, 6000);
const heroBg=document.querySelector('.hero__bg');
const heroIn=document.querySelector('.hero__in');
const r2img=document.querySelector('.r2hero-r img');
let ticking=false;
function fx(){
  const y=window.scrollY, vh=window.innerHeight;
  const docH=document.documentElement.scrollHeight-vh;
  if(prog) prog.style.width=(docH>0?Math.min(y/docH*100,100):0)+'%';
  if(reduce) return;
  if(window.matchMedia('(max-width:720px)').matches){
    if(heroBg) heroBg.style.transform='';
    if(heroIn){ heroIn.style.transform=''; heroIn.style.opacity=''; }
    if(r2img) r2img.style.transform='scale(1.16)';
    return;
  }
  if(heroBg) heroBg.style.transform=`translate3d(0,${(y*0.2).toFixed(1)}px,0)`;
  if(heroIn){ const p=Math.min(y/(vh*0.85),1); heroIn.style.transform=`translateY(${(p*70).toFixed(1)}px)`; heroIn.style.opacity=(1-p*0.95).toFixed(3); }
  if(r2img){ const r=r2img.parentElement.getBoundingClientRect(); const off=(r.top+r.height/2-vh/2)*-0.04; r2img.style.transform=`translate3d(0,${off.toFixed(1)}px,0) scale(1.16)`; }
}
function onScroll(){ headState(); if(!ticking){ requestAnimationFrame(()=>{fx();ticking=false;}); ticking=true; } }
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',fx);
headState(); fx();
window.addEventListener('load',()=>setTimeout(fx,100));

/* hero camera: 3D mouse tilt + scroll dolly-in (eased, idles when still) */
(function(){
  const cam=document.querySelector('.hero__cam'), heroHead=document.querySelector('.hero-head');
  if(!cam || !hero || reduce) return;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  let tx=0,ty=0,cx=0,cy=0,running=false;
  function frame(){
    cx+=(tx-cx)*0.07; cy+=(ty-cy)*0.07;
    const vh=window.innerHeight, y=window.scrollY;
    const p=Math.min(Math.max(y/vh,0),1);
    const s=1.06+p*0.3;                         /* push into the house as you scroll */
    cam.style.transform='translate3d('+(-cx*30).toFixed(2)+'px,'+(-cy*20).toFixed(2)+'px,0) '+
      'rotateY('+(cx*5.5).toFixed(3)+'deg) rotateX('+(-cy*4).toFixed(3)+'deg) scale('+s.toFixed(4)+')';
    if(heroHead) heroHead.style.transform='translate3d('+(cx*24).toFixed(2)+'px,'+(cy*14).toFixed(2)+'px,0)';
    if(Math.abs(tx-cx)>0.0004 || Math.abs(ty-cy)>0.0004) requestAnimationFrame(frame); else running=false;
  }
  function kick(){ if(!running){ running=true; requestAnimationFrame(frame); } }
  if(fine){
    hero.addEventListener('pointermove',e=>{ const r=hero.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width-0.5; ty=(e.clientY-r.top)/r.height-0.5; kick(); });
    hero.addEventListener('pointerleave',()=>{ tx=0; ty=0; kick(); });
  }
  window.addEventListener('scroll',()=>{ if(window.scrollY<window.innerHeight*1.3) kick(); },{passive:true});
  window.addEventListener('resize',kick);
  kick();
})();
const burger=document.getElementById('burger');
const mobileNav=document.getElementById('mobileNav');
const navClose=document.getElementById('navClose');
function openNav(){ if(!mobileNav) return; mobileNav.classList.add('open'); document.body.classList.add('nav-locked'); burger.setAttribute('aria-expanded','true'); }
function closeNav(){ if(!mobileNav) return; mobileNav.classList.remove('open'); document.body.classList.remove('nav-locked'); burger.setAttribute('aria-expanded','false'); }
if(burger) burger.addEventListener('click',openNav);
if(navClose) navClose.addEventListener('click',closeNav);
if(mobileNav) mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !document.getElementById('pvViewer').classList.contains('pv-open')) closeNav(); });
