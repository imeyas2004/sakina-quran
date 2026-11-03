// ====== Roue (العجلة) : on tourne, la roue s'arrête sur une sourate, puis une question ======
// Tout vient de l'API : noms, nombre de versets, lieu de révélation, verset et traduction.
// Utilise getChapters(), getVerse(), toggleAudio(), stopAudio() (app.js), el(), shuffle(), randInt() (game.js).

const whBox = document.querySelector("#wheel");
const WH_SEGMENTS = 8;
const wh = { segs: [], angle: 0, spinning: false, score: 0, asked: 0, chapters: null };

function whPick() {
  const ids = shuffle(Array.from({ length: 114 }, (_, i) => i + 1)).slice(0, WH_SEGMENTS);
  return ids;
}

function whSvg() {
  const NS = "http://www.w3.org/2000/svg";
  const R = 140, step = 360 / WH_SEGMENTS;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-150 -165 300 315");
  svg.setAttribute("class", "wheel-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Roue des sourates");
  const g = document.createElementNS(NS, "g");
  g.setAttribute("class", "wheel-rot");
  const colors = ["#1f6b5a", "#b88a3b", "#2b8c76", "#8a6a2c", "#164d41", "#d3a64c", "#256f60", "#a37b33"];
  wh.segs.forEach((id, i) => {
    const a0 = ((i * step - 90) * Math.PI) / 180, a1 = (((i + 1) * step - 90) * Math.PI) / 180;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M0 0 L${(R * Math.cos(a0)).toFixed(2)} ${(R * Math.sin(a0)).toFixed(2)} A${R} ${R} 0 0 1 ${(R * Math.cos(a1)).toFixed(2)} ${(R * Math.sin(a1)).toFixed(2)} Z`);
    p.setAttribute("fill", colors[i % colors.length]);
    p.setAttribute("stroke", "#fff");
    p.setAttribute("stroke-width", "2");
    g.appendChild(p);
    const t = document.createElementNS(NS, "text");
    const mid = i * step + step / 2;
    t.setAttribute("transform", `rotate(${mid}) translate(0,-88)`);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", "#fff");
    t.setAttribute("font-size", "17");
    t.setAttribute("font-family", "Amiri, serif");
    t.textContent = wh.chapters[id].arabic;
    g.appendChild(t);
  });
  svg.appendChild(g);
  const hub = document.createElementNS(NS, "circle");
  hub.setAttribute("r", "14"); hub.setAttribute("fill", "#fff"); hub.setAttribute("stroke", "#b88a3b"); hub.setAttribute("stroke-width", "3");
  svg.appendChild(hub);
  const ptr = document.createElementNS(NS, "path"); // la flèche fixe en haut
  ptr.setAttribute("d", "M-12 -163 L12 -163 L0 -138 Z");
  ptr.setAttribute("fill", "#c0392b");
  ptr.setAttribute("stroke", "#fff");
  ptr.setAttribute("stroke-width", "2");
  svg.appendChild(ptr);
  return svg;
}

async function whOpen() {
  stopAudio();
  whBox.innerHTML = "";
  whBox.appendChild(el("h1", "game-title", "Roue · العجلة"));
  whBox.appendChild(el("p", "muted center", "Tourne la roue : elle s'arrête sur une sourate, puis tu réponds à une question."));
  whBox.appendChild(el("p", "ar-sub", "أدِر العجلة وأجب عن السؤال"));
  const msg = el("p", "muted center", "Chargement…");
  whBox.appendChild(msg);
  try {
    wh.chapters = await getChapters();
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger les sourates. Vérifiez votre connexion.";
    const b = el("button", "btn", "Réessayer");
    b.addEventListener("click", whOpen);
    const w = el("div", "center");
    w.appendChild(b);
    whBox.appendChild(w);
    return;
  }
  msg.remove();
  whRender();
}

function whRender() {
  stopAudio();
  Array.from(whBox.querySelectorAll(".wh-dyn")).forEach((n) => n.remove());
  wh.segs = whPick();
  wh.angle = 0;
  wh.spinning = false;
  const dyn = el("div", "wh-dyn");
  dyn.appendChild(el("p", "muted center", "Score : " + wh.score + " / " + wh.asked));
  const holder = el("div", "wheel-holder");
  const svg = whSvg();
  holder.appendChild(svg);
  dyn.appendChild(holder);
  const spin = el("button", "btn", "🎡 Tourner");
  const row = el("div", "center");
  row.appendChild(spin);
  dyn.appendChild(row);
  const out = el("div", "wh-out");
  dyn.appendChild(out);
  whBox.appendChild(dyn);

  const rot = svg.querySelector(".wheel-rot");
  spin.addEventListener("click", () => {
    if (wh.spinning) return;
    wh.spinning = true;
    spin.disabled = true;
    out.innerHTML = "";
    const step = 360 / WH_SEGMENTS;
    const final = 360 * 5 + Math.random() * 360;
    wh.angle = final;
    const quick = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    rot.style.transition = quick ? "none" : "transform 4s cubic-bezier(.12,.6,.1,1)";
    rot.style.transform = "rotate(" + final + "deg)";
    let done = false;
    const stop = () => {
      if (done) return;
      done = true;
      const under = (360 - (final % 360)) % 360; // position d'origine sous la flèche
      const idx = Math.min(WH_SEGMENTS - 1, Math.floor(under / step));
      whQuestion(wh.segs[idx], out, dyn);
    };
    rot.addEventListener("transitionend", stop, { once: true });
    setTimeout(stop, quick ? 50 : 4300);
  });
}

// ---------- Questions sur la sourate où la roue s'arrête ----------
function whOptions(correct, pool) {
  const set = new Set([correct]);
  const list = shuffle(pool.slice());
  for (const x of list) { if (set.size >= 4) break; set.add(x); }
  return shuffle([...set]);
}

async function whQuestion(id, out, dyn) {
  const ch = wh.chapters[id];
  out.innerHTML = "";
  const head = el("div", "verse");
  head.appendChild(el("div", "verse-ref", "La roue s'est arrêtée sur : sourate " + ch.latin + " (" + ch.arabic + ")"));
  out.appendChild(head);

  const kinds = ["number", "count", "meaning"];
  if (ch.place === "makkah" || ch.place === "madinah") kinds.push("place");
  const kind = kinds[randInt(0, kinds.length - 1)];
  let q, qAr, options, answer, verse = null;
  const fmt = (x) => String(x);

  try {
    if (kind === "number") {
      q = "Quel est le numéro de la sourate " + ch.latin + " ?";
      qAr = "ما رقم سورة " + ch.arabic + "؟";
      answer = fmt(id);
      const near = [id - 2, id - 1, id + 1, id + 2, id + 5, id - 5].filter((x) => x >= 1 && x <= 114 && x !== id).map(fmt);
      options = whOptions(answer, near);
    } else if (kind === "count") {
      q = "Combien de versets compte la sourate " + ch.latin + " ?";
      qAr = "كم عدد آيات سورة " + ch.arabic + "؟";
      answer = fmt(ch.verses);
      const near = [ch.verses - 2, ch.verses - 1, ch.verses + 1, ch.verses + 2, ch.verses + 4, ch.verses + 7].filter((x) => x >= 1 && x !== ch.verses).map(fmt);
      options = whOptions(answer, near);
    } else if (kind === "place") {
      q = "La sourate " + ch.latin + " est-elle mecquoise ou médinoise ?";
      qAr = "هل سورة " + ch.arabic + " مكية أم مدنية؟";
      const A = "Mecquoise · مكية", B = "Médinoise · مدنية";
      answer = ch.place === "makkah" ? A : B;
      options = [A, B];
    } else {
      out.appendChild(el("p", "muted center", "Chargement du verset…"));
      const n = randInt(1, ch.verses);
      const others = [];
      while (others.length < 3) {
        const oid = randInt(1, 114);
        if (oid === id) continue;
        others.push(oid + ":" + randInt(1, wh.chapters[oid].verses));
      }
      const [v, ...ov] = await Promise.all([getVerse(id + ":" + n), ...others.map(getVerse)]);
      verse = v;
      const short = (t) => (t.length > 150 ? t.slice(0, 147) + "…" : t);
      answer = short(v.french);
      options = shuffle([answer, ...ov.map((x) => short(x.french))]);
      if (new Set(options).size < 4 || !answer) throw new Error("options");
      out.lastChild.remove();
      q = "Quel est le sens de ce verset ? (" + v.key + ")";
      qAr = "ما معنى هذه الآية؟";
    }
  } catch (err) {
    console.error(err);
    out.innerHTML = "";
    out.appendChild(el("p", "error", "Impossible de charger la question. Vérifiez votre connexion."));
    const b = el("button", "btn", "Tourner encore");
    b.addEventListener("click", whRender);
    const w = el("div", "center");
    w.appendChild(b);
    out.appendChild(w);
    return;
  }

  if (verse) {
    const p = el("p", "arabic", verse.arabic);
    p.lang = "ar";
    p.dir = "rtl";
    head.appendChild(p);
    const play = el("button", "btn ghost", "🔊 Écouter");
    play.addEventListener("click", () => toggleAudio(play, verse.audio));
    const ac = el("div", "actions");
    ac.appendChild(play);
    head.appendChild(ac);
  }
  out.appendChild(el("p", "game-ask", q));
  out.appendChild(el("p", "ar-sub", qAr));

  const box = el("div", verse ? "choices one-col" : "choices");
  const btns = [];
  options.forEach((o) => {
    const b = el("button", "choice", o);
    b.addEventListener("click", () => {
      btns.forEach((x) => (x.disabled = true));
      const good = o === answer;
      wh.asked++;
      if (good) wh.score++;
      b.classList.add(good ? "correct" : "wrong");
      btns.find((x) => x.textContent === answer).classList.add("correct");
      Store.set("wheel", { best: Math.max((Store.get("wheel", { best: 0 }) || {}).best || 0, wh.score) });
      markToday();
      const fb = el("div", "feedback " + (good ? "ok" : "no"));
      fb.appendChild(el("strong", "", good ? "Bonne réponse ! ✅ أحسنت" : "Pas tout à fait. La bonne réponse : " + answer));
      fb.appendChild(el("p", "muted", "Score : " + wh.score + " / " + wh.asked));
      const again = el("button", "btn", "🎡 Tourner encore");
      again.addEventListener("click", whRender);
      fb.appendChild(again);
      out.appendChild(fb);
      fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    btns.push(b);
    box.appendChild(b);
  });
  out.appendChild(box);
}

document.querySelector('.tab[data-view="wheel"]').addEventListener("click", () => { if (!wh.chapters || !whBox.querySelector(".wh-dyn")) whOpen(); });
