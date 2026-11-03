// ====== Hifdh : Test de récitation (bêta) ======
// Le navigateur écoute la récitation et la transforme en texte (reconnaissance vocale).
// On compare ce texte avec le vrai texte de l'API (jamais écrit à la main) et on
// montre les mots oubliés ou différents. Résultat INDICATIF : la reconnaissance de
// l'arabe du Coran n'est pas parfaite, et le tajwid n'est PAS jugé.
// Utilise hfShell/hfContent/wordsOf (hifdh.js), getVerse/getChapters/toggleAudio/stopAudio (app.js),
// el() (game.js), tjLoadSurah/tjArabic/tjLegend (tajwid.js).

const RC_SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const RC_MAX = 20; // nombre maximum de versets par test
const rc = { surah: 112, from: 1, to: 4, hide: true, verses: [], rec: null, active: false, base: "", heard: "", fatal: null };

// ---------- Comparaison de textes arabes ----------
// On enlève voyelles et signes, et on unifie les lettres qui se ressemblent.
function rcNorm(s) {
  return (s || "")
    .normalize("NFC")
    .replace(/[ـً-ٰٟۖ-ۭ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Ressemblance entre deux mots : 1 = identiques, 0 = rien en commun
function rcSim(a, b) {
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

// Aligne les mots attendus avec les mots entendus.
// Retourne pour chaque mot attendu : "ok", "wrong" (avec le mot entendu) ou "miss",
// et la liste des mots entendus en trop.
function rcAlign(expected, heard, okSim) {
  const E = expected.length, H = heard.length;
  const OKSIM = okSim || 0.7; // en dessous de ce score, deux mots sont considérés comme différents
  const cost = Array.from({ length: E + 1 }, () => new Float64Array(H + 1));
  // Coût d'un échange : 0 si le mot est reconnu, sinon entre 0,7 et 1 (le plus ressemblant est préféré)
  const subCost = (i, j) => { const s = rcSim(expected[i - 1], heard[j - 1]); return s >= OKSIM ? 0 : 1 - 0.3 * s; };
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  for (let i = 1; i <= E; i++) cost[i][0] = i;
  for (let j = 1; j <= H; j++) cost[0][j] = j;
  for (let i = 1; i <= E; i++) {
    for (let j = 1; j <= H; j++) {
      cost[i][j] = Math.min(cost[i - 1][j - 1] + subCost(i, j), cost[i - 1][j] + 1, cost[i][j - 1] + 1);
    }
  }
  const res = expected.map(() => ({ st: "miss", said: "" }));
  const extra = [];
  let i = E, j = H;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const good = rcSim(expected[i - 1], heard[j - 1]) >= OKSIM;
      if (near(cost[i][j], cost[i - 1][j - 1] + subCost(i, j))) {
        res[i - 1] = good ? { st: "ok", said: "" } : { st: "wrong", said: heard[j - 1] };
        i--; j--;
        continue;
      }
    }
    if (i > 0 && near(cost[i][j], cost[i - 1][j] + 1)) { i--; continue; } // mot oublié
    extra.unshift(heard[j - 1]); // mot entendu en trop
    j--;
  }
  return { res, extra };
}

// ---------- Écran de départ ----------
function reciteStart() {
  hfShell("recite");
  rcStop(true);
  const box = hfContent;

  box.appendChild(el("p", "muted center",
    "Version bêta : le navigateur écoute ta récitation et la compare au texte du Coran. " +
    "Le résultat est indicatif : l'arabe du Coran est difficile à reconnaître, il peut se tromper. " +
    "Le tajwid n'est pas jugé."));

  if (!RC_SR) {
    box.appendChild(el("p", "error",
      "Ce navigateur ne sait pas écouter la voix. Ouvre Sakîna avec Google Chrome (téléphone Android ou ordinateur) pour utiliser ce mode."));
    return;
  }

  box.appendChild(el("p", "muted center", "Choisis le passage à réciter (20 versets au maximum)."));
  const form = el("div", "pick");
  const sSel = document.createElement("select");
  sSel.setAttribute("aria-label", "Sourate");
  const fSel = document.createElement("select");
  fSel.setAttribute("aria-label", "Du verset");
  const tSel = document.createElement("select");
  tSel.setAttribute("aria-label", "Au verset");
  form.appendChild(sSel);
  form.appendChild(fSel);
  form.appendChild(tSel);
  box.appendChild(form);

  const hideLabel = el("label", "rc-hide");
  const hideBox = document.createElement("input");
  hideBox.type = "checkbox";
  hideBox.checked = rc.hide;
  hideBox.addEventListener("change", () => (rc.hide = hideBox.checked));
  hideLabel.appendChild(hideBox);
  hideLabel.appendChild(document.createTextNode(" Cacher le texte pendant que je récite (de mémoire)"));
  box.appendChild(hideLabel);

  const go = el("button", "btn", "🎙 Commencer");
  const row = el("div", "center");
  row.appendChild(go);
  box.appendChild(row);
  const msg = el("p", "error");
  box.appendChild(msg);

  getChapters().then((chapters) => {
    for (let i = 1; i <= 114; i++) {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = i + ". " + chapters[i].latin + " (" + chapters[i].arabic + ")";
      sSel.appendChild(o);
    }
    sSel.value = rc.surah;
    function fillVerses() {
      const count = chapters[rc.surah].verses;
      fSel.innerHTML = "";
      for (let i = 1; i <= count; i++) {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = "Du verset " + i;
        fSel.appendChild(o);
      }
      rc.from = Math.min(Math.max(1, rc.from), count);
      fSel.value = rc.from;
      fillTo();
    }
    function fillTo() {
      const count = chapters[rc.surah].verses;
      const max = Math.min(count, rc.from + RC_MAX - 1);
      tSel.innerHTML = "";
      for (let i = rc.from; i <= max; i++) {
        const o = document.createElement("option");
        o.value = i;
        o.textContent = "au verset " + i;
        tSel.appendChild(o);
      }
      rc.to = Math.min(Math.max(rc.to, rc.from), max);
      tSel.value = rc.to;
    }
    sSel.addEventListener("change", () => { rc.surah = Number(sSel.value); rc.from = 1; rc.to = 1; fillVerses(); });
    fSel.addEventListener("change", () => { rc.from = Number(fSel.value); rc.to = rc.from; fillTo(); });
    tSel.addEventListener("change", () => (rc.to = Number(tSel.value)));
    fillVerses();
  }).catch((err) => {
    console.error(err);
    msg.textContent = "Impossible de charger la liste des sourates. Vérifie ta connexion.";
  });

  go.addEventListener("click", async () => {
    if (!sSel.value || !tSel.value) return;
    go.disabled = true;
    msg.textContent = "";
    try {
      const keys = [];
      for (let a = rc.from; a <= rc.to; a++) keys.push(rc.surah + ":" + a);
      rc.verses = await Promise.all(keys.map(getVerse));
      reciteListen();
    } catch (err) {
      console.error(err);
      msg.textContent = "Impossible de charger le passage. Vérifie ta connexion.";
      go.disabled = false;
    }
  });
}

// ---------- Écoute ----------
function rcStop(silent) {
  rc.active = false;
  if (rc.rec) {
    try { rc.rec.onend = null; rc.rec.onresult = null; rc.rec.onerror = null; rc.rec.abort(); } catch (e) { /* ignoré */ }
    rc.rec = null;
  }
  if (silent) { rc.base = ""; rc.heard = ""; }
}

function reciteListen() {
  stopAudio();
  rcStop(true);
  rc.fatal = null;
  const box = hfContent;
  box.innerHTML = "";
  const first = rc.verses[0].key, last = rc.verses[rc.verses.length - 1].key;
  box.appendChild(el("h2", "game-title", "Récite " + (first === last ? first : first + " → " + last)));

  if (rc.hide) {
    box.appendChild(el("p", "muted center", "Le texte est caché. Récite de mémoire, puis appuie sur « Terminer »."));
  } else {
    const all = el("div", "verse");
    rc.verses.forEach((v) => {
      const p = el("p", "arabic", v.arabic);
      p.lang = "ar";
      p.dir = "rtl";
      all.appendChild(p);
    });
    box.appendChild(all);
  }

  const status = el("p", "center rc-status", "🎙 Micro en attente… autorise le micro si le navigateur le demande.");
  box.appendChild(status);
  const live = el("p", "arabic rc-live");
  live.lang = "ar";
  live.dir = "rtl";
  box.appendChild(live);

  const finish = el("button", "btn", "✅ Terminer");
  const cancel = el("button", "btn ghost", "Annuler");
  const row = el("div", "actions center-actions");
  row.appendChild(finish);
  row.appendChild(cancel);
  box.appendChild(row);

  const rec = new RC_SR();
  rec.lang = "ar-SA";
  rec.continuous = true;
  rec.interimResults = true;
  rc.rec = rec;
  rc.active = true;
  rc.base = "";
  rc.heard = "";

  rec.onstart = () => { status.textContent = "🔴 Je t'écoute… récite."; };
  rec.onresult = (event) => {
    let t = "";
    for (let i = 0; i < event.results.length; i++) t += event.results[i][0].transcript + " ";
    rc.heard = (rc.base + " " + t).trim();
    live.textContent = rc.heard.split(/\s+/).slice(-12).join(" "); // les derniers mots entendus
  };
  rec.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      rc.fatal = "Le micro est refusé. Autorise le micro pour ce site dans le navigateur, puis recommence.";
    } else if (event.error === "network") {
      rc.fatal = "La reconnaissance vocale a besoin d'internet. Vérifie ta connexion.";
    } else if (event.error === "audio-capture") {
      rc.fatal = "Aucun micro trouvé sur cet appareil.";
    }
    if (rc.fatal) { rc.active = false; showFatal(); }
  };
  rec.onend = () => {
    // Le navigateur coupe parfois tout seul : on relance tant que ce n'est pas terminé
    if (!rc.active) return;
    rc.base = rc.heard;
    try { rec.start(); } catch (e) { /* déjà relancé */ }
  };

  function showFatal() {
    status.textContent = "";
    status.className = "error";
    status.textContent = rc.fatal;
    rcStop(false);
    finish.disabled = true;
  }

  finish.addEventListener("click", () => {
    const heard = rc.heard;
    rcStop(false);
    reciteResult(heard);
  });
  cancel.addEventListener("click", () => { rcStop(true); reciteStart(); });

  try {
    rec.start();
  } catch (err) {
    console.error(err);
    rc.fatal = "Impossible de démarrer l'écoute sur ce navigateur.";
    showFatal();
  }
}

