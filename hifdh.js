// ====== Hifdh : mémorisation + « Complète le verset » ======
// Utilise getChapters(), getVerse(), toggleAudio(), stopAudio() (app.js),
// randInt(), shuffle(), el() (game.js) et EMOTIONS (emotions.js).

const hfBox = document.querySelector("#hifdh");
const HF_REFS = [...new Set(EMOTIONS.flatMap((e) => e.verses))]; // versets utilisés par « Complète le verset »

const mem = { surah: 112, ayah: 1, verse: null, order: [], hidden: 0, revealed: new Set() };
const comp = { number: 0, score: 0, total: 5 };
let hfContent = null;

// Les mots d'un verset (si l'API ne donne pas les mots, on coupe le texte aux espaces)
function wordsOf(v) {
  return v.words.length ? v.words.map((w) => w.text) : v.arabic.split(" ").filter(Boolean);
}

// Cadre commun : titre + deux modes
function hfShell(active) {
  stopAudio();
  hfBox.innerHTML = "";
  hfBox.appendChild(el("h1", "game-title", "Hifdh – Mémorisation"));
  const modes = el("div", "modes");
  [["memorize", "Mémoriser"], ["complete", "Complète le verset"]].forEach(([key, label]) => {
    const b = el("button", "mode" + (key === active ? " active" : ""), label);
    b.addEventListener("click", () => (key === "memorize" ? memStart() : compStart()));
    modes.appendChild(b);
  });
  hfBox.appendChild(modes);
  hfContent = el("div", "hf-content");
  hfBox.appendChild(hfContent);
}

function hfLoading() {
  hfContent.innerHTML = "";
  hfContent.appendChild(el("p", "muted center", "Chargement du verset…"));
}

function hfError(retry) {
  hfContent.innerHTML = "";
  hfContent.appendChild(el("p", "error", "Impossible de charger le verset. Vérifiez votre connexion."));
  const b = el("button", "btn", "Réessayer");
  b.addEventListener("click", retry);
  const wrap = el("div", "center");
  wrap.appendChild(b);
  hfContent.appendChild(wrap);
}

// =====================================================
//  MODE 1 : MÉMORISER
// =====================================================
function memStart() {
  hfShell("memorize");
  memLoad();
}

async function memLoad() {
  stopAudio();
  hfLoading();
  try {
    const chapters = await getChapters();
    const v = await getVerse(mem.surah + ":" + mem.ayah);
    mem.verse = v;
    mem.order = shuffle(wordsOf(v).map((_, i) => i)); // ordre dans lequel les mots se cachent
    mem.hidden = 0;
    mem.revealed = new Set();
    renderMem(chapters);
  } catch (err) {
    console.error(err);
    hfError(memLoad);
  }
}

function optionList(select, count, labelFn) {
  for (let i = 1; i <= count; i++) {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = labelFn(i);
    select.appendChild(o);
  }
}

