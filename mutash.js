// ====== Mutashabihât (المتشابهات) : versets qui se ressemblent ======
// Seules les références sont écrites ici. Le texte, la traduction et l'audio viennent de l'API,
// et les mots qui diffèrent sont trouvés automatiquement en comparant les deux textes.
// Les paires ont été choisies de mémoire : à faire vérifier par un professeur.
// Utilise getChapters(), getVerse(), toggleAudio(), stopAudio() (app.js), el(), shuffle(), randInt() (game.js),
// wordsOf() (hifdh.js), rcNorm(), rcAlign() (recite.js).

const MT_PAIRS = [
  ["2:49", "7:141"],
  ["2:35", "7:19"],
  ["2:58", "7:161"],
  ["2:62", "5:69"],
  ["2:126", "14:35"],
  ["6:151", "17:31"],
  ["3:126", "8:10"],
  ["2:136", "3:84"],
  ["2:48", "2:123"]
];

const mtBox = document.querySelector("#mutash");
let mtQuiz = null; // { list, i, score }

function mtShell(extra) {
  stopAudio();
  mtBox.innerHTML = "";
  mtBox.appendChild(el("h1", "game-title", "Mutashabihât · المتشابهات"));
  mtBox.appendChild(el("p", "ar-sub", "آيات متشابهة: فرّق بينها لتحفظها بسهولة"));
  if (extra !== false) {
    mtBox.appendChild(el("p", "muted center", "Des versets presque identiques : les confondre est l'erreur la plus fréquente quand on mémorise. Ici, les mots qui changent sont surlignés."));
  }
}

// Statut de chaque mot d'un verset par rapport à l'autre : true = identique
function mtSame(a, b) {
  const na = wordsOf(a).map(rcNorm), nb = wordsOf(b).map(rcNorm);
  const idx = [];
  na.forEach((w, i) => { if (w) idx.push(i); });
  const { res } = rcAlign(idx.map((i) => na[i]), nb.filter(Boolean), 1); // 1 = mots exactement identiques
  const same = na.map(() => true);
  idx.forEach((wi, k) => { same[wi] = res[k].st === "ok"; });
  return same;
}

function mtVerseBlock(chapters, v, other) {
  const [s, a] = v.key.split(":").map(Number);
  const box = el("article", "verse");
  box.appendChild(el("div", "verse-ref", "Sourate " + chapters[s].latin + " (" + chapters[s].arabic + ") · verset " + a));
  const p = el("p", "arabic");
  p.lang = "ar";
  p.dir = "rtl";
  const words = wordsOf(v);
  const same = mtSame(v, other);
  words.forEach((w, i) => {
    p.appendChild(el("span", same[i] ? "" : "mt-diff", w));
    if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
  });
  box.appendChild(p);
  box.appendChild(el("p", "french", v.french));
  const play = el("button", "btn ghost", "🔊 Écouter");
  if (!v.audio) play.disabled = true;
  play.addEventListener("click", () => toggleAudio(play, v.audio));
  const ac = el("div", "actions");
  ac.appendChild(play);
  box.appendChild(ac);
  return box;
}

async function mtHome() {
  mtQuiz = null;
  mtShell();
  const msg = el("p", "muted center", "Chargement…");
  mtBox.appendChild(msg);
  let chapters;
  try {
    chapters = await getChapters();
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger les sourates. Vérifiez votre connexion.";
    return;
  }
  msg.remove();
  const quiz = el("button", "btn", "🎯 Quiz : de quelle sourate vient ce verset ?");
  quiz.addEventListener("click", mtQuizStart);
  const qrow = el("div", "center");
  qrow.appendChild(quiz);
  mtBox.appendChild(qrow);
  mtBox.appendChild(el("h2", "space-title", "Les paires"));
  const list = el("div", "mt-list");
  MT_PAIRS.forEach((pair) => {
    const [a, b] = pair;
    const sa = Number(a.split(":")[0]), sb = Number(b.split(":")[0]);
    const btn = el("button", "mt-pair");
    btn.appendChild(el("span", "", chapters[sa].latin + " " + a.split(":")[1] + "  ↔  " + chapters[sb].latin + " " + b.split(":")[1]));
    btn.appendChild(el("span", "choice-ar", chapters[sa].arabic + " ↔ " + chapters[sb].arabic));
    btn.addEventListener("click", () => mtOpen(chapters, pair));
    list.appendChild(btn);
  });
  mtBox.appendChild(list);
  mtBox.appendChild(el("p", "muted center small", "Ces paires classiques ont été choisies à la main (références seulement). Faites-les vérifier par un professeur."));

  // Recherche de TOUS les versets semblables, sourate par sourate
  mtBox.appendChild(el("h2", "space-title", "Tous les mutashabihât · كل المتشابهات"));
  mtBox.appendChild(el("p", "muted center", "Choisissez une sourate : l'application cherche dans tout le Coran les versets qui ressemblent à ses versets, et vous montre de quelle sourate ils viennent."));
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", "Sourate");
  for (let i = 1; i <= 114; i++) {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = i + ". " + chapters[i].latin + " (" + chapters[i].arabic + ")";
    sel.appendChild(o);
  }
  sel.value = mtSurah;
  const go = el("button", "btn", "🔎 Chercher");
  go.addEventListener("click", () => { mtSurah = Number(sel.value); mtList(chapters, mtSurah); });
  const row = el("div", "pick");
  row.appendChild(sel);
  row.appendChild(go);
  mtBox.appendChild(row);
  mtBox.appendChild(el("p", "muted center small", "Recherche automatique faite sur le texte de l'API : elle trouve les versets très proches, mais ce n'est pas la liste officielle des savants. Pour réviser, vérifiez avec un professeur."));
}

