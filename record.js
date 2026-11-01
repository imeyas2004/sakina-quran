// ====== « Récite et compare » ======
// L'utilisateur enregistre sa récitation avec le micro, puis la compare à celle du récitateur.
// L'enregistrement reste dans le navigateur : il n'est jamais envoyé sur internet.
// Utilise stopAudio() défini dans app.js.

let playing = []; // sons de « Récite et compare » en cours de lecture
let mineHook = null; // fonction appelée quand la séquence s'arrête (ex. bouton « Répéter »)

function runMineHook() {
  if (mineHook) { const h = mineHook; mineHook = null; h(); }
}

function stopMine() {
  playing.forEach((a) => a.pause());
  playing = [];
  runMineHook();
}

// Joue des sons les uns après les autres (ex. récitateur, puis vous)
function playSequence(urls, onDone) {
  stopAudio(); // coupe le lecteur principal et les sons en cours
  mineHook = onDone || null;
  const list = urls.map((u) => new Audio(u));
  playing = list;
  list.forEach((a, i) => {
    a.addEventListener("ended", () => {
      if (playing !== list) return;
      if (list[i + 1]) list[i + 1].play().catch(() => {});
      else { playing = []; runMineHook(); }
    });
  });
  list[0].play().catch(() => {});
}

// Démarre le micro. Renvoie un objet avec stop() qui rend l'enregistrement (Blob).
async function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
    throw new Error("unsupported");
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const finished = new Promise((resolve) => {
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop()); // éteint le micro
      resolve(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
    };
  });
  recorder.start();
  return { stop: () => { recorder.stop(); return finished; } };
}

function attachRecorder(card, v) {
  const actions = card.querySelector(".actions");
  const recBtn = document.createElement("button");
  recBtn.className = "btn ghost";
  recBtn.textContent = "🎙 Réciter";
  actions.appendChild(recBtn);

  const box = document.createElement("div");
  box.className = "recbox hidden";
  const status = document.createElement("p");
  status.className = "rec-status";
  const tools = document.createElement("div");
  tools.className = "actions hidden";
  const mineBtn = document.createElement("button");
  mineBtn.className = "btn";
  mineBtn.textContent = "▶ Ma récitation";
  const cmpBtn = document.createElement("button");
  cmpBtn.className = "btn";
  cmpBtn.textContent = "⇄ Comparer";
  tools.appendChild(mineBtn);
  tools.appendChild(cmpBtn);
  const note = document.createElement("p");
  note.className = "rec-note muted";
  note.textContent = "Comparer = le récitateur d'abord, puis vous. Votre enregistrement reste sur votre appareil.";
  box.appendChild(status);
  box.appendChild(tools);
  box.appendChild(note);
  card.appendChild(box);

  let session = null; // enregistrement en cours
  let myUrl = null;   // adresse de votre enregistrement

  recBtn.addEventListener("click", async () => {
    if (session) {
      // Arrêter l'enregistrement
      const s = session;
      session = null;
      recBtn.classList.remove("recording");
      recBtn.textContent = "🎙 Refaire";
      const blob = await s.stop();
      if (myUrl) URL.revokeObjectURL(myUrl);
      myUrl = URL.createObjectURL(blob);
      status.textContent = "Enregistrement terminé. Écoutez-vous ou comparez.";
      tools.classList.remove("hidden");
      return;
    }
    // Commencer l'enregistrement
    stopAudio();
    box.classList.remove("hidden");
    tools.classList.add("hidden");
    try {
      session = await startRecording();
      recBtn.classList.add("recording");
      recBtn.textContent = "⏹ Arrêter";
      status.textContent = "Enregistrement… récitez le verset, puis cliquez sur Arrêter.";
    } catch (err) {
      console.error(err);
      status.textContent = err.message === "unsupported"
        ? "Votre navigateur ne permet pas l'enregistrement."
        : "Micro non autorisé. Autorisez le micro dans le navigateur, puis réessayez.";
    }
  });

  mineBtn.addEventListener("click", () => myUrl && playSequence([myUrl]));
  cmpBtn.addEventListener("click", () => {
    if (!myUrl) return;
    playSequence(v.audio ? [v.audio, myUrl] : [myUrl]);
  });
}
