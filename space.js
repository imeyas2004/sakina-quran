// ====== Mon espace : progression + versets favoris ======
// Utilise getChapters(), getVerse(), buildCard(), stopAudio() (app.js), el() (game.js)
// et les fonctions de store.js.

const spaceBox = document.querySelector("#space");

function tile(icon, value, label) {
  const t = el("div", "tile");
  t.appendChild(el("div", "tile-icon", icon));
  t.appendChild(el("div", "tile-num", String(value)));
  t.appendChild(el("div", "tile-label", label));
  return t;
}

async function renderSpace() {
  stopAudio();
  const s = getStats();
  const favs = getFavs();
  const n = streak();
  spaceBox.innerHTML = "";
  spaceBox.appendChild(el("h1", "game-title", "Mon espace"));
  spaceBox.appendChild(el("p", "muted center", "Vos données restent sur cet appareil, dans votre navigateur."));

  const tiles = el("div", "stats");
  tiles.appendChild(tile("🔥", n, n > 1 ? "jours de suite" : "jour de suite"));
  tiles.appendChild(tile("🎮", s.played, "parties jouées"));
  tiles.appendChild(tile("🏆", s.best.game + "/10", "meilleur score – Jeu"));
  tiles.appendChild(tile("🧠", s.best.comp + "/5", "meilleur score – Complète"));
  tiles.appendChild(tile("📅", s.best.daily + "/10", "meilleur Défi du jour"));
  tiles.appendChild(tile("⭐", favs.length, favs.length > 1 ? "versets favoris" : "verset favori"));
  spaceBox.appendChild(tiles);

  spaceBox.appendChild(el("h2", "space-title", "Mes versets favoris"));
  const list = el("div", "");
  spaceBox.appendChild(list);

  if (!favs.length) {
    list.appendChild(el("p", "muted center", "Aucun favori pour l'instant. Cliquez sur « ☆ Favori » sous un verset pour le garder ici."));
    return;
  }
  list.appendChild(el("p", "muted center", "Chargement des favoris…"));
  try {
    const chapters = await getChapters();
    const verses = await Promise.all(favs.slice().reverse().map(getVerse)); // les plus récents d'abord
    list.innerHTML = "";
    verses.forEach((v) => list.appendChild(buildCard(v, chapters)));
  } catch (err) {
    console.error(err);
    list.innerHTML = "";
    list.appendChild(el("p", "error", "Impossible de charger vos favoris. Vérifiez votre connexion."));
  }
}

document.querySelector('.tab[data-view="me"]').addEventListener("click", renderSpace);