function renderMem(chapters) {
  hfContent.innerHTML = "";
  const v = mem.verse;
  const words = wordsOf(v);
  const n = words.length;

  // --- Choix du verset ---
  const pick = el("div", "pick");
  const sSel = document.createElement("select");
  sSel.setAttribute("aria-label", "Sourate");
  optionList(sSel, 114, (i) => i + ". " + chapters[i].latin + " (" + chapters[i].arabic + ")");
  sSel.value = mem.surah;
  const aSel = document.createElement("select");
  aSel.setAttribute("aria-label", "Verset");
  optionList(aSel, chapters[mem.surah].verses, (i) => "Verset " + i);
  aSel.value = mem.ayah;
  sSel.addEventListener("change", () => { mem.surah = Number(sSel.value); mem.ayah = 1; memLoad(); });
  aSel.addEventListener("change", () => { mem.ayah = Number(aSel.value); memLoad(); });

  const prev = el("button", "btn ghost", "←");
  prev.title = "Verset précédent";
  prev.addEventListener("click", () => {
    if (mem.ayah > 1) mem.ayah--;
    else if (mem.surah > 1) { mem.surah--; mem.ayah = chapters[mem.surah].verses; }
    else return;
    memLoad();
  });
  const next = el("button", "btn ghost", "→");
  next.title = "Verset suivant";
  next.addEventListener("click", () => {
    if (mem.ayah < chapters[mem.surah].verses) mem.ayah++;
    else if (mem.surah < 114) { mem.surah++; mem.ayah = 1; }
    else return;
    memLoad();
  });
  pick.appendChild(sSel);
  pick.appendChild(aSel);
  pick.appendChild(prev);
  pick.appendChild(next);
  hfContent.appendChild(pick);

  // --- Le verset, mot par mot ---
  const card = el("article", "verse");
  const arabic = el("p", "arabic");
  arabic.lang = "ar";
  arabic.dir = "rtl";
  const info = el("p", "muted center");
  card.appendChild(arabic);
  card.appendChild(info);

  function paint() {
    arabic.textContent = "";
    const hiddenSet = new Set(mem.order.slice(0, mem.hidden));
    let stillHidden = 0;
    words.forEach((w, i) => {
      const span = el("span", "w", w);
      if (hiddenSet.has(i) && !mem.revealed.has(i)) {
        stillHidden++;
        span.classList.add("hw");
        span.title = "Cliquez pour révéler";
        span.addEventListener("click", () => { mem.revealed.add(i); paint(); });
      }
      arabic.appendChild(span);
      if (i < n - 1) arabic.appendChild(document.createTextNode(" "));
    });
    info.textContent = "Mots cachés : " + stillHidden + " sur " + n;
  }

  // --- Boutons de difficulté ---
  const step = Math.max(1, Math.ceil(n / 4));
  const level = (newHidden) => { mem.hidden = Math.max(0, Math.min(n, newHidden)); mem.revealed.clear(); paint(); };
  const controls = el("div", "actions center-actions");
  [
    ["− Afficher", () => level(mem.hidden - step), "btn ghost"],
    ["+ Cacher", () => level(mem.hidden + step), "btn"],
    ["Tout cacher", () => level(n), "btn ghost"],
    ["Tout afficher", () => level(0), "btn ghost"]
  ].forEach(([label, fn, cls]) => {
    const b = el("button", cls, label);
    b.addEventListener("click", fn);
    controls.appendChild(b);
  });
  card.appendChild(controls);

  // --- Audio ---
  const play = el("button", "btn", "▶ Écouter");
  if (!v.audio) play.disabled = true;
  play.addEventListener("click", () => toggleAudio(play, v.audio));
  const audioRow = el("div", "actions center-actions");
  audioRow.appendChild(play);
  card.appendChild(audioRow);

  card.appendChild(el("p", "french", v.french));
  hfContent.appendChild(card);
  hfContent.appendChild(el("p", "muted center", "Astuce : cachez des mots, récitez de mémoire, puis cliquez sur un mot caché pour vérifier."));
  paint();
}

// =====================================================
//  MODE 2 : COMPLÈTE LE VERSET
// =====================================================
function compStart() {
  hfShell("complete");
  comp.number = 0;
  comp.score = 0;
  compNext();
}