// ---------- Résultat ----------
function reciteResult(heardText) {
  stopAudio();
  const box = hfContent;
  box.innerHTML = "";
  box.appendChild(el("h2", "game-title", "Résultat"));

  const heard = rcNorm(heardText).split(" ").filter(Boolean);
  if (!heard.length) {
    box.appendChild(el("p", "error", "Je n'ai rien entendu. Vérifie le micro, parle près du téléphone et réessaie."));
    const again = el("button", "btn", "Réessayer");
    again.addEventListener("click", reciteListen);
    const row = el("div", "center");
    row.appendChild(again);
    box.appendChild(row);
    return;
  }

  // Mots attendus (ceux sans lettres, comme un simple signe, sont ignorés)
  const items = [];
  rc.verses.forEach((v, vi) => {
    wordsOf(v).forEach((w) => {
      const norm = rcNorm(w);
      if (norm) items.push({ vi, text: w, norm });
    });
  });
  const { res, extra } = rcAlign(items.map((x) => x.norm), heard);
  items.forEach((x, i) => { x.st = res[i].st; x.said = res[i].said; });

  const total = items.length;
  const ok = items.filter((x) => x.st === "ok").length;
  const pct = total ? Math.round((ok / total) * 100) : 0;
  box.appendChild(el("p", "final-score", pct + " %"));
  box.appendChild(el("p", "muted center", ok + " mots sur " + total + " reconnus. Résultat indicatif (bêta)."));

  const legend = el("div", "tj-legend");
  [["rc-ok", "reconnu"], ["rc-wrong", "différent"], ["rc-miss", "non entendu"]].forEach(([c, l]) => {
    const chip = el("span", "chip");
    chip.appendChild(el("span", c, "● "));
    chip.appendChild(document.createTextNode(l));
    legend.appendChild(chip);
  });
  box.appendChild(legend);

  rc.verses.forEach((v, vi) => {
    const card = el("article", "verse");
    card.appendChild(el("p", "muted", "Verset " + v.key));
    const p = el("p", "arabic");
    p.lang = "ar";
    p.dir = "rtl";
    const mine = items.filter((x) => x.vi === vi);
    mine.forEach((x, i) => {
      const s = el("span", "rc-" + x.st, x.text);
      if (x.st === "wrong") s.title = "entendu : " + x.said;
      p.appendChild(s);
      if (i < mine.length - 1) p.appendChild(document.createTextNode(" "));
    });
    card.appendChild(p);

    const toReview = mine.filter((x) => x.st !== "ok");
    if (toReview.length) {
      card.appendChild(el("p", "muted", "À revoir : " + toReview.length + " mot" + (toReview.length > 1 ? "s" : "") + ". Écoute le verset, puis réessaie."));
    } else if (mine.length) {
      card.appendChild(el("p", "muted", "Tous les mots ont été reconnus."));
    }

    const actions = el("div", "actions");
    const play = el("button", "btn ghost", "🔊 Écouter");
    play.addEventListener("click", () => toggleAudio(play, v.audio));
    actions.appendChild(play);
    const tj = el("button", "btn ghost", "🎨 Voir le tajwid");
    actions.appendChild(tj);
    card.appendChild(actions);
    const tjBoxEl = el("div", "rc-tj");
    card.appendChild(tjBoxEl);
    tj.addEventListener("click", () => rcShowTajwid(v, tj, tjBoxEl));
    box.appendChild(card);
  });

  if (extra.length) {
    box.appendChild(el("p", "muted center", "Mots entendus en plus ou mal compris : " + extra.slice(0, 30).join(" ") + (extra.length > 30 ? " …" : "")));
  }
  box.appendChild(el("p", "muted center",
    "Ce test ne remplace pas un professeur : l'application ne juge pas ton tajwid. Pour vérifier ta prononciation, récite devant un professeur."));

  const again = el("button", "btn", "Recommencer");
  again.addEventListener("click", reciteListen);
  const change = el("button", "btn ghost", "Changer de passage");
  change.addEventListener("click", reciteStart);
  const row = el("div", "actions center-actions");
  row.appendChild(again);
  row.appendChild(change);
  box.appendChild(row);
}

