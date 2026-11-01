// ====== Extras : favori + image à partager sur les versets, et mode sombre ======

// Découpe un texte en lignes qui tiennent dans la largeur donnée
function wrapLines(ctx, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (line && ctx.measureText(test).width > maxW) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Crée une image du verset, puis la partage (téléphone) ou la télécharge (ordinateur)
async function verseImage(v, chapters) {
  const [s, a] = v.key.split(":").map(Number);
  const ch = chapters[s];
  const W = 1080, H = 1350, PAD = 100;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  try {
    await document.fonts.load("48px Amiri");
    await document.fonts.load("32px Inter");
  } catch (e) { /* polices indisponibles : police par défaut */ }

  // Fond et cadre
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1f6b5a");
  g.addColorStop(1, "#164d41");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#b88a3b";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Titre
  ctx.direction = "ltr";
  ctx.fillStyle = "#e8d6a8";
  ctx.font = "600 38px Inter, sans-serif";
  ctx.fillText("Sakîna", W / 2, 130);

  // Verset en arabe : la taille diminue si le verset est long
  const maxW = W - 2 * PAD;
  ctx.direction = "rtl";
  ctx.fillStyle = "#ffffff";
  let lines = [];
  let lh = 0;
  for (const size of [64, 56, 48, 42, 36, 32, 28]) {
    ctx.font = size + "px Amiri, serif";
    lines = wrapLines(ctx, v.arabic, maxW);
    lh = size * 1.9;
    if (lines.length * lh <= 600) break;
  }
  let y = 250 + lh * 0.6;
  lines.forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += lh;
  });

  // Traduction française
  ctx.direction = "ltr";
  ctx.fillStyle = "#e9efee";
  let fLines = [];
  let flh = 0;
  for (const size of [34, 30, 27, 24, 21]) {
    ctx.font = "italic " + size + "px Inter, sans-serif";
    fLines = wrapLines(ctx, v.french, maxW);
    flh = size * 1.5;
    if (fLines.length * flh <= 330) break;
  }
  y += 30;
  fLines.forEach((line) => {
    ctx.fillText(line, W / 2, y);
    y += flh;
  });

  // Référence et source
  ctx.fillStyle = "#e8d6a8";
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText("Sourate " + ch.latin + " · " + s + ":" + a, W / 2, H - 150);
  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText("Texte et audio : Quran.com · Traduction : Hamidullah", W / 2, H - 100);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("image impossible");
  const file = new File([blob], "sakina-" + s + "-" + a + ".png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "Sakîna" }); } catch (e) { /* annulé */ }
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Ajoute « Favori » et « Image » sous un verset (appelé par buildCard dans app.js)
function attachExtras(card, v, chapters) {
  const actions = card.querySelector(".actions");
  if (!actions) return;
  actions.appendChild(favButton(v.key));
  const img = document.createElement("button");
  img.className = "btn ghost";
  img.textContent = "🖼 Image";
  img.addEventListener("click", async () => {
    img.disabled = true;
    img.textContent = "Création…";
    let label = "🖼 Image";
    try {
      await verseImage(v, chapters);
    } catch (err) {
      console.error(err);
      label = "Échec";
    }
    img.textContent = label;
    img.disabled = false;
    if (label === "Échec") setTimeout(() => (img.textContent = "🖼 Image"), 1800);
  });
  actions.appendChild(img);
}

// ====== Mode sombre ======
const themeBtn = document.querySelector("#theme");

function applyTheme(t) {
  if (t === "dark") document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", t === "dark" ? "Passer au mode clair" : "Passer au mode sombre");
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeBtn.addEventListener("click", () => {
  const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(t);
  try { localStorage.setItem("sakina:theme", t); } catch (e) { /* ignoré */ }
});
