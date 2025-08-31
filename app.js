/* Quick Coach v3 – app.js */
const DATA = [
{"text": "Write tomorrow’s top 3 before you log off.", "tags": ["planning", "focus"], "pack": "focus"},
{"text": "Close every app you don’t need. Single-task for 20 minutes.", "tags": ["focus", "deep work"], "pack": "focus"},
{"text": "Use a 25/5 focus timer. Breathe on breaks.", "tags": ["timeboxing", "deep work"], "pack": "focus"},
{"text": "Protect your best 90 minutes for deep work.", "tags": ["focus", "deep work"], "pack": "focus"},
{"text": "Do Not Disturb for an hour. Let people wait.", "tags": ["focus", "digital"], "pack": "focus"},
{"text": "Write the problem first. Then the solution.", "tags": ["writing", "clarity"], "pack": "writing"},
{"text": "Short lines. One idea per sentence.", "tags": ["writing", "clarity"], "pack": "writing"},
{"text": "Draft in plain text. Polish later.", "tags": ["writing", "quality"], "pack": "writing"},
{"text": "Write the email subject last—after you’re clear.", "tags": ["writing", "email"], "pack": "writing"},
{"text": "Template your replies. Save 3 frequent responses.", "tags": ["automation", "email"], "pack": "writing"},
{"text": "Stand up, stretch, sip water. Two minutes now.", "tags": ["energy", "health"], "pack": "energy"},
{"text": "Delay coffee until after your first glass of water.", "tags": ["energy", "health"], "pack": "energy"},
{"text": "Work near daylight. It lifts mood and focus.", "tags": ["environment", "energy"], "pack": "energy"},
{"text": "Sleep 7–8 hours. Tired brains fake productivity.", "tags": ["health", "energy"], "pack": "energy"},
{"text": "Walk during low-stakes calls.", "tags": ["health", "energy"], "pack": "energy"},
{"text": "Default to async. Meeting only if needed.", "tags": ["meetings", "async"], "pack": "meetings"},
{"text": "End meetings with owners and dates.", "tags": ["meetings", "ownership"], "pack": "meetings"},
{"text": "Keep meetings to 25 or 50 minutes.", "tags": ["meetings", "time"], "pack": "meetings"},
{"text": "Reduce meetings via 1-pager updates.", "tags": ["async", "communication"], "pack": "meetings"},
{"text": "Protect one meeting-free morning weekly.", "tags": ["meetings", "focus"], "pack": "meetings"},
{"text": "Lift 3x/week. Muscle is your productivity insurance.", "tags": ["after40", "health"], "pack": "after40"},
{"text": "Front-load deep work when energy peaks.", "tags": ["after40", "focus"], "pack": "after40"},
{"text": "Plan protein with your calendar, not vibes.", "tags": ["after40", "planning"], "pack": "after40"},
{"text": "Schedule sleep like a meeting. Show up.", "tags": ["after40", "sleep"], "pack": "after40"},
{"text": "Batch errands to protect your knees and your time.", "tags": ["after40", "efficiency"], "pack": "after40"},
{"text": "If it takes under 2 minutes, do it now.", "tags": ["execution", "habits"], "pack": "general"},
{"text": "Start with a tiny win. Momentum beats motivation.", "tags": ["mindset", "habits"], "pack": "general"},
{"text": "Ask: what’s the smallest valuable version?", "tags": ["strategy", "shipping"], "pack": "general"},
{"text": "Touch it once: decide, delegate, or delete.", "tags": ["execution", "prioritization"], "pack": "general"},
{"text": "Your calendar is your strategy. Guard it.", "tags": ["strategy", "prioritization"], "pack": "general"}
];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const els = {
  tipText: $("#tip-text"),
  tipTags: $("#tip-tags"),
  next: $("#btn-next"),
  fav: $("#btn-fav"),
  copy: $("#btn-copy"),
  share: $("#btn-share"),
  speak: $("#btn-speak"),
  image: $("#btn-image"),
  search: $("#search"),
  chips: $("#chips"),
  favorites: $("#favorites"),
  custom: $("#custom"),
  addForm: $("#add-form"),
  addText: $("#add-text"),
  addTags: $("#add-tags"),
  addPack: $("#add-pack"),
  exportFavs: $("#btn-export"),
  importFile: $("#import-file"),
  clearFavs: $("#btn-clear-favs"),
  autoShuffle: $("#autoShuffle"),
  avoidRepeats: $("#avoidRepeats"),
  breakNotify: $("#breakNotify"),
  fxToggle: $("#fx"),
  hapticsToggle: $("#haptics"),
  tiltToggle: $("#tilt"),
  tipCard: $("#tip-card"),
  toast: $("#toast"),
  theme: $("#btn-theme"),
  cycle: $("#btn-cycle"),
  install: $("#btn-install"),
  pack: $("#pack"),
  // daily
  dailyGoal: $("#daily-goal"),
  saveGoal: $("#btn-save-goal"),
  clearGoal: $("#btn-clear-goal"),
  heatmap: $("#heatmap"),
  streakCount: $("#streak-count"),
  // challenge
  chalText: $("#daily-challenge"),
  chalDone: $("#btn-complete-challenge"),
  chalStatus: $("#challenge-status"),
  // timer
  td: $("#timer-display"),
  tStart: $("#t-start"),
  tPause: $("#t-pause"),
  tReset: $("#t-reset"),
  tWork: $("#t-work"),
  tBreak: $("#t-break"),
  tRounds: $("#t-rounds"),
  ring: $("#ring-fg"),
  // journal + stats
  journal: $("#journal"),
  saveJournal: $("#btn-save-journal"),
  exportJournal: $("#btn-export-journal"),
  statTips: $("#stat-tips"),
  statFavs: $("#stat-favs"),
  statSessions: $("#stat-sessions"),
  statMins: $("#stat-mins"),
  // FX canvas
  fx: $("#fx-canvas"),
};

