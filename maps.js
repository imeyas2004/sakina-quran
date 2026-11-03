// ====== Cartes mentales (خرائط ذهنية) : plan d'une sourate ou d'une histoire, pour mieux mémoriser ======
// Les TITRES et les découpages ci-dessous sont un résumé simplifié écrit à la main (références seulement).
// Le texte arabe, la traduction et l'audio viennent TOUJOURS de l'API.
// À faire relire par un professeur.
// Utilise getChapters(), getVerse(), buildCard(), stopAudio() (app.js), el() (game.js), rc/reciteStart (recite.js).

// r : liste de passages [début, fin] (même sourate pour un passage)
const MAPS = [
  {
    id: "yusuf", kind: "story", emoji: "🌟", title: "Histoire de Yûsuf", ar: "قصة سيدنا يوسف",
    nodes: [
      { t: "Le rêve de Yûsuf", ar: "رؤيا يوسف", r: [["12:4", "12:6"]] },
      { t: "Le complot des frères", ar: "مكيدة الإخوة", r: [["12:7", "12:18"]] },
      { t: "Vendu en Égypte", ar: "بيع في مصر", r: [["12:19", "12:22"]] },
      { t: "L'épreuve chez al-Azîz", ar: "الفتنة في بيت العزيز", r: [["12:23", "12:35"]] },
      { t: "La prison", ar: "السجن", r: [["12:36", "12:42"]] },
      { t: "Le rêve du roi", ar: "رؤيا الملك", r: [["12:43", "12:49"]] },
      { t: "L'innocence prouvée", ar: "براءة يوسف", r: [["12:50", "12:53"]] },
      { t: "Yûsuf aux trésors du pays", ar: "يوسف على خزائن الأرض", r: [["12:54", "12:57"]] },
      { t: "Les frères viennent en Égypte", ar: "مجيء الإخوة", r: [["12:58", "12:68"]] },
      { t: "La coupe du roi", ar: "صواع الملك", r: [["12:69", "12:79"]] },
      { t: "La tristesse de Yaqûb", ar: "حزن يعقوب", r: [["12:80", "12:87"]] },
      { t: "Yûsuf se fait reconnaître", ar: "الكشف عن الهوية", r: [["12:88", "12:93"]] },
      { t: "Les retrouvailles", ar: "لقاء الأحبة", r: [["12:94", "12:101"]] },
      { t: "Les leçons à retenir", ar: "العبرة", r: [["12:102", "12:111"]] }
    ]
  },
  {
    id: "maryam", kind: "story", emoji: "🌴", title: "Sourate Maryam", ar: "سورة مريم",
    nodes: [
      { t: "L'invocation de Zakariyyâ", ar: "دعاء زكريا", r: [["19:1", "19:11"]] },
      { t: "Yahyâ", ar: "يحيى", r: [["19:12", "19:15"]] },
      { t: "Maryam et la naissance de 'Îsâ", ar: "مريم وولادة عيسى", r: [["19:16", "19:26"]] },
      { t: "Maryam revient auprès des siens", ar: "العودة إلى القوم", r: [["19:27", "19:33"]] },
      { t: "La vérité sur 'Îsâ", ar: "حقيقة عيسى", r: [["19:34", "19:40"]] },
      { t: "Ibrâhîm et son père", ar: "إبراهيم وأبوه", r: [["19:41", "19:50"]] },
      { t: "Mûsâ, Ismâ'îl et Idrîs", ar: "موسى وإسماعيل وإدريس", r: [["19:51", "19:57"]] },
      { t: "Les prophètes et ceux qui sont venus après eux", ar: "الأنبياء والخلف", r: [["19:58", "19:63"]] },
      { t: "Rappels et avertissements", ar: "تذكير وإنذار", r: [["19:64", "19:98"]] }
    ]
  },
  {
    id: "isa", kind: "story", emoji: "🕊️", title: "Histoire de 'Îsâ", ar: "قصة سيدنا عيسى",
    nodes: [
      { t: "L'annonce faite à Maryam", ar: "البشارة", r: [["3:45", "3:47"]] },
      { t: "Naissance et paroles dans le berceau", ar: "الميلاد والمهد", r: [["19:16", "19:34"]] },
      { t: "Ses miracles et son message", ar: "معجزاته ورسالته", r: [["3:48", "3:51"]] },
      { t: "Les apôtres (hawâriyyûn)", ar: "الحواريون", r: [["3:52", "3:54"]] },
      { t: "Allah l'élève vers Lui", ar: "رفعه", r: [["3:55", "3:59"]] },
      { t: "La table servie", ar: "المائدة", r: [["5:112", "5:115"]] },
      { t: "Le témoignage de 'Îsâ", ar: "شهادة عيسى", r: [["5:116", "5:118"]] },
      { t: "Son annonce du Prophète", ar: "البشارة بأحمد", r: [["61:6", "61:6"], ["61:14", "61:14"]] }
    ]
  },
  {
    id: "baqara", kind: "surah", emoji: "🐄", title: "Sourate al-Baqara", ar: "سورة البقرة",
    nodes: [
      { t: "Les trois groupes : croyants, mécréants, hypocrites", ar: "المؤمنون والكافرون والمنافقون", r: [["2:1", "2:20"]] },
      { t: "Appel à adorer Allah", ar: "دعوة إلى العبادة", r: [["2:21", "2:29"]] },
      { t: "Âdam, le khalîfa", ar: "آدم والخلافة", r: [["2:30", "2:39"]] },
      { t: "Les Banû Isrâ'îl", ar: "بنو إسرائيل", r: [["2:40", "2:123"]] },
      { t: "Ibrâhîm et la Kaaba", ar: "إبراهيم والكعبة", r: [["2:124", "2:141"]] },
      { t: "Le changement de qibla", ar: "تحويل القبلة", r: [["2:142", "2:152"]] },
      { t: "Patience et piété", ar: "الصبر والبر", r: [["2:153", "2:177"]] },
      { t: "Lois : talion, testament, jeûne", ar: "أحكام: القصاص والصيام", r: [["2:178", "2:188"]] },
      { t: "Le Hajj et la 'Umra", ar: "الحج والعمرة", r: [["2:189", "2:203"]] },
      { t: "Société et famille", ar: "أحكام المجتمع والأسرة", r: [["2:204", "2:242"]] },
      { t: "Tâlût et Jâlût", ar: "طالوت وجالوت", r: [["2:243", "2:252"]] },
      { t: "Âyat al-Kursî", ar: "آية الكرسي", r: [["2:253", "2:257"]] },
      { t: "Ibrâhîm et la résurrection", ar: "إبراهيم والإحياء", r: [["2:258", "2:260"]] },
      { t: "Dépenser dans la voie d'Allah", ar: "الإنفاق", r: [["2:261", "2:274"]] },
      { t: "L'usure et les dettes", ar: "الربا والدَّين", r: [["2:275", "2:283"]] },
      { t: "La fin : foi et invocation", ar: "الخاتمة", r: [["2:284", "2:286"]] }
    ]
  },
  {
    id: "imran", kind: "surah", emoji: "👨‍👩‍👧", title: "Sourate Âl 'Imrân", ar: "سورة آل عمران",
    nodes: [
      { t: "Le Livre et ses versets", ar: "الكتاب وآياته", r: [["3:1", "3:9"]] },
      { t: "La vie d'ici-bas et la piété", ar: "الدنيا والتقوى", r: [["3:10", "3:20"]] },
      { t: "L'amour d'Allah et l'obéissance", ar: "محبة الله والطاعة", r: [["3:21", "3:32"]] },
      { t: "La famille de 'Imrân et Maryam", ar: "آل عمران ومريم", r: [["3:33", "3:44"]] },
      { t: "'Îsâ", ar: "عيسى", r: [["3:45", "3:63"]] },
      { t: "Les gens du Livre", ar: "أهل الكتاب", r: [["3:64", "3:120"]] },
      { t: "La bataille d'Uhud", ar: "غزوة أحد", r: [["3:121", "3:175"]] },
      { t: "Rappels et invocations finales", ar: "الخاتمة والدعاء", r: [["3:176", "3:200"]] }
    ]
  },
  {
    id: "adam", kind: "story", emoji: "🌍", title: "Histoire d'Âdam", ar: "قصة سيدنا آدم",
    nodes: [
      { t: "Âdam, le khalîfa sur terre", ar: "خليفة في الأرض", r: [["2:30", "2:33"]] },
      { t: "Iblîs refuse de se prosterner", ar: "إبليس يأبى السجود", r: [["2:34", "2:34"], ["7:11", "7:18"]] },
      { t: "Le jardin et l'arbre", ar: "الجنة والشجرة", r: [["2:35", "2:36"], ["7:19", "7:22"], ["20:117", "20:121"]] },
      { t: "Le repentir d'Âdam", ar: "توبة آدم", r: [["2:37", "2:39"], ["7:23", "7:25"], ["20:122", "20:123"]] }
    ]
  },
  {
    id: "nuh", kind: "story", emoji: "🚢", title: "Histoire de Nûh", ar: "قصة سيدنا نوح",
    nodes: [
      { t: "Il avertit son peuple", ar: "إنذار قومه", r: [["11:25", "11:35"]] },
      { t: "L'appel jour et nuit", ar: "دعوته ليلاً ونهاراً", r: [["71:1", "71:20"]] },
      { t: "Le refus de son peuple", ar: "إعراض قومه", r: [["71:21", "71:24"]] },
      { t: "La construction de l'arche", ar: "بناء السفينة", r: [["11:36", "11:41"]] },
      { t: "Le déluge", ar: "الطوفان", r: [["11:42", "11:44"]] },
      { t: "Le fils de Nûh", ar: "ابن نوح", r: [["11:45", "11:47"]] },
      { t: "Le débarquement", ar: "الهبوط من السفينة", r: [["11:48", "11:49"]] },
      { t: "Sa dernière invocation", ar: "دعاؤه الأخير", r: [["71:25", "71:28"]] }
    ]
  },
  {
    id: "hud", kind: "story", emoji: "🏜️", title: "Histoire de Hûd", ar: "قصة سيدنا هود",
    nodes: [
      { t: "L'appel à 'Âd", ar: "دعوة عاد", r: [["7:65", "7:69"]] },
      { t: "Leur refus et leur sort", ar: "إعراضهم وهلاكهم", r: [["7:70", "7:72"]] },
      { t: "Le dialogue de Hûd avec son peuple", ar: "حوار هود مع قومه", r: [["11:50", "11:60"]] }
    ]
  },
  {
    id: "salih", kind: "story", emoji: "🐪", title: "Histoire de Sâlih", ar: "قصة سيدنا صالح",
    nodes: [
      { t: "L'appel à Thamûd", ar: "دعوة ثمود", r: [["7:73", "7:74"]] },
      { t: "L'orgueil et le châtiment", ar: "الكبر والعذاب", r: [["7:75", "7:79"]] },
      { t: "Sâlih dans la sourate Hûd", ar: "صالح في سورة هود", r: [["11:61", "11:68"]] },
      { t: "Le plus malheureux d'entre eux", ar: "أشقى القوم", r: [["91:11", "91:15"]] }
    ]
  },
  {
    id: "ibrahim", kind: "story", emoji: "🔥", title: "Histoire d'Ibrâhîm", ar: "قصة سيدنا إبراهيم",
    nodes: [
      { t: "À la recherche de son Seigneur", ar: "البحث عن الله", r: [["6:74", "6:83"]] },
      { t: "Ibrâhîm et son père", ar: "إبراهيم وأبوه", r: [["19:41", "19:50"]] },
      { t: "Les idoles et le feu", ar: "الأصنام والنار", r: [["21:51", "21:70"]] },
      { t: "Le roi et la résurrection", ar: "الملك والإحياء", r: [["2:258", "2:260"]] },
      { t: "La Kaaba", ar: "بناء الكعبة", r: [["2:124", "2:129"]] },
      { t: "Son invocation pour La Mecque", ar: "دعاؤه لمكة", r: [["14:35", "14:41"]] },
      { t: "Le sacrifice", ar: "الذبح", r: [["37:99", "37:113"]] }
    ]
  },
  {
    id: "lut", kind: "story", emoji: "🌅", title: "Histoire de Lût", ar: "قصة سيدنا لوط",
    nodes: [
      { t: "L'appel de Lût", ar: "دعوة لوط", r: [["7:80", "7:84"]] },
      { t: "Les anges et le châtiment", ar: "الملائكة والعذاب", r: [["11:77", "11:83"]] },
      { t: "Lût dans la sourate ash-Shu'arâ'", ar: "لوط في سورة الشعراء", r: [["26:160", "26:175"]] }
    ]
  },
  {
    id: "shuayb", kind: "story", emoji: "⚖️", title: "Histoire de Shu'ayb", ar: "قصة سيدنا شعيب",
    nodes: [
      { t: "L'appel : honnêteté dans les mesures", ar: "دعوة شعيب", r: [["7:85", "7:87"]] },
      { t: "Le refus et le sort de Madyan", ar: "إعراض مدين وهلاكهم", r: [["7:88", "7:93"]] },
      { t: "Shu'ayb dans la sourate Hûd", ar: "شعيب في سورة هود", r: [["11:84", "11:95"]] }
    ]
  },
  {
    id: "ayyub", kind: "story", emoji: "🌿", title: "Histoire d'Ayyûb", ar: "قصة سيدنا أيوب",
    nodes: [
      { t: "L'épreuve et l'invocation", ar: "البلاء والدعاء", r: [["21:83", "21:84"]] },
      { t: "La guérison et la patience", ar: "الشفاء والصبر", r: [["38:41", "38:44"]] }
    ]
  },
  {
    id: "yunus", kind: "story", emoji: "🐋", title: "Histoire de Yûnus", ar: "قصة سيدنا يونس",
    nodes: [
      { t: "Il quitte son peuple, le poisson l'avale", ar: "الحوت", r: [["37:139", "37:142"]] },
      { t: "Il glorifie Allah et il est sauvé", ar: "التسبيح والنجاة", r: [["37:143", "37:148"]] },
      { t: "L'invocation dans les ténèbres", ar: "دعاء الظلمات", r: [["21:87", "21:88"]] },
      { t: "Son peuple a cru", ar: "آمن قومه", r: [["10:98", "10:98"]] }
    ]
  },
  {
    id: "musa", kind: "story", emoji: "🌊", title: "Histoire de Mûsâ", ar: "قصة سيدنا موسى",
    nodes: [
      { t: "Naissance et la mère de Mûsâ", ar: "ميلاده وأمه", r: [["28:7", "28:13"]] },
      { t: "Le jeune homme et la fuite", ar: "القتل والفرار", r: [["28:14", "28:21"]] },
      { t: "Madyan et les deux filles", ar: "مدين والفتاتان", r: [["28:22", "28:28"]] },
      { t: "Le feu et la mission", ar: "النار والرسالة", r: [["20:9", "20:36"]] },
      { t: "Face à Fir'awn et aux magiciens", ar: "فرعون والسحرة", r: [["7:103", "7:126"]] },
      { t: "La traversée de la mer", ar: "عبور البحر", r: [["26:52", "26:68"]] },
      { t: "Le veau d'or", ar: "العجل", r: [["20:83", "20:98"]] },
      { t: "Mûsâ et al-Khidr", ar: "موسى والخضر", r: [["18:60", "18:82"]] }
    ]
  },
  {
    id: "dawud", kind: "story", emoji: "🛡️", title: "Histoire de Dâwûd", ar: "قصة سيدنا داود",
    nodes: [
      { t: "Dâwûd et Jâlût", ar: "داود وجالوت", r: [["2:249", "2:251"]] },
      { t: "Sa force et sa royauté", ar: "قوته وملكه", r: [["38:17", "38:20"]] },
      { t: "Le litige et la repentance", ar: "الخصمان والتوبة", r: [["38:21", "38:25"]] },
      { t: "Le fer assoupli", ar: "إلانة الحديد", r: [["34:10", "34:11"]] }
    ]
  },
  {
    id: "sulayman", kind: "story", emoji: "🐜", title: "Histoire de Sulaymân", ar: "قصة سيدنا سليمان",
    nodes: [
      { t: "Le savoir, les armées et la fourmi", ar: "العلم والجنود والنملة", r: [["27:15", "27:19"]] },
      { t: "La huppe", ar: "الهدهد", r: [["27:20", "27:28"]] },
      { t: "La lettre et le cadeau", ar: "الكتاب والهدية", r: [["27:29", "27:35"]] },
      { t: "Le trône et le palais", ar: "العرش والصرح", r: [["27:36", "27:44"]] },
      { t: "L'épreuve et l'invocation", ar: "الفتنة والدعاء", r: [["38:30", "38:40"]] },
      { t: "Le vent et les djinns", ar: "الريح والجن", r: [["34:12", "34:14"]] }
    ]
  },
  {
    id: "zakariyya", kind: "story", emoji: "🙏", title: "Histoire de Zakariyyâ", ar: "قصة سيدنا زكريا",
    nodes: [
      { t: "Il demande un enfant", ar: "طلب الولد", r: [["3:37", "3:41"]] },
      { t: "L'annonce de Yahyâ", ar: "بشارة يحيى", r: [["19:2", "19:11"]] },
      { t: "Son invocation", ar: "دعاء زكريا", r: [["21:89", "21:90"]] }
    ]
  },
  {
    id: "kahf-people", kind: "story", emoji: "⛰️", title: "Les gens de la caverne", ar: "أصحاب الكهف",
    nodes: [
      { t: "Les jeunes fuient pour leur foi", ar: "فتية آمنوا بربهم", r: [["18:9", "18:12"]] },
      { t: "Leur foi et la caverne", ar: "الإيمان والكهف", r: [["18:13", "18:16"]] },
      { t: "Le sommeil dans la caverne", ar: "النوم في الكهف", r: [["18:17", "18:18"]] },
      { t: "Le réveil", ar: "الاستيقاظ", r: [["18:19", "18:22"]] },
      { t: "« Si Allah le veut » et la durée", ar: "إن شاء الله ومدة اللبث", r: [["18:23", "18:26"]] }
    ]
  },
  {
    id: "dhulqarnayn", kind: "story", emoji: "🧭", title: "Histoire de Dhul-Qarnayn", ar: "قصة ذي القرنين",
    nodes: [
      { t: "Vers l'ouest", ar: "نحو المغرب", r: [["18:83", "18:88"]] },
      { t: "Vers l'est", ar: "نحو المشرق", r: [["18:89", "18:91"]] },
      { t: "Le rempart contre Yajûj et Majûj", ar: "السد", r: [["18:92", "18:98"]] }
    ]
  },
  {
    id: "luqman", kind: "story", emoji: "💎", title: "Les conseils de Luqmân", ar: "وصايا لقمان",
    nodes: [
      { t: "Remercier Allah et ne pas Lui associer", ar: "الشكر وعدم الشرك", r: [["31:12", "31:13"]] },
      { t: "Les parents", ar: "الوالدان", r: [["31:14", "31:15"]] },
      { t: "Allah sait tout, la prière et le bien", ar: "علم الله والصلاة", r: [["31:16", "31:17"]] },
      { t: "L'humilité et la modestie", ar: "التواضع", r: [["31:18", "31:19"]] }
    ]
  },
  {
    id: "fatiha", kind: "surah", emoji: "🌙", title: "Sourate al-Fâtiha", ar: "سورة الفاتحة",
    nodes: [
      { t: "Louange à Allah", ar: "الحمد لله", r: [["1:1", "1:4"]] },
      { t: "Adoration et aide", ar: "العبادة والاستعانة", r: [["1:5", "1:5"]] },
      { t: "La guidance", ar: "الهداية", r: [["1:6", "1:7"]] }
    ]
  },
  {
    id: "kahf", kind: "surah", emoji: "⛰️", title: "Sourate al-Kahf", ar: "سورة الكهف",
    nodes: [
      { t: "Louange à Allah et avertissement", ar: "الحمد والإنذار", r: [["18:1", "18:8"]] },
      { t: "Les gens de la caverne (la foi)", ar: "أصحاب الكهف", r: [["18:9", "18:26"]] },
      { t: "Patience avec les croyants", ar: "الصبر مع المؤمنين", r: [["18:27", "18:31"]] },
      { t: "Les deux jardins (l'argent)", ar: "صاحب الجنتين", r: [["18:32", "18:44"]] },
      { t: "La vie d'ici-bas et Iblîs", ar: "الدنيا وإبليس", r: [["18:45", "18:59"]] },
      { t: "Mûsâ et al-Khidr (la science)", ar: "موسى والخضر", r: [["18:60", "18:82"]] },
      { t: "Dhul-Qarnayn (le pouvoir)", ar: "ذو القرنين", r: [["18:83", "18:98"]] },
      { t: "La fin et la conclusion", ar: "الخاتمة", r: [["18:99", "18:110"]] }
    ]
  },
  {
    id: "yasin", kind: "surah", emoji: "💠", title: "Sourate Yâ-Sîn", ar: "سورة يس",
    nodes: [
      { t: "Le Coran et l'avertissement", ar: "القرآن والإنذار", r: [["36:1", "36:12"]] },
      { t: "Les gens de la cité", ar: "أصحاب القرية", r: [["36:13", "36:32"]] },
      { t: "Les signes d'Allah", ar: "آيات الله", r: [["36:33", "36:47"]] },
      { t: "La résurrection", ar: "البعث", r: [["36:48", "36:54"]] },
      { t: "Paradis et enfer", ar: "الجنة والنار", r: [["36:55", "36:68"]] },
      { t: "La création et la conclusion", ar: "الخلق والخاتمة", r: [["36:69", "36:83"]] }
    ]
  },
  {
    id: "mulk", kind: "surah", emoji: "👑", title: "Sourate al-Mulk", ar: "سورة الملك",
    nodes: [
      { t: "La royauté et la création", ar: "الملك والخلق", r: [["67:1", "67:5"]] },
      { t: "Le châtiment des mécréants", ar: "عذاب الكافرين", r: [["67:6", "67:11"]] },
      { t: "Ceux qui craignent leur Seigneur", ar: "الذين يخشون ربهم", r: [["67:12", "67:14"]] },
      { t: "La terre mise à votre service", ar: "الأرض ذلولا", r: [["67:15", "67:21"]] },
      { t: "Guidés et égarés, l'eau", ar: "الهدى والضلال", r: [["67:22", "67:30"]] }
    ]
  },
  {
    id: "rahman", kind: "surah", emoji: "🌺", title: "Sourate ar-Rahmân", ar: "سورة الرحمن",
    nodes: [
      { t: "Le Coran et la création", ar: "تعليم القرآن والخلق", r: [["55:1", "55:13"]] },
      { t: "L'homme, les djinns et les mers", ar: "الإنسان والجن والبحار", r: [["55:14", "55:30"]] },
      { t: "Le jugement", ar: "الحساب", r: [["55:31", "55:45"]] },
      { t: "Les jardins du paradis", ar: "الجنات", r: [["55:46", "55:78"]] }
    ]
  },
  {
    id: "waqia", kind: "surah", emoji: "⚖️", title: "Sourate al-Wâqi'a", ar: "سورة الواقعة",
    nodes: [
      { t: "L'événement et les trois groupes", ar: "الواقعة وأصناف الناس", r: [["56:1", "56:12"]] },
      { t: "Les premiers (as-sâbiqûn)", ar: "السابقون", r: [["56:13", "56:26"]] },
      { t: "Les gens de la droite", ar: "أصحاب اليمين", r: [["56:27", "56:40"]] },
      { t: "Les gens de la gauche", ar: "أصحاب الشمال", r: [["56:41", "56:56"]] },
      { t: "Les signes : création, semence, eau, feu", ar: "آيات الله", r: [["56:57", "56:74"]] },
      { t: "Le Coran et la mort", ar: "القرآن والموت", r: [["56:75", "56:87"]] },
      { t: "Le sort des trois groupes", ar: "مصير الأصناف", r: [["56:88", "56:96"]] }
    ]
  },
  {
    id: "s78", kind: "amma", emoji: "📖", title: "Sourate an-Naba'", ar: "سورة النبأ",
    nodes: [
      { t: "La grande nouvelle", ar: "النبأ العظيم", r: [["78:1", "78:5"]] },
      { t: "Les signes dans la création", ar: "آيات الله في الكون", r: [["78:6", "78:16"]] },
      { t: "Le Jour de la décision", ar: "يوم الفصل", r: [["78:17", "78:30"]] },
      { t: "Le paradis des pieux", ar: "نعيم المتقين", r: [["78:31", "78:36"]] },
      { t: "Ce jour-là, tout le monde se taira", ar: "يوم لا ينطقون", r: [["78:37", "78:40"]] }
    ]
  },
  {
    id: "s79", kind: "amma", emoji: "📖", title: "Sourate an-Nâzi'ât", ar: "سورة النازعات",
    nodes: [
      { t: "Les anges et la résurrection", ar: "الملائكة والبعث", r: [["79:1", "79:14"]] },
      { t: "Mûsâ face à Fir'awn", ar: "موسى وفرعون", r: [["79:15", "79:26"]] },
      { t: "Les signes de la création", ar: "آيات الخلق", r: [["79:27", "79:33"]] },
      { t: "La grande calamité et les deux destins", ar: "الطامة الكبرى", r: [["79:34", "79:41"]] },
      { t: "Quand viendra l'Heure ?", ar: "متى الساعة؟", r: [["79:42", "79:46"]] }
    ]
  },
  {
    id: "s80", kind: "amma", emoji: "📖", title: "Sourate 'Abasa", ar: "سورة عبس",
    nodes: [
      { t: "Le reproche à propos de l'aveugle", ar: "العتاب في شأن الأعمى", r: [["80:1", "80:10"]] },
      { t: "Le Coran est honoré", ar: "القرآن الكريم", r: [["80:11", "80:16"]] },
      { t: "L'ingratitude de l'homme", ar: "كفر الإنسان", r: [["80:17", "80:23"]] },
      { t: "Que l'homme regarde sa nourriture", ar: "فلينظر الإنسان إلى طعامه", r: [["80:24", "80:32"]] },
      { t: "Le jour du grand fracas", ar: "الصاخة", r: [["80:33", "80:42"]] }
    ]
  },
  {
    id: "s81", kind: "amma", emoji: "📖", title: "Sourate at-Takwîr", ar: "سورة التكوير",
    nodes: [
      { t: "Les bouleversements du Jour dernier", ar: "أحداث يوم القيامة", r: [["81:1", "81:14"]] },
      { t: "Serments et vérité du Coran", ar: "القسم وصدق القرآن", r: [["81:15", "81:25"]] },
      { t: "Où allez-vous ?", ar: "فأين تذهبون؟", r: [["81:26", "81:29"]] }
    ]
  },
  {
    id: "s82", kind: "amma", emoji: "📖", title: "Sourate al-Infitâr", ar: "سورة الانفطار",
    nodes: [
      { t: "Le ciel se fend", ar: "انفطار السماء", r: [["82:1", "82:5"]] },
      { t: "Ô homme, qu'est-ce qui t'a trompé ?", ar: "ما غرك؟", r: [["82:6", "82:12"]] },
      { t: "Les justes et les pervers", ar: "الأبرار والفجار", r: [["82:13", "82:19"]] }
    ]
  },
  {
    id: "s83", kind: "amma", emoji: "📖", title: "Sourate al-Mutaffifîn", ar: "سورة المطففين",
    nodes: [
      { t: "Malheur aux fraudeurs", ar: "ويل للمطففين", r: [["83:1", "83:6"]] },
      { t: "Le registre des pervers (Sijjîn)", ar: "كتاب الفجار", r: [["83:7", "83:17"]] },
      { t: "Le registre des justes ('Illiyyûn)", ar: "كتاب الأبرار", r: [["83:18", "83:28"]] },
      { t: "Ceux qui se moquaient des croyants", ar: "السخرية من المؤمنين", r: [["83:29", "83:36"]] }
    ]
  },
  {
    id: "s84", kind: "amma", emoji: "📖", title: "Sourate al-Inshiqâq", ar: "سورة الانشقاق",
    nodes: [
      { t: "Le ciel se déchire", ar: "انشقاق السماء", r: [["84:1", "84:5"]] },
      { t: "Le livre dans la main droite ou dans le dos", ar: "الكتاب باليمين أو وراء الظهر", r: [["84:6", "84:15"]] },
      { t: "Serments et avertissement", ar: "القسم والإنذار", r: [["84:16", "84:25"]] }
    ]
  },
  {
    id: "s85", kind: "amma", emoji: "📖", title: "Sourate al-Burûj", ar: "سورة البروج",
    nodes: [
      { t: "Les gens de la tranchée", ar: "أصحاب الأخدود", r: [["85:1", "85:9"]] },
      { t: "Récompense des croyants, châtiment des persécuteurs", ar: "الجزاء", r: [["85:10", "85:11"]] },
      { t: "La puissance d'Allah et le Coran préservé", ar: "قدرة الله والقرآن المحفوظ", r: [["85:12", "85:22"]] }
    ]
  },
  {
    id: "s86", kind: "amma", emoji: "📖", title: "Sourate at-Târiq", ar: "سورة الطارق",
    nodes: [
      { t: "L'étoile perçante et la création de l'homme", ar: "الطارق وخلق الإنسان", r: [["86:1", "86:10"]] },
      { t: "Une parole décisive", ar: "قول فصل", r: [["86:11", "86:17"]] }
    ]
  },
  {
    id: "s87", kind: "amma", emoji: "📖", title: "Sourate al-A'lâ", ar: "سورة الأعلى",
    nodes: [
      { t: "Glorifie le nom de ton Seigneur", ar: "سبح اسم ربك", r: [["87:1", "87:8"]] },
      { t: "Rappelle : réussit celui qui se purifie", ar: "قد أفلح من تزكى", r: [["87:9", "87:15"]] },
      { t: "L'au-delà est meilleur et plus durable", ar: "والآخرة خير وأبقى", r: [["87:16", "87:19"]] }
    ]
  },
  {
    id: "s88", kind: "amma", emoji: "📖", title: "Sourate al-Ghâshiya", ar: "سورة الغاشية",
    nodes: [
      { t: "Des visages humiliés", ar: "وجوه خاشعة", r: [["88:1", "88:7"]] },
      { t: "Des visages radieux", ar: "وجوه ناعمة", r: [["88:8", "88:16"]] },
      { t: "Regardez la création", ar: "أفلا ينظرون", r: [["88:17", "88:20"]] },
      { t: "Rappelle, tu n'es pas un contraignant", ar: "فذكر", r: [["88:21", "88:26"]] }
    ]
  },
  {
    id: "s89", kind: "amma", emoji: "📖", title: "Sourate al-Fajr", ar: "سورة الفجر",
    nodes: [
      { t: "Serments", ar: "القسم", r: [["89:1", "89:5"]] },
      { t: "'Âd, Thamûd et Fir'awn", ar: "عاد وثمود وفرعون", r: [["89:6", "89:14"]] },
      { t: "L'attitude de l'homme envers l'argent", ar: "موقف الإنسان من المال", r: [["89:15", "89:20"]] },
      { t: "Le Jour où la terre sera broyée", ar: "يوم القيامة", r: [["89:21", "89:26"]] },
      { t: "L'âme apaisée", ar: "النفس المطمئنة", r: [["89:27", "89:30"]] }
    ]
  },
  {
    id: "s90", kind: "amma", emoji: "📖", title: "Sourate al-Balad", ar: "سورة البلد",
    nodes: [
      { t: "La cité et l'homme dans l'épreuve", ar: "البلد وكبد الإنسان", r: [["90:1", "90:10"]] },
      { t: "Le chemin escarpé", ar: "العقبة", r: [["90:11", "90:20"]] }
    ]
  },
  {
    id: "s91", kind: "amma", emoji: "📖", title: "Sourate ash-Shams", ar: "سورة الشمس",
    nodes: [
      { t: "Serments et purification de l'âme", ar: "القسم وتزكية النفس", r: [["91:1", "91:10"]] },
      { t: "Thamûd et la chamelle", ar: "ثمود والناقة", r: [["91:11", "91:15"]] }
    ]
  },
  {
    id: "s92", kind: "amma", emoji: "📖", title: "Sourate al-Layl", ar: "سورة الليل",
    nodes: [
      { t: "Deux voies : celui qui donne, celui qui retient", ar: "طريق المعطي وطريق البخيل", r: [["92:1", "92:11"]] },
      { t: "La guidance appartient à Allah", ar: "إن علينا للهدى", r: [["92:12", "92:21"]] }
    ]
  },
  {
    id: "s93", kind: "amma", emoji: "📖", title: "Sourate ad-Duhâ", ar: "سورة الضحى",
    nodes: [
      { t: "Ton Seigneur ne t'a pas abandonné", ar: "ما ودعك ربك", r: [["93:1", "93:3"]] },
      { t: "Une promesse : le meilleur est à venir", ar: "وللآخرة خير لك", r: [["93:4", "93:8"]] },
      { t: "Ne maltraite pas l'orphelin, évoque le bienfait", ar: "فأما اليتيم", r: [["93:9", "93:11"]] }
    ]
  },
  {
    id: "s94", kind: "amma", emoji: "📖", title: "Sourate ash-Sharh", ar: "سورة الشرح",
    nodes: [
      { t: "Ton cœur ouvert et ton fardeau ôté", ar: "ألم نشرح لك صدرك", r: [["94:1", "94:4"]] },
      { t: "Avec la difficulté vient la facilité", ar: "مع العسر يسرا", r: [["94:5", "94:6"]] },
      { t: "Efforce-toi et tourne-toi vers ton Seigneur", ar: "فارغب", r: [["94:7", "94:8"]] }
    ]
  },
  {
    id: "s95", kind: "amma", emoji: "📖", title: "Sourate at-Tîn", ar: "سورة التين",
    nodes: [
      { t: "Les serments et la plus belle forme", ar: "أحسن تقويم", r: [["95:1", "95:4"]] },
      { t: "La chute et les croyants récompensés", ar: "أسفل سافلين", r: [["95:5", "95:6"]] },
      { t: "Allah est le meilleur des juges", ar: "أحكم الحاكمين", r: [["95:7", "95:8"]] }
    ]
  },
  {
    id: "s96", kind: "amma", emoji: "📖", title: "Sourate al-'Alaq", ar: "سورة العلق",
    nodes: [
      { t: "« Lis » : la première révélation", ar: "اقرأ", r: [["96:1", "96:5"]] },
      { t: "L'homme se rebelle", ar: "إن الإنسان ليطغى", r: [["96:6", "96:14"]] },
      { t: "Avertissement : prosterne-toi et rapproche-toi", ar: "واسجد واقترب", r: [["96:15", "96:19"]] }
    ]
  },
  {
    id: "s97", kind: "amma", emoji: "📖", title: "Sourate al-Qadr", ar: "سورة القدر",
    nodes: [
      { t: "La nuit du Destin", ar: "ليلة القدر", r: [["97:1", "97:3"]] },
      { t: "Les anges descendent, la paix jusqu'à l'aube", ar: "تنزل الملائكة", r: [["97:4", "97:5"]] }
    ]
  },
  {
    id: "s98", kind: "amma", emoji: "📖", title: "Sourate al-Bayyina", ar: "سورة البينة",
    nodes: [
      { t: "La preuve claire", ar: "البينة", r: [["98:1", "98:5"]] },
      { t: "Les pires et les meilleurs des créatures", ar: "شر البرية وخير البرية", r: [["98:6", "98:8"]] }
    ]
  },
  {
    id: "s99", kind: "amma", emoji: "📖", title: "Sourate az-Zalzala", ar: "سورة الزلزلة",
    nodes: [
      { t: "Le grand tremblement", ar: "الزلزلة", r: [["99:1", "99:5"]] },
      { t: "Le poids d'un atome", ar: "مثقال ذرة", r: [["99:6", "99:8"]] }
    ]
  },
  {
    id: "s100", kind: "amma", emoji: "📖", title: "Sourate al-'Âdiyât", ar: "سورة العاديات",
    nodes: [
      { t: "Les coursiers qui galopent", ar: "العاديات ضبحا", r: [["100:1", "100:5"]] },
      { t: "L'ingratitude et l'amour des biens", ar: "كنود", r: [["100:6", "100:8"]] },
      { t: "Le jour où les tombes seront retournées", ar: "بعثرة القبور", r: [["100:9", "100:11"]] }
    ]
  },
  {
    id: "s101", kind: "amma", emoji: "📖", title: "Sourate al-Qâri'a", ar: "سورة القارعة",
    nodes: [
      { t: "Le Fracas", ar: "القارعة", r: [["101:1", "101:5"]] },
      { t: "Les balances lourdes ou légères", ar: "الميزان", r: [["101:6", "101:11"]] }
    ]
  },
  {
    id: "s102", kind: "amma", emoji: "📖", title: "Sourate at-Takâthur", ar: "سورة التكاثر",
    nodes: [
      { t: "La rivalité pour les biens", ar: "ألهاكم التكاثر", r: [["102:1", "102:2"]] },
      { t: "Vous saurez, et vous serez interrogés", ar: "كلا سوف تعلمون", r: [["102:3", "102:8"]] }
    ]
  },
  {
    id: "s103", kind: "amma", emoji: "📖", title: "Sourate al-'Asr", ar: "سورة العصر",
    nodes: [
      { t: "Par le temps, l'homme est en perdition", ar: "والعصر", r: [["103:1", "103:2"]] },
      { t: "Sauf ceux qui croient, font le bien, se recommandent la vérité et la patience", ar: "إلا الذين آمنوا", r: [["103:3", "103:3"]] }
    ]
  },
  {
    id: "s104", kind: "amma", emoji: "📖", title: "Sourate al-Humaza", ar: "سورة الهمزة",
    nodes: [
      { t: "Malheur au calomniateur", ar: "ويل لكل همزة", r: [["104:1", "104:4"]] },
      { t: "Le feu écrasant (al-Hutama)", ar: "الحطمة", r: [["104:5", "104:9"]] }
    ]
  },
  {
    id: "s105", kind: "amma", emoji: "📖", title: "Sourate al-Fîl", ar: "سورة الفيل",
    nodes: [
      { t: "Les gens de l'éléphant : leur ruse", ar: "ألم تر كيف فعل ربك", r: [["105:1", "105:2"]] },
      { t: "Les oiseaux en vols", ar: "طيرا أبابيل", r: [["105:3", "105:5"]] }
    ]
  },
  {
    id: "s106", kind: "amma", emoji: "📖", title: "Sourate Quraysh", ar: "سورة قريش",
    nodes: [
      { t: "La sécurité des voyages de Quraysh", ar: "إيلاف قريش", r: [["106:1", "106:2"]] },
      { t: "Qu'ils adorent le Seigneur de cette Maison", ar: "فليعبدوا رب هذا البيت", r: [["106:3", "106:4"]] }
    ]
  },
  {
    id: "s107", kind: "amma", emoji: "📖", title: "Sourate al-Mâ'ûn", ar: "سورة الماعون",
    nodes: [
      { t: "Celui qui traite le Jugement de mensonge", ar: "يكذب بالدين", r: [["107:1", "107:3"]] },
      { t: "Prière négligée, ostentation, refus de l'aide", ar: "الذين هم عن صلاتهم ساهون", r: [["107:4", "107:7"]] }
    ]
  },
  {
    id: "s108", kind: "amma", emoji: "📖", title: "Sourate al-Kawthar", ar: "سورة الكوثر",
    nodes: [
      { t: "Nous t'avons donné l'abondance", ar: "إنا أعطيناك الكوثر", r: [["108:1", "108:1"]] },
      { t: "Prie et sacrifie pour ton Seigneur", ar: "فصل لربك وانحر", r: [["108:2", "108:2"]] },
      { t: "Ton ennemi est celui qui est coupé", ar: "إن شانئك هو الأبتر", r: [["108:3", "108:3"]] }
    ]
  },
  {
    id: "s109", kind: "amma", emoji: "📖", title: "Sourate al-Kâfirûn", ar: "سورة الكافرون",
    nodes: [
      { t: "Je n'adore pas ce que vous adorez", ar: "لا أعبد ما تعبدون", r: [["109:1", "109:3"]] },
      { t: "À vous votre religion, à moi la mienne", ar: "لكم دينكم ولي دين", r: [["109:4", "109:6"]] }
    ]
  },
  {
    id: "s110", kind: "amma", emoji: "📖", title: "Sourate an-Nasr", ar: "سورة النصر",
    nodes: [
      { t: "La victoire et la conquête", ar: "النصر والفتح", r: [["110:1", "110:2"]] },
      { t: "Glorifie et demande pardon", ar: "فسبح بحمد ربك", r: [["110:3", "110:3"]] }
    ]
  },
  {
    id: "s111", kind: "amma", emoji: "📖", title: "Sourate al-Masad", ar: "سورة المسد",
    nodes: [
      { t: "La perte d'Abû Lahab", ar: "تبت يدا أبي لهب", r: [["111:1", "111:3"]] },
      { t: "Sa femme et la corde de fibres", ar: "وامرأته حمالة الحطب", r: [["111:4", "111:5"]] }
    ]
  },
  {
    id: "s112", kind: "amma", emoji: "📖", title: "Sourate al-Ikhlâs", ar: "سورة الإخلاص",
    nodes: [
      { t: "Allah est Unique et Absolu", ar: "الله أحد الله الصمد", r: [["112:1", "112:2"]] },
      { t: "Il n'a pas engendré et n'a pas été engendré", ar: "لم يلد ولم يولد", r: [["112:3", "112:4"]] }
    ]
  },
  {
    id: "s113", kind: "amma", emoji: "📖", title: "Sourate al-Falaq", ar: "سورة الفلق",
    nodes: [
      { t: "Je cherche refuge auprès du Seigneur de l'aube", ar: "أعوذ برب الفلق", r: [["113:1", "113:2"]] },
      { t: "Contre le mal de la nuit, des sorcières et de l'envieux", ar: "من شر ما خلق", r: [["113:3", "113:5"]] }
    ]
  },
  {
    id: "s114", kind: "amma", emoji: "📖", title: "Sourate an-Nâs", ar: "سورة الناس",
    nodes: [
      { t: "Le Seigneur, le Roi, le Dieu des hommes", ar: "رب الناس ملك الناس إله الناس", r: [["114:1", "114:3"]] },
      { t: "Contre le mal du tentateur furtif", ar: "من شر الوسواس الخناس", r: [["114:4", "114:6"]] }
    ]
  },
  {
    id: "nisa", kind: "surah", emoji: "📚", title: "Sourate an-Nisâ'", ar: "سورة النساء", goal: ["Organiser la famille et la société avec justice, protéger les faibles (femmes, orphelins) et rendre les dépôts à leurs ayants droit.", "تنظيم الأسرة والمجتمع بالعدل، وحماية الضعفاء (النساء واليتامى)، وأداء الأمانات إلى أهلها"],
    nodes: [
      { t: "Piété, orphelins et héritage", ar: "التقوى واليتامى والميراث", r: [["4:1", "4:14"]], k: [["Craignez Allah qui vous a créés d'un seul être (4:1)", "اتقوا ربكم الذي خلقكم من نفس واحدة"], ["Les biens des orphelins (4:2-10)", "أموال اليتامى"], ["Les parts d'héritage (4:11-12)", "أنصبة الميراث"]], i: ["Justice envers les orphelins et dans l'héritage", "العدل مع اليتامى وفي الميراث"] },
      { t: "Interdits et mariage", ar: "المحرمات والزواج", r: [["4:15", "4:28"]], k: [["Le repentir accepté (4:17-18)", "التوبة"], ["Bien traiter les épouses (4:19)", "وعاشروهن بالمعروف"], ["Les femmes interdites au mariage (4:23)", "المحرمات من النساء"]], i: ["Allah veut vous alléger", "يريد الله أن يخفف عنكم"] },
      { t: "Biens, justice et familles", ar: "المال والعدل والأسرة", r: [["4:29", "4:42"]], k: [["Ne dévorez pas vos biens injustement (4:29)", "لا تأكلوا أموالكم بالباطل"], ["Les péchés graves (4:31)", "اجتناب الكبائر"], ["Être bon envers les parents et les proches (4:36)", "الإحسان إلى الوالدين والأقارب"]], i: ["Honnêteté dans les biens et bonté dans les liens", "الأمانة في المال والإحسان"] },
      { t: "Pureté, prière et gens du Livre", ar: "الطهارة والصلاة وأهل الكتاب", r: [["4:43", "4:57"]], k: [["Prière et purification, le tayammum (4:43)", "الصلاة والتيمم"], ["Ils déforment les paroles (4:46)", "تحريف الكلم"], ["Allah ne pardonne pas qu'on Lui associe (4:48)", "إن الله لا يغفر أن يشرك به"]], i: ["Le tawhid est la base de tout", "التوحيد أساس الدين"] },
      { t: "Dépôts, jugement et obéissance", ar: "الأمانات والحكم والطاعة", r: [["4:58", "4:70"]], k: [["Rendez les dépôts à leurs ayants droit (4:58)", "إن الله يأمركم أن تؤدوا الأمانات"], ["Obéissez à Allah et au Messager (4:59)", "أطيعوا الله وأطيعوا الرسول"], ["Ceux qui obéissent seront avec les prophètes (4:69)", "مع الذين أنعم الله عليهم"]], i: ["L'amana et le jugement juste", "الأمانة والحكم بالعدل"] },
      { t: "Combat, hypocrites et hijra", ar: "القتال والمنافقون والهجرة", r: [["4:71", "4:104"]], k: [["Prenez vos précautions (4:71)", "خذوا حذركم"], ["Combattre pour défendre les faibles (4:75)", "المستضعفون"], ["La hijra (4:97-100)", "الهجرة"], ["La prière de la peur (4:102)", "صلاة الخوف"]], i: ["Défendre la justice avec prudence et discipline", "الدفاع عن العدل بحذر ونظام"] },
      { t: "Justice, repentir et chemin des croyants", ar: "العدل والتوبة وسبيل المؤمنين", r: [["4:105", "4:126"]], k: [["Ne défends pas les traîtres (4:105)", "ولا تكن للخائنين خصيماً"], ["Allah pardonne ce qui est moindre que le shirk (4:116)", "إن الله لا يغفر أن يشرك به"], ["Ibrâhîm, ami d'Allah (4:125)", "واتخذ الله إبراهيم خليلاً"]], i: ["Suivre le chemin des croyants", "اتباع سبيل المؤمنين"] },
      { t: "Femmes, réconciliation et témoignage", ar: "النساء والصلح والشهادة", r: [["4:127", "4:152"]], k: [["La réconciliation est meilleure (4:128)", "والصلح خير"], ["Soyez fermes dans la justice, témoins pour Allah (4:135)", "كونوا قوامين بالقسط شهداء لله"], ["Les hypocrites seront au plus bas du Feu (4:145)", "الدرك الأسفل من النار"]], i: ["La justice même contre soi-même", "العدل ولو على النفس"] },
      { t: "Gens du Livre, 'Îsâ et messagers", ar: "أهل الكتاب وعيسى والرسل", r: [["4:153", "4:176"]], k: [["Révélation à tous les prophètes (4:163)", "إنا أوحينا إليك كما أوحينا إلى نوح"], ["Ne dites pas « trois » (4:171)", "ولا تقولوا ثلاثة"], ["La kalâla (4:176)", "الكلالة"]], i: ["Un seul Dieu et un seul message", "إله واحد ورسالة واحدة"] }
    ]
  },
  {
    id: "maida", kind: "surah", emoji: "🍞", title: "Sourate al-Mâ'ida", ar: "سورة المائدة", goal: ["Respecter les engagements et appliquer la loi d'Allah avec justice : un pacte avec Allah et entre les gens.", "الوفاء بالعقود وتحكيم شرع الله بالعدل"],
    nodes: [
      { t: "Respecter les engagements", ar: "الوفاء بالعقود", r: [["5:1", "5:5"]], k: [["Remplissez vos engagements (5:1)", "أوفوا بالعقود"], ["Les aliments interdits (5:3)", "المحرمات من الطعام"], ["« Aujourd'hui J'ai parachevé votre religion » (5:3)", "اليوم أكملت لكم دينكم"]], i: ["La religion est complète", "اكتمال الدين"] },
      { t: "Purification et justice", ar: "الطهارة والعدل", r: [["5:6", "5:11"]], k: [["Les ablutions (5:6)", "الوضوء"], ["Soyez justes même envers vos ennemis (5:8)", "ولا يجرمنكم شنآن قوم"], ["Souvenez-vous du bienfait d'Allah (5:7)", "واذكروا نعمة الله"]], i: ["La justice est proche de la piété", "العدل أقرب للتقوى"] },
      { t: "Le pacte des Banû Isrâ'îl", ar: "ميثاق بني إسرائيل", r: [["5:12", "5:26"]], k: [["Allah prend leur engagement (5:12)", "أخذ الله ميثاق بني إسرائيل"], ["Ils ont rompu le pacte (5:13)", "نقضهم للميثاق"], ["Ils refusent d'entrer en Terre sainte (5:22-26)", "رفضهم دخول الأرض المقدسة"]], i: ["La rupture du pacte mène à la perte", "نقض العهد يؤدي إلى الضياع"] },
      { t: "Les deux fils d'Âdam", ar: "ابنا آدم", r: [["5:27", "5:32"]], k: [["L'offrande acceptée et l'offrande refusée (5:27)", "القربان"], ["Le premier meurtre (5:30)", "أول جريمة قتل"], ["Sauver une vie, c'est sauver tous les hommes (5:32)", "ومن أحياها فكأنما أحيا الناس جميعاً"]], i: ["Le caractère sacré de la vie", "حرمة النفس"] },
      { t: "Sanctions et jugement par la révélation", ar: "الحدود والحكم بما أنزل الله", r: [["5:33", "5:50"]], k: [["La sanction du brigandage (5:33)", "حد الحرابة"], ["La Torah et l'Évangile contenaient guidance et lumière (5:44, 5:46)", "التوراة والإنجيل"], ["Le Livre confirme ce qui l'a précédé (5:48)", "مصدقاً لما بين يديه"]], i: ["Juger par ce qu'Allah a révélé", "الحكم بما أنزل الله"] },
      { t: "Alliances et fermeté dans la foi", ar: "الولاء والثبات على الدين", r: [["5:51", "5:66"]], k: [["Ne prenez pas pour alliés ceux qui se moquent de la religion (5:51, 5:57)", "لا تتخذوا الذين اتخذوا دينكم هزواً"], ["Allah fera venir un peuple qu'Il aime (5:54)", "يحبهم ويحبونه"], ["Vos alliés sont Allah, Son Messager et les croyants (5:55)", "إنما وليكم الله ورسوله"]], i: ["Loyauté envers Allah et Son Messager", "الولاء لله ورسوله"] },
      { t: "Message, trinité et Maryam", ar: "البلاغ والتثليث ومريم", r: [["5:67", "5:86"]], k: [["Transmets ce qui t'a été révélé (5:67)", "بلغ ما أنزل إليك"], ["Ils ont dit : Allah est le troisième de trois (5:73)", "لقد كفر الذين قالوا ثالث ثلاثة"], ["Maryam est véridique (5:75)", "وأمه صديقة"]], i: ["Le Messie est un messager", "المسيح رسول"] },
      { t: "Licites, interdits et serments", ar: "الحلال والحرام والأيمان", r: [["5:87", "5:108"]], k: [["Ne rendez pas illicites les bonnes choses (5:87)", "لا تحرموا طيبات ما أحل الله"], ["L'expiation des serments (5:89)", "كفارة اليمين"], ["Le vin et les jeux de hasard (5:90-91)", "الخمر والميسر"]], i: ["Obéir sans exagérer ni interdire ce qu'Allah a permis", "الاعتدال في التحليل والتحريم"] },
      { t: "'Îsâ, la table servie et le Jour du témoignage", ar: "عيسى والمائدة ويوم الشهادة", r: [["5:109", "5:120"]], k: [["Les miracles de 'Îsâ (5:110)", "معجزات عيسى"], ["La table servie du ciel (5:112-115)", "المائدة"], ["'Îsâ nie être pris pour dieu (5:116-117)", "عيسى يتبرأ من التأليه"]], i: ["À Allah appartient la royauté des cieux et de la terre", "لله ملك السماوات والأرض"] }
    ]
  },
  {
    id: "anam", kind: "surah", emoji: "🐑", title: "Sourate al-An'âm", ar: "سورة الأنعام", goal: ["Affirmer le tawhid et réfuter le shirk, les superstitions et les croyances de l'ignorance.", "إثبات التوحيد ونفي الشرك والخرافات"],
    nodes: [
      { t: "Louange au Créateur", ar: "الحمد لله الخالق", r: [["6:1", "6:11"]], k: [["Louange à Allah qui a créé les cieux et la terre (6:1)", "الحمد لله الذي خلق السماوات والأرض"], ["Les peuples précédents détruits (6:6)", "القرون السابقة"], ["Voyagez et voyez la fin des falsificateurs (6:11)", "انظروا كيف كان عاقبة المكذبين"]], i: ["Tout appartient à Allah", "كل شيء لله"] },
      { t: "À qui appartient tout ce qui existe ?", ar: "لمن ما في السماوات والأرض؟", r: [["6:12", "6:32"]], k: [["Allah a prescrit la miséricorde (6:12)", "كتب على نفسه الرحمة"], ["Je ne prends pour protecteur qu'Allah (6:14)", "أغير الله أتخذ ولياً"], ["La vie d'ici-bas n'est que jeu et amusement (6:32)", "وما الحياة الدنيا إلا لعب ولهو"]], i: ["Seul Allah est digne de protection", "الله وحده الولي"] },
      { t: "Patience du Prophète et signes", ar: "صبر النبي والآيات", r: [["6:33", "6:55"]], k: [["Ils ne te traitent pas de menteur, mais nient les signes (6:33)", "فإنهم لا يكذبونك"], ["L'épreuve par l'aisance et la difficulté (6:42-45)", "الابتلاء بالشدة والرخاء"], ["Ne repousse pas les croyants pauvres (6:52)", "ولا تطرد الذين يدعون ربهم"]], i: ["Patience et égards pour les croyants sincères", "الصبر والرفق بالمؤمنين"] },
      { t: "Les clés de l'invisible", ar: "مفاتح الغيب", r: [["6:56", "6:73"]], k: [["Il détient les clés de l'inconnaissable (6:59)", "وعنده مفاتح الغيب"], ["Il vous rappelle la nuit et vous ressuscite le jour (6:60)", "وهو الذي يتوفاكم بالليل"], ["Éloigne-toi de ceux qui se jouent de la religion (6:68, 6:70)", "الإعراض عن الخائضين"]], i: ["Allah connaît tout, rien ne Lui échappe", "علم الله المحيط"] },
      { t: "Ibrâhîm et les prophètes", ar: "إبراهيم والأنبياء", r: [["6:74", "6:94"]], k: [["Ibrâhîm et les astres (6:76-79)", "إبراهيم والكواكب"], ["Ceux qui ont cru sans mêler leur foi à l'injustice (6:82)", "ولم يلبسوا إيمانهم بظلم"], ["Les prophètes guidés (6:84-90)", "ذكر الأنبياء"]], i: ["Chercher Allah par la réflexion", "الوصول إلى الله بالتفكر"] },
      { t: "Les signes dans la création", ar: "آيات الله في الخلق", r: [["6:95", "6:113"]], k: [["Il fend le grain et le noyau (6:95)", "فالق الحب والنوى"], ["Il a fait des étoiles pour vous guider (6:97)", "النجوم لتهتدوا بها"], ["Les regards ne L'atteignent pas (6:103)", "لا تدركه الأبصار"]], i: ["La création témoigne du Créateur", "الكون شاهد على الخالق"] },
      { t: "Licite et illicite", ar: "الحلال والحرام", r: [["6:114", "6:135"]], k: [["Ne mangez pas ce sur quoi le nom d'Allah n'a pas été prononcé (6:121)", "ولا تأكلوا مما لم يذكر اسم الله عليه"], ["Celui qui était mort et que Nous avons ressuscité (6:122)", "أومن كان ميتاً فأحييناه"], ["Allah ouvre la poitrine à l'islam (6:125)", "يشرح صدره للإسلام"]], i: ["Le jugement revient à Allah seul", "الحكم لله وحده"] },
      { t: "Les superstitions de l'ignorance", ar: "خرافات الجاهلية", r: [["6:136", "6:150"]], k: [["Ils font à Allah une part des récoltes et du bétail (6:136)", "جعلوا لله مما ذرأ"], ["Ce qui est réellement interdit (6:145)", "المحرمات الحقيقية"], ["« Si Allah l'avait voulu… » (6:148)", "لو شاء الله ما أشركنا"]], i: ["Ne pas inventer de règles au nom d'Allah", "لا تشريع إلا من الله"] },
      { t: "Les recommandations et le droit chemin", ar: "الوصايا العشر والصراط المستقيم", r: [["6:151", "6:165"]], k: [["Ne rien associer à Allah, être bon envers les parents (6:151)", "ألا تشركوا به شيئاً وبالوالدين إحساناً"], ["Ne tuez pas vos enfants, ne vous approchez pas des turpitudes (6:151)", "ولا تقتلوا أولادكم"], ["« Voici Mon chemin droit, suivez-le » (6:153)", "وأن هذا صراطي مستقيماً فاتبعوه"], ["Ma prière, mes sacrifices, ma vie et ma mort sont pour Allah (6:162)", "إن صلاتي ونسكي ومحياي ومماتي لله"]], i: ["Vivre et mourir pour Allah seul", "الحياة والممات لله"] }
    ]
  },
  {
    id: "araf", kind: "surah", emoji: "🏔️", title: "Sourate al-A'râf", ar: "سورة الأعراف", goal: ["Suivre la révélation et le Messager, tirer la leçon des peuples passés et se protéger de la tentation de Satan.", "اتباع الوحي والرسول والعبرة بالأمم السابقة والحذر من الشيطان"],
    nodes: [
      { t: "Le Livre et l'avertissement", ar: "الكتاب والإنذار", r: [["7:1", "7:10"]], k: [["Un Livre révélé pour avertir (7:2)", "كتاب أنزل إليك لتنذر به"], ["Suivez ce qui vous a été révélé (7:3)", "اتبعوا ما أنزل إليكم"], ["La pesée des œuvres (7:8-9)", "الوزن يومئذ الحق"]], i: ["La révélation est le seul guide", "الوحي هو الهداية"] },
      { t: "Âdam et Iblîs", ar: "آدم وإبليس", r: [["7:11", "7:25"]], k: [["Iblîs refuse de se prosterner (7:12)", "إبليس يرفض السجود"], ["Âdam et son épouse dans le jardin (7:19)", "آدم وزوجه في الجنة"], ["« Seigneur, nous nous sommes fait du tort » (7:23)", "ربنا ظلمنا أنفسنا"]], i: ["Le repentir sauve, l'orgueil perd", "التوبة نجاة والكبر هلاك"] },
      { t: "Les enfants d'Âdam", ar: "بنو آدم", r: [["7:26", "7:39"]], k: [["Le vêtement de la piété est le meilleur (7:26)", "ولباس التقوى ذلك خير"], ["Ne laissez pas Satan vous tenter (7:27)", "لا يفتننكم الشيطان"], ["Prenez vos parures à chaque mosquée (7:31)", "خذوا زينتكم عند كل مسجد"]], i: ["La piété est le meilleur habit", "التقوى خير لباس"] },
      { t: "Gens du Paradis, du Feu et d'al-A'râf", ar: "أصحاب الجنة والنار والأعراف", r: [["7:40", "7:58"]], k: [["Les portes du ciel fermées aux orgueilleux (7:40)", "لا تفتح لهم أبواب السماء"], ["Les gens d'al-A'râf (7:46)", "أصحاب الأعراف"], ["Allah a créé les cieux et la terre en six jours (7:54)", "خلق السماوات والأرض في ستة أيام"]], i: ["Chacun reçoit ce qu'il a préparé", "كل نفس بما كسبت"] },
      { t: "Nûh", ar: "نوح", r: [["7:59", "7:64"]], k: [["« Adorez Allah, vous n'avez pas d'autre dieu » (7:59)", "اعبدوا الله ما لكم من إله غيره"], ["Ses appels et leur refus (7:60-62)", "دعوته وإعراض قومه"], ["Ceux qui l'ont suivi sont sauvés (7:64)", "نجاة من آمن معه"]], i: ["Le message de tous les prophètes est le tawhid", "رسالة الأنبياء التوحيد"] },
      { t: "Hûd", ar: "هود", r: [["7:65", "7:72"]], k: [["L'appel à 'Âd (7:65)", "دعوة عاد"], ["Leur orgueil (7:66-70)", "استكبارهم"], ["Leur destruction (7:72)", "هلاكهم"]], i: ["L'orgueil mène à la destruction", "الكبر سبب الهلاك"] },
      { t: "Sâlih", ar: "صالح", r: [["7:73", "7:79"]], k: [["La chamelle d'Allah, un signe (7:73)", "ناقة الله آية"], ["Ils la tuent par orgueil (7:77)", "عقروا الناقة"], ["Le tremblement les saisit (7:78)", "فأخذتهم الرجفة"]], i: ["Désobéir au signe d'Allah entraîne le châtiment", "المعصية بعد الآية"] },
      { t: "Lût", ar: "لوط", r: [["7:80", "7:84"]], k: [["Il interdit la turpitude (7:80)", "ينهاهم عن الفاحشة"], ["Ils veulent le chasser avec ses gens (7:82)", "أخرجوهم من قريتكم"], ["Une pluie de pierres (7:84)", "وأمطرنا عليهم مطراً"]], i: ["Gare à l'obstination dans le péché", "خطر الإصرار على المعصية"] },
      { t: "Shu'ayb", ar: "شعيب", r: [["7:85", "7:93"]], k: [["Donnez la pleine mesure (7:85)", "أوفوا الكيل والميزان"], ["Ils le menacent de l'expulser (7:88)", "لنخرجنك يا شعيب"], ["Il les quitte avec tristesse (7:93)", "فكيف آسى على قوم كافرين"]], i: ["L'honnêteté dans les transactions", "الأمانة في المعاملات"] },
      { t: "Leçons des peuples", ar: "عبر الأمم", r: [["7:94", "7:102"]], k: [["Les cités auraient été bénies si elles avaient cru (7:96)", "لفتحنا عليهم بركات"], ["Sont-ils à l'abri du plan d'Allah ? (7:99)", "أفأمنوا مكر الله"], ["La plupart n'honorent pas leurs engagements (7:102)", "وما وجدنا لأكثرهم من عهد"]], i: ["Prendre la leçon avant qu'il ne soit trop tard", "الاعتبار قبل فوات الأوان"] },
      { t: "Mûsâ, Fir'awn et les magiciens", ar: "موسى وفرعون والسحرة", r: [["7:103", "7:137"]], k: [["Le bâton et la main blanche (7:107-108)", "العصا واليد البيضاء"], ["Les magiciens se prosternent (7:120)", "وألقي السحرة ساجدين"], ["Les signes : déluge, sauterelles… (7:133)", "الآيات التسع"]], i: ["La vérité l'emporte sur la magie", "الحق يغلب الباطل"] },
      { t: "Traversée de la mer et le veau d'or", ar: "عبور البحر والعجل", r: [["7:138", "7:155"]], k: [["Ils demandent un dieu comme les leurs (7:138)", "اجعل لنا إلهاً"], ["Mûsâ demande à voir Allah (7:143)", "رب أرني أنظر إليك"], ["Le veau d'or (7:148)", "اتخذوا العجل"]], i: ["Ne rien adorer en dehors d'Allah", "لا عبادة إلا لله"] },
      { t: "Miséricorde, Messager illettré et pacte", ar: "الرحمة والنبي الأمي والميثاق", r: [["7:156", "7:171"]], k: [["Ma miséricorde embrasse toute chose (7:156)", "ورحمتي وسعت كل شيء"], ["Le Prophète illettré (7:157)", "النبي الأمي"], ["Je suis le Messager d'Allah pour vous tous (7:158)", "إني رسول الله إليكم جميعاً"]], i: ["Suivre le Messager est la voie de la miséricorde", "اتباع الرسول طريق الرحمة"] },
      { t: "Le pacte originel et la fin de la sourate", ar: "العهد الأول وخاتمة السورة", r: [["7:172", "7:206"]], k: [["« Ne suis-Je pas votre Seigneur ? » (7:172)", "ألست بربكم"], ["À Allah les plus beaux noms (7:180)", "ولله الأسماء الحسنى"], ["Écoutez le Coran en silence (7:204)", "فاستمعوا له وأنصتوا"], ["Invoque ton Seigneur matin et soir (7:205)", "واذكر ربك في نفسك"]], i: ["Se souvenir d'Allah et L'écouter", "ذكر الله والإنصات لكتابه"] }
    ]
  },
  {
    id: "anfal", kind: "surah", emoji: "⚔️", title: "Sourate al-Anfâl", ar: "سورة الأنفال", goal: ["Les leçons de Badr : obéissance à Allah et à Son Messager, unité, confiance en Allah et éthique du combat.", "دروس بدر: طاعة الله ورسوله والوحدة والتوكل"],
    nodes: [
      { t: "Le butin et les qualités des croyants", ar: "الأنفال وصفات المؤمنين", r: [["8:1", "8:8"]], k: [["Le butin appartient à Allah et au Messager (8:1)", "الأنفال لله والرسول"], ["Les croyants : cœurs qui frémissent à Son rappel (8:2)", "إذا ذكر الله وجلت قلوبهم"], ["Badr : Allah établit la vérité (8:5-8)", "بدر"]], i: ["Réformer ses relations et craindre Allah", "اتقوا الله وأصلحوا ذات بينكم"] },
      { t: "L'aide d'Allah à Badr", ar: "نصر الله في بدر", r: [["8:9", "8:19"]], k: [["Les anges en renfort (8:9)", "الإمداد بالملائكة"], ["La sécurité qui vous enveloppe (8:11)", "النعاس أمنة"], ["« Ce n'est pas vous qui les avez tués » (8:17)", "فلم تقتلوهم ولكن الله قتلهم"]], i: ["La victoire vient d'Allah seul", "النصر من عند الله"] },
      { t: "Obéissance et dépôt", ar: "الطاعة والأمانة", r: [["8:20", "8:29"]], k: [["Répondez à Allah et au Messager (8:24)", "استجيبوا لله وللرسول"], ["Craignez une épreuve qui n'atteindra pas que les injustes (8:25)", "واتقوا فتنة"], ["Vos biens et vos enfants sont une épreuve (8:28)", "أموالكم وأولادكم فتنة"]], i: ["L'obéissance donne la vie", "الطاعة تحيي القلوب"] },
      { t: "Les complots des mécréants", ar: "مكر الكافرين", r: [["8:30", "8:40"]], k: [["Ils complotent contre toi (8:30)", "وإذ يمكر بك الذين كفروا"], ["Leur prière à la Maison : sifflements et applaudissements (8:35)", "صلاتهم عند البيت مكاء وتصدية"], ["Combattez jusqu'à ce qu'il n'y ait plus de fitna (8:39)", "وقاتلوهم حتى لا تكون فتنة"]], i: ["Allah est le meilleur des stratèges", "والله خير الماكرين"] },
      { t: "Le butin, la fermeté et l'unité", ar: "الغنيمة والثبات والوحدة", r: [["8:41", "8:54"]], k: [["Le cinquième du butin (8:41)", "الخمس"], ["Soyez fermes et invoquez Allah souvent (8:45)", "فاثبتوا واذكروا الله كثيراً"], ["Ne vous disputez pas, vous faibliriez (8:46)", "ولا تنازعوا"]], i: ["L'unité et le dhikr donnent la force", "الوحدة والذكر قوة"] },
      { t: "Pactes, force et alliances", ar: "العهود والقوة والولاية", r: [["8:55", "8:75"]], k: [["Préparez la force autant que vous le pouvez (8:60)", "وأعدوا لهم ما استطعتم من قوة"], ["Si l'ennemi penche vers la paix, penche vers elle (8:61)", "وإن جنحوا للسلم فاجنح لها"], ["Ceux qui ont émigré et combattu sont les vrais croyants (8:74)", "أولئك هم المؤمنون حقاً"]], i: ["La force et la paix au service de la justice", "القوة والسلم لخدمة العدل"] }
    ]
  },
  {
    id: "tawba", kind: "surah", emoji: "🕌", title: "Sourate at-Tawba", ar: "سورة التوبة", goal: ["Distinguer les croyants sincères des hypocrites : sincérité dans l'engagement, mobilisation et repentir.", "تمييز المؤمنين الصادقين من المنافقين: الصدق والنفير والتوبة"],
    nodes: [
      { t: "Les pactes et les mois sacrés", ar: "العهود والأشهر الحرم", r: [["9:1", "9:16"]], k: [["Rupture avec ceux qui ont trahi (9:1)", "براءة من الله ورسوله"], ["Les mois sacrés (9:5)", "انسلاخ الأشهر الحرم"], ["Accorde la protection à celui qui la demande (9:6)", "وإن أحد من المشركين استجارك"]], i: ["Respecter les pactes tant qu'ils sont respectés", "الوفاء بالعهد"] },
      { t: "Les mosquées d'Allah", ar: "مساجد الله", r: [["9:17", "9:29"]], k: [["Seuls ceux qui croient entretiennent les mosquées (9:18)", "إنما يعمر مساجد الله من آمن"], ["Aimer Allah plus que ses proches et ses biens (9:24)", "أحب إليكم من الله ورسوله"], ["Hunayn et la sérénité (9:25-26)", "حنين والسكينة"]], i: ["L'amour d'Allah passe avant tout", "حب الله فوق كل شيء"] },
      { t: "Croyances et mois sacrés", ar: "العقائد والأشهر الحرم", r: [["9:30", "9:37"]], k: [["Leurs croyances déviées (9:30-31)", "انحراف عقائدهم"], ["Ils veulent éteindre la lumière d'Allah (9:32)", "يريدون أن يطفئوا نور الله"], ["Les mois sont au nombre de douze (9:36)", "إن عدة الشهور اثنا عشر شهراً"]], i: ["La lumière d'Allah sera parachevée", "ويأبى الله إلا أن يتم نوره"] },
      { t: "Tabûk : la mobilisation", ar: "غزوة تبوك والنفير", r: [["9:38", "9:59"]], k: [["Pourquoi vous alourdissez-vous sur terre ? (9:38)", "ما لكم إذا قيل لكم انفروا"], ["« Ne t'attriste pas, Allah est avec nous » (9:40)", "لا تحزن إن الله معنا"], ["Les excuses des hypocrites (9:42-59)", "أعذار المنافقين"]], i: ["Se mobiliser pour la cause d'Allah", "النفير في سبيل الله"] },
      { t: "La zakât et les caractéristiques des gens", ar: "الزكاة وصفات الناس", r: [["9:60", "9:72"]], k: [["Les huit catégories de la zakât (9:60)", "مصارف الزكاة"], ["Les hypocrites ordonnent le blâmable (9:67)", "المنافقون يأمرون بالمنكر"], ["Les croyants et les croyantes sont alliés (9:71)", "المؤمنون والمؤمنات بعضهم أولياء بعض"]], i: ["Les croyants s'entraident dans le bien", "التعاون على البر"] },
      { t: "Les hypocrites démasqués", ar: "فضح المنافقين", r: [["9:73", "9:99"]], k: [["Jihad contre les mécréants et les hypocrites (9:73)", "جاهد الكفار والمنافقين"], ["Ils se réjouissent de rester derrière (9:81)", "فرح المخلفون"], ["Les Bédouins (9:97-99)", "الأعراب"]], i: ["La sincérité se prouve dans l'épreuve", "الصدق يظهر عند الابتلاء"] },
      { t: "Premiers croyants et repentants", ar: "السابقون والتائبون", r: [["9:100", "9:110"]], k: [["Les premiers émigrés et Ansâr (9:100)", "السابقون الأولون"], ["D'autres ont reconnu leurs péchés (9:102)", "اعترفوا بذنوبهم"], ["La mosquée de la nuisance (9:107)", "مسجد الضرار"]], i: ["Allah accepte le repentir sincère", "الله يقبل التوبة"] },
      { t: "Le marché avec Allah et la fin", ar: "الصفقة مع الله وخاتمة السورة", r: [["9:111", "9:129"]], k: [["Allah a acheté aux croyants leurs personnes et leurs biens (9:111)", "إن الله اشترى من المؤمنين"], ["Les trois restés en arrière (9:118)", "الثلاثة الذين خلفوا"], ["« Soyez avec les véridiques » (9:119)", "وكونوا مع الصادقين"], ["« Allah me suffit » (9:129)", "حسبي الله"]], i: ["Se confier à Allah, Seigneur du Trône immense", "التوكل على الله"] }
    ]
  }
];


