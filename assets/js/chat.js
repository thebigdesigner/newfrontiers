/* New Frontiers — website assistant widget.
   Talks to /api/chat (Gemini, server side). The conversation survives page
   changes (sessionStorage). "Continue on WhatsApp" opens wa.me with a short
   first-person summary of the chat, so the team picks up with full context.
   Settings (name, greeting, WhatsApp number, intro line) live in
   network.json -> chat on the server; widget defaults are just below. */
(function(){
  if(window.__dvChat) return; window.__dvChat = true;

  const C = window.CONTENT || {};
  const cfg = Object.assign({
    name: 'Frontier Assistant',
    greeting: "Welcome 🙏 I'm the New Frontiers assistant. Ask me about the network, the three pillars, our events, or how to join.",
    whatsapp: '2348028295917',
    whatsappIntro: 'Hello New Frontiers, I was chatting with the assistant on your website.'
  }, C.chat || {});
  const WA = String(cfg.whatsapp || '').replace(/\D/g, '');
  const API = '/api/chat';
  const KEY = 'nf-chat';

  /* ---------- state ---------- */
  let state = { open:false, messages:[] };
  try{ const s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if(s && Array.isArray(s.messages)) state = s; }catch(e){}
  const save = () => { try{ sessionStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} };
  let busy = false;

  /* ---------- styles ---------- */
  const css = `
.dvc{--c-teal:var(--teal,#2795ae);--c-teal-d:var(--teal-dark,#1f7f96);--c-mint:var(--mint,#4fccbe);
  --c-navy:var(--navy,#1e293b);--c-navy-d:var(--navy-deep,#0a1a2b);--c-ink:var(--ink,#16232e);
  --c-body:var(--body,#5b6672);--c-faint:var(--faint,#9aa1ad);--c-tint:var(--tint,#f2fafc);
  --c-line:var(--line,#e4e7ea);--c-wa:#25D366;--c-wa-d:#1DA851;
  --c-f:var(--f-body,'Raleway',system-ui,sans-serif);
  --c-eo:var(--eo,cubic-bezier(.16,1,.3,1));font-family:var(--c-f)}

/* launcher — the site's teal pill button, as a circle */
.dvc-launch{position:fixed;right:22px;bottom:22px;z-index:70;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;
  background:var(--c-teal);color:#fff;display:flex;align-items:center;justify-content:center;
  box-shadow:0 18px 36px -14px rgba(31,127,150,.7);transition:transform .45s var(--c-eo),background .3s,box-shadow .45s}
.dvc-launch:hover{background:var(--c-teal-d);transform:translateY(-3px);box-shadow:0 24px 42px -16px rgba(31,127,150,.8)}
.dvc-launch svg{width:24px;height:24px}
.dvc-launch .dvc-x{display:none}
.dvc.open .dvc-launch{background:var(--c-navy)}
.dvc.open .dvc-launch .dvc-bub{display:none}.dvc.open .dvc-launch .dvc-x{display:block}
.dvc-launch::after{content:"";position:absolute;top:4px;right:4px;width:11px;height:11px;border-radius:50%;background:var(--c-mint);border:2px solid #fff}
.dvc.open .dvc-launch::after{display:none}

.dvc-nudge{position:fixed;right:92px;bottom:30px;z-index:70;background:#fff;color:var(--c-ink);font-size:.82rem;font-weight:500;
  padding:.7rem 1rem;border-radius:100px 100px 6px 100px;border:1px solid var(--c-line);box-shadow:0 16px 32px -20px rgba(22,35,46,.45);
  cursor:pointer;opacity:0;transform:translateY(8px);transition:opacity .4s,transform .4s;pointer-events:none;max-width:230px}
.dvc-nudge.show{opacity:1;transform:none;pointer-events:auto}
.dvc.open .dvc-nudge{display:none}

/* panel */
.dvc-panel{position:fixed;right:22px;bottom:92px;z-index:85;width:390px;max-width:calc(100vw - 32px);height:min(620px,calc(100svh - 130px));
  background:#fff;border-radius:24px;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--c-line);
  box-shadow:0 40px 80px -30px rgba(10,26,43,.45);
  opacity:0;transform:translateY(16px) scale(.97);transform-origin:bottom right;pointer-events:none;
  transition:opacity .3s,transform .45s var(--c-eo)}
.dvc.open .dvc-panel{opacity:1;transform:none;pointer-events:auto}

/* header — the navy panel look from the network section */
.dvc-head{position:relative;display:flex;align-items:center;gap:.75rem;padding:1rem;color:#fff;background:var(--c-navy);overflow:hidden}
.dvc-head::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(70% 140% at 88% 10%,rgba(39,149,174,.75),transparent 70%),radial-gradient(40% 90% at 5% 100%,rgba(79,204,190,.3),transparent 70%)}
.dvc-head>*{position:relative}
.dvc-av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);
  display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:#fff}
.dvc-av svg{width:20px;height:20px}
.dvc-ttl{flex:1;min-width:0}
.dvc-ttl b{display:block;font-family:var(--f-display,var(--c-f));font-size:.98rem;font-weight:500;letter-spacing:-.01em;color:#fff}
.dvc-ttl span{display:flex;align-items:center;gap:.4rem;font-size:.72rem;color:rgba(255,255,255,.72)}
.dvc-ttl span::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--c-mint)}
.dvc-hbtn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.1);color:#fff;transition:background .3s,color .3s,border-color .3s}
.dvc-hbtn:hover{background:#fff;color:var(--c-navy);border-color:#fff}
.dvc-hbtn svg{width:17px;height:17px}
.dvc-hbtn.wa{background:var(--c-wa);border-color:var(--c-wa)}
.dvc-hbtn.wa:hover{background:var(--c-wa-d);border-color:var(--c-wa-d);color:#fff}

/* conversation */
.dvc-log{flex:1;overflow-y:auto;padding:1.1rem 1rem;display:flex;flex-direction:column;gap:.55rem;background:#fff;overscroll-behavior:contain}
.dvc-m{max-width:86%;padding:.7rem .95rem;border-radius:18px;font-size:.89rem;line-height:1.6;word-wrap:break-word}
.dvc-m.a{align-self:flex-start;background:var(--c-tint);color:var(--c-ink);border:1px solid var(--c-line);border-bottom-left-radius:6px}
.dvc-m.u{align-self:flex-end;background:var(--c-teal);color:#fff;border-bottom-right-radius:6px}
.dvc-m ul{margin:.4rem 0 .1rem;padding-left:1.15rem;list-style:disc}.dvc-m li{margin:.12rem 0}
.dvc-m.a li::marker{color:var(--c-teal)}
.dvc-m.a a{color:var(--c-teal-d);text-decoration:underline;text-underline-offset:2px}
.dvc-m.u a{color:#fff}
.dvc-m strong{font-weight:600;color:var(--c-ink)}.dvc-m.u strong{color:#fff}
.dvc-m p{margin:0}.dvc-m p+p{margin-top:.5rem}

/* WhatsApp hand-off — the site's pill with a round badge */
.dvc-wa-card{align-self:flex-start;display:inline-flex;align-items:center;gap:.7rem;border:0;cursor:pointer;
  background:var(--c-wa);color:#fff;font:600 .84rem/1 var(--c-f);padding:.45rem .5rem .45rem 1.1rem;border-radius:100px;
  box-shadow:0 12px 24px -14px rgba(37,211,102,.8);transition:transform .45s var(--c-eo),background .3s}
.dvc-wa-card:hover{background:var(--c-wa-d);transform:translateY(-2px)}
.dvc-wa-card .dvc-bdg{width:30px;height:30px;border-radius:50%;background:#fff;color:var(--c-wa-d);display:grid;place-items:center}
.dvc-wa-card svg{width:16px;height:16px}

.dvc-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.3rem}
.dvc-chip{border:1px solid var(--c-line);background:#fff;color:var(--c-ink);font:500 .8rem/1 var(--c-f);
  padding:.6rem .95rem;border-radius:100px;cursor:pointer;transition:background .35s,color .35s,border-color .35s}
.dvc-chip:hover{background:var(--c-tint);color:var(--c-teal-d);border-color:var(--c-teal)}

.dvc-typing{align-self:flex-start;background:var(--c-tint);border:1px solid var(--c-line);border-radius:18px;border-bottom-left-radius:6px;padding:.75rem .95rem;display:flex;gap:4px}
.dvc-typing i{width:6px;height:6px;border-radius:50%;background:var(--c-teal);opacity:.55;animation:dvcDot 1.2s infinite}
.dvc-typing i:nth-child(2){animation-delay:.15s}.dvc-typing i:nth-child(3){animation-delay:.3s}
@keyframes dvcDot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}

/* composer */
.dvc-form{display:flex;align-items:flex-end;gap:.5rem;padding:.75rem;border-top:1px solid var(--c-line);background:#fff}
.dvc-in{flex:1;resize:none;border:1px solid var(--c-line);border-radius:100px;padding:.7rem 1.05rem;font:500 .88rem/1.45 var(--c-f);
  color:var(--c-ink);background:var(--c-tint);max-height:110px;outline:none;transition:border-color .25s,background .25s,box-shadow .25s}
.dvc-in::placeholder{color:var(--c-faint)}
.dvc-in:focus{border-color:var(--c-teal);background:#fff;box-shadow:0 0 0 3px rgba(39,149,174,.12)}
.dvc-in.multi{border-radius:18px}
.dvc-send{width:42px;height:42px;border-radius:50%;border:0;cursor:pointer;background:var(--c-teal);color:#fff;display:flex;align-items:center;justify-content:center;flex:0 0 auto;
  transition:transform .45s var(--c-eo),background .3s}
.dvc-send:not(:disabled):hover{background:var(--c-teal-d);transform:translateY(-2px)}
.dvc-send:disabled{opacity:.35;cursor:default}
.dvc-send svg{width:18px;height:18px}
.dvc-foot{font-size:.66rem;color:var(--c-faint);text-align:center;padding:0 .8rem .7rem;background:#fff}

.nav-open .dvc,.nav-locked .dvc{display:none}
@media(max-width:560px){
  .dvc-launch{right:16px;bottom:16px;width:54px;height:54px}
  .dvc-nudge{right:78px;bottom:22px;max-width:190px;font-size:.78rem}
  .dvc-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:90svh;border-radius:24px 24px 0 0;border-bottom:0;transform-origin:bottom center}
  .dvc.open .dvc-launch{display:none}
}
@media(prefers-reduced-motion:reduce){.dvc-panel,.dvc-launch,.dvc-nudge,.dvc-send,.dvc-wa-card{transition:none}.dvc-typing i{animation:none}}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- icons ---------- */
  const I = {
    chat:'<svg class="dvc-bub" viewBox="0 0 24 24" fill="none"><path d="M4.5 18.2V6.8A2.3 2.3 0 016.8 4.5h10.4a2.3 2.3 0 012.3 2.3v7.4a2.3 2.3 0 01-2.3 2.3H8.6L4.5 19.8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 9.6h7M8.5 12.6h4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    mark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.7 2.9 2.7 14.3 0 17.2M12 3.4c-2.7 2.9-2.7 14.3 0 17.2"/></svg>',
    send:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2.5a9.43 9.43 0 00-8.1 14.3L2.6 21.5l4.83-1.27A9.44 9.44 0 1012.04 2.5zm0 17.2a7.8 7.8 0 01-3.97-1.09l-.28-.17-2.87.75.77-2.8-.19-.29a7.8 7.8 0 1113.34-5.5 7.8 7.8 0 01-6.8 9.1zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.16.23-.61.76-.75.92-.14.16-.28.18-.51.06a6.4 6.4 0 01-1.88-1.16 7.06 7.06 0 01-1.3-1.62c-.14-.23-.02-.36.1-.47.1-.1.23-.27.35-.4.12-.14.16-.24.23-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.27-.72-1.74-.19-.46-.39-.4-.53-.4h-.45a.87.87 0 00-.63.3 2.65 2.65 0 00-.83 1.97 4.6 4.6 0 00.97 2.44 10.5 10.5 0 004.02 3.55c.56.24 1 .39 1.34.5.56.18 1.08.15 1.48.09.45-.07 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.28z"/></svg>'
  };

  /* ---------- DOM ---------- */
  const root = document.createElement('div');
  root.className = 'dvc';
  root.innerHTML =
    '<div class="dvc-nudge" role="button" tabindex="0">Questions about the network? Ask here 🙏</div>' +
    '<section class="dvc-panel" role="dialog" aria-label="' + esc(cfg.name) + '" aria-modal="false">' +
      '<header class="dvc-head"><div class="dvc-av">' + I.mark + '</div>' +
        '<div class="dvc-ttl"><b>' + esc(cfg.name) + '</b><span>Replies instantly</span></div>' +
        (WA ? '<button class="dvc-hbtn wa" type="button" data-wa title="Continue on WhatsApp" aria-label="Continue on WhatsApp">' + I.wa + '</button>' : '') +
        '<button class="dvc-hbtn" type="button" data-close aria-label="Close chat">' + I.x + '</button></header>' +
      '<div class="dvc-log" aria-live="polite"></div>' +
      '<form class="dvc-form"><textarea class="dvc-in" rows="1" maxlength="1500" placeholder="Type your message…" aria-label="Message"></textarea>' +
        '<button class="dvc-send" type="submit" aria-label="Send">' + I.send + '</button></form>' +
      '<div class="dvc-foot">AI assistant — answers may be imperfect. For a person, continue on WhatsApp.</div>' +
    '</section>' +
    '<button class="dvc-launch" type="button" aria-label="Chat with us" aria-expanded="false">' + I.chat +
      '<span class="dvc-x">' + I.x + '</span></button>';
  document.body.appendChild(root);

  const $ = s => root.querySelector(s);
  const log = $('.dvc-log'), form = $('.dvc-form'), input = $('.dvc-in'), sendBtn = $('.dvc-send');
  const launch = $('.dvc-launch'), nudge = $('.dvc-nudge');

  /* ---------- rendering ---------- */
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function inline(s){
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/(^|[\s(])\/(onboarding)(\.html)?\b/g, '$1<a href="/onboarding.html">/onboarding.html</a>');
  }
  function fmt(text){
    const lines = String(text).split(/\n/), out = []; let list = null;
    for(const ln of lines){
      const m = ln.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
      if(m){ if(!list){ list = []; } list.push('<li>' + inline(m[1]) + '</li>'); continue; }
      if(list){ out.push('<ul>' + list.join('') + '</ul>'); list = null; }
      if(ln.trim()) out.push('<p>' + inline(ln) + '</p>');
    }
    if(list) out.push('<ul>' + list.join('') + '</ul>');
    return out.join('');
  }
  function bubble(role, text){
    const d = document.createElement('div');
    d.className = 'dvc-m ' + (role === 'user' ? 'u' : 'a');
    d.innerHTML = role === 'user' ? '<p>' + esc(text).replace(/\n/g, '<br>') + '</p>' : fmt(text);
    log.appendChild(d); return d;
  }
  function waCard(){
    if(!WA) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dvc-wa-card'; b.setAttribute('data-wa', '');
    b.innerHTML = 'Continue on WhatsApp<span class="dvc-bdg">' + I.wa + '</span>';
    log.appendChild(b);
  }
  function chips(){
    const wrap = document.createElement('div'); wrap.className = 'dvc-chips';
    [['How do I join?','How do I join the network?'],
     ['Upcoming events','Tell me about your events.'],
     ['The three pillars','What are the three pillars?'],
     ['Talk to a person',null]].forEach(([label, q]) => {
      const c = document.createElement('button'); c.type = 'button'; c.className = 'dvc-chip'; c.textContent = label;
      c.addEventListener('click', () => q ? ask(q) : openWhatsApp());
      wrap.appendChild(c);
    });
    log.appendChild(wrap);
  }
  function renderAll(){
    log.innerHTML = '';
    bubble('assistant', cfg.greeting);
    if(!state.messages.some(m => m.role === 'user')) chips();
    state.messages.forEach(m => { bubble(m.role, m.content); if(m.handoff) waCard(); });
    scroll();
  }
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  let typingEl = null;
  function typing(on){
    if(on && !typingEl){ typingEl = document.createElement('div'); typingEl.className = 'dvc-typing'; typingEl.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(typingEl); scroll(); }
    if(!on && typingEl){ typingEl.remove(); typingEl = null; }
  }

  /* ---------- open / close ---------- */
  function setOpen(v){
    state.open = v; save();
    root.classList.toggle('open', v);
    launch.setAttribute('aria-expanded', String(v));
    if(v){ nudge.classList.remove('show'); try{ sessionStorage.setItem(KEY + '-nudged', '1'); }catch(e){}
      setTimeout(() => { scroll(); if(matchMedia('(hover:hover)').matches) input.focus(); }, 60); }
  }
  launch.addEventListener('click', () => setOpen(!root.classList.contains('open')));
  $('[data-close]').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && root.classList.contains('open')) setOpen(false); });
  nudge.addEventListener('click', () => setOpen(true));
  nudge.addEventListener('keydown', e => { if(e.key === 'Enter') setOpen(true); });

  /* ---------- talking to the assistant ---------- */
  async function post(payload, ms){
    const ctl = window.AbortController ? new AbortController() : null;
    const tm = ctl && setTimeout(() => ctl.abort(), ms || 25000);
    try{
      const r = await fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(payload), signal: ctl && ctl.signal });
      let data = null; try{ data = await r.json(); }catch(e){}
      return { ok:r.ok, status:r.status, data:data || {} };
    }finally{ if(tm) clearTimeout(tm); }
  }
  const history = () => state.messages.map(m => ({ role:m.role, content:m.content }));

  async function ask(text){
    text = String(text || '').trim();
    if(!text || busy) return;
    busy = true; sendBtn.disabled = true;
    const chipsEl = log.querySelector('.dvc-chips'); if(chipsEl) chipsEl.remove();
    state.messages.push({ role:'user', content:text }); save();
    bubble('user', text); input.value = ''; autosize(); scroll();
    typing(true);
    let reply, handoff = false;
    try{
      const r = await post({ messages: history() });
      if(r.ok && r.data.reply){ reply = r.data.reply; handoff = !!r.data.handoff; }
      else if(r.status === 503){ reply = 'Our online assistant is offline at the moment, but the team is available on WhatsApp.'; handoff = true; }
      else if(r.status === 429){ reply = "You're sending messages quite quickly — please wait a moment, or continue with the team on WhatsApp."; handoff = true; }
      else { reply = "Sorry, I couldn't get an answer just now. You can reach the team directly on WhatsApp."; handoff = true; }
    }catch(e){
      reply = "Sorry, I'm having trouble connecting. You can reach the team directly on WhatsApp."; handoff = true;
    }
    typing(false);
    state.messages.push({ role:'assistant', content:reply, handoff:handoff && !!WA });
    if(state.messages.length > 40) state.messages = state.messages.slice(-40);
    save();
    bubble('assistant', reply); if(handoff) waCard(); scroll();
    busy = false; sendBtn.disabled = false;
  }

  /* ---------- WhatsApp hand-off ---------- */
  async function openWhatsApp(){
    if(!WA) return;
    const win = window.open('', '_blank');          // open now, inside the click, so popup blockers allow it
    if(win){ try{ win.opener = null; win.document.title = 'Opening WhatsApp…';
      win.document.body.innerHTML = '<p style="font:16px system-ui;padding:2rem;color:#333">Opening WhatsApp…</p>'; }catch(e){} }
    let body = '';
    const users = state.messages.filter(m => m.role === 'user');
    if(users.length){
      try{
        const r = await post({ messages: history(), mode:'summary' }, 7000);
        if(r.ok && r.data.summary) body = r.data.summary;
      }catch(e){}
      if(!body) body = users.map(m => '- ' + m.content).join('\n');
    }
    let text = cfg.whatsappIntro + (body ? '\n\n' + body : '');
    if(text.length > 1800) text = text.slice(0, 1797) + '…';
    const url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    if(win && !win.closed){ try{ win.location.href = url; return; }catch(e){} }
    window.location.href = url;
  }
  root.addEventListener('click', e => { if(e.target.closest('[data-wa]')){ e.preventDefault(); openWhatsApp(); } });

  /* ---------- input ---------- */
  function autosize(){ input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; input.classList.toggle('multi', input.scrollHeight > 48); }
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); ask(input.value); } });
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  /* ---------- boot ---------- */
  renderAll();
  if(state.open) setOpen(true);
  let nudged = false; try{ nudged = !!sessionStorage.getItem(KEY + '-nudged'); }catch(e){}
  if(!nudged && !state.open){
    setTimeout(() => { if(!root.classList.contains('open')) nudge.classList.add('show'); }, 7000);
    setTimeout(() => nudge.classList.remove('show'), 19000);
    try{ sessionStorage.setItem(KEY + '-nudged', '1'); }catch(e){}
  }
})();