let currentIndex = -1;
let pool = [];
let favorites = JSON.parse(localStorage.getItem("qc:favs")||"[]");
let custom = JSON.parse(localStorage.getItem("qc:custom")||"[]");
let autoTimer = null;
let deferredPrompt = null;

// Stats
const stats = JSON.parse(localStorage.getItem("qc:stats")||"{}");
stats.tips = stats.tips||0;
stats.favs = stats.favs||0;
stats.sessions = stats.sessions||0;
stats.mins = stats.mins||0;

// Theme
const themeKey = "qc:theme";
const setThemeIcon = () => {
  const light = document.documentElement.classList.contains("light");
  els.theme.firstElementChild.className = light ? "icon-moon" : "icon-sun";
};
const loadTheme = () => {
  const saved = localStorage.getItem(themeKey);
  if(saved === "dark") document.documentElement.classList.remove("light");
  else document.documentElement.classList.add("light");
  setThemeIcon();
};
const toggleTheme = () => {
  document.documentElement.classList.toggle("light");
  localStorage.setItem(themeKey, document.documentElement.classList.contains("light") ? "light" : "dark");
  setThemeIcon();
};

const palettes = [
  ["#6366f1","#22c55e"], // indigo-green
  ["#f97316","#22c55e"], // orange-green
  ["#06b6d4","#a78bfa"], // cyan-violet
  ["#ef4444","#f59e0b"], // red-amber
  ["#10b981","#3b82f6"], // emerald-blue
];
function applyPalette([a,b]){
  document.documentElement.style.setProperty('--brand', a);
  document.documentElement.style.setProperty('--brand-2', b);
}

// Packs + tags
const allTags = Array.from(new Set(DATA.flatMap(t => t.tags).concat(custom.flatMap(t=>t.tags||[])))).sort();
let activeTag = null;
function renderChips() {
  els.chips.innerHTML = '<span class="chip'+(activeTag===null?' active':'')+'" data-tag="">All</span>'
    + allTags.map(tag => `<span class="chip{active}" data-tag="{tag}">{text}</span>`
      .replace("{tag}", tag)
      .replace("{text}", "#"+tag)
      .replace("{active}", activeTag===tag?' active':''))
      .join("");
  $$(".chip").forEach(ch => ch.addEventListener("click", () => {
    activeTag = ch.dataset.tag||null;
    renderChips();
    rebuildPool();
    showRandom(true);
  }));
}

function dataWithCustom() {
  const pack = els.pack.value;
  const src = DATA.concat(custom);
  return src.filter(t => pack==="all" ? true : (t.pack||"general")===pack);
}

function getFilteredData() {
  const term = els.search.value.trim().toLowerCase();
  const src = dataWithCustom();
  return src.filter(t => {
    const okTag = !activeTag || (t.tags||[]).includes(activeTag);
    const okText = !term || t.text.toLowerCase().includes(term) || (t.tags||[]).some(x=>x.toLowerCase().includes(term));
    return okTag && okText;
  });
}

