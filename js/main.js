/* H.G.O ENG RESOURCES LIMITED - main script */

/* ---- Site settings (contact details also appear in index.html; see README) ---- */
const COMPANY="H.G.O ENG RESOURCES LIMITED";
const WA="2348022771016";            // WhatsApp number, international format, digits only
const TANKER=33000;                 // standard tanker size (litres) used for the auto-calculation
/* [min, max, step, default, unit, label] */
const FUEL=[1,5000000,1,33000,"Liters","Estimated Volume (Liters)"];
const CFG={pms:FUEL,ago:FUEL,dpk:FUEL,atk:FUEL,
  lpg:[1,5000000,1,1000,"Kilograms","Estimated Quantity (Kilograms)"],
  logistics:[1,50,1,1,"Tankers","Number of Tanker Trucks"]};
const PRESETS={fuel:[10000,33000,45000,60000,100000],lpg:[500,1000,5000,10000,20000]};

/* ---- Email delivery via Web3Forms ----
   1. Get a free access key at https://web3forms.com (enter the email that should receive messages).
   2. Paste it below. The key is public by design: it only routes messages to your inbox. */
const WEB3FORMS_KEY = "62572d49-5b4c-452a-a018-1e1ec70499c0";

const $id=id=>document.getElementById(id);

/* ---- Core UI ---- */
$id("year").textContent=new Date().getFullYear();
document.querySelectorAll("[data-wa]").forEach(a=>{a.href="https://wa.me/"+WA});

// Mobile menu
(function(){const b=$id("menu-btn"),n=$id("nav");
 function set(open){n.classList.toggle("open",open);b.setAttribute("aria-expanded",String(open));b.setAttribute("aria-label",open?"Close menu":"Open menu");
  b.querySelector("use").setAttribute("href",open?"#i-close":"#i-menu")}
 b.addEventListener("click",()=>set(!n.classList.contains("open")));
 n.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>set(false)));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&n.classList.contains("open")){set(false);b.focus()}});
})();

/* ---- Quote estimator & WhatsApp hand-off ---- */
let activeCategory="pms";
function renderChips(cat){const box=$id("preset-chips");box.innerHTML="";
 const list=cat==="logistics"?[]:(cat==="lpg"?PRESETS.lpg:PRESETS.fuel);
 list.forEach(v=>{const b=document.createElement("button");b.type="button";b.className="qty-chip";b.dataset.v=v;b.textContent=v.toLocaleString()+(cat==="lpg"?" kg":" L");b.addEventListener("click",()=>setVolume(v));box.appendChild(b)});
 box.hidden=!list.length}
function selectCategory(cat){activeCategory=cat;const c=CFG[cat];
 document.querySelectorAll(".cat-btn").forEach(b=>{const on=b.id==="btn-"+cat;b.classList.toggle("on",on);b.setAttribute("aria-pressed",String(on))});
 const r=$id("volume-input");r.min=c[0];r.max=c[1];r.step=c[2];r.value=c[3];
 $id("quantity-label").textContent=c[5];$id("qty-unit").textContent=c[4];
 const fuel=["pms","ago","dpk","atk"].indexOf(cat)>-1;const nt=$id("tanker-note");if(nt)nt.hidden=!fuel;
 renderChips(cat);updateVolume(c[3])}
function setVolume(n){$id("volume-input").value=n;updateVolume(n)}
function equivText(n){if(!(n>0))return"";
 if(activeCategory==="logistics")return n+" tanker"+(n>1?"s":"")+" = about "+(n*TANKER).toLocaleString()+" L at "+TANKER.toLocaleString()+" L each";
 if(activeCategory==="lpg")return"Quantity and delivery are confirmed by our sales desk.";
 const t=n/TANKER,full=Math.ceil(t);return"\u2248 "+(Math.round(t*10)/10).toLocaleString()+" tanker"+(t>1?"s":"")+" of "+TANKER.toLocaleString()+" L ("+full+" truck"+(full>1?"s":"")+" needed)"}
function updateVolume(v){const n=parseInt(v,10),u=CFG[activeCategory][4];
 $id("quantity-display").textContent=n>0?n.toLocaleString()+" "+u:"Enter amount";
 $id("tanker-equiv").textContent=n>0?equivText(n):"Type a quantity or tap a preset.";
 document.querySelectorAll(".qty-chip").forEach(x=>x.classList.toggle("on",+x.dataset.v===n))}