// ====== Contenu détaillé pour la vue « affiche » : points clés [fr, ar] et idée [fr, ar] ======
// Écrit à la main (résumé simplifié) : à faire vérifier par un professeur.
const MAP_EXTRA = {
  imran: {
    goal: ["Affermir les croyants face aux gens du Livre et aux épreuves (Uhud) : tawhid, unité, patience.", "تثبيت المؤمنين أمام أهل الكتاب وفي الابتلاء (أحد): التوحيد والوحدة والصبر"],
    nodes: [
      { k: [["Le Livre confirme les Écritures précédentes", "تصديق الكتب السابقة"], ["Versets clairs et versets ambigus (3:7)", "المحكم والمتشابه"], ["« Seigneur, ne laisse pas dévier nos cœurs » (3:8)", "ربنا لا تزغ قلوبنا"]], i: ["Se tenir au Livre et demander la fermeté du cœur", "التمسك بالكتاب وطلب الثبات"] },
      { k: [["Les attraits des désirs (3:14)", "زينة الشهوات"], ["Allah témoigne qu'il n'y a de dieu que Lui (3:18)", "شهد الله أنه لا إله إلا هو"], ["La religion auprès d'Allah est l'Islam (3:19)", "إن الدين عند الله الإسلام"]], i: ["Ne pas se laisser tromper par la vie d'ici-bas", "عدم الاغترار بالدنيا"] },
      { k: [["Aimer Allah, c'est suivre le Messager (3:31)", "إن كنتم تحبون الله فاتبعوني"], ["Ne pas prendre les mécréants pour alliés", "النهي عن موالاة الكافرين"], ["Obéir à Allah et au Messager (3:32)", "أطيعوا الله والرسول"]], i: ["L'amour d'Allah se prouve par l'obéissance", "محبة الله تظهر بالطاعة"] },
      { k: [["La femme de 'Imrân fait un vœu (3:35)", "نذر امرأة عمران"], ["Zakariyyâ prend soin de Maryam (3:37)", "كفالة زكريا لمريم"], ["Maryam est choisie (3:42)", "اصطفاء مريم"]], i: ["Allah choisit et purifie Ses serviteurs", "اصطفاء الله لعباده"] },
      { k: [["L'annonce faite à Maryam (3:45)", "البشارة بعيسى"], ["Les miracles de 'Îsâ par la permission d'Allah (3:49)", "معجزات عيسى بإذن الله"], ["'Îsâ est comme Âdam (3:59)", "إن مثل عيسى عند الله كمثل آدم"]], i: ["'Îsâ est un serviteur et un messager d'Allah", "عيسى عبد الله ورسوله"] },
      { k: [["Venez à une parole commune (3:64)", "كلمة سواء"], ["Ibrâhîm n'était ni juif ni chrétien (3:67)", "ما كان إبراهيم يهودياً ولا نصرانياً"], ["Vous êtes la meilleure communauté (3:110)", "كنتم خير أمة"]], i: ["Dialoguer avec justice et rester ferme sur la vérité", "الحوار بالحجة والثبات على الحق"] },
      { k: [["Ne faiblissez pas et ne vous attristez pas (3:139)", "ولا تهنوا ولا تحزنوا"], ["Muhammad n'est qu'un messager (3:144)", "وما محمد إلا رسول"], ["« Allah nous suffit » (3:173)", "حسبنا الله ونعم الوكيل"]], i: ["Obéissance, patience et confiance en Allah dans l'épreuve", "الطاعة والصبر والتوكل"] },
      { k: [["Allah distingue le bon du mauvais (3:179)", "ليميز الخبيث من الطيب"], ["Les gens doués d'intelligence (3:190-194)", "أولو الألباب"], ["Patientez, persévérez, craignez Allah (3:200)", "اصبروا وصابروا ورابطوا"]], i: ["Réfléchir, patienter et rester uni", "التفكر والصبر والمرابطة"] }
    ]
  },
  baqara: {
    goal: ["Former la communauté croyante, khalîfa sur terre : foi, obéissance, patience et lois d'Allah, en tirant les leçons des nations passées.", "بناء الأمة المؤمنة المستخلفة في الأرض بالإيمان والطاعة والصبر وأحكام الله، مع أخذ العبرة من الأمم السابقة"],
    nodes: [
      { k: [["Les croyants", "المؤمنون"], ["Les mécréants", "الكافرون"], ["Les hypocrites", "المنافقون"]], i: ["Chacun choisit sa voie : guidance ou égarement", "تحديد طريق الهداية والضلال"] },
      { k: [["Adorer Allah seul", "عبادة الله وحده"], ["Les signes dans la création", "آيات الله في الخلق"]], i: ["Le Coran est une preuve et un défi", "القرآن دليل وتحدٍّ"] },
      { k: [["Création d'Âdam", "خلق آدم"], ["Les anges et les noms", "الملائكة والأسماء"], ["Iblîs et la descente sur terre", "إبليس والهبوط"]], i: ["L'homme est khalîfa sur terre", "الإنسان خليفة في الأرض"] },
      { k: [["Les bienfaits d'Allah sur eux", "نعم الله عليهم"], ["L'histoire de Mûsâ", "قصة موسى"], ["L'histoire de la vache", "قصة البقرة"], ["Leurs manquements à l'alliance", "نقضهم للعهد"]], i: ["Prendre la leçon sans répéter leurs erreurs", "العبرة وعدم تكرار أخطائهم"] },
      { k: [["Les épreuves d'Ibrâhîm", "ابتلاء إبراهيم"], ["La construction de la Kaaba", "بناء الكعبة"], ["Son invocation pour sa descendance", "الدعاء لذريته"]], i: ["Ibrâhîm, modèle de foi et de soumission", "إبراهيم قدوة في الإيمان"] },
      { k: [["Le changement de qibla", "تحويل القبلة"], ["Une communauté du juste milieu", "أمة وسط"], ["« Souvenez-vous de Moi… » (2:152)", "فاذكروني أذكركم"]], i: ["La communauté a son identité", "للأمة هويتها وشخصيتها"] },
      { k: [["Patience et prière", "الصبر والصلاة"], ["Les épreuves (2:155)", "الابتلاء بالخوف والجوع"], ["Le vrai sens de la piété (2:177)", "حقيقة البر"]], i: ["Purifier l'âme par l'adoration et la patience", "تزكية النفس بالعبادة والصبر"] },
      { k: [["Le talion (qisâs)", "القصاص"], ["Le testament", "الوصية"], ["Le jeûne", "الصيام"]], i: ["Des lois pour la justice et la piété", "تشريعات للعدل والتقوى"] },
      { k: [["Les nouvelles lunes", "الأهلة"], ["Le combat légitime", "القتال المشروع"], ["Le Hajj et la 'Umra", "الحج والعمرة"]], i: ["Obéir à Allah dans les rites", "الطاعة في العبادات"] },
      { k: [["Orphelins, mariage et divorce", "اليتامى والزواج والطلاق"], ["Allaitement et délai de viduité", "الرضاعة والعدة"]], i: ["Bâtir la famille sur la bonté et la justice", "بناء الأسرة على المعروف والعدل"] },
      { k: [["La mort et la vie", "الموت والحياة"], ["Tâlût et Jâlût", "طالوت وجالوت"]], i: ["La victoire vient d'Allah", "النصر من عند الله"] },
      { k: [["Âyat al-Kursî", "آية الكرسي"], ["Pas de contrainte en religion (2:256)", "لا إكراه في الدين"]], i: ["La grandeur et les attributs d'Allah", "عظمة الله وصفاته"] },
      { k: [["Ibrâhîm et le roi", "إبراهيم والملك"], ["Celui qui passa près d'un village", "المار على القرية"], ["Les quatre oiseaux", "الطيور الأربعة"]], i: ["Allah donne la vie et ressuscite", "الله يحيي ويميت"] },
      { k: [["La parabole de l'épi", "مثل السنبلة"], ["Dépenser avec sincérité", "الإنفاق بإخلاص"], ["Ne pas rappeler ses dons", "لا منّ ولا أذى"]], i: ["L'argent est une amana à dépenser pour Allah", "المال أمانة يُنفق في سبيل الله"] },
      { k: [["Interdiction de l'usure (ribâ)", "تحريم الربا"], ["Le verset de la dette (2:282)", "آية الدين"], ["Écrire et témoigner", "الكتابة والإشهاد"]], i: ["La justice dans les transactions", "العدل في المعاملات"] },
      { k: [["Tout appartient à Allah", "لله ما في السماوات والأرض"], ["Les croyants ont cru au Messager", "آمن الرسول"], ["L'invocation finale", "دعاء خاتمة السورة"]], i: ["Foi, soumission et demande de pardon", "الإيمان والاستسلام وطلب المغفرة"] }
    ]
  },
  yusuf: {
    goal: ["La patience et la piété mènent à la victoire, et Allah accomplit Son dessein.", "الصبر والتقوى عاقبتهما التمكين وتحقيق وعد الله"],
    nodes: [
      { k: [["Onze étoiles, le soleil et la lune", "أحد عشر كوكباً والشمس والقمر"], ["Yaqûb lui conseille le secret", "وصية يعقوب"]] },
      { k: [["La jalousie des frères", "غيرة الإخوة"], ["Il est jeté dans le puits", "إلقاؤه في الجب"]] },
      { k: [["La caravane", "القافلة"], ["Acheté en Égypte", "شراؤه في مصر"]] },
      { k: [["La séduction", "المراودة"], ["Il se réfugie auprès d'Allah", "معاذ الله"]] },
      { k: [["Les deux compagnons de prison", "صاحبا السجن"], ["Il appelle à Allah seul", "الدعوة إلى التوحيد"]] },
      { k: [["Sept vaches grasses", "سبع بقرات سمان"], ["Sept épis verts", "سبع سنبلات خضر"]] },
      { k: [["Il demande l'enquête", "طلب التحقيق"], ["L'épouse reconnaît la vérité", "اعتراف امرأة العزيز"]] },
      { k: [["Il est mis à la tête des réserves", "على خزائن الأرض"], ["Gardien compétent", "حفيظ عليم"]] },
      { k: [["Il les reconnaît", "عرفهم"], ["Il demande leur frère", "أخ لكم من أبيكم"]] },
      { k: [["La coupe du roi", "صواع الملك"], ["Benyamin retenu", "احتجاز أخيه"]] },
      { k: [["Une patience élégante", "صبر جميل"], ["Ses yeux blanchissent de tristesse", "ابيضت عيناه من الحزن"]] },
      { k: [["« Je suis Yûsuf »", "أنا يوسف"], ["Pardon aux frères", "لا تثريب عليكم"]] },
      { k: [["La chemise et la vue retrouvée", "القميص والبصر"], ["Le rêve se réalise", "تأويل الرؤيا"]] },
      { k: [["Une leçon pour les gens doués d'intelligence", "عبرة لأولي الألباب"], ["Il confirme ce qui l'a précédé", "تصديق الذي بين يديه"]] }
    ]
  },
  kahf: {
    goal: ["Se protéger des quatre épreuves : la foi, l'argent, la science et le pouvoir.", "الوقاية من أربع فتن: فتنة الدين والمال والعلم والسلطة"],
    nodes: [
      { k: [["Louange à Allah qui a révélé le Livre", "الحمد لله الذي أنزل الكتاب"], ["Avertissement", "الإنذار"]] },
      { k: [["Des jeunes fuient pour leur foi", "فتية آمنوا بربهم"], ["Un long sommeil dans la caverne", "نومهم في الكهف"]], i: ["Épreuve de la foi", "فتنة الدين"] },
      { k: [["Rester avec ceux qui invoquent Allah", "الصبر مع الذاكرين"], ["La récompense des croyants", "جزاء المؤمنين"]] },
      { k: [["Le riche orgueilleux", "صاحب الجنتين"], ["Son compagnon croyant", "صاحبه المؤمن"]], i: ["Épreuve de l'argent", "فتنة المال"] },
      { k: [["La vie d'ici-bas est comme la pluie", "مثل الحياة الدنيا"], ["Iblîs, ennemi de l'homme", "إبليس عدو"]] },
      { k: [["Mûsâ cherche la science", "موسى وطلب العلم"], ["Trois événements avec al-Khidr", "ثلاث وقائع"]], i: ["Épreuve de la science", "فتنة العلم"] },
      { k: [["Dhul-Qarnayn voyage", "رحلات ذي القرنين"], ["Le rempart contre Yajûj et Majûj", "السد"]], i: ["Épreuve du pouvoir", "فتنة السلطة"] },
      { k: [["Le Jour dernier", "يوم القيامة"], ["Œuvres justes sans rien associer à Allah", "العمل الصالح والتوحيد"]] }
    ]
  }
};
Object.keys(MAP_EXTRA).forEach((id) => {
  const m = MAPS.find((x) => x.id === id);
  if (!m) return;
  m.goal = MAP_EXTRA[id].goal;
  MAP_EXTRA[id].nodes.forEach((x, i) => { if (m.nodes[i]) Object.assign(m.nodes[i], x); });
});

