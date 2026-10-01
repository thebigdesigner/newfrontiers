/* New Frontiers — inner pages: event galleries, Mentorship Archive, E-Books.
   Reads content/events.js and content/library.js. No dependencies. */
(function(){
  'use strict';
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var page = document.body.dataset.page;
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function ico(id, cls){ return '<svg class="ico' + (cls ? ' ' + cls : '') + '"><use href="#' + id + '"/></svg>'; }

  /* ---------- video links → embeddable players ---------- */
  function ytId(u){ var m = String(u).match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; }
  function driveId(u){ var m = String(u).match(/drive\.google\.com\/file\/d\/([^/?#]+)/); return m ? m[1] : null; }
  function embedUrl(u){
    var y = ytId(u); if(y) return 'https://www.youtube-nocookie.com/embed/' + y + '?autoplay=1&rel=0';
    var d = driveId(u); if(d) return 'https://drive.google.com/file/d/' + d + '/preview';
    return null;
  }
  function thumbFor(v, fallback){ if(v.thumb) return v.thumb; var y = ytId(v.url); return y ? 'https://i.ytimg.com/vi/' + y + '/hqdefault.jpg' : fallback; }

  /* ---------- lightbox (photos + videos) ---------- */
  var lb = $('#lightbox'), lbStage = lb && $('.lb-stage', lb), lbCap = lb && $('.lb-cap', lb), lastFocus = null;
  function openLb(html, cap){
    if(!lb || typeof lb.showModal !== 'function') return false;
    lastFocus = document.activeElement;
    lbStage.innerHTML = html; lbCap.textContent = cap || '';
    lb.showModal(); document.body.classList.add('nav-locked'); return true;
  }
  if(lb){
    $('.lb-x', lb).addEventListener('click', function(){ lb.close(); });
    lb.addEventListener('click', function(e){ if(e.target === lb) lb.close(); });
    lb.addEventListener('close', function(){ lbStage.innerHTML = ''; document.body.classList.remove('nav-locked'); if(lastFocus) lastFocus.focus(); });
  }

  /* ================= EVENT PAGES ================= */
  if(page === 'event'){
    var root = $('#mediaRoot'), tabs = $('#seasonTabs');
    var slug = document.body.dataset.event, art = document.body.dataset.art;
    var data = (window.NF_EVENTS || {})[slug] || { seasons:[] };
    var seasons = data.seasons || [];

    function render(i){
      var s = seasons[i] || { photos:[], videos:[] }, html = '';
      var photos = s.photos || [], videos = s.videos || [];
      html += '<div class="media-block"><div class="media-h"><h3>Photos</h3><span>' + photos.length + (photos.length === 1 ? ' photo' : ' photos') + '</span></div>';
      if(photos.length){
        html += '<div class="photo-grid">' + photos.map(function(p, k){
          return '<button type="button" class="ph" data-ph="' + k + '"><img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy" /><span class="ph-zoom">' + ico('i-plus') + '</span></button>';
        }).join('') + '</div>';
      } else html += '<p class="media-empty">Photos from this season will be posted here.</p>';
      html += '</div>';

      html += '<div class="media-block"><div class="media-h"><h3>Videos</h3><span>' + videos.length + (videos.length === 1 ? ' video' : ' videos') + '</span></div>';
      if(videos.length){
        html += '<div class="video-grid">' + videos.map(function(v, k){
          return '<a class="vd" href="' + esc(v.url) + '" target="_blank" rel="noopener" data-vd="' + k + '">' +
            '<span class="vd-poster"><img src="' + esc(thumbFor(v, art)) + '" alt="" loading="lazy" /><span class="vd-play">' + ico('i-playfill') + '</span></span>' +
            '<span class="vd-t">' + esc(v.title) + '</span></a>';
        }).join('') + '</div>';
      } else html += '<div class="media-empty media-empty--video">' + ico('i-play') + '<p>Recordings from past seasons will be posted here. Ask the team on WhatsApp for a recent one.</p></div>';
      html += '</div>';
      root.innerHTML = html;

      Array.prototype.forEach.call(root.querySelectorAll('[data-ph]'), function(b){
        b.addEventListener('click', function(){ var p = photos[+b.dataset.ph]; openLb('<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" />', p.alt); });
      });
      Array.prototype.forEach.call(root.querySelectorAll('[data-vd]'), function(a){
        a.addEventListener('click', function(e){
          var v = videos[+a.dataset.vd], src = embedUrl(v.url);
          if(src && openLb('<iframe src="' + esc(src) + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>', v.title)) e.preventDefault();
        });
      });
    }

    if(seasons.length > 1){
      tabs.innerHTML = seasons.map(function(s, i){ return '<button type="button" role="tab" aria-selected="' + (i ? 'false' : 'true') + '">' + esc(s.name) + '</button>'; }).join('');
      Array.prototype.forEach.call(tabs.children, function(t, i){
        t.addEventListener('click', function(){
          Array.prototype.forEach.call(tabs.children, function(x, k){ x.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
          render(i);
        });
      });
    } else if(tabs) tabs.remove();
    render(0);
  }

  /* ================= MENTORSHIP ARCHIVE ================= */
  if(page === 'archive'){
    var A = (window.NF_LIBRARY || {}).archive || {};
    var audio = A.audio || [], video = A.video || [];
    function meta(x){ return [x.speaker, x.length].filter(Boolean).map(esc).join(', '); }
    function folderBtn(id, url, label){ var el = $(id); if(!el) return; if(url){ el.href = url; el.querySelector('span').textContent = label; } else el.remove(); }

    $('#audioCount').textContent = audio.length;
    $('#videoCount').textContent = video.length;

    $('#audioList').innerHTML = audio.map(function(m, i){
      var inner = '<span class="au-n">' + (i + 1) + '</span><span class="au-ico">' + ico('i-wave') + '</span>' +
        '<span class="au-t"><b>' + esc(m.title) + '</b><small>' + meta(m) + '</small></span>';
      return m.url
        ? '<li><a class="au" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + inner + '<span class="au-go">Listen ' + ico('i-arrow') + '</span></a></li>'
        : '<li><div class="au is-soon">' + inner + '<span class="soon">Coming soon</span></div></li>';
    }).join('');

    $('#videoList').innerHTML = video.map(function(m){
      var poster = m.thumb ? '<img src="' + esc(m.thumb) + '" alt="" loading="lazy" />' : '';
      var inner = '<span class="vd-poster vd-poster--gen">' + poster + '<span class="vd-play">' + ico('i-playfill') + '</span>' + (m.length ? '<span class="vd-len">' + esc(m.length) + '</span>' : '') + '</span>' +
        '<span class="vd-t">' + esc(m.title) + '</span><small class="vd-m">' + meta(m) + '</small>';
      return m.url
        ? '<a class="vd" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + inner + '<span class="vd-go">Watch on Drive ' + ico('i-arrow') + '</span></a>'
        : '<div class="vd is-soon">' + inner + '<span class="soon">Coming soon</span></div>';
    }).join('');

    folderBtn('#audioFolder', A.audioFolder, 'Open the audio folder');
    folderBtn('#videoFolder', A.videoFolder, 'Open the video folder');
  }

  /* ================= E-BOOKS ================= */
  if(page === 'ebooks'){
    var E = (window.NF_LIBRARY || {}).ebooks || {};
    var books = E.books || [];
    $('#bookCount').textContent = books.length;
    $('#bookList').innerHTML = books.map(function(b){
      var cover = b.cover
        ? '<span class="bk-cover"><img src="' + esc(b.cover) + '" alt="" loading="lazy" /></span>'
        : '<span class="bk-cover bk-cover--' + esc(b.tone || 'navy') + '"><span class="bk-mark">New Frontiers</span><span class="bk-title">' + esc(b.title) + '</span><span class="bk-foot">NFMGN</span></span>';
      var body = '<span class="bk-t">' + esc(b.title) + '</span><span class="bk-d">' + esc(b.description) + '</span>';
      return b.url
        ? '<a class="book" href="' + esc(b.url) + '" target="_blank" rel="noopener">' + cover + body + '<span class="bk-go">Read on Drive ' + ico('i-arrow') + '</span></a>'
        : '<div class="book is-soon">' + cover + body + '<span class="soon">Coming soon</span></div>';
    }).join('');
    var f = $('#bookFolder'); if(f){ if(E.folder) f.href = E.folder; else f.remove(); }
  }
})();