function qtyText(){const n=parseInt($id("volume-input").value,10),d=$id("quantity-display").textContent;
 return["pms","ago","dpk","atk"].indexOf(activeCategory)>-1&&n>0?d+" ("+equivText(n)+")":d}
function lines(f){return[...f.querySelectorAll("input[type=text],input[type=tel],input[type=email],textarea,select")].filter(e=>e.name!=="bot-field").map(e=>{const l=e.parentElement.querySelector("label");return(l?l.textContent.trim():"")+": "+e.value}).join("\n")}
function openWA(t){window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(t),"_blank")}
function sendForm(f,subject){
  if(!WEB3FORMS_KEY||WEB3FORMS_KEY.indexOf("PASTE_")===0){console.warn("Web3Forms access key not set in js/main.js");return Promise.resolve(false)}
  const fd=new FormData(f);
  fd.set("access_key",WEB3FORMS_KEY);
  fd.set("from_name",COMPANY+" Website");
  if(subject)fd.set("subject",subject);
  return fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Accept":"application/json"},body:fd})
    .then(r=>r.json()).then(d=>!!(d&&d.success)).catch(()=>false);
}
function setBusy(f,on){const b=f.querySelector("button[type=submit]");if(!b)return;b.disabled=on;if(on){b.dataset.t=b.innerHTML;b.textContent="Sending..."}else if(b.dataset.t){b.innerHTML=b.dataset.t}}
function handleQuoteSubmit(e){e.preventDefault();const f=e.target;
  f.elements.category.value=activeCategory.toUpperCase();f.elements.quantity.value=qtyText();
  sendForm(f,"New quote request - "+f.elements.category.value+" ("+f.elements.quantity.value+")");
  openWA("Quote request - "+COMPANY+"\nCategory: "+activeCategory.toUpperCase()+"\nQuantity: "+qtyText()+"\n"+lines(f));
  f.classList.add("hidden");$id("quote-success").classList.remove("hidden")}
function handleContactSubmit(e){e.preventDefault();const f=e.target,ok=$id("contact-success"),bad=$id("contact-error");
  ok.classList.add("hidden");bad.classList.add("hidden");setBusy(f,true);
  sendForm(f).then(sent=>{setBusy(f,false);if(sent){ok.classList.remove("hidden");f.reset()}else{bad.classList.remove("hidden")}})}
// product / CTA buttons that preselect a category
document.querySelectorAll("[data-cat]").forEach(a=>a.addEventListener("click",()=>selectCategory(a.dataset.cat)));
selectCategory("pms");

/* ---- Header shadow, scroll reveal ---- */
(function(){const hd=$id("site-header");
 function sc(){hd.classList.toggle("scrolled",window.scrollY>10)}addEventListener("scroll",sc,{passive:true});sc();
 const els=[].slice.call(document.querySelectorAll(".rv"));
 if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in"));return}
 const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12,rootMargin:"0px 0px -40px 0px"});
 els.forEach(e=>io.observe(e));
})();

/* ---- Hero video: skipped for reduced-motion / Data Saver visitors (the poster image is shown instead) ---- */
(function(){const v=$id("hero-video");if(!v)return;
 const rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,sd=navigator.connection&&navigator.connection.saveData;
 if(rm||sd){v.removeAttribute("autoplay");v.pause&&v.pause();v.remove();return}
 const ss=v.querySelectorAll("source");if(ss.length)ss[ss.length-1].addEventListener("error",()=>v.remove());v.addEventListener("error",()=>v.remove());
 const p=v.play&&v.play();if(p&&p.catch)p.catch(()=>{});
})();

/* ---- Talk to Sales: one floating control for WhatsApp, calls and email ---- */
(function(){const box=$id("talk"),btn=$id("talk-btn");if(!box)return;
 function set(open){box.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open))}
 btn.addEventListener("click",()=>set(!box.classList.contains("open")));
 document.addEventListener("click",e=>{if(!box.contains(e.target))set(false)});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&box.classList.contains("open")){set(false);btn.focus()}});
 $id("talk-menu").addEventListener("click",()=>set(false));
})();


