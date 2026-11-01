// ====== Défi du jour ======
// Les mêmes 10 questions pour tout le monde, chaque jour (tirées à partir de la date).
// Utilise getChapters(), getVerse(), toggleAudio(), stopAudio() (app.js), el() (game.js),
// Store, todayStr(), recordResult() (store.js).

const DAILY_TOTAL = 10;
const DAILY_MIN = 67;  // sourates 67 à 114 (plus courtes)
const DAILY_MAX = 114;
const dailyBox = document.querySelector("#daily");
let daily = null; // défi en cours : { date, specs, number, score, results }

// Petit générateur de nombres « au hasard » qui donne la même suite pour la même graine
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(s) {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

// Les 10 questions du jour : bonne sourate, numéro du verset, 4 choix mélangés
function dailySpecs(chapters, date) {
  const rng = mulberry32(seedFromString("sakina-" + date));
  const ri = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const specs = [];
  const used = new Set();
  while (specs.length < DAILY_TOTAL) {
    const answer = ri(DAILY_MIN, DAILY_MAX);
    if (used.has(answer)) continue;
    used.add(answer);
    const verseNumber = ri(1, chapters[answer].verses);
    const ids = new Set([answer]);
    while (ids.size < 4) ids.add(ri(DAILY_MIN, DAILY_MAX));
    const choices = [...ids];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    specs.push({ answer, verseNumber, choices });
  }
  return specs;
}

function prettyDate(iso) {
  const [y, m, d] = iso.split("-");
  return d + "/" + m;
}

// ---------- Accueil du défi ----------
function dailyHome() {
  stopAudio();
  dailyBox.innerHTML = "";
  dailyBox.appendChild(el("h1", "game-title", "Défi du jour"));
  const saved = Store.get("daily", null);
  if (saved && saved.date === todayStr()) {
    showDailyResult(saved);
    return;
  }
  dailyBox.appendChild(el("p", "muted center", "Les mêmes " + DAILY_TOTAL + " questions pour tout le monde aujourd'hui (sourates " + DAILY_MIN + " à " + DAILY_MAX + "). Une seule tentative par jour, puis partagez votre score !"));
  const start = el("button", "btn", "Commencer le défi");
  start.addEventListener("click", startDaily);
  const wrap = el("div", "actions center-actions");
  wrap.appendChild(start);
  dailyBox.appendChild(wrap);
}

async function startDaily() {
  dailyBox.innerHTML = "";
  dailyBox.appendChild(el("p", "muted center", "Préparation du défi…"));
  try {
    const chapters = await getChapters();
    const date = todayStr();
    daily = { date, specs: dailySpecs(chapters, date), number: 0, score: 0, results: [] };
    dailyNext();
  } catch (err) {
    console.error(err);
    dailyBox.innerHTML = "";
    dailyBox.appendChild(el("p", "error", "Impossible de préparer le défi. Vérifiez votre connexion."));
    const retry = el("button", "btn", "Réessayer");
    retry.addEventListener("click", startDaily);
    const wrap = el("div", "center");
    wrap.appendChild(retry);
    dailyBox.appendChild(wrap);
  }
}

// ---------- Une question ----------
async function dailyNext() {
  stopAudio();
  daily.number++;
  dailyBox.innerHTML = "";
  dailyBox.appendChild(el("p", "muted center", "Chargement du verset…"));
  try {
    const chapters = await getChapters();
    const spec = daily.specs[daily.number - 1];
    const verse = await getVerse(spec.answer + ":" + spec.verseNumber);
    renderDailyQuestion(chapters, verse, spec);
  } catch (err) {
    console.error(err);
    daily.number--;
    dailyBox.innerHTML = "";
    dailyBox.appendChild(el("p", "error", "Impossible de charger la question. Vérifiez votre connexion."));
    const retry = el("button", "btn", "Réessayer");
    retry.addEventListener("click", dailyNext);
    const wrap = el("div", "center");
    wrap.appendChild(retry);
    dailyBox.appendChild(wrap);
  }
}

function renderDailyQuestion(chapters, verse, spec) {
  dailyBox.innerHTML = "";
  const head = el("div", "game-head");
  head.appendChild(el("span", "", "Question " + daily.number + " sur " + DAILY_TOTAL));
  head.appendChild(el("span", "score", "Score : " + daily.score));
  dailyBox.appendChild(head);

  const card = el("article", "verse");
  const arabic = el("p", "arabic", verse.arabic);
  arabic.lang = "ar";
  arabic.dir = "rtl";
  card.appendChild(arabic);
  const play = el("button", "btn", "▶ Écouter");
  if (!verse.audio) play.disabled = true;
  play.addEventListener("click", () => toggleAudio(play, verse.audio));
  const actions = el("div", "actions");
  actions.appendChild(play);
  card.appendChild(actions);
  dailyBox.appendChild(card);

  dailyBox.appendChild(el("p", "game-ask", "De quelle sourate vient ce verset ?"));
  const box = el("div", "choices");
  const buttons = [];
  spec.choices.forEach((id) => {
    const b = el("button", "choice");
    b.appendChild(el("span", "", chapters[id].latin));
    b.appendChild(el("span", "choice-ar", chapters[id].arabic));
    b.addEventListener("click", () => {
      buttons.forEach((x) => (x.disabled = true));
      const good = id === spec.answer;
      if (good) daily.score++;
      daily.results.push(good);
      b.classList.add(good ? "correct" : "wrong");
      buttons[spec.choices.indexOf(spec.answer)].classList.add("correct");
      dailyFeedback(chapters, verse, spec, good);
    });
    buttons.push(b);
    box.appendChild(b);
  });
  dailyBox.appendChild(box);
}

function dailyFeedback(chapters, verse, spec, good) {
  const box = el("div", "feedback " + (good ? "ok" : "ko"));
  box.appendChild(el("strong", "", good ? "Bravo, bonne réponse !" : "Pas tout à fait."));
  box.appendChild(el("p", "", "C'était la sourate " + chapters[spec.answer].latin + ", verset " + spec.verseNumber + "."));
  box.appendChild(el("p", "french", verse.french));
  const last = daily.number >= DAILY_TOTAL;
  const next = el("button", "btn", last ? "Voir mon score" : "Question suivante →");
  next.addEventListener("click", () => (last ? finishDaily() : dailyNext()));
  box.appendChild(next);
  dailyBox.appendChild(box);
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- Résultat et partage ----------
function finishDaily() {
  const saved = { date: daily.date, score: daily.score, results: daily.results };
  Store.set("daily", saved);
  recordResult("daily", saved.score);
  daily = null;
  dailyBox.innerHTML = "";
  dailyBox.appendChild(el("h1", "game-title", "Défi du jour"));
  showDailyResult(saved);
}

function showDailyResult(r) {
  const grid = r.results.map((g) => (g ? "🟩" : "🟥")).join("");
  dailyBox.appendChild(el("p", "muted center", "Défi du " + prettyDate(r.date)));
  dailyBox.appendChild(el("p", "final-score", r.score + " / " + DAILY_TOTAL));
  dailyBox.appendChild(el("p", "center emoji-grid", grid));

  const share = el("button", "btn", "Partager mon score");
  share.addEventListener("click", async () => {
    const text = "Sakîna – Défi du jour (" + prettyDate(r.date) + ")\n" + r.score + "/" + DAILY_TOTAL + "\n" + grid + "\n" + location.origin + location.pathname;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        share.textContent = "Copié ✓";
        setTimeout(() => (share.textContent = "Partager mon score"), 1800);
      }
    } catch (e) { /* partage annulé */ }
  });
  const wrap = el("div", "actions center-actions");
  wrap.appendChild(share);
  dailyBox.appendChild(wrap);
  dailyBox.appendChild(el("p", "muted center", "Revenez demain pour un nouveau défi !"));
}

// Au clic sur l'onglet : accueil, sauf si un défi est déjà en cours
document.querySelector('.tab[data-view="daily"]').addEventListener("click", () => {
  if (!daily) dailyHome();
});
