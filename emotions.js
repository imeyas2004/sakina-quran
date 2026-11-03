// Liste de versets choisis à la main pour chaque état d'esprit.
// Seules les références (sourate:verset) sont écrites ici.
// Le texte arabe, la traduction et l'audio viennent TOUJOURS de l'API.

const AUTHOR = "Rahal imene"; // <-- votre nom

const EMOTIONS = [
  {
  
    id: "anxiete",
    emoji: "🌧️",
    label: "Anxieux(se)",
    ar: "قلق",
    introAr: "حين يضطرب القلب، يذكّرنا القرآن أين نجد الطمأنينة.",
    intro: "Quand le cœur s'agite, le Coran rappelle où trouver l'apaisement.",
    verses: ["13:28", "2:286", "3:173", "9:51", "10:62"]
  },
  {
    id: "tristesse",
    emoji: "💧",
    label: "Triste",
    ar: "حزن",
    introAr: "لست وحدك: هذه الآيات تواسي وتطمئن.",
    intro: "Vous n'êtes pas seul(e) : ces versets consolent et rassurent.",
    verses: ["93:3", "93:5", "94:5", "94:6", "3:139", "12:86"]
  },
  {
    id: "examen",
    emoji: "📚",
    label: "Stressé(e) par un examen",
    ar: "خوف من الامتحان",
    introAr: "دعاء لتيسير الأمر وزيادة العلم.",
    intro: "Une invocation pour faciliter la tâche et accroître la science.",
    verses: ["20:25", "20:26", "20:27", "20:28", "20:114"]
  },
  {
    id: "patience",
    emoji: "⏳",
    label: "Besoin de patience",
    ar: "حاجة إلى الصبر",
    introAr: "الصبر طريق، والله مع الصابرين.",
    intro: "La patience est un chemin, et Allah est avec ceux qui patientent.",
    verses: ["2:153", "2:155", "3:200", "39:10", "16:127"]
  },
  {
    id: "espoir",
    emoji: "🌅",
    label: "En quête d'espoir",
    ar: "البحث عن الأمل",
    introAr: "رحمة الله أوسع من كل شيء.",
    intro: "La miséricorde d'Allah est plus vaste que tout.",
    verses: ["39:53", "65:3", "2:186", "12:87", "40:60"]
  },
  {
    id: "gratitude",
    emoji: "🤲",
    label: "Reconnaissant(e)",
    ar: "الشكر",
    introAr: "الشكر أن نرى النعم من حولنا.",
    intro: "Remercier, c'est voir les bienfaits qui nous entourent.",
    verses: ["14:7", "2:152", "16:18", "55:13", "31:12"]
  },
  {
    id: "egare",
    emoji: "🧭",
    label: "Perdu(e)",
    ar: "الضياع",
    introAr: "طلب الهداية أول خطوة نحوها.",
    intro: "Demander la guidance est déjà un premier pas vers elle.",
    verses: ["1:6", "93:7", "29:69", "2:257", "57:9"]
  },
  {
    id: "colere",
    emoji: "🔥",
    label: "En colère",
    ar: "الغضب",
    introAr: "كظم الغيظ والرد بالتي هي أحسن.",
    intro: "Maîtriser sa colère et répondre par le meilleur.",
    verses: ["3:134", "7:199", "42:37", "41:34", "42:43"]
  },
  {
    id: "remords",
    emoji: "🕊️",
    label: "Plein(e) de remords",
    ar: "الندم",
    introAr: "باب التوبة مفتوح دائماً.",
    intro: "La porte du repentir reste toujours ouverte.",
    verses: ["3:135", "4:110", "66:8", "25:70", "7:23"]
  },
  {
    id: "solitude",
    emoji: "🌙",
    label: "Seul(e)",
    ar: "الوحدة",
    introAr: "الله قريب منك ويسمعك دائماً.",
    intro: "Allah est proche de vous, vous n'êtes jamais seul(e).",
    verses: ["50:16", "57:4", "9:40", "20:46", "2:186"]
  },
  {
    id: "peur",
    emoji: "🛡️",
    label: "Peur",
    ar: "الخوف",
    introAr: "لا تخافوا ولا تحزنوا.",
    intro: "Des versets pour calmer la peur et se sentir en sécurité.",
    verses: ["41:30", "20:68", "28:7", "2:38", "3:175"]
  },
  {
    id: "epreuve",
    emoji: "⛰️",
    label: "Dans l'épreuve",
    ar: "في الابتلاء",
    introAr: "بعد العسر يسر.",
    intro: "Après la difficulté vient la facilité, et l'épreuve a un sens.",
    verses: ["2:216", "2:214", "65:7", "29:2", "94:6"]
  },
  {
    id: "motivation",
    emoji: "🚀",
    label: "Manque de motivation",
    ar: "قلة الهمة",
    introAr: "ابدأ بخطوة، واتكل على الله.",
    intro: "Pour se remettre en route : l'effort, la décision et la confiance en Allah.",
    verses: ["13:11", "53:39", "94:7", "3:159", "9:105"]
  },
  {
    id: "famille",
    emoji: "🏡",
    label: "Pour ma famille",
    ar: "من أجل أسرتي",
    introAr: "البر بالوالدين والمودة في الأسرة.",
    intro: "Le respect des parents, l'affection dans le foyer et l'invocation pour les siens.",
    verses: ["17:23", "17:24", "31:14", "25:74", "30:21"]
  },
  {
    id: "foi",
    emoji: "💚",
    label: "Foi qui faiblit",
    ar: "ضعف الإيمان",
    introAr: "اطلب من الله أن يثبّت قلبك.",
    intro: "Quand le cœur s'éloigne, ces versets aident à le raffermir.",
    verses: ["48:4", "57:16", "3:8", "8:2", "8:24"]
  },
  {
    id: "rizq",
    emoji: "🌾",
    label: "Souci de subsistance",
    ar: "الرزق",
    introAr: "الله هو الرزّاق.",
    intro: "Allah pourvoit à chacun, et la piété ouvre des issues.",
    verses: ["65:2", "65:3", "11:6", "51:22", "71:10"]
  }
];