/* =====================================================================
   COOKIE CONSENT + LEGAL DIALOGS
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "hgo_cookie_consent", VERSION = 1;
  var d = document, memory = null;

  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }

  /* ---------- consent storage (safe if storage is blocked) ---------- */
  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var c = JSON.parse(raw); if (c && c.v === VERSION) return c; }
    } catch (e) {}
    return memory;
  }
  function writeConsent(analytics) {
    var c = { v: VERSION, essential: true, analytics: !!analytics, ts: new Date().toISOString() };
    memory = c;
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    applyConsent(c);
    return c;
  }

  /* Non-essential scripts must only start from here, after consent. */
  function applyConsent(c) {
    window.HGO_CONSENT = c;
    d.dispatchEvent(new CustomEvent("hgo:consent", { detail: c }));
    if (c && c.analytics) { loadAnalytics(); }
  }
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    /* No analytics provider is installed yet. When you add one (e.g. Google
       Analytics, Plausible), inject its <script> here so it only loads after
       the visitor opts in. */
  }

  /* ---------- banner ---------- */
  var banner = $("#cookie-banner");
  function showBanner() {
    banner.hidden = false;
    d.body.classList.add("cc-open");
    d.documentElement.style.setProperty("--cc-h", banner.offsetHeight + "px");
  }
  function hideBanner() {
    banner.hidden = true;
    d.body.classList.remove("cc-open");
  }
  addEventListener("resize", function () {
    if (!banner.hidden) d.documentElement.style.setProperty("--cc-h", banner.offsetHeight + "px");
  });

  /* ---------- generic dialog helper (focus trap, Esc, scroll lock) ---------- */
  var openStack = [], lastFocus = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

  function openDialog(overlay) {
    if (!openStack.length) lastFocus = d.activeElement;
    overlay.hidden = false;
    d.body.classList.add("lg-locked");
    if (openStack.indexOf(overlay) < 0) openStack.push(overlay);
    var panel = $(".lg-panel", overlay);
    setTimeout(function () { panel.focus(); }, 0);
  }
  function closeDialog(overlay) {
    overlay.hidden = true;
    openStack = openStack.filter(function (o) { return o !== overlay; });
    if (!openStack.length) {
      d.body.classList.remove("lg-locked");
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }
  }
  d.addEventListener("keydown", function (e) {
    var top = openStack[openStack.length - 1];
    if (!top) return;
    if (e.key === "Escape") { closeDialog(top); return; }
    if (e.key === "Tab") {
      var items = $$(FOCUSABLE, top).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (d.activeElement === first || d.activeElement === $(".lg-panel", top))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $$(".lg-overlay").forEach(function (o) {
    o.addEventListener("mousedown", function (e) { if (e.target === o) closeDialog(o); });
    $$("[data-close]", o).forEach(function (b) { b.addEventListener("click", function () { closeDialog(o); }); });
  });

  /* ---------- legal documents ---------- */
  var legal = $("#legal-modal"), legalTitle = $("#legal-title");
  function showDoc(name) {
    var found = false;
    $$(".lg-doc", legal).forEach(function (doc) {
      var on = doc.id === "doc-" + name;
      doc.hidden = !on;
      if (on) { found = true; legalTitle.textContent = doc.getAttribute("data-title"); }
    });
    if (!found) return showDoc("privacy");
    $$(".lg-tabs button", legal).forEach(function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    $("#legal-body").scrollTop = 0;
  }
  function openLegal(name) {
    showDoc(name);
    openDialog(legal);
  }
  $$(".lg-tabs button", legal).forEach(function (t) {
    t.addEventListener("click", function () { showDoc(t.getAttribute("data-tab")); });
  });

  /* ---------- preferences ---------- */
  var prefs = $("#cookie-prefs"), analyticsBox = $("#cc-analytics");
  function openPrefs() {
    var c = readConsent();
    analyticsBox.checked = !!(c && c.analytics);
    openDialog(prefs);
  }

  /* ---------- wire up every control by data attributes ---------- */
  d.addEventListener("click", function (e) {
    var l = e.target.closest("[data-legal]");
    if (l) { e.preventDefault(); openLegal(l.getAttribute("data-legal")); return; }

    var b = e.target.closest("[data-cc]");
    if (!b) return;
    e.preventDefault();
    var act = b.getAttribute("data-cc");
    if (act === "accept-all") { writeConsent(true); hideBanner(); closeDialog(prefs); }
    else if (act === "essential-only") { writeConsent(false); hideBanner(); closeDialog(prefs); }
    else if (act === "save") { writeConsent(analyticsBox.checked); hideBanner(); closeDialog(prefs); }
    else if (act === "settings") {
      if (!legal.hidden) closeDialog(legal);
      openPrefs();
    }
  });

  /* ---------- init ---------- */
  var existing = readConsent();
  if (existing) applyConsent(existing); else showBanner();
})();
