// ====== Tajwid : leçons pour débutants ======
// Les exemples viennent de l'API Quran.com (texte avec les règles de tajwid déjà marquées).
// Rien du texte coranique n'est écrit à la main ici : seulement des explications.
//
// Utilise : getChapters(), getVerse(), toggleAudio(), stopAudio() (app.js), attachRecorder() (record.js),
// el(), shuffle(), randInt() (game.js), Store, markToday(), recordResult() (store.js).

const tjBox = document.querySelector("#tajwid");

// Règles reconnues. Toute classe inconnue renvoyée par l'API est ignorée (affichée sans couleur).
const TJ_RULES = {
  ham_wasl: { name: "Hamzat al-wasl · همزة الوصل", info: "Hamza de liaison : elle ne se prononce qu'au début de la lecture. Quand on enchaîne depuis le mot précédent, on ne la prononce pas." },
  slnt: { name: "Lettre muette · الحرف الذي لا يُنطق", info: "Lettre écrite mais non prononcée (par exemple le lam de l'article devant une lettre solaire)." },
  madda_normal: { name: "Madd naturel (2 temps) · المد الطبيعي", info: "Allongement de 2 temps d'une lettre de madd (alif, waw ou ya)." },
  madda_permissible: { name: "Madd permis (2, 4 ou 6 temps) · المد الجائز المنفصل", info: "Allongement dont la durée peut être de 2, 4 ou 6 temps selon la lecture et l'enseignement suivi." },
  madda_obligatory: { name: "Madd obligatoire (4-5 temps) · المد الواجب المتصل", info: "Allongement de 4 à 5 temps quand la lettre de madd est suivie d'une hamza dans le même mot." },
  madda_necessary: { name: "Madd nécessaire (6 temps) · المد اللازم", info: "Allongement de 6 temps quand la lettre de madd est suivie d'un soukoun permanent." },
  qlq: { name: "Qalqala (rebond) · القلقلة", info: "Léger rebond du son sur les lettres ق ط ب ج د quand elles portent un soukoun." },
  ikhf: { name: "Ikhfa' (dissimulation) · الإخفاء", info: "Le noun sakina ou le tanwin est prononcé de façon légère et nasalisée devant l'une des 15 lettres de l'ikhfa'." },
  ikhf_shfw: { name: "Ikhfa' chafawi · الإخفاء الشفوي", info: "Mim sakina devant la lettre ب : prononcé avec ghunna, les lèvres presque fermées." },
  idghm_shfw: { name: "Idgham chafawi · الإدغام الشفوي", info: "Mim sakina devant un autre mim : les deux se fondent avec ghunna." },
  iqlb: { name: "Iqlab (conversion) · الإقلاب", info: "Le noun sakina ou le tanwin devant la lettre ب se transforme en mim, avec ghunna." },
  idgh_ghn: { name: "Idgham avec ghunna · الإدغام بغنة", info: "Le noun sakina ou le tanwin se fond dans ي ن م و, avec nasalisation." },
  idgh_w_ghn: { name: "Idgham sans ghunna · الإدغام بغير غنة", info: "Le noun sakina ou le tanwin se fond dans ل ou ر, sans nasalisation." },
  idgh_mus: { name: "Idgham de lettres proches · إدغام المتقاربين والمتجانسين", info: "Deux lettres de même point ou de points proches se fondent l'une dans l'autre." },
  ghn: { name: "Ghunna (nasalisation) · الغنة", info: "Son nasal d'environ 2 temps sur le noun ou le mim portant une chadda." }
};