// Affiche le verset avec les couleurs du tajwid (pour que la personne vérifie elle-même)
async function rcShowTajwid(v, btn, target) {
  if (target.childNodes.length) { target.innerHTML = ""; btn.textContent = "🎨 Voir le tajwid"; return; }
  btn.disabled = true;
  btn.textContent = "Chargement…";
  try {
    const list = await tjLoadSurah(Number(v.key.split(":")[0]));
    const t = list.find((x) => x.key === v.key);
    if (!t) throw new Error("verset introuvable");
    const classes = t.classes;
    target.appendChild(tjArabic(t.segs, { mode: "lesson", show: classes }));
    if (classes.length) target.appendChild(tjLegend(classes));
    else target.appendChild(el("p", "muted", "Pas de règle colorée dans ce verset."));
    target.appendChild(el("p", "muted", "Compare avec ta récitation, et demande à un professeur de vérifier."));
    btn.textContent = "Cacher le tajwid";
  } catch (err) {
    console.error(err);
    target.appendChild(el("p", "error", "Impossible de charger le tajwid. Vérifie ta connexion."));
    btn.textContent = "🎨 Voir le tajwid";
  }
  btn.disabled = false;
}

// On coupe le micro quand on quitte l'onglet Hifdh
document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => { if (t.dataset.view !== "hifdh") rcStop(false); });
});