async function compNext() {
  stopAudio();
  comp.number++;
  hfLoading();
  try {
    const chapters = await getChapters();
    // Un verset d'au moins 4 mots
    let v, words, tries = 0;
    do {
      v = await getVerse(HF_REFS[randInt(0, HF_REFS.length - 1)]);
      words = wordsOf(v);
      tries++;
    } while (words.length < 4 && tries < 8);

    const missing = randInt(0, words.length - 1);
    const correct = words[missing];

    // Trois mauvais choix : d'abord d'autres mots du même verset
    const wrong = shuffle([...new Set(words.filter((w) => w !== correct))]).slice(0, 3);
    // Si le verset est court, on complète avec des mots d'un autre verset
    let extra = 0;
    while (wrong.length < 3 && extra < 10) {
      extra++;
      const other = await getVerse(HF_REFS[randInt(0, HF_REFS.length - 1)]);
      shuffle(wordsOf(other).slice()).forEach((w) => {
        if (wrong.length < 3 && w !== correct && !wrong.includes(w)) wrong.push(w);
      });
    }
    renderComp(chapters, v, words, missing, shuffle([correct, ...wrong]));
  } catch (err) {
    console.error(err);
    comp.number--;
    hfError(compNext);
  }
}

function renderComp(chapters, v, words, missing, choices) {
  hfContent.innerHTML = "";

  const head = el("div", "game-head");
  head.appendChild(el("span", "", "Question " + comp.number + " sur " + comp.total));
  head.appendChild(el("span", "score", "Score : " + comp.score));
  hfContent.appendChild(head);

  // Le verset avec un trou
  const card = el("article", "verse");
  const arabic = el("p", "arabic");
  arabic.lang = "ar";
  arabic.dir = "rtl";
  let gap = null;
  words.forEach((w, i) => {
    const span = el("span", "w", i === missing ? "_____" : w);
    if (i === missing) { span.classList.add("gap"); gap = span; }
    arabic.appendChild(span);
    if (i < words.length - 1) arabic.appendChild(document.createTextNode(" "));
  });
  card.appendChild(arabic);
  hfContent.appendChild(card);

  hfContent.appendChild(el("p", "game-ask", "Quel mot manque dans ce verset ?"));

  const box = el("div", "choices");
  const buttons = [];
  choices.forEach((word) => {
    const b = el("button", "choice choice-word", word);
    b.lang = "ar";
    b.addEventListener("click", () => {
      buttons.forEach((x) => (x.disabled = true));
      const good = word === words[missing];
      if (good) comp.score++;
      b.classList.add(good ? "correct" : "wrong");
      buttons.forEach((x) => { if (x.textContent === words[missing]) x.classList.add("correct"); });
      gap.textContent = words[missing]; // on remplit le trou
      gap.classList.remove("gap");
      gap.classList.add("filled");
      compFeedback(chapters, v, good);
    });
    buttons.push(b);
    box.appendChild(b);
  });
  hfContent.appendChild(box);
}

function compFeedback(chapters, v, good) {
  const [s, a] = v.key.split(":").map(Number);
  const box = el("div", "feedback " + (good ? "ok" : "ko"));
  box.appendChild(el("strong", "", good ? "Bravo, bonne réponse !" : "Pas tout à fait."));
  box.appendChild(el("p", "", "Sourate " + chapters[s].latin + ", verset " + a + "."));
  box.appendChild(el("p", "french", v.french));
  const last = comp.number >= comp.total;
  const next = el("button", "btn", last ? "Voir mon score" : "Question suivante →");
  next.addEventListener("click", () => (last ? compEnd() : compNext()));
  box.appendChild(next);
  hfContent.appendChild(box);
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function compEnd() {
  hfContent.innerHTML = "";
  hfContent.appendChild(el("h2", "game-title", "Partie terminée"));
  hfContent.appendChild(el("p", "final-score", comp.score + " / " + comp.total));
  const again = el("button", "btn", "Rejouer");
  again.addEventListener("click", compStart);
  const mode = el("button", "btn ghost", "Mode Mémoriser");
  mode.addEventListener("click", memStart);
  const row = el("div", "actions center-actions");
  row.appendChild(again);
  row.appendChild(mode);
  hfContent.appendChild(row);
}

// Affichage initial de l'onglet (les données ne sont chargées qu'au premier clic)
document.querySelector('.tab[data-view="hifdh"]').addEventListener("click", () => {
  if (!hfContent) memStart();
});