const mapBox = document.querySelector("#maps");
const mapState = { hide: false };
const MAP_COLORS = ["#1f6b5a", "#b88a3b", "#2b8c76", "#8a6a2c", "#256f60", "#a37b33"];

function mapShell() {
  stopAudio();
  mapBox.innerHTML = "";
  mapBox.appendChild(el("h1", "game-title", "Cartes mentales · خرائط ذهنية"));
  mapBox.appendChild(el("p", "ar-sub", "خريطة ذهنية لتسهيل الحفظ"));
}

// Liste des clés de versets d'un passage ["12:4","12:6"]
function mapKeys(range, chapters) {
  const [s, a] = range[0].split(":").map(Number);
  const [s2, b] = range[1].split(":").map(Number);
  if (s !== s2 || !chapters[s]) return [];
  const max = chapters[s].verses;
  const keys = [];
  for (let i = Math.max(1, a); i <= Math.min(b, max); i++) keys.push(s + ":" + i);
  return keys;
}

function mapRef(range, chapters) {
  const [s, a] = range[0].split(":");
  const [, b] = range[1].split(":");
  return chapters[s].latin + " " + (a === b ? a : a + "–" + b);
}

async function mapsHome() {
  mapShell();
  mapBox.appendChild(el("p", "muted center", "Un plan en quelques branches pour retenir l'ordre d'une sourate ou d'une histoire. Touchez une branche pour lire ses versets."));
  let chapters = null;
  try {
    chapters = await getChapters();
  } catch (err) {
    console.error(err); // la liste des cartes reste utilisable sans le plan automatique
  }
  const groups = [["story", "Histoires et prophètes · القصص"], ["surah", "Sourates · السور"], ["amma", "Juz 'Amma (30) · جزء عمّ"]];
  groups.forEach(([kind, label]) => {
    mapBox.appendChild(el("h2", "space-title", label));
    const list = el("div", "mt-list");
    MAPS.filter((m) => m.kind === kind).sort((a, b) => (kind === "story" ? 0 : Number(a.nodes[0].r[0][0].split(":")[0]) - Number(b.nodes[0].r[0][0].split(":")[0]))).forEach((m) => {
      const b = el("button", "mt-pair");
      b.appendChild(el("span", "", m.emoji + " " + m.title + " · " + m.nodes.length + " branches"));
      b.appendChild(el("span", "choice-ar", m.ar));
      b.addEventListener("click", () => mapOpen(m));
      list.appendChild(b);
    });
    mapBox.appendChild(list);
  });

  // Plan automatique pour les 114 sourates : découpage par pages du Mushaf (données de l'API)
  mapBox.appendChild(el("h2", "space-title", "Toutes les sourates · كل السور"));
  mapBox.appendChild(el("p", "muted center", "Plan automatique : la sourate est découpée par pages du Mushaf (d'après l'API)."));
  if (chapters) {
    const sel = document.createElement("select");
    sel.setAttribute("aria-label", "Sourate");
    for (let i = 1; i <= 114; i++) {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = i + ". " + chapters[i].latin + " (" + chapters[i].arabic + ")";
      sel.appendChild(o);
    }
    const go = el("button", "btn", "Ouvrir le plan");
    const msg = el("p", "error");
    go.addEventListener("click", () => mapAuto(Number(sel.value), chapters, go, msg));
    const row = el("div", "pick");
    row.appendChild(sel);
    row.appendChild(go);
    mapBox.appendChild(row);
    mapBox.appendChild(msg);
  } else {
    mapBox.appendChild(el("p", "error", "Impossible de charger la liste des sourates. Vérifiez votre connexion."));
  }
  mapBox.appendChild(el("p", "muted center small", "Les plans des histoires et des sourates sont un résumé simplifié écrit à la main : faites-les vérifier par un professeur. Les versets, eux, viennent de l'API."));
}