function rebuildPool() {
  pool = getFilteredData().map((_, i) => i);
  shuffle(pool);
}

function shuffle(arr) {
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderTip(tip) {
  els.tipText.textContent = tip.text;
  els.tipTags.innerHTML = (tip.tags||[]).map(t => `<span class="tag">#${t}</span>`).join("");
  // subtle transition
  els.tipText.style.opacity = "0"; requestAnimationFrame(()=>{ els.tipText.style.opacity="1"; });
  stats.tips++; saveStats(); renderStats();
}

function showRandom(force=false) {
  const data = getFilteredData();
  if(data.length===0){
    els.tipText.textContent = "No tips match the filter. Clear search or tags.";
    els.tipTags.innerHTML = "";
    return;
  }
  if(!els.avoidRepeats.checked || force || pool.length===0){
    rebuildPool();
  }
  const idxInPool = Math.floor(Math.random()*pool.length);
  const index = pool.splice(idxInPool,1)[0];
  currentIndex = index;
  renderTip(data[index]);
  if(els.fxToggle.checked) burst("spark");
  vibe(10);
}

function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  setTimeout(()=>els.toast.classList.remove("show"), 1400);
}

function copyCurrent() {
  const t = getFilteredData()[currentIndex];
  if(!t) return;
  navigator.clipboard.writeText(t.text).then(()=>toast("Copied")).catch(()=>toast("Press Ctrl+C"));
}

function shareCurrent() {
  const t = getFilteredData()[currentIndex];
  if(!t) return;
  const url = new URL(window.location.href);
  url.hash = encodeURIComponent(t.text.slice(0,60));
  if(navigator.share) {
    navigator.share({title:"Quick Coach Tip", text:t.text, url:url.toString()}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(`${t.text}\n${url}`);
    toast("Share link copied");
  }
}

function speakCurrent() {
  const t = getFilteredData()[currentIndex];
  if(!t) return;
  try {
    const u = new SpeechSynthesisUtterance(t.text);
    u.rate = 1.05;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch { toast("Speech not supported"); }
}

function shareAsImage() {
  const t = getFilteredData()[currentIndex];
  if(!t) return;
  const c = document.querySelector("#share-canvas");
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  const g = ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0, "#0b1220"); g.addColorStop(1, "#1d3a29");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){ 
    ctx.fillStyle = i%2? "#22c55e88":"#22c55e33"; 
    ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*10+2, 0, Math.PI*2); ctx.fill(); 
  }
  ctx.fillStyle = "#e8f0ff";
  ctx.font = "bold 52px system-ui, -apple-system, Segoe UI, Roboto";
  const words = t.text.split(" ");
  let line="", y=220, maxWidth=W-200;
  words.forEach(w=>{
    const m = ctx.measureText((line+" "+w).trim());
    if(m.width>maxWidth){ ctx.fillText(line.trim(), 100, y); line=w; y+=64; }
    else line = (line+" "+w).trim();
  });
  if(line) ctx.fillText(line, 100, y);
  ctx.font = "20px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillStyle = "#a5b4d4";
  ctx.fillText("Quick Coach · quick tip", 100, H-120);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png"); a.download = "quick-coach-tip.png"; a.click();
  toast("PNG ready");
}

// Favorites + custom
function toggleFav() {
  const t = getFilteredData()[currentIndex];
  if(!t) return;
  const key = t.text;
  const i = favorites.findIndex(x => x.text === key);
  if(i>-1) favorites.splice(i,1);
  else { favorites.unshift(t); stats.favs++; saveStats(); }
  localStorage.setItem("qc:favs", JSON.stringify(favorites));
  renderFavs(); renderStats();
  toast("Favorites updated");
}

function renderFavs() {
  els.favorites.innerHTML = favorites.map((t,i)=>`
    <li>
      <span>${t.text}</span>
      <span>
        <button class="btn small" data-i="${i}" data-act="copy">Copy</button>
        <button class="btn danger small" data-i="${i}" data-act="del">Remove</button>
      </span>
    </li>
  `).join("") || '<li class="small">No favorites yet.</li>';
  els.favorites.querySelectorAll("button").forEach(b=>b.addEventListener("click", ()=>{
    const i = +b.dataset.i; const act = b.dataset.act;
    if(act==="del") { favorites.splice(i,1); localStorage.setItem("qc:favs", JSON.stringify(favorites)); renderFavs(); renderStats(); }
    if(act==="copy") { navigator.clipboard.writeText(favorites[i].text); toast("Copied"); }
  }));
}

