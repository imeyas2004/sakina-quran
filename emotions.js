// Liste de versets choisis à la main pour chaque état d'esprit.
// Seules les références (sourate:verset) sont écrites ici.
// Le texte arabe, la traduction et l'audio viennent TOUJOURS de l'API.

const AUTHOR = "Rahal imene"; // <-- votre nom

const EMOTIONS = [
  {
    id: "anxiete",
    emoji: "🌧️",
    label: "Anxieux(se)",
    intro: "Quand le cœur s'agite, le Coran rappelle où trouver l'apaisement.",
    verses: ["13:28", "2:286", "3:173", "9:51", "10:62"]
  },
  {
    id: "tristesse",
    emoji: "💧",
    label: "Triste",
    intro: "Vous n'êtes pas seul(e) : ces versets consolent et rassurent.",
    verses: ["93:3", "93:5", "94:5", "94:6", "3:139", "12:86"]
  },
  {
    id: "examen",
    emoji: "📚",
    label: "Stressé(e) par un examen",
    intro: "Une invocation pour faciliter la tâche et accroître la science.",
    verses: ["20:25", "20:26", "20:27", "20:28", "20:114"]
  },
  {
    id: "patience",
    emoji: "⏳",
    label: "Besoin de patience",
    intro: "La patience est un chemin, et Allah est avec ceux qui patientent.",
    verses: ["2:153", "2:155", "3:200", "39:10", "16:127"]
  },
  {
    id: "espoir",
    emoji: "🌅",
    label: "En quête d'espoir",
    intro: "La miséricorde d'Allah est plus vaste que tout.",
    verses: ["39:53", "65:3", "2:186", "12:87", "40:60"]
  },
  {
    id: "gratitude",
    emoji: "🤲",
    label: "Reconnaissant(e)",
    intro: "Remercier, c'est voir les bienfaits qui nous entourent.",
    verses: ["14:7", "2:152", "16:18", "55:13", "31:12"]
  },
  {
    id: "egare",
    emoji: "🧭",
    label: "Perdu(e)",
    intro: "Demander la guidance est déjà un premier pas vers elle.",
    verses: ["1:6", "93:7", "29:69", "2:257", "57:9"]
  },
  {
    id: "colere",
    emoji: "🔥",
    label: "En colère",
    intro: "Maîtriser sa colère et répondre par le meilleur.",
    verses: ["3:134", "7:199", "42:37", "41:34", "42:43"]
  },
  {
    id: "remords",
    emoji: "🕊️",
    label: "Plein(e) de remords",
    intro: "La porte du repentir reste toujours ouverte.",
    verses: ["3:135", "4:110", "66:8", "25:70", "7:23"]
  }
];
