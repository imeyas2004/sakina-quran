// ====== Configuration API (Quran.com v4, gratuite, sans clé) ======
const API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";
const TRANSLATION_ID = 31; // Muhammad Hamidullah (français)
const RECITER_ID = 7;      // Mishary Alafasy

const $ = (sel) => document.querySelector(sel);
const player = $("#player");

// ====== Cache simple pour éviter de redemander les mêmes données ======
const verseCache = new Map();
let chaptersCache = null;

async function getChapters() {
  if (chaptersCache) return chaptersCache;
  const res = await fetch(`${API}/chapters?language=fr`);
  if (!res.ok) throw new Error("Impossible de charger les sourates");
  const data = await res.json();
  chaptersCache = {};
  data.chapters.forEach((c) => {
    chaptersCache[c.id] = { arabic: c.name_arabic, latin: c.name_simple, translated: c.translated_name.name, verses: c.verses_count };
  });
  return chaptersCache;
}

async function getVerse(key) {
  if (verseCache.has(key)) return verseCache.get(key);
  const url = `${API}/verses/by_key/${key}?language=fr&words=true&word_fields=text_uthmani&translations=${TRANSLATION_ID}&audio=${RECITER_ID}&fields=text_uthmani`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de charger le verset " + key);
  const { verse } = await res.json();
  const item = {
    key,
    arabic: verse.text_uthmani,
    french: cleanTranslation(verse.translations?.[0]?.text || ""),
    audio: verse.audio?.url ? AUDIO_BASE + verse.audio.url : null,
    // Mots du verset (sans le signe de fin) et moments de récitation de chaque mot
    words: (verse.words || [])
      .filter((w) => w.char_type_name === "word" && (w.text_uthmani || w.text))
      .map((w) => ({ pos: w.position, text: w.text_uthmani || w.text })),
    segments: verse.audio?.segments || []
  };
  verseCache.set(key, item);
  return item;
}

// La traduction peut contenir des balises (notes de bas de page) : on les retire.
function cleanTranslation(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("sup").forEach((s) => s.remove());
  return div.textContent.trim();
}

// ====== Navigation entre les vues ======
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    $("#view-" + btn.dataset.view).classList.add("active");
    stopAudio();
  });
});

// ====== Audio ======
let currentBtn = null;

function stopAudio() {
  player.pause();
  clearKaraoke();
  if (typeof stopMine === "function") stopMine(); // arrête aussi « Récite et compare »
  if (currentBtn) {
    currentBtn.classList.remove("playing");
    currentBtn.textContent = "▶ Écouter";
    currentBtn = null;
  }
}

function toggleAudio(btn, url, k) {
  if (currentBtn === btn) {
    stopAudio();
    return;
  }
  stopAudio();
  if (!url) return;
  karaoke = k || null;
  player.src = url;
  player.play().catch(() => {
    btn.textContent = "Audio indisponible";
  });
  btn.classList.add("playing");
  btn.textContent = "⏸ Pause";
  currentBtn = btn;
}

// ====== Karaoké : surligner le mot récité ======
let karaoke = null; // { box, segments }

// Écrit le verset mot par mot (un <span> par mot). Sans mots, texte simple.
function fillArabic(p, v) {
  if (!v.words.length) {
    p.textContent = v.arabic;
    return;
  }
  p.textContent = "";
  v.words.forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.dataset.pos = w.pos;
    span.textContent = w.text;
    p.appendChild(span);
    if (i < v.words.length - 1) p.appendChild(document.createTextNode(" "));
  });
}

function clearKaraoke() {
  if (!karaoke) return;
  karaoke.box.querySelectorAll(".w").forEach((s) => s.classList.remove("on", "done"));
  karaoke = null;
}

function updateKaraoke() {
  if (!karaoke) return;
  const ms = player.currentTime * 1000;
  // segment = [index, position du mot, début (ms), fin (ms)]
  const seg = karaoke.segments.find((s) => ms >= s[2] && ms <= s[3]);
  if (!seg) return; // entre deux mots : on garde l'affichage précédent
  karaoke.box.querySelectorAll(".w").forEach((span) => {
    const pos = Number(span.dataset.pos);
    span.classList.toggle("on", pos === seg[1]);
    span.classList.toggle("done", pos < seg[1]);
  });
}

function karaokeLoop() {
  if (!karaoke || player.paused) return;
  updateKaraoke();
  requestAnimationFrame(karaokeLoop);
}
player.addEventListener("play", () => requestAnimationFrame(karaokeLoop));

player.addEventListener("ended", stopAudio);

// ====== Écran 1 : choix de l'émotion ======
function renderEmotions() {
  const wrap = $("#emotions");
  wrap.innerHTML = "";
  EMOTIONS.forEach((e) => {
    const b = document.createElement("button");
    b.className = "emotion";
    b.innerHTML = `<span class="emoji">${e.emoji}</span><span>${e.label}</span>`;
    b.addEventListener("click", () => showEmotion(e));
    wrap.appendChild(b);
  });
}

// ====== Écran 2 : versets de l'émotion choisie ======
async function showEmotion(emotion) {
  stopAudio();
  $("#emotions").classList.add("hidden");
  document.querySelector("#view-sakina .hero").classList.add("hidden");
  $("#results").classList.remove("hidden");
  $("#results-title").textContent = `${emotion.emoji} ${emotion.label}`;
  $("#results-intro").textContent = emotion.intro;

  const box = $("#verses");
  box.innerHTML = `<p class="muted center">Chargement des versets…</p>`;
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const [chapters, verses] = await Promise.all([
      getChapters(),
      Promise.all(emotion.verses.map(getVerse))
    ]);
    box.innerHTML = "";
    verses.forEach((v) => box.appendChild(buildCard(v, chapters)));
  } catch (err) {
    box.innerHTML = `<p class="error">Une erreur est survenue : vérifiez votre connexion et réessayez.</p>`;
    console.error(err);
  }
}

function buildCard(v, chapters) {
  const [s, a] = v.key.split(":").map(Number);
  const ch = chapters[s];
  const card = document.createElement("article");
  card.className = "verse";
  card.innerHTML = `
    <div class="verse-ref">Sourate ${ch.latin} (${ch.arabic}) · verset ${a}</div>
    <p class="arabic" lang="ar" dir="rtl"></p>
    <p class="french"></p>
    <div class="actions">
      <button class="btn play">▶ Écouter</button>
      <button class="btn ghost copy">Copier</button>
    </div>`;
  const arabicBox = card.querySelector(".arabic");
  fillArabic(arabicBox, v);
  card.querySelector(".french").textContent = v.french;

  const playBtn = card.querySelector(".play");
  if (!v.audio) playBtn.disabled = true;
  playBtn.addEventListener("click", () => toggleAudio(playBtn, v.audio, { box: arabicBox, segments: v.segments }));

  const copyBtn = card.querySelector(".copy");
  copyBtn.addEventListener("click", async () => {
    const text = `${v.arabic}\n\n${v.french}\n\n(Sourate ${ch.latin}, ${s}:${a})`;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copié ✓";
    } catch {
      copyBtn.textContent = "Échec";
    }
    setTimeout(() => (copyBtn.textContent = "Copier"), 1500);
  });
  if (typeof attachRecorder === "function") attachRecorder(card, v); // « Récite et compare »
  return card;
}

$("#back").addEventListener("click", () => {
  stopAudio();
  $("#results").classList.add("hidden");
  $("#emotions").classList.remove("hidden");
  document.querySelector("#view-sakina .hero").classList.remove("hidden");
});

// ====== Démarrage ======
$("#author").textContent = AUTHOR;
renderEmotions();