function renderCustom() {
  els.custom.innerHTML = custom.map((t,i)=>`
    <li>
      <span>${t.text}</span>
      <span>
        <button class="btn small" data-i="${i}" data-act="copy">Copy</button>
        <button class="btn danger small" data-i="${i}" data-act="del">Delete</button>
      </span>
    </li>
  `).join("") || '<li class="small">You haven’t added custom tips yet.</li>';
  els.custom.querySelectorAll("button").forEach(b=>b.addEventListener("click", ()=>{
    const i = +b.dataset.i; const act = b.dataset.act;
    if(act==="del") { custom.splice(i,1); localStorage.setItem("qc:custom", JSON.stringify(custom)); rebuildPool(); renderCustom(); renderChips(); }
    if(act==="copy") { navigator.clipboard.writeText(custom[i].text); toast("Copied"); }
  }));
}

function exportFavs() {
  const blob = new Blob([JSON.stringify(favorites,null,2)], {type:"application/json"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "quick-coach-favorites.json"; a.click(); URL.revokeObjectURL(a.href);
}

function importFavs(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if(Array.isArray(arr)) { favorites = arr.concat(favorites); localStorage.setItem("qc:favs", JSON.stringify(favorites)); renderFavs(); renderStats(); toast("Imported"); }
    } catch(e) { toast("Bad file"); }
  };
  reader.readAsText(file);
}

function startAutoShuffle() {
  if(autoTimer) clearInterval(autoTimer);
  if(els.autoShuffle.checked) autoTimer = setInterval(showRandom, 30000);
}

// FX: bursts (spark/confetti) on the full-screen canvas
function burst(type="spark") {
  const c = els.fx, ctx = c.getContext("2d");
  const W = c.width = window.innerWidth, H = c.height = window.innerHeight;
  const n = type==="confetti" ? 140 : 40;
  const parts=[];
  for(let i=0;i<n;i++) {
    parts.push({
      x: W/2, y: H/3,
      vx: (Math.random()-0.5)*(type==="confetti"?10:4),
      vy: -Math.random()*(type==="confetti"?10:4)-1,
      size: type==="confetti" ? Math.random()*6+3 : 2.2,
      life: Math.random()*60+30,
      color: type==="confetti" ? (Math.random()<.5?getComputedStyle(document.documentElement).getPropertyValue('--brand'):getComputedStyle(document.documentElement).getPropertyValue('--brand-2')) : "#fff"
    });
  }
  let t=0;
  function frame(){
    ctx.clearRect(0,0,W,H);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
      ctx.globalAlpha = Math.max(0, p.life/70);
      ctx.fillStyle = p.color.trim() || "#fff";
      if(type==="confetti"){ ctx.fillRect(p.x,p.y,p.size,p.size); }
      else { ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,Math.PI*2); ctx.fill(); }
    });
    t++;
    if(t<100 && els.fxToggle.checked) requestAnimationFrame(frame); else ctx.clearRect(0,0,W,H);
  }
  frame();
}


// Tilt effect (safe attach/detach without cloning)
const _tilt = { handlers: null };
function enableTilt(){
  const card = els.tipCard;
  const onMove = (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    card.style.transform = `rotateX(${ -y*6 }deg) rotateY(${ x*8 }deg)`;
  };
  const off = ()=>{ card.style.transform = 'rotateX(0) rotateY(0)'; };
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', off);
  _tilt.handlers = { onMove, off };
  card.dataset.tilt = "on";
}
function disableTilt(){
  const card = els.tipCard;
  if(_tilt.handlers){
    card.removeEventListener('mousemove', _tilt.handlers.onMove);
    card.removeEventListener('mouseleave', _tilt.handlers.off);
    _tilt.handlers = null;
  }
  card.style.transform = 'rotateX(0) rotateY(0)';
  delete card.dataset.tilt;
}

// Haptics helper
function vibe(ms){ if(els.hapticsToggle.checked && 'vibrate' in navigator) navigator.vibrate(ms); }

// PWA install
window.addEventListener("beforeinstallprompt", (e)=>{ e.preventDefault(); deferredPrompt = e; els.install.hidden=false; });
els.install.addEventListener("click", async ()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; els.install.hidden=true; });

