// ====== Jeu : Devine la sourate ======
// Utilise getChapters(), getVerse(), toggleAudio(), stopAudio() définies dans app.js.

const GAME_TOTAL = 10; // nombre de questions par partie
const LEVELS = {
  facile: { min: 78, max: 114, label: "Facile", desc: "Sourates courtes (78 à 114)" },
  difficile: { min: 1, max: 114, label: "Difficile", desc: "Les 114 sourates" }
};

const gameBox = document.querySelector("#game");
let game = null; // { level, number, score }

// ---------- Petits outils ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------- Écran de départ ----------
function showStart() {
  stopAudio();
  gameBox.innerHTML = "";
  gameBox.appendChild(el("h1", "game-title", "Devine la sourate"));
  gameBox.appendChild(el("p", "muted center", "On vous montre un verset. À vous de retrouver de quelle sourate il vient. " + GAME_TOTAL + " questions par partie."));

  const levels = el("div", "levels");
  Object.keys(LEVELS).forEach((key) => {
    const b = el("button", "level");
    b.appendChild(el("strong", "", LEVELS[key].label));
    b.appendChild(el("span", "muted", LEVELS[key].desc));
    b.addEventListener("click", () => startGame(key));
    levels.appendChild(b);
  });
  gameBox.appendChild(levels);
}

function startGame(level) {
  game = { level, number: 0, score: 0 };
  nextQuestion();
}

// ---------- Une question ----------
async function nextQuestion() {
  stopAudio();
  game.number++;
  gameBox.innerHTML = "";
  gameBox.appendChild(el("p", "muted center", "Chargement du verset…"));

  try {
    const chapters = await getChapters();
    const { min, max } = LEVELS[game.level];

    // 1) La bonne réponse : une sourate au hasard
    const answer = randInt(min, max);
    // 2) Un verset au hasard dans cette sourate
    const verseNumber = randInt(1, chapters[answer].verses);
    const verse = await getVerse(answer + ":" + verseNumber);
    // 3) Trois autres sourates différentes pour les mauvais choix
    const ids = new Set([answer]);
    while (ids.size < 4) ids.add(randInt(min, max));

    renderQuestion(chapters, verse, answer, verseNumber, shuffle([...ids]));
  } catch (err) {
    console.error(err);
    gameBox.innerHTML = "";
    gameBox.appendChild(el("p", "error", "Impossible de charger la question. Vérifiez votre connexion."));
    const retry = el("button", "btn", "Réessayer");
    retry.addEventListener("click", () => { game.number--; nextQuestion(); });
    const wrap = el("div", "center");
    wrap.appendChild(retry);
    gameBox.appendChild(wrap);
  }
}

function renderQuestion(chapters, verse, answer, verseNumber, choices) {
  gameBox.innerHTML = "";

  const head = el("div", "game-head");
  head.appendChild(el("span", "", "Question " + game.number + " sur " + GAME_TOTAL));
  head.appendChild(el("span", "score", "Score : " + game.score));
  gameBox.appendChild(head);

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
  gameBox.appendChild(card);

  gameBox.appendChild(el("p", "game-ask", "De quelle sourate vient ce verset ?"));

  const choicesBox = el("div", "choices");
  const buttons = [];
  choices.forEach((id) => {
    const b = el("button", "choice");
    b.appendChild(el("span", "", chapters[id].latin));
    b.appendChild(el("span", "choice-ar", chapters[id].arabic));
    b.addEventListener("click", () => {
      // Une seule réponse possible par question
      buttons.forEach((x) => (x.disabled = true));
      const good = id === answer;
      if (good) game.score++;
      b.classList.add(good ? "correct" : "wrong");
      buttons[choices.indexOf(answer)].classList.add("correct");
      showFeedback(chapters, verse, answer, verseNumber, good);
    });
    buttons.push(b);
    choicesBox.appendChild(b);
  });
  gameBox.appendChild(choicesBox);
}

function showFeedback(chapters, verse, answer, verseNumber, good) {
  const box = el("div", "feedback " + (good ? "ok" : "ko"));
  box.appendChild(el("strong", "", good ? "Bravo, bonne réponse !" : "Pas tout à fait."));
  box.appendChild(el("p", "", "C'était la sourate " + chapters[answer].latin + ", verset " + verseNumber + "."));
  box.appendChild(el("p", "french", verse.french));

  const last = game.number >= GAME_TOTAL;
  const next = el("button", "btn", last ? "Voir mon score" : "Question suivante →");
  next.addEventListener("click", () => (last ? showEnd() : nextQuestion()));
  box.appendChild(next);
  gameBox.appendChild(box);
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- Fin de partie ----------
function showEnd() {
  stopAudio();
  const ratio = game.score / GAME_TOTAL;
  let message = "Continuez, vous allez progresser !";
  if (ratio >= 0.9) message = "Excellent, mashaAllah !";
  else if (ratio >= 0.6) message = "Très bien !";
  else if (ratio >= 0.3) message = "Pas mal, réessayez pour faire mieux.";

  gameBox.innerHTML = "";
  gameBox.appendChild(el("h1", "game-title", "Partie terminée"));
  gameBox.appendChild(el("p", "final-score", game.score + " / " + GAME_TOTAL));
  gameBox.appendChild(el("p", "muted center", message));

  const again = el("button", "btn", "Rejouer");
  again.addEventListener("click", () => startGame(game.level));
  const menu = el("button", "btn ghost", "Changer de niveau");
  menu.addEventListener("click", showStart);
  const actions = el("div", "actions center-actions");
  actions.appendChild(again);
  actions.appendChild(menu);
  gameBox.appendChild(actions);
}

showStart();