async function mapAuto(s, chapters, btn, msg) {
  msg.textContent = "";
  btn.disabled = true;
  btn.textContent = "Chargement…";
  try {
    const verses = chapters[s].verses;
    const starts = await getUnitStarts(s, 1, verses, "p", 1);
    const nodes = starts.map((a, i) => ({
      t: "Partie " + (i + 1),
      ar: "المقطع " + (i + 1),
      r: [[s + ":" + a, s + ":" + (i + 1 < starts.length ? starts[i + 1] - 1 : verses)]]
    }));
    mapOpen({ emoji: "📖", title: "Sourate " + chapters[s].latin + " · plan par pages", ar: "سورة " + chapters[s].arabic, nodes });
  } catch (err) {
    console.error(err);
    msg.textContent = "Impossible de calculer le plan (connexion ?). Réessayez.";
    btn.disabled = false;
    btn.textContent = "Ouvrir le plan";
  }
}

async function mapOpen(map) {
  mapShell();
  const back = el("button", "link-btn", "← Toutes les cartes");
  back.addEventListener("click", mapsHome);
  mapBox.appendChild(back);
  const msg = el("p", "muted center", "Chargement…");
  mapBox.appendChild(msg);
  let chapters;
  try {
    chapters = await getChapters();
  } catch (err) {
    console.error(err);
    msg.className = "error";
    msg.textContent = "Impossible de charger les sourates. Vérifiez votre connexion.";
    return;
  }
  msg.remove();

  const center = el("div", "map-center");
  center.appendChild(el("div", "map-center-fr", map.emoji + " " + map.title));
  center.appendChild(el("div", "map-center-ar", map.ar));
  mapBox.appendChild(center);

  const hideLabel = el("label", "rc-hide");
  const hideBox = document.createElement("input");
  hideBox.type = "checkbox";
  hideBox.checked = mapState.hide;
  hideLabel.appendChild(hideBox);
  hideLabel.appendChild(document.createTextNode(" Cacher les titres (test de mémoire) : touchez une branche pour la révéler"));
  mapBox.appendChild(hideLabel);

  // Exercices pour fixer la carte dans la mémoire
  const exoRow = el("div", "actions center-actions");
  const bOrder = el("button", "btn ghost", "🔀 Remettre dans l'ordre");
  const bWhich = el("button", "btn ghost", "❓ Quelle branche ?");
  exoRow.appendChild(bOrder);
  exoRow.appendChild(bWhich);
  mapBox.appendChild(exoRow);
  const exo = el("div", "map-exo");
  mapBox.appendChild(exo);
  bOrder.addEventListener("click", () => mapOrder(map, exo));
  bWhich.addEventListener("click", () => mapWhich(map, chapters, exo));

  const posterBox = el("div", "");
  mapBox.appendChild(posterBox);
  const tree = el("div", "map-tree hidden");
  mapBox.appendChild(tree);

  // Deux présentations : affiche (carte mentale) ou liste (versets)
  const viewRow = el("div", "modes");
  const vPoster = el("button", "mode active", "🗺 Affiche");
  const vList = el("button", "mode", "📋 Liste et versets");
  viewRow.appendChild(vPoster);
  viewRow.appendChild(vList);
  mapBox.insertBefore(viewRow, exoRow);
  const showView = (v) => {
    stopAudio();
    vPoster.classList.toggle("active", v === "poster");
    vList.classList.toggle("active", v === "list");
    posterBox.classList.toggle("hidden", v !== "poster");
    tree.classList.toggle("hidden", v !== "list");
  };
  const drawPoster = () => mapPoster(map, chapters, posterBox, hideBox.checked, (i) => {
    showView("list");
    const head = tree.querySelectorAll(".map-node")[i];
    if (head) {
      const body = head.parentElement.querySelector(".map-body");
      if (body && body.classList.contains("hidden")) head.click();
      head.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  vPoster.addEventListener("click", () => showView("poster"));
  vList.addEventListener("click", () => showView("list"));
  hideBox.addEventListener("change", drawPoster);
  drawPoster();

  map.nodes.forEach((n, i) => {
    const branch = el("div", "map-branch");
    branch.style.setProperty("--bc", MAP_COLORS[i % MAP_COLORS.length]);
    const head = el("button", "map-node");
    head.appendChild(el("span", "map-num", String(i + 1)));
    const txt = el("span", "map-txt");
    const fr = el("span", "map-fr", n.t);
    const ar = el("span", "map-ar", n.ar);
    ar.lang = "ar";
    ar.dir = "rtl";
    txt.appendChild(fr);
    txt.appendChild(ar);
    txt.appendChild(el("span", "map-ref", n.r.map((x) => mapRef(x, chapters)).join(" · ")));
    head.appendChild(txt);
    branch.appendChild(head);
    const body = el("div", "map-body hidden");
    branch.appendChild(body);
    tree.appendChild(branch);

    let revealed = false;
    const applyHide = () => { branch.classList.toggle("map-masked", hideBox.checked && !revealed); };
    applyHide();
    hideBox.addEventListener("change", () => { mapState.hide = hideBox.checked; revealed = false; applyHide(); });

    let loaded = false;
    head.addEventListener("click", () => {
      if (branch.classList.contains("map-masked")) { revealed = true; applyHide(); return; }
      body.classList.toggle("hidden");
      if (!body.classList.contains("hidden") && !loaded) { loaded = true; mapLoadBody(body, n, chapters); }
      if (body.classList.contains("hidden")) stopAudio();
    });
  });
  mapBox.appendChild(el("p", "muted center small", "Plan simplifié écrit à la main, à faire vérifier par un professeur."));
}

// Charge les versets d'une branche (5 à la fois) avec les cartes habituelles (audio, karaoké, enregistrement…)
async function mapLoadBody(body, node, chapters) {
  const keys = node.r.flatMap((r) => mapKeys(r, chapters));
  let shown = 0;
  const list = el("div", "");
  body.appendChild(list);

  if (node.r.length === 1 && typeof rc !== "undefined" && typeof reciteStart === "function") {
    const [s, a] = node.r[0][0].split(":").map(Number);
    const b = Number(node.r[0][1].split(":")[1]);
    const btn = el("button", "btn ghost", "🎙 Réciter ce passage");
    btn.addEventListener("click", () => {
      rc.surah = s;
      rc.from = a;
      rc.to = Math.min(b, a + 19);
      if (!hfContent) hfContent = document.createElement("div"); // évite que l'onglet Hifdh recharge « Mémoriser » par-dessus
      document.querySelector('.tab[data-view="hifdh"]').click();
      reciteStart();
    });
    const row = el("div", "actions");
    row.appendChild(btn);
    body.appendChild(row);
  }

  const more = el("button", "btn", "");
  const wrap = el("div", "center");
  wrap.appendChild(more);
  body.appendChild(wrap);

  async function load() {
    const slice = keys.slice(shown, shown + 5);
    more.disabled = true;
    more.textContent = "Chargement…";
    try {
      const verses = await Promise.all(slice.map(getVerse));
      verses.forEach((v) => list.appendChild(buildCard(v, chapters)));
      shown += slice.length;
    } catch (err) {
      console.error(err);
      list.appendChild(el("p", "error", "Impossible de charger les versets. Vérifiez votre connexion."));
    }
    more.disabled = false;
    if (shown >= keys.length) wrap.remove();
    else more.textContent = "Voir la suite (" + (keys.length - shown) + " versets restants)";
  }
  more.addEventListener("click", load);
  if (!keys.length) { wrap.remove(); list.appendChild(el("p", "muted", "Passage introuvable.")); return; }
  load();
}

document.querySelector('.tab[data-view="maps"]').addEventListener("click", mapsHome);

// ---------- Exercice 1 : remettre les branches dans l'ordre ----------
function mapOrder(map, exo) {
  stopAudio();
  exo.innerHTML = "";
  const nodes = map.nodes.slice(0, 12); // 12 branches au maximum, dans l'ordre de la carte
  let next = 0, errors = 0;
  const box = el("div", "verse");
  box.appendChild(el("p", "game-ask", "Touchez les branches dans le bon ordre (de la 1re à la dernière)"));
  box.appendChild(el("p", "ar-sub", "رتّب الفروع بالترتيب الصحيح"));
  const status = el("p", "muted center", "Prochaine : n° 1 · erreurs : 0");
  box.appendChild(status);
  const grid = el("div", "choices one-col");
  shuffle(nodes.map((n, i) => i)).forEach((i) => {
    const b = el("button", "choice");
    b.appendChild(el("span", "", nodes[i].t));
    const ar = el("span", "choice-ar", nodes[i].ar);
    ar.lang = "ar";
    b.appendChild(ar);
    b.addEventListener("click", () => {
      if (i === next) {
        b.disabled = true;
        b.classList.add("correct");
        b.prepend(el("strong", "", (i + 1) + ". "));
        next++;
        if (next === nodes.length) {
          status.textContent = errors === 0 ? "Parfait, aucune erreur ! mashaAllah ✅" : "Terminé avec " + errors + " erreur" + (errors > 1 ? "s" : "") + ". Recommencez pour faire mieux.";
          markToday();
        } else status.textContent = "Prochaine : n° " + (next + 1) + " · erreurs : " + errors;
      } else {
        errors++;
        b.classList.add("wrong");
        setTimeout(() => b.classList.remove("wrong"), 600);
        status.textContent = "Prochaine : n° " + (next + 1) + " · erreurs : " + errors;
      }
    });
    grid.appendChild(b);
  });
  box.appendChild(grid);
  const row = el("div", "actions center-actions");
  const again = el("button", "btn ghost", "Recommencer");
  again.addEventListener("click", () => mapOrder(map, exo));
  const close = el("button", "btn ghost", "Fermer");
  close.addEventListener("click", () => (exo.innerHTML = ""));
  row.appendChild(again);
  row.appendChild(close);
  box.appendChild(row);
  exo.appendChild(box);
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---------- Exercice 2 : de quelle branche vient ce verset ? ----------
async function mapWhich(map, chapters, exo) {
  stopAudio();
  const total = Math.min(5, map.nodes.length);
  const picks = shuffle(map.nodes.map((n, i) => i)).slice(0, total);
  let q = 0, score = 0;
  const close = () => (exo.innerHTML = "");

  async function ask() {
    exo.innerHTML = "";
    const box = el("div", "verse");
    exo.appendChild(box);
    if (q >= total) {
      box.appendChild(el("p", "final-score", score + " / " + total));
      const row = el("div", "actions center-actions");
      const again = el("button", "btn", "Rejouer");
      again.addEventListener("click", () => mapWhich(map, chapters, exo));
      const b2 = el("button", "btn ghost", "Fermer");
      b2.addEventListener("click", close);
      row.appendChild(again);
      row.appendChild(b2);
      box.appendChild(row);
      return;
    }
    const node = map.nodes[picks[q]];
    const keys = node.r.flatMap((r) => mapKeys(r, chapters));
    box.appendChild(el("p", "muted center", "Question " + (q + 1) + " / " + total));
    const msg = el("p", "muted center", "Chargement du verset…");
    box.appendChild(msg);
    let v;
    try {
      if (!keys.length) throw new Error("passage vide");
      v = await getVerse(keys[randInt(0, keys.length - 1)]);
    } catch (err) {
      console.error(err);
      msg.className = "error";
      msg.textContent = "Impossible de charger le verset. Vérifiez votre connexion.";
      return;
    }
    msg.remove();
    const p = el("p", "arabic", v.arabic);
    p.lang = "ar";
    p.dir = "rtl";
    box.appendChild(p);
    const play = el("button", "btn ghost", "🔊 Écouter");
    play.addEventListener("click", () => toggleAudio(play, v.audio));
    const ac = el("div", "actions");
    ac.appendChild(play);
    box.appendChild(ac);
    box.appendChild(el("p", "game-ask", "De quelle branche vient ce verset ?"));
    box.appendChild(el("p", "ar-sub", "من أي فرع هذه الآية؟"));
    const others = shuffle(map.nodes.filter((n) => n !== node)).slice(0, 3);
    const opts = shuffle([node, ...others]);
    const grid = el("div", "choices one-col");
    const btns = [];
    opts.forEach((o) => {
      const b = el("button", "choice");
      b.appendChild(el("span", "", o.t));
      const ar = el("span", "choice-ar", o.ar);
      ar.lang = "ar";
      b.appendChild(ar);
      b.addEventListener("click", () => {
        btns.forEach((x) => (x.disabled = true));
        const good = o === node;
        if (good) score++;
        b.classList.add(good ? "correct" : "wrong");
        btns[opts.indexOf(node)].classList.add("correct");
        markToday();
        const fb = el("div", "feedback " + (good ? "ok" : "no"));
        fb.appendChild(el("strong", "", (good ? "Bonne réponse ! ✅" : "Pas tout à fait.") + " Verset " + v.key + " : « " + node.t + " »."));
        fb.appendChild(el("p", "french", v.french));
        const nx = el("button", "btn", q + 1 >= total ? "Voir mon score" : "Question suivante →");
        nx.addEventListener("click", () => { q++; ask(); });
        fb.appendChild(nx);
        box.appendChild(fb);
        fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      btns.push(b);
      grid.appendChild(b);
    });
    box.appendChild(grid);
  }
  ask();
}

// ---------- Vue « affiche » : cercle central + branches colorées, comme une carte mentale ----------
function mapPoster(map, chapters, box, hidden, openBranch) {
  box.innerHTML = "";
  const poster = el("div", "poster");
  const center = el("div", "poster-center");
  const car = el("div", "poster-center-ar", map.ar);
  car.lang = "ar";
  center.appendChild(car);
  center.appendChild(el("div", "poster-center-fr", map.emoji + " " + map.title));
  poster.appendChild(center);
  poster.appendChild(el("div", "poster-trunk"));

  const card = (n, i, side) => {
    const c = el("button", "pcard " + side + (hidden ? " pmasked" : ""));
    c.style.setProperty("--bc", MAP_COLORS[i % MAP_COLORS.length]);
    const head = el("div", "pcard-head");
    head.appendChild(el("span", "pnum", String(i + 1)));
    const t = el("span", "ptitle");
    t.appendChild(el("strong", "", n.t));
    const ar = el("span", "pcard-ar", n.ar);
    ar.lang = "ar";
    t.appendChild(ar);
    head.appendChild(t);
    c.appendChild(head);
    const body = el("div", "pcard-body");
    body.appendChild(el("div", "pcard-ref", "الآيات · " + n.r.map((x) => mapRef(x, chapters)).join(" · ")));
    if (n.k) {
      const ul = el("ul", "pcard-list");
      n.k.forEach(([fr, a]) => {
        const li = el("li", "");
        li.appendChild(document.createTextNode(fr));
        const sp = el("span", "pcard-ar", a);
        sp.lang = "ar";
        li.appendChild(sp);
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }
    if (n.i) {
      const idea = el("div", "pcard-idea");
      idea.appendChild(el("span", "", "💡 " + n.i[0]));
      const sp = el("span", "pcard-ar", n.i[1]);
      sp.lang = "ar";
      idea.appendChild(sp);
      body.appendChild(idea);
    }
    c.appendChild(body);
    c.addEventListener("click", () => {
      if (c.classList.contains("pmasked")) { c.classList.remove("pmasked"); return; }
      openBranch(i);
    });
    return c;
  };

  for (let i = 0; i < map.nodes.length; i += 2) {
    const row = el("div", "prow");
    row.appendChild(card(map.nodes[i], i, "left"));
    row.appendChild(el("div", "pmid"));
    if (map.nodes[i + 1]) row.appendChild(card(map.nodes[i + 1], i + 1, "right"));
    else row.appendChild(el("div", ""));
    poster.appendChild(row);
  }
  if (map.goal) {
    const goal = el("div", "poster-goal");
    goal.appendChild(el("strong", "", "⭐ Idée générale · الفكرة العامة"));
    goal.appendChild(el("p", "", map.goal[0]));
    const a = el("p", "pcard-ar", map.goal[1]);
    a.lang = "ar";
    a.dir = "rtl";
    goal.appendChild(a);
    poster.appendChild(goal);
  }
  box.appendChild(poster);
  box.appendChild(el("p", "muted center small", "Touchez une branche pour lire ses versets."));
}