// Daily goal + streaks
function saveGoal(){ localStorage.setItem("qc:goal", els.dailyGoal.value.trim()); toast("Goal saved"); }
function loadGoal(){ els.dailyGoal.value = localStorage.getItem("qc:goal")||""; }
els.saveGoal?.addEventListener("click", saveGoal);
els.clearGoal?.addEventListener("click", ()=>{ els.dailyGoal.value=""; saveGoal(); });

function getTodayKey(){ const d=new Date(); return d.toISOString().slice(0,10); }
function markDoneToday(){ const key="qc:done"; const obj=JSON.parse(localStorage.getItem(key)||"{}"); obj[getTodayKey()]=true; localStorage.setItem(key, JSON.stringify(obj)); renderHeatmap(); }
function getStreak(){ const obj=JSON.parse(localStorage.getItem("qc:done")||"{}"); let s=0; for(let i=0;i<365;i++){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); if(obj[k]) s++; else break; } return s; }
function renderHeatmap(){ const obj=JSON.parse(localStorage.getItem("qc:done")||"{}"); els.heatmap.innerHTML=""; for(let i=29;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); const div=document.createElement("div"); div.className="cell"+(obj[k]?" on":""); div.title=k+(obj[k]?" ✓":""); els.heatmap.appendChild(div); } els.streakCount.textContent=getStreak(); }

// Challenge of the day
const challenges=["Delete one app from your phone.","Write your top 3 for tomorrow.","25/5 sprint on a single task.","Turn off notifications for an hour.","Drink 3 glasses of water before lunch.","Write a one-pager instead of a meeting.","Rename one vague task to a crisp action."];
function loadChallenge(){ const key="qc:challenge"; const today=getTodayKey(); let obj=JSON.parse(localStorage.getItem(key)||"{}"); if(obj.date!==today){ obj={date:today,text:challenges[Math.floor(Math.random()*challenges.length)],done:false}; localStorage.setItem(key, JSON.stringify(obj)); } els.chalText.textContent=obj.text; els.chalStatus.textContent=obj.done?"Completed ✓":"Not done"; }
function completeChallenge(){ let obj=JSON.parse(localStorage.getItem("qc:challenge")||"{}"); obj.done=true; localStorage.setItem("qc:challenge", JSON.stringify(obj)); els.chalStatus.textContent="Completed ✓"; markDoneToday(); toast("Nice. Challenge completed."); if(els.fxToggle.checked) burst("confetti"); vibe(20); }

