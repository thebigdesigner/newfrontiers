/* New Frontiers — "one global table" globe.
   Land is drawn as dots from an embedded 360x180 land bitmap (1 bit per degree).
   Dawn-gold arcs pulse outward from Lagos. Drag to spin; pauses off-screen. */
(function(){
  var boxes = [].slice.call(document.querySelectorAll('.globe-box'));
  if(!boxes.length) return;
  var MASK = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf//8AAf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////D//////n/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/gf/x////////wAAAAAbgAAB4AAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAf//8A///////+AAAAB/ngAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAcH3Hv/5////////8AAAAA/gAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAcIAAQP/AH///////+AAAAAPCAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAADwDAc+f+AP///////4AAAAAAAAAAAAAB4AAAAB/8AAAAAAAAAAAAAAAAAAAAAH9wc374AAAf/////8AAAAAAAAAAAAH4AAAA////AAAB/gAAAAAAAAAAAAAAAAwAAA/QAAAH/////8AAAAAAAAAAAAOAAAAP///wAAAAAAAAAAAAAAAAAAAAP8AYe+c3AAAD/////4AAAAAAAAAAAA4AAAH////++HgAOAAAAAAAAAAAAAAAfv+4+w/4gAAB/////wAAAAAAAAAAADwAHgH///////4AfgAAAAAgAAAAAAAAPf/4O4//9AAB/////wAAAAAAAAAAADwAPb////////4m//gAAAAAAAf+AAAAAA/+A8f//4AB////8gAAAAAAA/gAAAAAfv/////////////8AAAAAB///+H//H/+PeDwf+AA3////AAAAAAA//4AAAA8fv///////////////P8gAf////////A4CPz4H8AAP///wAAAAAAD///wADH/n3/////////////////8AD////////////34Z/wA///4AAAAAAAP///+M////n/////////////////+4E/////////////gD/8Af//gAAAAAAAf//5+P////f/////////////////fw/////////////6AD8YAf/wAAf8AAAA/8f+D///////////////////////AgEf///////////zw7/AAP/gAAP4AAAB/4/+f//////////////////////8AMAf//////////+DIA/gAH/gAAAAAAAH/z/////////////////////////+AAH///////////8AwgOAAD+AAAAAAAA//H/////////////////////////6AAP///////////wAA/AAAB+AAAAAAAB/+H//////////////////////nP+AAAH//z////////wAA/wAAAOAAAAAAAB//D/////////////////////+A/4AAAA/zAD///////gAA/4wAAAAAAAAAAB//Ab///////////////////+eDgAAAAABwAA///////4AA/94AAAAAAAAAYA5+A///////////////////4AAHAAAAAADcAAD//////4AAf/8AAAAAAAAA8AC+C///////////////////wAAfgAAAAAMAAAA///////wAf/8AAAAAAAAA4AO8H///////////////////AAA/gAAAABgAAAA///////8A///AAAAAAAAA8ANwH//////////////////8AAB/AAAAAEAAAAAf///////z///4AAAAAAAHOAEDv//////////////////+AAA+AAAAAAAAAABH///////x///8AAAAAAAHHAf/////////////////////6AA8AAAAAAAAAAAD///////x///8AAAAAAAGPz//////////////////////6AAwAAAAAAAAAAAD///////9///6AAAAAAAAPj//////////////////////6AAQAAAAAAAAAAAC///////////EAAAAAAAAYf//////////////////////7AAAAAAAAAAAAAABv////////+MNAAAAAAAAD///////////////////////zAAAAAAAAAAAAAAAH////////7gfgAAAAAAAf///////////////////////yAAAAAAAAAAAAAAAL/////////gCgAAAAAAAH///////////////////////iAAAAAAAAAAAAAAAP/////////pAAAAAAAAAD/////uP////////////////DAAAAAAAAAAAAAAAP/////////+AAAAAAAAAB//v//Gf///////////////+AAAAAAAAAAAAAAAAP////////8wAAAAAAAAAB//H/+AP///////////////8CAAAAAAAAAAAAAAAP////////wAAAAAAAAADj/jz/8AD///////////////4HgAAAAAAAAAAAAAAP////////gAAAAAAAAAH/4Bw/8AA//////////////+APAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wA8f8Ph//////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/gMHfJ///////////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AMCOP//////////////+JwAMAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/AAAHH//////////////8BwAIAAAAAAAAAAAAAAAH///////wAAAAAAAAAAH+AAYGH//////////////+w4A4AAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgf+ACBs//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAj/+AAAA//////////////AYf4AAAAAAAAAAAAAAAA///////gAAAAAAAAAAB//8AAAA//////////////Ah2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gDwAAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAH///4GAB//////////////gDAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8P4h//////////////wCAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////v////////////////gAAAAAAAAAAAAAAAAAAABP//hgYAAAAAAAAAAAP//////3//P///////////wAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf//////9//H///////////wAAAAAAAAAAAAAAAAAAAB3/+AAcAAAAAAAAAAB///////4//h///////////gAAAAAAAAAAAAAAAAAAAAR/+AANAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/0B/////////+AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+f/44Af///////+QAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAP////////H//+AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAuAAAAAAAAAAP////////H///AD///v///ggAAAAAAAAAAAAAAAAAAAAAH+AABgAAAAAAAAAf////////n//+AD//4P//YAAAAAAAAAAAAAAAAAAAAAAAP+A4AYAAAAAAAAAP////////j//+AAf/4H/+AAAAAAAAAAAAAAAAgAAAAAAAH/B4ABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAD/nwAD9AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AD/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAf////////4f+AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8f8AAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAf/////////eAAAAHwAAP/gAMAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAf/////////gAAAAHwAAM/gACAAAAAAAAAAAAAAAAAAAAAAAADABAAAAAAAAAP/////////gYAAADwAAEfgAJAAAAAAAAAAAAAAAAAAAAAAAADgPfOAAAAAAAH/////////34AAADwAAIOABAAAAAAAAAAAAAAAAAAAAAAAAAAyPf+AAAAAAAD//////////4AAADoAAIEACBAAAAAAAAAAAAAAAAAAAAAAAAA8///AAAAAAAB//////////wAAABIAAMAAAFAAAAAAAAAAAAAAAAAAAAAAAAAE///gAAAAAAB//////////wAAAAMAAEAAALgAAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/////////gAAAAMAADAAMCAAAAAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAP/B///////gAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA///////AAAAAAAAxgA+AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB4AAAAAAAAAAAAAAAAAAAAAAAAAAB////4AAAAAAAAAD/////8AAAAAAAAMwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAH/////4AAAAAAAAHQf8AIAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH/////gAAAAAAAAHgf88IAAAAAAAAAAAAAAAAAAAAAAAAD////+AAAAAAAAAH/////AAAAAAAAADwf8AAgAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH/////AAAAAAAAABwP5wBwAAAAAAAAAAAAAAAAAAAAAAAH/////6AAAAAAAAD////+AAAAAAAAAB8P5wATwAAAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQif+AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAB////4AAAAAAAAAAcAAIAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMAAIAI/ywAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAADgAAAI/8BAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf///4AAAAAAAAAAB+AAAA/4AIAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAmogAOMAAAAAAAAAAAAAAAAAAAAAB///////AAAAAAAAf///8AAAAAAAAAAAABCAAAGADAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///8AAAAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///+AQAAAAAAAAAAAAB+CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AQAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38DgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////8BwAAAAAAAAAAAD/8DgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////8PwAAAAAAAAAAAD//HwAABABAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////wPgAAAAAAAAAAAP//3wAAAACAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////APgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAD////+AAIAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAEAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAAAAH//+AOAAAAAAAAAAB//////wAAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAAAAH//4AEAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAB//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////8AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP/AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAf8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAYAAAAAAAAAAAAAAAOAAF//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAABAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAgAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADQAAAAAAAAAAAAAAAAAD/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAHAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAOAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAH4AAAAAAB4HgAD8AAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAA//AAAD//////////wAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAf///4Af///////////AAAAAAAAAAAAAAAAAAAAAAAz4AAAAAAAAAAAAAAAPz////8B/////////////wAAAAAAAAAAAAAAAAAAAAA78AAAAAAAAAAA8/8///////wf/////////////+AAAAAAAAAAAAAAAAAAAAH9+AAAAAAAAZ////////////w////////////////4AAAAAAAAAAAAAAAAAAAB+AAAAAAAB//////////////////////////////4AAAAAAAAABmAAB8f+HB/+AAAAAAAP//////////////////////////////gAAAAAAAAP/c/oAf/////4AAAAAAAP/////////////////////////////8AAAAAAAD/////////////gAAAAAAB//////////////////////////////wAAAAAAAD////////////wAAAAAAP///////////////////////////////wAAAAAD/////////////4AAAAAAD////////////////////////////////wAAAADh/////////////AAAAB8A/////////////////////////////////+AAAAA4Af///////////gAAAH+AA///////////////////////////////+AAAAAAAAH///////////+A/A/wAA///////////////////////////////8AAAAAAAf//////////////gAAAf////////////////////////////////+AAAAAAAH///////////////h////////////////////////////////////wAAAAAAP/////////////////////////////////////////////////////gA+/gAAH/////////////////////////////////////////////////////8/////v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";

  function start(box){
    if(!window.THREE) return;
    var THREE = window.THREE;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'low-power' }); }
    catch(e){ return; }                              /* no WebGL: CSS fallback stays */
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    box.insertBefore(renderer.domElement, box.firstChild);
    box.classList.add('gl');

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 1, .1, 50);
    camera.position.set(0, 0, 4.25);
    var world = new THREE.Group(); scene.add(world);
    world.rotation.x = .32;

    /* ---- land bitmap ---- */
    var raw = atob(MASK), bits = new Uint8Array(raw.length);
    for(var i = 0; i < raw.length; i++) bits[i] = raw.charCodeAt(i);
    function isLand(lat, lon){
      var r = Math.min(179, Math.max(0, Math.floor(90 - lat)));
      var c = ((Math.floor(lon + 180) % 360) + 360) % 360;
      var k = r * 360 + c;
      return (bits[k >> 3] >> (7 - (k & 7))) & 1;
    }
    function vec(lat, lon, rad){
      var la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
      return new THREE.Vector3(Math.cos(la) * Math.cos(lo) * rad, Math.sin(la) * rad, -Math.cos(la) * Math.sin(lo) * rad);
    }

    /* round dot sprite */
    function dotTex(inner, outer){
      var c = document.createElement('canvas'); c.width = c.height = 64;
      var g = c.getContext('2d'), gr = g.createRadialGradient(32,32,0,32,32,32);
      gr.addColorStop(0, inner); gr.addColorStop(.45, inner); gr.addColorStop(.55, outer); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0,0,64,64);
      var t = new THREE.CanvasTexture(c); return t;
    }

    /* ---- occluding core + land dots ---- */
    var core = new THREE.Mesh(new THREE.SphereGeometry(.992, 64, 48), new THREE.MeshBasicMaterial({ color:0x0C1628 }));
    world.add(core);

    var small = window.innerWidth < 760;
    var N = small ? 11000 : 17000, pos = [], golden = Math.PI * (3 - Math.sqrt(5));
    for(var n = 0; n < N; n++){
      var y = 1 - (n / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = golden * n;
      var lat = Math.asin(y) * 180 / Math.PI, lon = Math.atan2(-Math.sin(th) * rr, Math.cos(th) * rr) * 180 / Math.PI;
      if(isLand(lat, lon)){ var v = vec(lat, lon, 1.0); pos.push(v.x, v.y, v.z); }
    }
    var landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    var land = new THREE.Points(landGeo, new THREE.PointsMaterial({
      size: small ? .034 : .03, map: dotTex('rgba(178,232,244,1)','rgba(150,220,236,.35)'),
      transparent:true, opacity:1, depthWrite:false, sizeAttenuation:true
    }));
    world.add(land);

    /* ---- atmosphere glow (camera-facing sprite, outside the world group) ---- */
    (function(){
      var c = document.createElement('canvas'); c.width = c.height = 256;
      var g = c.getContext('2d'), gr = g.createRadialGradient(128,128,0,128,128,128);
      gr.addColorStop(0, 'rgba(39,149,174,0)'); gr.addColorStop(.76, 'rgba(39,149,174,0)'); gr.addColorStop(.855, 'rgba(92,198,218,.42)');
      gr.addColorStop(.9, 'rgba(39,149,174,.16)'); gr.addColorStop(1, 'rgba(39,149,174,0)');
      g.fillStyle = gr; g.fillRect(0,0,256,256);
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map:new THREE.CanvasTexture(c), depthWrite:false, transparent:true }));
      s.scale.set(2.36, 2.36, 1); s.position.z = -.2; scene.add(s);
    })();

    /* ---- the network: hub + nations ---- */
    var HUB = [6.52, 3.38]; /* Lagos */
    /* the nations in the network: Ghana, United Kingdom, United States, Canada (+ Abuja at home) */
    var DEST = [[5.6,-.19],[51.5,-.13],[53.5,-2.2],[40.7,-74],[29.8,-95.4],[38.9,-77],[43.7,-79.4],[45.4,-75.7],[9.06,7.49]];
    var gold = new THREE.Color(0x4fccbe);
    var hubV = vec(HUB[0], HUB[1], 1.004);
    var arcs = [];
    DEST.forEach(function(d, i){
      var b = vec(d[0], d[1], 1.004), ang = hubV.angleTo(b), seg = 72, pts = [];
      var lift = .05 + Math.min(ang, 1.7) * .17;
      for(var s = 0; s <= seg; s++){
        var t = s / seg;
        var p = new THREE.Vector3().copy(hubV).normalize().lerp(b.clone().normalize(), t).normalize();
        /* slerp-ish: renormalised lerp is fine at these spans */
        p.multiplyScalar(1.004 + Math.sin(Math.PI * t) * lift);
        pts.push(p.x, p.y, p.z);
      }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      g.setDrawRange(0, 0);
      var line = new THREE.Line(g, new THREE.LineBasicMaterial({ color:gold, transparent:true, opacity:.75, depthWrite:false }));
      world.add(line);
      var pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map:dotTex('rgba(226,255,250,1)','rgba(79,204,190,.35)'), transparent:true, depthWrite:false }));
      pulse.scale.set(.07,.07,1); pulse.visible = false; world.add(pulse);
      var mark = new THREE.Sprite(new THREE.SpriteMaterial({ map:dotTex('rgba(79,204,190,1)','rgba(79,204,190,.3)'), transparent:true, depthWrite:false }));
      mark.scale.set(.05,.05,1); mark.position.copy(b); mark.material.opacity = 0; world.add(mark);
      arcs.push({ g:g, line:line, pts:pts, seg:seg, pulse:pulse, mark:mark, delay: i * .18, speed: .28 + (i % 4) * .05, phase: Math.random() });
    });
    /* hub beacon */
    var hubDot = new THREE.Sprite(new THREE.SpriteMaterial({ map:dotTex('rgba(226,255,250,1)','rgba(79,204,190,.5)'), transparent:true, depthWrite:false }));
    hubDot.scale.set(.1,.1,1); hubDot.position.copy(hubV); world.add(hubDot);
    var ring = new THREE.Mesh(new THREE.RingGeometry(.05,.062,48), new THREE.MeshBasicMaterial({ color:gold, transparent:true, opacity:.8, side:THREE.DoubleSide, depthWrite:false }));
    ring.position.copy(hubV); ring.lookAt(hubV.clone().multiplyScalar(2)); world.add(ring);

    /* face Africa / the Atlantic first */
    var yaw = -Math.PI / 2 + 18 * Math.PI / 180, pitch = .42;   /* centre on longitude 18°W: West Africa, UK and North America in view */

    /* ---- interaction: drag with inertia ---- */
    var dragging = false, lx = 0, ly = 0, vy = 0, vp = 0, idle = 0;
    var el = renderer.domElement;
    el.addEventListener('pointerdown', function(e){ dragging = true; lx = e.clientX; ly = e.clientY; vy = vp = 0; if(el.setPointerCapture) el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', function(e){
      if(!dragging) return;
      var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      vy = dx * .006; vp = dy * .004; yaw += vy; pitch = Math.max(-.6, Math.min(.9, pitch + vp)); idle = 0;
    });
    function up(){ dragging = false; }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);

    /* ---- sizing ---- */
    function size(){
      var w = box.clientWidth, h = box.clientHeight || w;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    size();
    if(window.ResizeObserver) new ResizeObserver(size).observe(box); else window.addEventListener('resize', size);

    /* ---- loop, only while visible ---- */
    var visible = false, raf = 0, t0 = 0, last = 0;
    function frame(now){
      raf = 0; if(!visible || box.dataset.on === '0') return;
      if(!t0) t0 = now; var t = (now - t0) / 1000, dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      if(!dragging){
        idle += dt;
        vy *= .94; vp *= .92; yaw += vy; pitch = Math.max(-.6, Math.min(.9, pitch + vp));
        if(!reduce && idle > .6) yaw += dt * .045;
        pitch += (.32 - pitch) * dt * .4;
      }
      world.rotation.y = yaw; world.rotation.x = pitch;
      arcs.forEach(function(a){
        var grow = reduce ? 1 : Math.min(1, Math.max(0, (t - .4 - a.delay) / 1.4));
        var e = 1 - Math.pow(1 - grow, 3);
        a.g.setDrawRange(0, Math.floor(e * a.seg) + 1);
        a.mark.material.opacity = grow >= 1 ? .95 : 0;
        if(grow >= 1 && !reduce){
          var u = ((t * a.speed + a.phase) % 1), k = Math.floor(u * a.seg) * 3;
          a.pulse.visible = true; a.pulse.position.set(a.pts[k], a.pts[k+1], a.pts[k+2]);
          a.pulse.material.opacity = Math.sin(Math.PI * u);
        }
      });
      var s = 1 + ((t * .8) % 1) * 1.6; ring.scale.set(s, s, s); ring.material.opacity = .85 * (1 - ((t * .8) % 1));
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function resume(){ if(visible && !raf && box.dataset.on !== '0'){ last = 0; raf = requestAnimationFrame(frame); } }
    box.addEventListener('globe:resume', resume);
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(en){ visible = en[0].isIntersecting; resume(); }, { threshold: .05 }).observe(box);
    } else { visible = true; resume(); }
  }

  function startAll(){ boxes.forEach(start); }
  if(window.THREE) startAll();
  else window.addEventListener('load', startAll);
})();