// ---------- Recherche automatique des versets semblables ----------
let mtSurah = 2;
let mtIndex = null; // { sim: { "2:49": [{ k: "7:141", s: 0.9 }] }, bySurah: { 2: ["2:49", ...] } }
const MT_STORE = "quranwords1";

async function mtFetchSurahText(n) {
  let verses = null;
  try {
    const res = await fetch(`${API}/quran/verses/uthmani?chapter_number=${n}`);
    if (res.ok) verses = (await res.json()).verses;
  } catch (e) { /* on essaie l'autre adresse */ }
  if (!verses || !verses.length || !verses[0].text_uthmani) {
    verses = [];
    let page = 1;
    while (page && page < 20) {
      const res = await fetch(`${API}/verses/by_chapter/${n}?words=false&fields=text_uthmani&per_page=50&page=${page}`);
      if (!res.ok) throw new Error("texte indisponible");
      const d = await res.json();
      verses.push(...(d.verses || []));
      page = d.pagination && d.pagination.next_page ? d.pagination.next_page : null;
    }
  }
  return verses.filter((v) => v.verse_key && v.text_uthmani).map((v) => [v.verse_key, rcNorm(v.text_uthmani)]);
}

// Charge tout le texte du Coran (une seule fois : il est gardé sur l'appareil) et cherche les versets proches
async function mtLoadIndex(progress) {
  if (mtIndex) return mtIndex;
  let words = Store.get(MT_STORE, null);
  if (!words || Object.keys(words).length < 6000) {
    words = {};
    let done = 0;
    const queue = Array.from({ length: 114 }, (_, i) => i + 1);
    const worker = async () => {
      while (queue.length) {
        const n = queue.shift();
        (await mtFetchSurahText(n)).forEach(([k, t]) => { words[k] = t; });
        done++;
        if (progress) progress(done, 114);
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    Store.set(MT_STORE, words);
  }
  mtIndex = mtBuild(words);
  return mtIndex;
}

function mtBuild(words) {
  const keys = Object.keys(words).filter((k) => words[k]);
  const toks = keys.map((k) => words[k].split(" ").filter(Boolean));
  const sh = toks.map((t) => {
    const set = new Set();
    if (t.length >= 3) for (let i = 0; i + 3 <= t.length; i++) set.add(t[i] + " " + t[i + 1] + " " + t[i + 2]);
    else if (t.length) set.add(t.join(" "));
    return set;
  });
  const inv = new Map();
  sh.forEach((set, i) => set.forEach((g) => { let a = inv.get(g); if (!a) { a = []; inv.set(g, a); } a.push(i); }));
  const sim = {};
  const add = (a, b, score) => { (sim[keys[a]] = sim[keys[a]] || []).push({ k: keys[b], s: score }); };
  keys.forEach((_, i) => {
    if (toks[i].length < 3) return;
    const counts = new Map();
    sh[i].forEach((g) => {
      const list = inv.get(g);
      if (list.length > 200) return; // groupes de mots trop courants
      list.forEach((j) => { if (j > i) counts.set(j, (counts.get(j) || 0) + 1); });
    });
    counts.forEach((shared, j) => {
      if (toks[j].length < 3) return;
      const score = shared / Math.max(sh[i].size, sh[j].size);
      const tiny = Math.min(toks[i].length, toks[j].length) <= 4;
      if (tiny ? score < 1 : score < 0.45 || shared < 2) return;
      add(i, j, score);
      add(j, i, score);
    });
  });
  const bySurah = {};
  Object.keys(sim).forEach((k) => {
    sim[k].sort((a, b) => b.s - a.s);
    sim[k] = sim[k].slice(0, 15);
    (bySurah[k.split(":")[0]] = bySurah[k.split(":")[0]] || []).push(k);
  });
  Object.values(bySurah).forEach((l) => l.sort((a, b) => Number(a.split(":")[1]) - Number(b.split(":")[1])));
  return { sim, bySurah };
}

async function mtList(chapters, s) {
  mtShell(false);
  const back = el("button", "link-btn", "← Retour");
  back.addEventListener("click", mtHome);
  mtBox.appendChild(back);
  const msg = el("p", "muted center", "Chargement du Coran (une seule fois, ensuite c'est rapide)…");
  mtBox.appendChild(msg);
  let index;
  try {
    index = await mtLoadIndex((d, t) => { msg.textContent = "Chargement du Coran… " + d + " / " + t; });
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger le texte du Coran. Vérifiez votre connexion.";
    const retry = el("button", "btn", "Réessayer");
    retry.addEventListener("click", () => mtList(chapters, s));
    const w = el("div", "center");
    w.appendChild(retry);
    mtBox.appendChild(w);
    return;
  }
  msg.remove();
  const keys = index.bySurah[s] || [];
  mtBox.appendChild(el("h2", "space-title", "Sourate " + chapters[s].latin + " (" + chapters[s].arabic + ")"));
  if (!keys.length) {
    mtBox.appendChild(el("p", "muted center", "Aucun verset très semblable à un autre n'a été trouvé dans cette sourate."));
    return;
  }
  mtBox.appendChild(el("p", "muted center", keys.length + " verset" + (keys.length > 1 ? "s" : "") + " ressemble" + (keys.length > 1 ? "nt" : "") + " à d'autres versets du Coran. Touchez un verset pour voir lesquels."));
  const list = el("div", "mt-list");
  keys.forEach((k) => {
    const others = index.sim[k];
    const names = [...new Set(others.map((o) => Number(o.k.split(":")[0])))].map((n) => chapters[n].latin);
    const b = el("button", "mt-pair");
    b.appendChild(el("span", "", "Verset " + k.split(":")[1] + " · " + others.length + " semblable" + (others.length > 1 ? "s" : "")));
    b.appendChild(el("span", "muted small", names.slice(0, 4).join(", ") + (names.length > 4 ? "…" : "")));
    b.addEventListener("click", () => mtDetail(chapters, k, index, s));
    list.appendChild(b);
  });
  mtBox.appendChild(list);
}

async function mtDetail(chapters, key, index, s) {
  mtShell(false);
  const back = el("button", "link-btn", "← Liste de la sourate " + chapters[s].latin);
  back.addEventListener("click", () => mtList(chapters, s));
  mtBox.appendChild(back);
  const msg = el("p", "muted center", "Chargement des versets…");
  mtBox.appendChild(msg);
  const others = index.sim[key] || [];
  try {
    const v = await getVerse(key);
    msg.remove();
    const names = [];
    others.forEach((o) => { const n = Number(o.k.split(":")[0]); if (!names.includes(n)) names.push(n); });
    mtBox.appendChild(el("p", "center", "Ce verset ressemble à des versets des sourates : " + names.map((n) => chapters[n].latin + " (" + n + ")").join(", ") + "."));
    mtBox.appendChild(el("p", "muted center", "Les mots en orange sont ceux qui changent."));
    const holder = el("div", "");
    mtBox.appendChild(holder);
    let shown = 0;
    const more = el("button", "btn", "");
    const wrap = el("div", "center");
    wrap.appendChild(more);
    async function load() {
      const slice = others.slice(shown, shown + 4);
      more.disabled = true;
      more.textContent = "Chargement…";
      try {
        const vs = await Promise.all(slice.map((o) => getVerse(o.k)));
        if (shown === 0) holder.appendChild(mtVerseBlock(chapters, v, vs[0]));
        vs.forEach((x, i) => {
          holder.appendChild(el("p", "muted center", "Ressemblance : " + Math.round(slice[i].s * 100) + " %"));
          holder.appendChild(mtVerseBlock(chapters, x, v));
        });
        shown += slice.length;
      } catch (err) {
        console.error(err);
        holder.appendChild(el("p", "error", "Impossible de charger les versets. Vérifiez votre connexion."));
      }
      more.disabled = false;
      if (shown >= others.length) wrap.remove();
      else more.textContent = "Voir la suite (" + (others.length - shown) + " restants)";
    }
    more.addEventListener("click", load);
    mtBox.appendChild(wrap);
    load();
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger le verset. Vérifiez votre connexion.";
  }
}

async function mtOpen(chapters, pair) {
  mtShell(false);
  const back = el("button", "link-btn", "← Toutes les paires");
  back.addEventListener("click", mtHome);
  mtBox.appendChild(back);
  const msg = el("p", "muted center", "Chargement des versets…");
  mtBox.appendChild(msg);
  try {
    const [a, b] = await Promise.all(pair.map(getVerse));
    msg.remove();
    mtBox.appendChild(el("p", "muted center", "Les mots en orange sont ceux qui changent d'un verset à l'autre."));
    mtBox.appendChild(mtVerseBlock(chapters, a, b));
    mtBox.appendChild(mtVerseBlock(chapters, b, a));
    mtBox.appendChild(el("p", "muted center small", "Astuce : retiens le mot qui change avec le nom de la sourate."));
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger les versets. Vérifiez votre connexion.";
  }
}

// ---------- Quiz ----------
async function mtQuizStart() {
  mtShell(false);
  mtBox.appendChild(el("p", "muted center", "Chargement…"));
  try {
    const chapters = await getChapters();
    const list = shuffle(MT_PAIRS.map((p) => p.slice())).slice(0, 5).map((p) => {
      const key = p[randInt(0, 1)];
      return { key, pair: p };
    });
    mtQuiz = { chapters, list, i: 0, score: 0 };
    mtQuizNext();
  } catch (err) {
    console.error(err);
    mtBox.innerHTML = "";
    mtBox.appendChild(el("p", "error", "Impossible de charger le quiz. Vérifiez votre connexion."));
  }
}

async function mtQuizNext() {
  const quiz = mtQuiz;
  const item = quiz.list[quiz.i];
  mtShell(false);
  mtBox.appendChild(el("p", "muted center", "Question " + (quiz.i + 1) + " / " + quiz.list.length));
  const msg = el("p", "muted center", "Chargement du verset…");
  mtBox.appendChild(msg);
  let v;
  try {
    v = await getVerse(item.key);
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger le verset. Vérifiez votre connexion.";
    return;
  }
  if (mtQuiz !== quiz) return;
  msg.remove();
  const card = el("article", "verse");
  const p = el("p", "arabic", v.arabic);
  p.lang = "ar";
  p.dir = "rtl";
  card.appendChild(p);
  const play = el("button", "btn ghost", "🔊 Écouter");
  if (!v.audio) play.disabled = true;
  play.addEventListener("click", () => toggleAudio(play, v.audio));
  const ac = el("div", "actions");
  ac.appendChild(play);
  card.appendChild(ac);
  mtBox.appendChild(card);
  mtBox.appendChild(el("p", "game-ask", "De quelle sourate vient ce verset ?"));
  mtBox.appendChild(el("p", "ar-sub", "من أي سورة هذه الآية؟"));

  const answer = Number(item.key.split(":")[0]);
  const ids = [...new Set(item.pair.map((k) => Number(k.split(":")[0])))];
  while (ids.length < 2) { const x = randInt(1, 114); if (!ids.includes(x)) ids.push(x); }
  const box = el("div", "choices");
  const btns = [];
  shuffle(ids.slice()).forEach((id) => {
    const b = el("button", "choice");
    b.appendChild(el("span", "", quiz.chapters[id].latin));
    b.appendChild(el("span", "choice-ar", quiz.chapters[id].arabic));
    b.addEventListener("click", () => {
      btns.forEach((x) => (x.disabled = true));
      const good = id === answer;
      if (good) quiz.score++;
      b.classList.add(good ? "correct" : "wrong");
      btns.find((x) => x.dataset.id === String(answer)).classList.add("correct");
      markToday();
      const fb = el("div", "feedback " + (good ? "ok" : "no"));
      fb.appendChild(el("strong", "", (good ? "Bonne réponse ! ✅" : "Pas tout à fait.") + " C'est la sourate " + quiz.chapters[answer].latin + ", verset " + item.key.split(":")[1] + "."));
      fb.appendChild(el("p", "french", v.french));
      const last = quiz.i + 1 >= quiz.list.length;
      const next = el("button", "btn", last ? "Voir mon score" : "Question suivante →");
      next.addEventListener("click", () => { quiz.i++; if (last) mtQuizEnd(); else mtQuizNext(); });
      fb.appendChild(next);
      mtBox.appendChild(fb);
      fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    b.dataset.id = String(id);
    btns.push(b);
    box.appendChild(b);
  });
  mtBox.appendChild(box);
}

function mtQuizEnd() {
  const quiz = mtQuiz;
  mtQuiz = null;
  mtShell(false);
  mtBox.appendChild(el("p", "final-score", quiz.score + " / " + quiz.list.length));
  const again = el("button", "btn", "Rejouer");
  again.addEventListener("click", mtQuizStart);
  const home = el("button", "btn ghost", "Voir les paires");
  home.addEventListener("click", mtHome);
  const row = el("div", "actions center-actions");
  row.appendChild(again);
  row.appendChild(home);
  mtBox.appendChild(row);
}

document.querySelector('.tab[data-view="mutash"]').addEventListener("click", () => { if (!mtQuiz) mtHome(); });
