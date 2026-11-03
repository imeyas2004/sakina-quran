// ====== Tathbît : réviser le Coran à plusieurs ======
// Avec des amies réelles (chacune sur son téléphone, le plan se partage par un lien)
// ou avec des compagnons audio (récitateurs) quand personne n'est disponible.
//
// Utilise : getChapters(), getVerse(), stopAudio() (app.js), wordsOf() (hifdh.js),
// playSequence(), startRecording() (record.js), el() (game.js), Store, markToday() (store.js).

const rafBox = document.querySelector("#rafiq");
let raf = null;         // plan sauvegardé : { plan, me, done }
let sess = null;        // séance en cours : { day, stages, si, ti }
let pendingJoin = null; // plan reçu par lien, en attente de confirmation
let recitersCache = null;
const PREFERRED_VOICES = /sobh[iy]|jaz[ae]+[iy]*r[iy]|jaz[ae]+ry|yas[s]?[ie]+n/i; // Islam Sobhi, Yassine Al-Jazairi
const audioUrlCache = new Map();

// ---------- Petits outils ----------
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function field(label, control) {
  const d = el("label", "field");
  d.appendChild(el("span", "field-label", label));
  d.appendChild(control);
  return d;
}

function numInput(value, min, max) {
  const i = document.createElement("input");
  i.type = "number";
  i.min = min;
  i.max = max;
  i.value = value;
  return i;
}

function selectOf(options, value) {
  const s = document.createElement("select");
  options.forEach(([v, l]) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = l;
    s.appendChild(o);
  });
  s.value = value;
  if (s.selectedIndex < 0) s.selectedIndex = 0;
  return s;
}

async function shareText(text, btn, idle) {
  try {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copié ✓";
      setTimeout(() => (btn.textContent = idle), 1800);
    }
  } catch (e) { /* partage annulé */ }
}

function rafTitle(subtitle) {
  rafBox.innerHTML = "";
  rafBox.appendChild(el("h1", "game-title", "Tathbît · تثبيت"));
  if (subtitle) rafBox.appendChild(el("p", "muted center", subtitle));
}

function rafError(message, retry) {
  rafBox.appendChild(el("p", "error", message));
  const b = el("button", "btn", "Réessayer");
  b.addEventListener("click", retry);
  const wrap = el("div", "center");
  wrap.appendChild(b);
  rafBox.appendChild(wrap);
}

// ---------- Récitateurs (liste demandée à l'API) ----------
async function getReciters() {
  if (recitersCache) return recitersCache;
  let list = [];
  try {
    const res = await fetch(`${API}/resources/recitations?language=fr`);
    if (res.ok) {
      const data = await res.json();
      list = (data.recitations || []).map((r) => ({
        id: r.id,
        name: ((r.translated_name && r.translated_name.name) || r.reciter_name || "Récitateur") + (r.style ? " – " + r.style : "")
      }));
    }
  } catch (e) { /* liste indisponible : on garde Alafasy */ }
  if (!list.some((r) => r.id === RECITER_ID)) list.unshift({ id: RECITER_ID, name: "Mishary Alafasy" });
  // Voix préférées (Islam Sobhi, Yassine Al-Jazairi) d'abord, puis Alafasy, puis les autres
  const rank = (r) => (PREFERRED_VOICES.test(r.name) ? 0 : r.id === RECITER_ID ? 1 : 2);
  list.sort((a, b) => rank(a) - rank(b));
  list.preferred = list.filter((r) => PREFERRED_VOICES.test(r.name));
  recitersCache = list;
  return list;
}

function reciterName(id) {
  const r = (recitersCache || []).find((x) => x.id === id);
  return r ? r.name : "Récitateur";
}

function fullAudioUrl(u) {
  if (!u) return null;
  if (u.startsWith("//")) return "https:" + u;
  if (/^https?:/.test(u)) return u;
  return AUDIO_BASE + u;
}

// Adresse de l'audio d'un verset pour un récitateur donné (repli : Alafasy)
async function getAudioUrl(key, rid) {
  if (rid === RECITER_ID) return (await getVerse(key)).audio;
  const ck = rid + ":" + key;
  if (audioUrlCache.has(ck)) return audioUrlCache.get(ck);
  let url = null;
  try {
    const res = await fetch(`${API}/verses/by_key/${key}?words=false&audio=${rid}`);
    if (res.ok) {
      const { verse } = await res.json();
      url = fullAudioUrl(verse && verse.audio && verse.audio.url);
    }
  } catch (e) { /* on essaie le repli */ }
  if (!url) url = (await getVerse(key)).audio;
  audioUrlCache.set(ck, url);
  return url;
}

