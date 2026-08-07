/* ==========================================================================
   New Frontiers Ministers' Global Network — onboarding form
   Ported from the supplied build. Field ids, input names and payload keys
   are unchanged — the Apps Script / Sheet columns depend on them.
   ========================================================================== */
(function(){
  "use strict";

  /* =====================================================================
     Google Apps Script Web App URL.
     ===================================================================== */
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1QCnC5P2S646RJBv8A4-j1zslkjrRfIKo3fqiTUu3DJV5E6K7ur5UuQD2FBC4V6os1w/exec";

  var form = document.getElementById("nfmForm");
  if (!form) return;

  var steps         = Array.prototype.slice.call(form.querySelectorAll(".nfm-step"));
  var fill          = document.getElementById("nfmProgressFill");
  var stepCountEl   = document.getElementById("nfmStepCount");
  var stepNameEl    = document.getElementById("nfmStepName");
  var progressMeta  = document.getElementById("nfmProgressMeta");
  var progressTrack = form.querySelector(".nfm-progress-track");
  var doneEl        = document.getElementById("nfmDone");
  var submitBtn     = document.getElementById("nfmSubmit");
  var TOTAL         = steps.length;
  var current       = 0;

  var STEP_NAMES = ["Personal & Bio Data","Ministry Profile","Vision Alignment",
                    "Commitment & Growth","References","Declaration"];

  /* ---- country list ---- */
  var COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

  function fillCountries(sel, placeholder){
    if(!sel) return;
    var html = '<option value="" disabled selected hidden>'+placeholder+'</option>';
    for(var i=0;i<COUNTRIES.length;i++){ html += '<option>'+COUNTRIES[i]+'</option>'; }
    sel.innerHTML = html;
  }
  fillCountries(document.getElementById("nationality"), "Select your country…");
  fillCountries(document.getElementById("locationCountry"), "Select country…");

  /* ---- date of birth: native picker, custom placeholder while empty ---- */
  var dobEl = document.getElementById("dob");
  if(dobEl){
    var syncDob = function(){ dobEl.classList.toggle("has-value", !!dobEl.value); };
    dobEl.addEventListener("input",  syncDob);
    dobEl.addEventListener("change", syncDob);
    syncDob();
  }

  /* ---- progress / navigation ---- */
  function showStep(i){
    steps.forEach(function(s,idx){ s.classList.toggle("is-active", idx===i); });
    current = i;
    fill.style.width = (((i+1)/TOTAL)*100) + "%";
    stepCountEl.textContent = "Section " + (i+1) + " of " + TOTAL;
    stepNameEl.textContent  = STEP_NAMES[i];
    var card = form.getBoundingClientRect();
    if(card.top < 0){ form.scrollIntoView({behavior:"smooth", block:"start"}); }
  }

  function goNext(){ if(validateStep(current) && current < TOTAL-1){ showStep(current+1); } }
  function goBack(){ if(current>0){ clearErrors(steps[current]); showStep(current-1); } }

  form.addEventListener("click", function(e){
    var n = e.target.closest("[data-next]"); if(n){ goNext(); return; }
    var b = e.target.closest("[data-back]"); if(b){ goBack(); return; }
  });

  /* ---- choice (radio) styling + conditional specify ---- */
  form.addEventListener("change", function(e){
    if(e.target.matches('.nfm-choice input[type="radio"]')){
      var group = e.target.closest(".nfm-choices");
      group.querySelectorAll(".nfm-choice").forEach(function(c){
        c.classList.toggle("is-checked", c.querySelector("input").checked);
      });
      group.classList.remove("is-bad");
      var name = group.getAttribute("data-radio");
      hideErr(name);
      var spec = form.querySelector('[data-specify-for="'+name+'"]');
      if(spec){ spec.classList.toggle("show", e.target.value === "Yes"); }
    }
    if(e.target.id === "declaration"){
      var box = document.getElementById("declareBox");
      box.classList.toggle("is-checked", e.target.checked);
      box.classList.remove("is-bad");
      hideErr("declaration");
    }
  });

  /* ---- word counter ---- */
  var visionEl = document.getElementById("vision");
  var visionCounter = form.querySelector('[data-counter-for="vision"]');
  function wordCount(str){ var t=str.trim(); return t?t.split(/\s+/).length:0; }
  if(visionEl){
    visionEl.addEventListener("input", function(){
      var n = wordCount(visionEl.value);
      visionCounter.textContent = n + " / 200 words";
      visionCounter.classList.toggle("over", n>200);
    });
  }

  /* ---- validation ---- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function showErr(key){ var el=form.querySelector('[data-err-for~="'+key+'"]'); if(el) el.classList.add("show"); }
  function hideErr(key){ var el=form.querySelector('[data-err-for~="'+key+'"]'); if(el) el.classList.remove("show"); }
  function clearErrors(step){
    step.querySelectorAll(".nfm-err").forEach(function(e){ e.classList.remove("show"); });
    step.querySelectorAll(".is-bad").forEach(function(e){ e.classList.remove("is-bad"); });
  }

  function validateStep(i){
    var step = steps[i];
    clearErrors(step);
    var ok = true, firstBad = null;

    step.querySelectorAll("input[data-required], select[data-required], textarea[data-required]").forEach(function(el){
      if(el.type==="radio" || el.type==="checkbox") return;
      var value = (el.value||"").trim();
      var bad = !value;
      if(!bad && el.type==="email" && !EMAIL_RE.test(value)) bad = true;
      if(!bad && el.id==="vision"  && wordCount(value)>200)  bad = true;
      if(bad){
        ok=false; el.classList.add("is-bad"); showErr(el.id);
        if(!firstBad) firstBad = el;
      }
    });

    step.querySelectorAll(".nfm-choices[data-radio]").forEach(function(group){
      var name = group.getAttribute("data-radio");
      if(!form.querySelector('input[name="'+name+'"]:checked')){
        ok=false; group.classList.add("is-bad"); showErr(name);
        if(!firstBad) firstBad = group;
      }
    });

    var decl = step.querySelector("#declaration");
    if(decl && !decl.checked){
      ok=false; document.getElementById("declareBox").classList.add("is-bad"); showErr("declaration");
      if(!firstBad) firstBad = decl;
    }

    if(firstBad && firstBad.focus){ try{ firstBad.focus({preventScroll:false}); }catch(_){ firstBad.focus(); } }
    return ok;
  }

  form.addEventListener("input", function(e){
    var el = e.target;
    if(el.classList && el.classList.contains("is-bad")){
      el.classList.remove("is-bad"); hideErr(el.id);
    }
  });

  /* ---- payload ---- */
  function val(id){ var el=form.querySelector('#'+id+', [name="'+id+'"]'); return el?(el.value||"").trim():""; }
  function radio(name){ var el=form.querySelector('input[name="'+name+'"]:checked'); return el?el.value:""; }

  function buildPayload(){
    return {
      firstName:           val("firstName"),
      lastName:            val("lastName"),
      dob:                 val("dob"),
      phone:               val("phone"),
      email:               val("email"),
      nationality:         val("nationality"),
      gender:              val("gender"),
      maritalStatus:       val("maritalStatus"),
      ministryName:        val("ministryName"),
      role:                val("role"),
      yearsMinistry:       val("yearsMinistry"),
      calling:             val("calling"),
      locationCountry:     val("locationCountry"),
      locationCity:        val("locationCity"),
      hearAbout:           val("hearAbout"),
      vision:              val("vision"),
      whyJoin:             val("whyJoin"),
      otherCovering:       radio("otherCovering"),
      otherCoveringDetail: val("otherCoveringDetail"),
      growthAreas:         val("growthAreas"),
      willingParticipate:  radio("willingParticipate"),
      contribution:        val("contribution"),
      referenceName:       val("referenceName"),
      referenceContact:    val("referenceContact"),
      declaration:         document.getElementById("declaration").checked ? "Yes" : "No",
      website:             val("website") // honeypot
    };
  }

  /* ---- submit ---- */
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!validateStep(current)) return;

    var payload = buildPayload();
    if(payload.website){ finishSuccess(); return; } // bot trap

    var labelEl = submitBtn.querySelector(".nfm-btn-label");
    var iconEl  = submitBtn.querySelector(".nfm-btn-icon");
    submitBtn.disabled = true;
    labelEl.textContent = "Submitting…";
    if(iconEl){ iconEl.outerHTML = '<span class="nfm-spin nfm-btn-icon"></span>'; }

    if(!SCRIPT_URL || SCRIPT_URL.indexOf("PASTE_YOUR") === 0){
      console.error("NFM form: SCRIPT_URL is not set. Add your Apps Script Web App URL.");
      finishSuccess();
      return;
    }

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
    .then(function(){ finishSuccess(); })
    .catch(function(err){
      console.error("NFM form submit error:", err);
      submitBtn.disabled = false;
      labelEl.textContent = "Submit application";
      var sp = submitBtn.querySelector(".nfm-btn-icon");
      if(sp){ sp.outerHTML = '<svg class="nfm-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'; }
      alert("We couldn't submit your application just now. Please check your connection and try again.");
    });
  });

  function finishSuccess(){
    steps.forEach(function(s){ s.classList.remove("is-active"); });
    progressMeta.style.display = "none";
    progressTrack.style.display = "none";
    fill.style.width = "100%";
    doneEl.classList.add("show");
    form.scrollIntoView({behavior:"smooth", block:"start"});
  }

  showStep(0);
})();