// Leçons pour débutants
const TJ_LESSONS = [
  {
    id: "noun", title: "Noun sakina et tanwin : les 4 règles · النون الساكنة والتنوين: أربعة أحكام",
    summary: "Que devient le noun sans voyelle (نْ) ou le tanwin quand une lettre le suit ?",
    blocks: [
      { title: "Idhar : clarté · الإظهار", text: "Devant les lettres de la gorge, on prononce le noun clairement, sans nasalisation.", letters: "ء ه ع ح غ خ" },
      { title: "Idgham : assimilation · الإدغام", text: "Le noun se fond dans la lettre suivante, qui se trouve dans le mot d'après. Avec ghunna devant ي ن م و, sans ghunna devant ل et ر.", letters: "ي ر م ل و ن" },
      { title: "Iqlab : conversion · الإقلاب", text: "Devant la lettre ب, le noun devient un mim, avec ghunna.", letters: "ب" },
      { title: "Ikhfa' : dissimulation · الإخفاء", text: "Devant les 15 autres lettres, le noun est prononcé de façon légère et nasalisée, sans le prononcer complètement.", letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك" }
    ],
    classes: ["idgh_ghn", "idgh_w_ghn", "iqlb", "ikhf"],
    tip: "L'idhar est la prononciation « normale » : il n'est généralement pas coloré."
  },
  {
    id: "mim", title: "Mim sakina : les 3 règles · الميم الساكنة: ثلاثة أحكام",
    summary: "Que devient le mim sans voyelle (مْ) selon la lettre qui le suit ?",
    blocks: [
      { title: "Ikhfa' chafawi · الإخفاء الشفوي", text: "Mim sakina devant ب : on le prononce avec ghunna, les lèvres presque fermées.", letters: "ب" },
      { title: "Idgham chafawi · الإدغام الشفوي", text: "Mim sakina devant un autre mim : les deux se fondent en un mim avec ghunna.", letters: "م" },
      { title: "Idhar chafawi · الإظهار الشفوي", text: "Devant toutes les autres lettres, le mim est prononcé clairement. Attention à ne pas le cacher devant ف et و.", letters: "toutes les autres" }
    ],
    classes: ["ikhf_shfw", "idghm_shfw"],
    tip: "Chafawi veut dire « labial » : ces règles se font avec les lèvres."
  },
  {
    id: "ghunna", title: "La ghunna · الغنة",
    summary: "Le son nasal.",
    blocks: [
      { title: "Qu'est-ce que la ghunna ? · ما هي الغنة؟", text: "C'est un son nasal, prononcé dans le nez. Elle est obligatoire sur le noun et le mim portant une chadda (نّ et مّ). Sa durée est d'environ 2 temps.", letters: "نّ مّ" },
      { title: "Repère de durée · مقدار الحركات", text: "Un temps correspond à peu près au temps de plier ou de déplier un doigt.", letters: "" }
    ],
    classes: ["ghn"],
    tip: "Écoutez le récitateur avant de répéter."
  },
  {
    id: "madd", title: "Le madd naturel · المد الطبيعي",
    summary: "L'allongement de base : 2 temps.",
    blocks: [
      { title: "Les 3 lettres de madd · حروف المد الثلاثة", text: "L'alif après une fatha, le waw après une damma, le ya après une kasra : ces lettres allongent la voyelle.", letters: "ا و ي" },
      { title: "Durée · المدة", text: "Le madd naturel dure 2 temps, ni plus ni moins, quand la lettre de madd n'est suivie ni d'une hamza ni d'un soukoun.", letters: "" }
    ],
    classes: ["madda_normal"],
    tip: "Les autres madd sont des allongements plus longs : voir la leçon suivante."
  },
  {
    id: "madd2", title: "Les madd plus longs · أنواع المد الأطول",
    summary: "Quand l'allongement dépasse 2 temps.",
    blocks: [
      { title: "Madd obligatoire (muttasil) · المد الواجب المتصل", text: "La lettre de madd est suivie d'une hamza dans le même mot : allongement de 4 à 5 temps.", letters: "" },
      { title: "Madd permis · المد الجائز المنفصل", text: "La durée peut être de 2, 4 ou 6 temps selon la lecture suivie. Un cas fréquent : la lettre de madd termine un mot et la hamza commence le mot suivant.", letters: "" },
      { title: "Madd nécessaire (lazim) · المد اللازم", text: "La lettre de madd est suivie d'un soukoun permanent : allongement de 6 temps.", letters: "" }
    ],
    classes: ["madda_obligatory", "madda_permissible", "madda_necessary"],
    tip: "Les durées précises dépendent de la lecture et de votre professeur : suivez ses consignes."
  },
  {
    id: "qalqala", title: "La qalqala · القلقلة",
    summary: "Le rebond du son.",
    blocks: [
      { title: "Les 5 lettres · الحروف الخمسة", text: "Quand l'une de ces lettres porte un soukoun, le son rebondit légèrement. Pour s'en souvenir : « qutb jad ».", letters: "ق ط ب ج د" },
      { title: "Comment la prononcer · طريقة النطق", text: "Sans ajouter de voyelle : un petit rebond, plus marqué quand on s'arrête sur la lettre.", letters: "" }
    ],
    classes: ["qlq"],
    tip: "Ne transformez pas le rebond en voyelle."
  },
  {
    id: "muette", title: "Lettres muettes et hamzat al-wasl · الحروف التي لا تُنطق وهمزة الوصل",
    summary: "Ce qui s'écrit mais ne se prononce pas.",
    blocks: [
      { title: "Lettre muette · الحرف الذي لا يُنطق", text: "Certaines lettres sont écrites mais pas prononcées. Exemple : le lam de l'article devant une lettre solaire, comme dans الشمس.", letters: "" },
      { title: "Hamzat al-wasl · همزة الوصل", text: "Cette hamza de liaison ne se prononce qu'au début de la lecture. Quand on enchaîne depuis le mot précédent, elle disparaît.", letters: "" }
    ],
    classes: ["slnt", "ham_wasl"],
    tip: "Écoutez où le récitateur ne prononce pas la lettre."
  }
];

// Sourates courtes d'abord (les exemples sont plus simples pour un débutant)
const TJ_SURAHS = [1, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78];

const tjCache = new Map(); // sourate -> versets analysés
let tjQuiz = null;

// ---------- Lecture du texte marqué ----------
function tjSegments(html) {
  const box = document.createElement("div");
  box.innerHTML = html;
  box.querySelectorAll(".end").forEach((e) => e.remove()); // numéro de fin de verset
  const segs = [];
  box.childNodes.forEach((n) => {
    if (n.nodeType === 3) segs.push({ text: n.textContent, cls: null });
    else if (n.nodeType === 1) segs.push({ text: n.textContent, cls: n.tagName === "TAJWEED" ? n.getAttribute("class") : null });
  });
  return segs;
}

function tjKnown(seg) {
  return !!(seg.cls && TJ_RULES[seg.cls]);
}

async function tjLoadSurah(n) {
  if (tjCache.has(n)) return tjCache.get(n);
  let verses = null;
  try {
    const res = await fetch(`${API}/quran/verses/uthmani_tajweed?chapter_number=${n}`);
    if (res.ok) verses = (await res.json()).verses;
  } catch (e) { /* on essaie l'autre adresse */ }
  if (!verses) {
    const res = await fetch(`${API}/verses/by_chapter/${n}?fields=text_uthmani_tajweed&per_page=300&words=false`);
    if (!res.ok) throw new Error("tajwid indisponible");
    verses = (await res.json()).verses;
  }
  const list = (verses || [])
    .filter((v) => v.text_uthmani_tajweed && v.verse_key)
    .map((v) => {
      const segs = tjSegments(v.text_uthmani_tajweed);
      return {
        key: v.verse_key,
        segs,
        classes: [...new Set(segs.filter(tjKnown).map((s) => s.cls))],
        len: segs.reduce((t, s) => t + s.text.length, 0)
      };
    });
  tjCache.set(n, list);
  return list;
}

async function tjLoadMany(surahs) {
  const results = await Promise.allSettled(surahs.map(tjLoadSurah));
  const ok = results.filter((r) => r.status === "fulfilled");
  if (!ok.length) throw new Error("tajwid indisponible"); // tout a échoué : panne ou pas de connexion
  return ok.flatMap((r) => r.value);
}

// Cherche des versets courts contenant l'une des règles données
async function tjExamples(classes, want) {
  const found = [];
  for (let i = 0; i < TJ_SURAHS.length; i += 6) {
    let batch;
    try {
      batch = await tjLoadMany(TJ_SURAHS.slice(i, i + 6));
    } catch (e) {
      if (found.length) break; // on garde les exemples déjà trouvés
      throw e;
    }
    batch.forEach((v) => { if (v.classes.some((c) => classes.includes(c))) found.push(v); });
    if (found.length >= want * 2) break;
  }
  return found.sort((a, b) => a.len - b.len);
}

// ---------- Affichage du verset coloré ----------
// mode "lesson" : seules les règles de la leçon sont colorées
// mode "quiz"   : une seule portion est surlignée (target = numéro parmi les portions connues)
function tjArabic(segs, opts) {
  const p = el("p", "arabic");
  p.lang = "ar";
  p.dir = "rtl";
  let k = -1;
  segs.forEach((s) => {
    if (!tjKnown(s)) { p.appendChild(document.createTextNode(s.text)); return; }
    k++;
    const colored = opts.mode === "quiz" ? k === opts.target : opts.show.includes(s.cls);
    if (!colored) { p.appendChild(document.createTextNode(s.text)); return; }
    const span = document.createElement("span");
    span.textContent = s.text;
    span.className = opts.mode === "quiz" ? "tj-target" : "tj tj-" + s.cls;
    if (opts.mode !== "quiz") span.title = TJ_RULES[s.cls].name;
    p.appendChild(span);
  });
  return p;
}

function tjLegend(classes) {
  const box = el("div", "tj-legend");
  classes.forEach((c) => {
    const chip = el("span", "chip");
    chip.appendChild(el("span", "swatch tj-" + c, "●"));
    chip.appendChild(document.createTextNode(" " + TJ_RULES[c].name));
    box.appendChild(chip);
  });
  return box;
}

// ---------- Accueil ----------
function tjDone() {
  const d = Store.get("tajwid", null);
  return d && d.done ? d.done : {};
}

function tjHome() {
  stopAudio();
  tjQuiz = null;
  tjBox.innerHTML = "";
  tjBox.appendChild(el("h1", "game-title", "Tajwid pour débutants"));
  const note = el("div", "tj-note");
  note.appendChild(el("strong", "", "À savoir : "));
  note.appendChild(document.createTextNode("ces leçons aident à découvrir les règles, mais elles ne remplacent pas un professeur qualifié. L'application ne contrôle pas votre voix : elle vous fait écouter, repérer les règles dans le texte et vous entraîner. Les couleurs viennent du marquage fourni par l'API Quran.com."));
  tjBox.appendChild(note);

  const done = tjDone();
  const list = el("div", "lessons");
  TJ_LESSONS.forEach((l, i) => {
    const b = el("button", "lesson");
    b.appendChild(el("span", "lesson-num", done[l.id] ? "✓" : String(i + 1)));
    const t = el("span", "lesson-text");
    t.appendChild(el("strong", "", l.title));
    t.appendChild(el("span", "muted small", l.summary));
    b.appendChild(t);
    b.addEventListener("click", () => tjLesson(l));
    list.appendChild(b);
  });
  tjBox.appendChild(list);

  const row = el("div", "actions center-actions");
  const quiz = el("button", "btn", "🎯 Quiz : quelle est la règle ?");
  quiz.addEventListener("click", tjQuizStart);
  const legend = el("button", "btn ghost", "Voir toutes les couleurs");
  legend.addEventListener("click", () => {
    const old = tjBox.querySelector(".tj-all");
    if (old) { old.remove(); return; }
    const box = el("div", "tj-all");
    Object.keys(TJ_RULES).forEach((c) => {
      const r = el("div", "tj-rule");
      r.appendChild(el("span", "swatch tj-" + c, "●"));
      const t = el("span", "");
      t.appendChild(el("strong", "", TJ_RULES[c].name));
      t.appendChild(document.createElement("br"));
      t.appendChild(el("span", "muted small", TJ_RULES[c].info));
      r.appendChild(t);
      box.appendChild(r);
    });
    tjBox.appendChild(box);
  });
  row.appendChild(quiz);
  row.appendChild(legend);
  tjBox.appendChild(row);
}

// ---------- Une leçon ----------
async function tjLesson(lesson) {
  stopAudio();
  tjBox.innerHTML = "";
  const back = el("button", "link-btn", "← Toutes les leçons");
  back.addEventListener("click", tjHome);
  tjBox.appendChild(back);
  tjBox.appendChild(el("h2", "space-title", lesson.title));
  tjBox.appendChild(el("p", "muted", lesson.summary));

  lesson.blocks.forEach((b) => {
    const card = el("article", "verse");
    card.appendChild(el("div", "verse-ref", b.title));
    card.appendChild(el("p", "", b.text));
    if (b.letters) {
      const l = el("p", "tj-letters", b.letters);
      l.lang = "ar";
      l.dir = "rtl";
      card.appendChild(l);
    }
    tjBox.appendChild(card);
  });
  if (lesson.tip) tjBox.appendChild(el("p", "tj-tip", "💡 " + lesson.tip));

  tjBox.appendChild(el("h3", "space-title", "Exemples du Coran"));
  tjBox.appendChild(tjLegend(lesson.classes));
  const exBox = el("div", "");
  exBox.appendChild(el("p", "muted center", "Recherche d'exemples…"));
  tjBox.appendChild(exBox);

  const finish = el("button", "btn", Store.get("tajwid", null) && tjDone()[lesson.id] ? "Leçon terminée ✓" : "J'ai compris cette leçon ✓");
  finish.addEventListener("click", () => {
    const d = Store.get("tajwid", null) || { done: {} };
    d.done = d.done || {};
    d.done[lesson.id] = true;
    Store.set("tajwid", d);
    markToday();
    tjHome();
  });
  const row = el("div", "actions center-actions");
  row.appendChild(finish);
  tjBox.appendChild(row);

  try {
    const pool = await tjExamples(lesson.classes, 4);
    if (!pool.length) {
      exBox.innerHTML = "";
      exBox.appendChild(el("p", "muted center", "Aucun exemple trouvé pour cette règle dans les sourates chargées."));
      return;
    }
    let shown = 0;
    const best = pool.slice(0, 12);
    const draw = async () => {
      exBox.innerHTML = "";
      const picks = shuffle(best.slice()).slice(0, 3);
      shown++;
      const chapters = await getChapters();
      for (const item of picks) {
        const v = await getVerse(item.key);
        const [s, a] = item.key.split(":").map(Number);
        const card = el("article", "verse");
        card.appendChild(el("div", "verse-ref", "Sourate " + chapters[s].latin + " · verset " + a));
        card.appendChild(tjArabic(item.segs, { mode: "lesson", show: lesson.classes }));
        const present = lesson.classes.filter((c) => item.classes.includes(c));
        if (present.length) card.appendChild(tjLegend(present));
        card.appendChild(el("p", "french", v.french));
        const actions = el("div", "actions");
        const play = el("button", "btn", "▶ Écouter");
        if (!v.audio) play.disabled = true;
        play.addEventListener("click", () => toggleAudio(play, v.audio));
        actions.appendChild(play);
        card.appendChild(actions);
        if (typeof attachRecorder === "function") attachRecorder(card, v); // répéter et comparer
        exBox.appendChild(card);
      }
      if (best.length > 3) {
        const more = el("button", "btn ghost", "Autres exemples");
        more.addEventListener("click", draw);
        const wrap = el("div", "actions center-actions");
        wrap.appendChild(more);
        exBox.appendChild(wrap);
      }
    };
    await draw();
  } catch (err) {
    console.error(err);
    exBox.innerHTML = "";
    exBox.appendChild(el("p", "error", "Les exemples colorés sont indisponibles pour le moment. Vérifiez votre connexion : la leçon reste lisible."));
  }
}

// ---------- Quiz : quelle est la règle ? ----------
const TJ_QUIZ_TOTAL = 5;

async function tjQuizStart() {
  stopAudio();
  tjBox.innerHTML = "";
  tjBox.appendChild(el("h1", "game-title", "Quiz de tajwid"));
  tjBox.appendChild(el("p", "muted center", "Préparation des questions…"));
  try {
    const pool = await tjLoadMany(TJ_SURAHS.slice(0, 18));
    const usable = pool.filter((v) => v.classes.length);
    const classes = [...new Set(usable.flatMap((v) => v.classes))];
    if (classes.length < 2) throw new Error("pas assez de règles");
    tjQuiz = { pool: usable, classes, number: 0, score: 0 };
    tjQuizNext();
  } catch (err) {
    console.error(err);
    tjBox.innerHTML = "";
    tjBox.appendChild(el("p", "error", "Le quiz est indisponible pour le moment. Vérifiez votre connexion."));
    const b = el("button", "btn", "Retour");
    b.addEventListener("click", tjHome);
    const w = el("div", "center");
    w.appendChild(b);
    tjBox.appendChild(w);
  }
}

function tjQuizNext() {
  stopAudio();
  const q = tjQuiz;
  q.number++;
  const target = q.classes[randInt(0, q.classes.length - 1)];
  const verses = q.pool.filter((v) => v.classes.includes(target)).sort((a, b) => a.len - b.len).slice(0, 15);
  const item = verses[randInt(0, verses.length - 1)];
  // numéro de la portion cible parmi les portions connues du verset
  const spots = [];
  let k = -1;
  item.segs.forEach((s) => { if (tjKnown(s)) { k++; if (s.cls === target) spots.push(k); } });
  const idx = spots[randInt(0, spots.length - 1)];
  const others = shuffle(q.classes.filter((c) => c !== target)).slice(0, 3);
  const choices = shuffle([target, ...others]);

  tjBox.innerHTML = "";
  const head = el("div", "game-head");
  head.appendChild(el("span", "", "Question " + q.number + " sur " + TJ_QUIZ_TOTAL));
  head.appendChild(el("span", "score", "Score : " + q.score));
  tjBox.appendChild(head);

  const card = el("article", "verse");
  card.appendChild(tjArabic(item.segs, { mode: "quiz", target: idx }));
  const actions = el("div", "actions");
  const play = el("button", "btn", "▶ Écouter");
  actions.appendChild(play);
  card.appendChild(actions);
  tjBox.appendChild(card);
  getVerse(item.key).then((v) => {
    if (!v.audio) play.disabled = true;
    play.addEventListener("click", () => toggleAudio(play, v.audio));
  }).catch(() => { play.disabled = true; });

  tjBox.appendChild(el("p", "game-ask", "Quelle règle s'applique à la partie surlignée ?"));
  const box = el("div", "choices");
  const buttons = [];
  choices.forEach((c) => {
    const b = el("button", "choice", TJ_RULES[c].name);
    b.addEventListener("click", () => {
      buttons.forEach((x) => (x.disabled = true));
      const good = c === target;
      if (good) q.score++;
      b.classList.add(good ? "correct" : "wrong");
      buttons[choices.indexOf(target)].classList.add("correct");
      const fb = el("div", "feedback " + (good ? "ok" : "ko"));
      fb.appendChild(el("strong", "", good ? "Bravo, bonne réponse !" : "Pas tout à fait."));
      fb.appendChild(el("p", "", TJ_RULES[target].name + " : " + TJ_RULES[target].info));
      const last = q.number >= TJ_QUIZ_TOTAL;
      const next = el("button", "btn", last ? "Voir mon score" : "Question suivante →");
      next.addEventListener("click", () => (last ? tjQuizEnd() : tjQuizNext()));
      fb.appendChild(next);
      tjBox.appendChild(fb);
      fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    buttons.push(b);
    box.appendChild(b);
  });
  tjBox.appendChild(box);
}

function tjQuizEnd() {
  stopAudio();
  const q = tjQuiz;
  tjQuiz = null; // le quiz est terminé : l'onglet reviendra aux leçons
  recordResult("tajwid", q.score);
  tjBox.innerHTML = "";
  tjBox.appendChild(el("h1", "game-title", "Quiz terminé"));
  tjBox.appendChild(el("p", "final-score", q.score + " / " + TJ_QUIZ_TOTAL));
  tjBox.appendChild(el("p", "muted center", q.score >= 4 ? "Très bien ! Continuez les leçons." : "Relisez les leçons concernées, puis réessayez."));
  const again = el("button", "btn", "Rejouer");
  again.addEventListener("click", tjQuizStart);
  const home = el("button", "btn ghost", "Retour aux leçons");
  home.addEventListener("click", tjHome);
  const row = el("div", "actions center-actions");
  row.appendChild(again);
  row.appendChild(home);
  tjBox.appendChild(row);
}

// Au clic sur l'onglet : accueil, sauf si un quiz est en cours
document.querySelector('.tab[data-view="tajwid"]').addEventListener("click", () => {
  if (!tjQuiz) tjHome();
});