// ---------- Plan : calculs ----------
// Unités du miqdar : versets, pages, rub' (quart de hizb), nisf hizb (demi-hizb), hizb
const UNITS = {
  v: { fr: "versets", one: "verset", ar: "آيات" },
  p: { fr: "pages", one: "page", ar: "صفحات" },
  r: { fr: "rub' (quart de hizb)", one: "rub' (quart de hizb)", ar: "ربع" },
  n: { fr: "nisf hizb (demi-hizb)", one: "nisf hizb (demi-hizb)", ar: "نصف حزب" },
  h: { fr: "hizb", one: "hizb", ar: "حزب" }
};

// Début (numéro de verset) de chaque jour : calculé depuis q (versets) ou donné par plan.d (autres unités)
function dayStarts(plan) {
  if (plan.d) return plan.d;
  const d = [];
  for (let v = plan.f; v <= plan.t; v += plan.q) d.push(v);
  return d;
}

function totalDays(plan) {
  return dayStarts(plan).length;
}

function portionOf(plan, day) {
  const d = dayStarts(plan);
  if (day < 1 || day > d.length) return null;
  return { from: d[day - 1], to: day < d.length ? d[day] - 1 : plan.t };
}

function miqdarText(plan) {
  const m = plan.m || "v";
  return plan.q + " " + (plan.q > 1 ? UNITS[m].fr : UNITS[m].one) + " par jour";
}

// Récupère le début de chaque unité (page, rub'…) pour les versets d'une sourate, avec l'API
async function getUnitStarts(s, f, t, m, q) {
  const all = [];
  let page = 1;
  while (page && all.length < 400) {
    const res = await fetch(`${API}/verses/by_chapter/${s}?words=false&fields=page_number,rub_el_hizb_number,hizb_number&per_page=50&page=${page}`);
    if (!res.ok) throw new Error("unités indisponibles");
    const data = await res.json();
    all.push(...(data.verses || []));
    page = data.pagination && data.pagination.next_page ? data.pagination.next_page : null;
  }
  const keyOf = (v) => {
    const rub = Number(v.rub_el_hizb_number);
    if (m === "p") return Number(v.page_number);
    if (!rub) return NaN;
    if (m === "r") return rub;
    if (m === "n") return Math.ceil(rub / 2);
    return Math.ceil(rub / 4); // hizb
  };
  const starts = []; // premier verset de chaque unité
  let last = null;
  all.forEach((v) => {
    const n = Number(String(v.verse_key).split(":")[1]);
    if (n < f || n > t) return;
    const k = keyOf(v);
    if (!Number.isFinite(k)) throw new Error("unités indisponibles");
    if (k !== last) { starts.push(n); last = k; }
  });
  if (!starts.length) throw new Error("unités indisponibles");
  const d = [];
  for (let i = 0; i < starts.length; i += q) d.push(starts[i]);
  return d;
}

// Étapes d'une journée : révision des 2 jours précédents, puis nouvelle portion
function stagesFor(plan, day) {
  const stages = [];
  if (day >= 2) {
    const a = portionOf(plan, Math.max(1, day - 2));
    const b = portionOf(plan, day - 1);
    stages.push({ title: "Révision", from: a.from, to: b.to });
  }
  const c = portionOf(plan, day);
  const reps = plan.r || 1; // le miqdar général est répété plusieurs fois ; les parts tournent entre les personnes
  for (let i = 1; i <= reps; i++) {
    stages.push({ title: reps > 1 ? "Miqdar général · répétition " + i + "/" + reps : "Nouvelle portion", from: c.from, to: c.to, shift: i - 1 });
  }
  const offset = (day - 1) % plan.p.length; // une personne différente commence chaque jour
  stages.forEach((st) => (st.turns = makeTurns(plan, st, offset + (st.shift || 0))));
  return stages;
}

// Découpe une portion en tours, à tour de rôle entre les personnes
function makeTurns(plan, stage, offset) {
  const turns = [];
  let person = offset % plan.p.length;
  if (plan.tu === "p" && plan.pg) { // tours en pages : chaque personne lit 1, 2… pages
    const starts = [stage.from, ...plan.pg.filter((x) => x > stage.from && x <= stage.to)];
    for (let i = 0; i < starts.length; i += plan.u) {
      const to = i + plan.u < starts.length ? starts[i + plan.u] - 1 : stage.to;
      turns.push({ person, from: starts[i], to });
      person = (person + 1) % plan.p.length;
    }
    return turns;
  }
  for (let v = stage.from; v <= stage.to; v += plan.u) {
    turns.push({ person, from: v, to: Math.min(stage.to, v + plan.u - 1) });
    person = (person + 1) % plan.p.length;
  }
  return turns;
}

function turnText(plan) {
  if (plan.tu === "p") return plan.u + (plan.u > 1 ? " pages" : " page") + " par tour";
  return plan.u + (plan.u > 1 ? " versets" : " verset") + " par tour";
}