// Timer
let timer=null,totalMs=0,leftMs=0,mode="work",roundsLeft=0;
function ms(m){ return m*60*1000; }
function setDisplay(ms){ const s=Math.max(0,Math.floor(ms/1000)); const mm=String(Math.floor(s/60)).padStart(2,"0"); const ss=String(s%60).padStart(2,"0"); els.td.textContent=mm+":"+ss; const pct=Math.max(0,1 - (ms/totalMs||1)); const circumference=339.292; els.ring.style.strokeDashoffset = String(circumference - circumference*pct); }
function startTimer(){ if(timer) return; const w=+els.tWork.value||25, b=+els.tBreak.value||5, r=+els.tRounds.value||4; if(totalMs===0){ mode="work"; roundsLeft=r; leftMs=totalMs=ms(w); setDisplay(leftMs); } timer=setInterval(()=>{ leftMs-=1000; setDisplay(leftMs); if(leftMs<=0){ clearInterval(timer); timer=null; if(mode==="work"){ stats.sessions++; stats.mins += (+els.tWork.value||25); saveStats(); renderStats(); markDoneToday(); if(els.breakNotify.checked && "Notification" in window && Notification.permission==="granted") new Notification("Break time","Walk, breathe, water."); mode="break"; leftMs=totalMs=ms(b); setDisplay(leftMs); startTimer(); } else { roundsLeft--; if(roundsLeft>0){ if(els.breakNotify.checked && "Notification" in window && Notification.permission==="granted") new Notification("Focus time","Back to work."); mode="work"; leftMs=totalMs=ms(w); setDisplay(leftMs); startTimer(); } else { toast("Session complete"); if(els.fxToggle.checked) burst("confetti"); vibe(30); } } } ,1000); }
function pauseTimer(){ if(timer){ clearInterval(timer); timer=null; } }
function resetTimer(){ pauseTimer(); totalMs=0; leftMs=0; mode="work"; setDisplay(ms(+els.tWork.value||25)); }

// Journal
function loadJournal(){ els.journal.value = localStorage.getItem("qc:journal")||""; }
function saveJournal(){ localStorage.setItem("qc:journal", els.journal.value); toast("Journal saved"); }
function exportJournal(){ const blob=new Blob([els.journal.value],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="quick-coach-journal.txt"; a.click(); URL.revokeObjectURL(a.href); }

// Stats
function renderStats(){ els.statTips.textContent=stats.tips||0; els.statFavs.textContent=favorites.length||0; els.statSessions.textContent=stats.sessions||0; els.statMins.textContent=stats.mins||0; }
function saveStats(){ localStorage.setItem("qc:stats", JSON.stringify(stats)); }

// Wire
function wire(){
  els.next.addEventListener("click", ()=>showRandom(true));
  els.fav.addEventListener("click", toggleFav);
  els.copy.addEventListener("click", copyCurrent);
  els.share.addEventListener("click", shareCurrent);
  els.speak.addEventListener("click", speakCurrent);
  els.image.addEventListener("click", shareAsImage);
  els.search.addEventListener("input", ()=>{ rebuildPool(); showRandom(true); });
  els.exportFavs.addEventListener("click", exportFavs);
  els.importFile.addEventListener("change", e => e.target.files[0] && importFavs(e.target.files[0]));
  els.clearFavs.addEventListener("click", ()=>{ favorites=[]; localStorage.setItem("qc:favs","[]"); renderFavs(); renderStats(); });
  els.autoShuffle.addEventListener("change", startAutoShuffle);
  els.avoidRepeats.addEventListener("change", ()=>{ rebuildPool(); showRandom(true); });
  els.pack.addEventListener("change", ()=>{ rebuildPool(); showRandom(true); });
  els.chalDone.addEventListener("click", completeChallenge);
  // Journal
  els.saveJournal.addEventListener("click", saveJournal);
// Ctrl+Enter to save journal
els.journal.addEventListener('keydown', (e)=>{ if((e.ctrlKey||e.metaKey) && e.key==='Enter'){ e.preventDefault(); saveJournal(); }});

  els.exportJournal.addEventListener("click", exportJournal);
  // Timer
  els.tStart.addEventListener("click", ()=>{ if(timer) pauseTimer(); else startTimer(); });
  els.tPause.addEventListener("click", pauseTimer);
  els.tReset.addEventListener("click", resetTimer);
  // Theme + FX settings
  els.theme.addEventListener("click", toggleTheme);
  els.cycle.addEventListener("click", ()=>{ const i = Math.floor(Math.random()*palettes.length); applyPalette(palettes[i]); });
  els.tiltToggle.addEventListener("change", ()=>{ els.tiltToggle.checked ? enableTilt() : disableTilt(); });
  els.breakNotify.addEventListener("change", ()=>{ if(els.breakNotify.checked && "Notification" in window) Notification.requestPermission(); });
  // Keyboard
  window.addEventListener("keydown", (e)=>{
    if(["INPUT","TEXTAREA"].includes(document.activeElement.tagName) && e.key!=="/") return;
    if(e.key===" "||e.key.toLowerCase()==="n") { e.preventDefault(); showRandom(true); }
    if(e.key.toLowerCase()==="f") { toggleFav(); }
    if(e.key.toLowerCase()==="c") { copyCurrent(); }
    if(e.key.toLowerCase()==="s") { shareCurrent(); }
    if(e.key==="/") { e.preventDefault(); els.search.focus(); }
    if(e.key.toLowerCase()==="t") { if(timer) pauseTimer(); else startTimer(); }
    if(e.key.toLowerCase()==="r") { resetTimer(); }
    if(e.key.toLowerCase()==="g") { els.dailyGoal.focus(); }
    if(e.key.toLowerCase()==="j") { els.journal.focus(); }
  });
  window.addEventListener("resize", ()=>{ els.fx.width = window.innerWidth; els.fx.height = window.innerHeight; });
}

// Boot
async function boot(){
  loadTheme(); applyPalette(palettes[0]);
  renderFavs(); renderCustom(); renderChips();
  rebuildPool(); showRandom(true); startAutoShuffle();
  loadGoal(); renderHeatmap(); loadChallenge();
  loadJournal(); renderStats(); resetTimer();
  wire(); enableTilt();
  if('serviceWorker' in navigator) { try { await navigator.serviceWorker.register('./sw.js'); } catch {} }
}
boot();
