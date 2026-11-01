// ====== Données de l'utilisateur : favoris, série de jours, scores ======
// Tout est gardé dans le navigateur de la personne (localStorage). Rien n'est envoyé sur internet.

const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("sakina:" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("sakina:" + key, JSON.stringify(value));
    } catch (e) { /* stockage indisponible : on continue sans */ }
  }
};

// ---------- Dates ----------
function dateStr(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function todayStr() {
  return dateStr(new Date());
}

// ---------- Statistiques ----------
function getStats() {
  const s = Store.get("stats", null) || {};
  return {
    played: s.played || 0,
    best: Object.assign({ game: 0, comp: 0, daily: 0 }, s.best),
    days: Array.isArray(s.days) ? s.days : []
  };
}

function saveDay(stats) {
  const t = todayStr();
  if (!stats.days.includes(t)) stats.days.push(t);
  stats.days = stats.days.slice(-400);
}

// Une activité aujourd'hui (écoute, favori…) : compte pour la série
function markToday() {
  const s = getStats();
  if (s.days.includes(todayStr())) return;
  saveDay(s);
  Store.set("stats", s);
}

// Fin d'une partie : kind = "game" | "comp" | "daily"
function recordResult(kind, score) {
  const s = getStats();
  s.played++;
  s.best[kind] = Math.max(s.best[kind] || 0, score);
  saveDay(s);
  Store.set("stats", s);
}

// Nombre de jours consécutifs d'activité (jusqu'à aujourd'hui ou hier)
function streak() {
  const days = new Set(getStats().days);
  const d = new Date();
  if (!days.has(dateStr(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dateStr(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---------- Favoris ----------
function getFavs() {
  const f = Store.get("favs", []);
  return Array.isArray(f) ? f : [];
}
function isFav(key) {
  return getFavs().includes(key);
}
function toggleFav(key) {
  let f = getFavs();
  if (f.includes(key)) {
    f = f.filter((k) => k !== key);
  } else {
    f.push(key);
    markToday();
  }
  Store.set("favs", f);
  return f.includes(key);
}

function favButton(key) {
  const b = document.createElement("button");
  b.className = "btn ghost fav";
  const paint = () => {
    const on = isFav(key);
    b.textContent = on ? "⭐ Favori" : "☆ Favori";
    b.setAttribute("aria-pressed", on ? "true" : "false");
  };
  b.addEventListener("click", () => {
    toggleFav(key);
    paint();
  });
  paint();
  return b;
}