function nextDay(plan) {
  const n = totalDays(plan);
  for (let d = 1; d <= n; d++) if (!raf.done[d]) return d;
  return null;
}

function doneCount(plan) {
  const n = totalDays(plan);
  let c = 0;
  for (let d = 1; d <= n; d++) if (raf.done[d]) c++;
  return c;
}

// ---------- Plan partagé par lien ----------
function encodePlan(plan) {
  const json = JSON.stringify({ v: 1, s: plan.s, f: plan.f, t: plan.t, q: plan.q, u: plan.u, p: plan.p, m: plan.m || "v", d: plan.m && plan.m !== "v" ? plan.d : undefined, tu: plan.tu === "p" ? "p" : undefined, r: plan.r > 1 ? plan.r : undefined, pg: plan.tu === "p" ? plan.pg : undefined });
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePlan(str) {
  try {
    let s = str.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  } catch (e) {
    return null;
  }
}

// Vérifie (et nettoie) un plan reçu ou sauvegardé : jamais de confiance aveugle
function cleanPlan(raw, chapters) {
  if (!raw || typeof raw !== "object") return null;
  const s = Number(raw.s), f = Number(raw.f), t = Number(raw.t), q = Number(raw.q), u = Number(raw.u);
  if (!Number.isInteger(s) || s < 1 || s > 114 || !chapters[s]) return null;
  if (![f, t, q, u].every(Number.isInteger)) return null;
  if (f < 1 || t > chapters[s].verses || f > t || q < 1 || q > 50 || u < 1 || u > 10) return null;
  if (!Array.isArray(raw.p) || raw.p.length < 2 || raw.p.length > 4) return null;
  const p = raw.p.map((x, i) => {
    const r = Number(x && x.r);
    return {
      n: String((x && x.n) || "Personne " + (i + 1)).slice(0, 30),
      k: x && x.k === "v" ? "v" : "h",
      r: Number.isInteger(r) && r > 0 ? r : RECITER_ID
    };
  });
  const m = Object.prototype.hasOwnProperty.call(UNITS, raw.m) ? raw.m : "v";
  const r = raw.r === undefined ? 1 : Number(raw.r);
  if (!Number.isInteger(r) || r < 1 || r > 10) return null;
  const plan = { s, f, t, q, u, p, m, tu: "v", r };
  if (raw.tu === "p") {
    const g = raw.pg;
    const okp = Array.isArray(g) && g.length >= 1 && g.length <= 300 && g.every((x, i) => Number.isInteger(x) && x >= f && x <= t && (i === 0 || x > g[i - 1])) && u <= 5;
    if (!okp) return null;
    plan.tu = "p";
    plan.pg = g.slice();
  }
  if (m !== "v") {
    const d = raw.d;
    const ok = Array.isArray(d) && d.length >= 1 && d.length <= 300 && d.every((x, i) => Number.isInteger(x) && x >= f && x <= t && (i === 0 || x > d[i - 1])) && d[0] === f;
    if (!ok) return null;
    plan.d = d.slice();
  }
  return plan;
}

async function rafImportHash() {
  if (!location.hash.startsWith("#rafiq=")) return;
  const raw = decodePlan(location.hash.slice(7));
  try { history.replaceState(null, "", location.href.split("#")[0]); } catch (e) { /* ignoré */ }
  try {
    const chapters = await getChapters();
    const plan = cleanPlan(raw, chapters);
    pendingJoin = plan ? { plan } : { error: true };
  } catch (e) {
    pendingJoin = { error: true };
  }
  document.querySelector('.tab[data-view="rafiq"]').click();
}

// ---------- Ouverture de l'onglet ----------
async function rafOpen() {
  stopAudio();
  rafTitle();
  rafBox.appendChild(el("p", "muted center", "Chargement…"));
  try {
    const chapters = await getChapters();
    await getReciters();
    if (pendingJoin) {
      rafJoin(chapters);
      return;
    }
    raf = Store.get("rafiq", null);
    const plan = raf && raf.plan ? cleanPlan(raf.plan, chapters) : null;
    if (plan) {
      raf.plan = plan;
      raf.me = Number.isInteger(raf.me) && raf.me >= 0 && raf.me < plan.p.length ? raf.me : 0;
      raf.done = raf.done && typeof raf.done === "object" ? raf.done : {};
      rafDashboard(chapters);
    } else {
      rafForm(chapters);
    }
  } catch (err) {
    console.error(err);
    rafTitle();
    rafError("Impossible de charger Tathbît. Vérifiez votre connexion.", rafOpen);
  }
}

// ---------- Rejoindre un plan reçu par lien ----------
function rafJoin(chapters) {
  const pj = pendingJoin;
  rafTitle();
  if (pj.error) {
    pendingJoin = null;
    rafBox.appendChild(el("p", "error", "Ce lien de plan n'est pas valide."));
    const b = el("button", "btn", "Créer mon propre plan");
    b.addEventListener("click", rafOpen);
    const wrap = el("div", "center");
    wrap.appendChild(b);
    rafBox.appendChild(wrap);
    return;
  }
  const plan = pj.plan;
  const ch = chapters[plan.s];
  rafBox.appendChild(el("p", "center", "On vous invite à réviser ensemble :"));
  const card = el("article", "verse");
  card.appendChild(el("div", "verse-ref", "Sourate " + ch.latin + " (" + ch.arabic + ")"));
  card.appendChild(el("p", "", "Versets " + plan.f + " à " + plan.t + " · " + miqdarText(plan) + " · " + totalDays(plan) + " jours"));
  const list = el("ul", "plist");
  plan.p.forEach((x) => list.appendChild(el("li", "", (x.k === "v" ? "🎧 " + x.n + " (compagnon audio)" : "👥 " + x.n))));
  card.appendChild(list);

  const humans = plan.p.map((x, i) => [i, x.n]).filter(([i]) => plan.p[i].k === "h");
  const who = selectOf(humans, humans[0][0]);
  card.appendChild(field("Qui êtes-vous dans ce groupe ?", who));
  const join = el("button", "btn", Store.get("rafiq", null) ? "Rejoindre (remplace mon plan actuel)" : "Rejoindre ce plan");
  join.addEventListener("click", () => {
    raf = { plan, me: Number(who.value), done: {} };
    Store.set("rafiq", raf);
    pendingJoin = null;
    rafDashboard(chapters);
  });
  const cancel = el("button", "btn ghost", "Annuler");
  cancel.addEventListener("click", () => { pendingJoin = null; rafOpen(); });
  const row = el("div", "actions");
  row.appendChild(join);
  row.appendChild(cancel);
  card.appendChild(row);
  rafBox.appendChild(card);
}

// ---------- Création d'un plan ----------
async function rafForm(chapters, draft) {
  const reciters = await getReciters();
  if (!draft) {
    draft = {
      s: 78, f: 1, t: chapters[78].verses, q: 5, m: "v", u: 2, tu: "v", r: 1,
      p: [
        { n: "Moi", k: "h", r: RECITER_ID },
        { n: "", k: "v", r: reciters[0].id },
        { n: "", k: "v", r: (reciters[1] || reciters[0]).id }
      ]
    };
  }

  const render = () => {
    rafTitle("Révisez à plusieurs : avec des amies, ou avec des compagnons audio quand elles ne sont pas disponibles.");
    draft.p.forEach((p) => {
      if (p.k === "v" && !reciters.some((r) => r.id === p.r)) p.r = reciters[0].id;
    });
    const max = chapters[draft.s].verses;
    const form = el("div", "form");

    const sSel = selectOf(Array.from({ length: 114 }, (_, i) => [i + 1, (i + 1) + ". " + chapters[i + 1].latin + " (" + chapters[i + 1].arabic + ")"]), draft.s);
    sSel.addEventListener("change", () => { draft.s = Number(sSel.value); draft.f = 1; draft.t = chapters[draft.s].verses; render(); });
    form.appendChild(field("Sourate à mémoriser", sSel));

    const fIn = numInput(draft.f, 1, max);
    fIn.addEventListener("change", () => { draft.f = clamp(Number(fIn.value) || 1, 1, max); if (draft.t < draft.f) draft.t = draft.f; render(); });
    const tIn = numInput(draft.t, 1, max);
    tIn.addEventListener("change", () => { draft.t = clamp(Number(tIn.value) || max, 1, max); if (draft.f > draft.t) draft.f = draft.t; render(); });
    const r1 = el("div", "row2");
    r1.appendChild(field("Du verset", fIn));
    r1.appendChild(field("Au verset", tIn));
    form.appendChild(r1);

    const qIn = numInput(draft.q, 1, 50);
    qIn.addEventListener("change", () => { draft.q = clamp(Number(qIn.value) || 5, 1, 50); render(); });
    const mSel = selectOf(Object.keys(UNITS).map((k) => [k, UNITS[k].fr + " · " + UNITS[k].ar]), draft.m);
    mSel.addEventListener("change", () => { draft.m = mSel.value; if (draft.m !== "v" && draft.q > 10) draft.q = 1; render(); });
    const tuSel = selectOf([["v", "versets · آيات"], ["p", "pages · صفحات"]], draft.tu);
    tuSel.addEventListener("change", () => { draft.tu = tuSel.value; if (draft.tu === "p" && draft.u > 3) draft.u = 1; render(); });
    const uSel = selectOf((draft.tu === "p" ? [1, 2, 3] : [1, 2, 3, 4, 5]).map((n) => [n, String(n)]), draft.u);
    uSel.addEventListener("change", () => { draft.u = Number(uSel.value); render(); });
    const rSel = selectOf(Array.from({ length: 10 }, (_, i) => [i + 1, (i + 1) + (i ? " fois" : " fois (une seule lecture)")]), draft.r || 1);
    rSel.addEventListener("change", () => { draft.r = Number(rSel.value); render(); });

    form.appendChild(el("p", "game-ask", "1. Miqdar général (tout le groupe, par jour) · المقدار العام"));
    const r2 = el("div", "row2");
    r2.appendChild(field("Quantité", qIn));
    r2.appendChild(field("Unité", mSel));
    form.appendChild(r2);

    form.appendChild(el("p", "game-ask", "2. Miqdar de chaque personne (à chaque tour) · مقدار كل شخص"));
    const r3 = el("div", "row2");
    r3.appendChild(field("Quantité", uSel));
    r3.appendChild(field("Unité", tuSel));
    form.appendChild(r3);

    form.appendChild(el("p", "game-ask", "3. Répéter le miqdar général · تكرار المقدار العام"));
    form.appendChild(field("Nombre de fois (les parts tournent entre les personnes à chaque répétition)", rSel));

    const cSel = selectOf([[2, "2 personnes"], [3, "3 personnes"], [4, "4 personnes"]], draft.p.length);
    cSel.addEventListener("change", () => {
      const n = Number(cSel.value);
      while (draft.p.length < n) draft.p.push({ n: "", k: "v", r: (reciters[draft.p.length % reciters.length] || reciters[0]).id });
      draft.p.length = n;
      render();
    });
    form.appendChild(field("Nombre de personnes (vous comprise)", cSel));

    draft.p.forEach((p, i) => {
      const row = el("div", "prow");
      row.appendChild(el("strong", "", i === 0 ? "Vous" : "Personne " + (i + 1)));
      const nIn = document.createElement("input");
      nIn.type = "text";
      nIn.maxLength = 20;
      nIn.placeholder = i === 0 ? "Votre prénom" : p.k === "v" ? "Nom (facultatif)" : "Prénom de l'amie";
      nIn.value = p.n;
      nIn.addEventListener("input", () => { p.n = nIn.value; });
      row.appendChild(nIn);
      if (i > 0) {
        const kSel = selectOf([["v", "Compagnon audio"], ["h", "Amie réelle"]], p.k);
        kSel.addEventListener("change", () => { p.k = kSel.value; render(); });
        row.appendChild(kSel);
        if (p.k === "v") {
          const rSel = selectOf(reciters.map((r) => [r.id, r.name]), p.r);
          rSel.addEventListener("change", () => { p.r = Number(rSel.value); });
          row.appendChild(rSel);
        }
      }
      form.appendChild(row);
    });

    const pref = reciters.preferred || [];
    if (pref.length) form.appendChild(el("p", "muted center small", "Voix préférées trouvées : " + pref.map((r) => r.name).join(", ") + "."));

    // Prévenir si tout le monde n'a pas de tour chaque jour
    const turnsPerDay = Math.ceil(Math.min(draft.q, draft.t - draft.f + 1) / draft.u); // calcul exact seulement en versets
    if (draft.m === "v" && draft.tu === "v" && turnsPerDay < draft.p.length) {
      form.appendChild(el("p", "muted center small", "Attention : avec " + draft.q + " versets par jour et des tours de " + draft.u + ", seules " + turnsPerDay + " personne" + (turnsPerDay > 1 ? "s" : "") + " sur " + draft.p.length + " récitent la nouvelle portion chaque jour. Le tour change de personne chaque jour, et la révision donne plus de tours."));
    }

    if (draft.m === "v") {
      const days = Math.ceil((draft.t - draft.f + 1) / draft.q);
      form.appendChild(el("p", "muted center", (draft.t - draft.f + 1) + " versets au total, soit " + days + " jour" + (days > 1 ? "s" : "") + " de mémorisation."));
    } else {
      form.appendChild(el("p", "muted center", (draft.t - draft.f + 1) + " versets au total. Le nombre de jours est calculé à la création, d'après les limites données par l'API."));
    }
    const formMsg = el("p", "error");

    const create = el("button", "btn", "Créer mon plan");
    create.addEventListener("click", async () => {
      formMsg.textContent = "";
      let d = null, pg = null;
      if (draft.m !== "v" || draft.tu === "p") {
        create.disabled = true;
        create.textContent = "Calcul des jours…";
        try {
          if (draft.m !== "v") d = await getUnitStarts(draft.s, draft.f, draft.t, draft.m, draft.q);
          if (draft.tu === "p") pg = await getUnitStarts(draft.s, draft.f, draft.t, "p", 1);
        } catch (err) {
          console.error(err);
          formMsg.textContent = "Impossible de calculer les pages ou le miqdar (connexion ?). Réessayez, ou choisissez « versets ».";
          create.disabled = false;
          create.textContent = "Créer mon plan";
          return;
        }
      }
      const plan = {
        s: draft.s, f: draft.f, t: draft.t, q: draft.q, u: draft.u, m: draft.m, tu: draft.tu, r: draft.r || 1,
        p: draft.p.map((p, i) => ({
          n: ((p.n || "").trim() || (i === 0 ? "Moi" : p.k === "v" ? reciterName(p.r) : "Personne " + (i + 1))).slice(0, 30),
          k: i === 0 ? "h" : p.k,
          r: p.r
        }))
      };
      if (d) plan.d = d;
      if (pg) plan.pg = pg;
      raf = { plan, me: 0, done: {} };
      Store.set("rafiq", raf);
      rafDashboard(chapters);
    });
    const wrap = el("div", "actions center-actions");
    wrap.appendChild(create);
    form.appendChild(wrap);
    form.appendChild(formMsg);
    rafBox.appendChild(form);
  };
  render();
}

// ---------- Tableau de bord du plan ----------
function progressBar(pct) {
  const bar = el("div", "progress");
  const fill = el("div", "bar");
  fill.style.width = Math.round(pct) + "%";
  bar.appendChild(fill);
  return bar;
}

function rafDashboard(chapters) {
  stopAudio();
  const plan = raf.plan;
  const ch = chapters[plan.s];
  const N = totalDays(plan);
  const finished = doneCount(plan);
  const pct = (finished / N) * 100;
  const upcoming = nextDay(plan);

  rafTitle();
  const card = el("article", "verse");
  card.appendChild(el("div", "verse-ref", "Sourate " + ch.latin + " (" + ch.arabic + ")"));
  card.appendChild(el("p", "", "Versets " + plan.f + " à " + plan.t + " · " + miqdarText(plan) + " · " + turnText(plan) + (plan.r > 1 ? " · répété " + plan.r + " fois" : "")));
  card.appendChild(progressBar(pct));
  card.appendChild(el("p", "muted", finished + " jour" + (finished > 1 ? "s" : "") + " sur " + N + " terminé" + (finished > 1 ? "s" : "") + " (" + Math.round(pct) + " %)"));

  const chips = el("div", "chips");
  plan.p.forEach((x, i) => {
    const icon = i === raf.me ? "🧑" : x.k === "v" ? "🎧" : "👥";
    chips.appendChild(el("span", "chip", icon + " " + x.n + (i === raf.me ? " (vous)" : "")));
  });
  card.appendChild(chips);
  rafBox.appendChild(card);

  if (upcoming) {
    const daySel = selectOf(Array.from({ length: N }, (_, i) => [i + 1, "Jour " + (i + 1) + (raf.done[i + 1] ? " ✓" : "")]), upcoming);
    const go = el("button", "btn", "Commencer la séance");
    go.addEventListener("click", () => rafStart(Number(daySel.value)));
    const row = el("div", "actions center-actions");
    row.appendChild(daySel);
    row.appendChild(go);
    rafBox.appendChild(el("p", "game-ask", "Prochaine séance : jour " + upcoming + " sur " + N));
    rafBox.appendChild(row);
  } else {
    const done = el("div", "feedback ok");
    done.appendChild(el("strong", "", "Mabrouk ! Vous avez terminé la sourate " + ch.latin + " 🎉"));
    done.appendChild(el("p", "", "Qu'Allah accepte votre effort. Vous pouvez créer un nouveau plan."));
    rafBox.appendChild(done);
  }

  const tools = el("div", "actions center-actions");
  const shareBtn = el("button", "btn ghost", "Inviter une amie (lien)");
  shareBtn.addEventListener("click", () => {
    const link = location.href.split("#")[0] + "#rafiq=" + encodePlan(plan);
    shareText("Rejoins mon plan de révision Tathbît – sourate " + ch.latin + ", " + miqdarText(plan) + " : " + link, shareBtn, "Inviter une amie (lien)");
  });
  const progBtn = el("button", "btn ghost", "Envoyer mon avancée");
  progBtn.addEventListener("click", () => {
    shareText("Tathbît – Sourate " + ch.latin + " : " + finished + "/" + N + " jours terminés (" + Math.round(pct) + " %) ✅", progBtn, "Envoyer mon avancée");
  });
  const reset = el("button", "btn ghost", "Nouveau plan");
  reset.addEventListener("click", () => {
    if (confirm("Créer un nouveau plan ? Votre plan actuel et sa progression seront supprimés.")) {
      Store.set("rafiq", null);
      raf = null;
      rafForm(chapters);
    }
  });
  tools.appendChild(shareBtn);
  tools.appendChild(progBtn);
  tools.appendChild(reset);
  rafBox.appendChild(tools);
  rafBox.appendChild(el("p", "muted center small", "Avec une amie réelle, chacune suit le même programme sur son téléphone et passe au tour suivant quand le tour est terminé."));
}

// ---------- Séance ----------
function rafStart(day) {
  sess = { day, stages: stagesFor(raf.plan, day), si: 0, ti: 0 };
  rafRenderTurn();
}

function rafQuit() {
  stopAudio();
  sess = null;
  rafOpen();
}

function rafNext() {
  const st = sess.stages[sess.si];
  if (sess.ti < st.turns.length - 1) sess.ti++;
  else if (sess.si < sess.stages.length - 1) { sess.si++; sess.ti = 0; }
  else { rafFinishDay(); return; }
  rafRenderTurn();
}

function rafFinishDay() {
  stopAudio();
  const day = sess.day;
  raf.done[day] = true;
  Store.set("rafiq", raf);
  markToday();
  sess = null;
  rafOpenFinished(day);
}

async function rafOpenFinished(day) {
  const chapters = await getChapters();
  const plan = raf.plan;
  const N = totalDays(plan);
  const finished = doneCount(plan);
  rafTitle();
  rafBox.appendChild(el("h2", "game-title", "Séance du jour " + day + " terminée ✅"));
  rafBox.appendChild(progressBar((finished / N) * 100));
  rafBox.appendChild(el("p", "muted center", finished + " jour" + (finished > 1 ? "s" : "") + " sur " + N + " terminé" + (finished > 1 ? "s" : "")));
  if (finished === N) {
    rafBox.appendChild(el("p", "final-score", "Khatm 🎉"));
    rafBox.appendChild(el("p", "center", "Mabrouk ! Vous avez terminé la sourate " + chapters[plan.s].latin + ". Qu'Allah accepte votre effort."));
  } else {
    rafBox.appendChild(el("p", "center", "À demain pour le jour " + nextDay(plan) + ", in cha Allah."));
  }
  const back = el("button", "btn", "Retour au programme");
  back.addEventListener("click", () => rafDashboard(chapters));
  const share = el("button", "btn ghost", "Envoyer mon avancée");
  share.addEventListener("click", () => {
    shareText("Tathbît – Sourate " + chapters[plan.s].latin + " : " + finished + "/" + N + " jours terminés (" + Math.round((finished / N) * 100) + " %) ✅", share, "Envoyer mon avancée");
  });
  const row = el("div", "actions center-actions");
  row.appendChild(back);
  row.appendChild(share);
  rafBox.appendChild(row);
}

// Joue un groupe de versets avec un récitateur ; le bouton sert aussi d'arrêt
function playChunk(btn, keys, rid, idle) {
  const reset = () => { delete btn.dataset.on; btn.textContent = idle; };
  btn.addEventListener("click", () => {
    if (btn.dataset.on) { stopAudio(); reset(); return; }
    stopAudio();
    btn.dataset.on = "1";
    btn.textContent = "⏳ Chargement…";
    Promise.all(keys.map((k) => getAudioUrl(k, rid)))
      .then((urls) => {
        if (!btn.dataset.on) return;
        if (urls.some((u) => !u)) throw new Error("audio manquant");
        btn.textContent = "⏹ Arrêter";
        playSequence(urls, reset);
      })
      .catch((e) => { console.error(e); reset(); btn.textContent = "Audio indisponible"; });
  });
}

function turnVerse(v, num, hidden) {
  const card = el("article", "verse");
  card.appendChild(el("div", "verse-ref", "Verset " + num));
  const ar = el("p", "arabic");
  ar.lang = "ar";
  ar.dir = "rtl";
  const words = wordsOf(v);
  words.forEach((w, i) => {
    const s = el("span", "w", w);
    if (hidden) {
      s.classList.add("hw");
      s.title = "Cliquez pour révéler";
      s.addEventListener("click", () => s.classList.remove("hw"));
    }
    ar.appendChild(s);
    if (i < words.length - 1) ar.appendChild(document.createTextNode(" "));
  });
  card.appendChild(ar);
  const fr = el("p", "french", v.french);
  if (hidden) fr.classList.add("hidden");
  card.appendChild(fr);
  return card;
}

async function rafRenderTurn() {
  stopAudio();
  const plan = raf.plan;
  const st = sess.stages[sess.si];
  const turn = st.turns[sess.ti];
  rafTitle();
  rafBox.appendChild(el("p", "muted center", "Chargement du tour…"));
  try {
    const chapters = await getChapters();
    const keys = [];
    for (let v = turn.from; v <= turn.to; v++) keys.push(plan.s + ":" + v);
    const verses = await Promise.all(keys.map(getVerse));

    const who = plan.p[turn.person];
    const mine = turn.person === raf.me;
    const totalTurns = sess.stages.reduce((n, s) => n + s.turns.length, 0);
    const before = sess.stages.slice(0, sess.si).reduce((n, s) => n + s.turns.length, 0) + sess.ti;

    rafTitle();
    const head = el("div", "game-head");
    head.appendChild(el("span", "", "Jour " + sess.day + " · " + st.title + " (étape " + (sess.si + 1) + "/" + sess.stages.length + ")"));
    head.appendChild(el("span", "score", "Tour " + (sess.ti + 1) + "/" + st.turns.length));
    rafBox.appendChild(head);
    rafBox.appendChild(progressBar((before / totalTurns) * 100));

    let message;
    if (mine) message = "🧑 C'est votre tour : récitez de mémoire";
    else if (who.k === "v") message = "🎧 " + who.n + " récite : écoutez";
    else message = "👥 Tour de " + who.n + " : écoutez sa récitation";
    rafBox.appendChild(el("div", "turn-banner" + (mine ? " mine" : ""), message));

    const block = el("div", "");
    verses.forEach((v, i) => block.appendChild(turnVerse(v, turn.from + i, mine)));
    rafBox.appendChild(block);

    const actions = el("div", "actions center-actions");

    if (mine) {
      let shown = false;
      const reveal = el("button", "btn ghost", "👁 Révéler");
      reveal.addEventListener("click", () => {
        shown = !shown;
        block.querySelectorAll(".w").forEach((s) => s.classList.toggle("hw", !shown));
        block.querySelectorAll(".french").forEach((f) => f.classList.toggle("hidden", !shown));
        reveal.textContent = shown ? "🙈 Cacher de nouveau" : "👁 Révéler";
      });
      actions.appendChild(reveal);

      // Enregistrement facultatif de sa propre récitation
      const rec = el("button", "btn ghost", "🎙 Me réciter");
      const mineBtn = el("button", "btn ghost hidden", "▶ Ma récitation");
      let recSession = null;
      let myUrl = null;
      const status = el("p", "muted center small");
      rec.addEventListener("click", async () => {
        if (recSession) {
          const s = recSession;
          recSession = null;
          rec.classList.remove("recording");
          rec.textContent = "🎙 Refaire";
          const blob = await s.stop();
          if (myUrl) URL.revokeObjectURL(myUrl);
          myUrl = URL.createObjectURL(blob);
          mineBtn.classList.remove("hidden");
          status.textContent = "Enregistrement terminé.";
          return;
        }
        stopAudio();
        try {
          recSession = await startRecording();
          rec.classList.add("recording");
          rec.textContent = "⏹ Arrêter";
          status.textContent = "Enregistrement… récitez, puis cliquez sur Arrêter.";
        } catch (e) {
          status.textContent = e.message === "unsupported" ? "Votre navigateur ne permet pas l'enregistrement." : "Micro non autorisé.";
        }
      });
      mineBtn.addEventListener("click", () => myUrl && playSequence([myUrl]));
      actions.appendChild(rec);
      actions.appendChild(mineBtn);

      const help = el("button", "btn ghost", "🔊 Écouter pour m'aider");
      playChunk(help, keys, RECITER_ID, "🔊 Écouter pour m'aider");
      actions.appendChild(help);
      rafBox.appendChild(actions);
      rafBox.appendChild(status);
    } else if (who.k === "v") {
      const play = el("button", "btn", "▶ Écouter " + who.n);
      playChunk(play, keys, who.r, "▶ Écouter " + who.n);
      actions.appendChild(play);
      rafBox.appendChild(actions);
    }

    const lastTurn = sess.si === sess.stages.length - 1 && sess.ti === st.turns.length - 1;
    const next = el("button", "btn", lastTurn ? "Terminer la séance ✅" : "Tour suivant →");
    next.addEventListener("click", rafNext);
    const quit = el("button", "btn ghost", "Quitter la séance");
    quit.addEventListener("click", rafQuit);
    const nav = el("div", "actions center-actions nav-row");
    nav.appendChild(next);
    nav.appendChild(quit);
    rafBox.appendChild(nav);
  } catch (err) {
    console.error(err);
    rafTitle();
    rafError("Impossible de charger ce tour. Vérifiez votre connexion.", rafRenderTurn);
  }
}

// Au clic sur l'onglet : tableau de bord, sauf si une séance est en cours
document.querySelector('.tab[data-view="rafiq"]').addEventListener("click", () => {
  if (!sess) rafOpen();
});

// Ouverture d'un lien d'invitation (…#rafiq=…)
rafImportHash();