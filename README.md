# Sakîna – The Quran according to your state of mind

**Author:** Rahal imene – university project (TP)
**Live app:** _(add the deployed link here)_

Sakîna (سكينة, "inner peace") is a small Quranic web app built with plain HTML, CSS and JavaScript. No framework, no server, no account needed.

## Features

- **Verses by state of mind** – choose how you feel (anxious, sad, stressed by an exam, hopeful, grateful, lost, angry, remorseful, in need of patience) and get a hand-picked list of verses with the Arabic text and a French translation.
- **Karaoke recitation** – while the recitation plays, each Arabic word lights up at the moment it is recited (word timings come from the API). Words already recited turn green.
- **Recite and compare** – record your own recitation with the microphone, then listen to the reciter followed by you. The recording stays in your browser and is never uploaded.
- **Hifdh (memorisation)** – pick any verse and hide more and more of its words, click a hidden word to reveal it; or play "Complete the verse" where one word is missing and you choose among 4.
- **Tathbît – تثبيت (revise together)** – plan a memorisation of a surah with a daily quota; each day has a review of the last two days and a new portion, recited in turns. Turns can belong to real friends (share the plan by link, each on her own phone) or to "audio companions" (reciters) when nobody is available.
- **Tajwid for beginners** – short lessons (noon sakinah, meem sakinah, ghunnah, madd, qalqalah, silent letters) with examples taken live from the Quran.com tajweed-annotated text, audio, record-and-compare, and a "which rule is it?" quiz. It does not judge the user's voice and does not replace a teacher.
- **Favourites and progress** – star any verse, see your streak of days, games played and best scores in "Mon espace" (all stored in your browser only).
- **Daily challenge** – the same 10 questions for everyone each day, with a shareable score.
- **Verse image** – turn any verse into a picture to share.
- **Repeat** – loop a verse 3, 5 or 10 times while memorising. **Dark mode** included.
- **Guess the surah (game)** – 10 questions per game: a verse is shown, find which surah it comes from. Two levels: easy (short surahs) and hard (all 114).

## Data and API

All Quranic content (Arabic text, translation, audio, word timings, surah names) is fetched live from the free [Quran.com API v4](https://api.quran.com). Nothing Quranic is typed by hand: the code only stores verse references (for example `13:28`) for each state of mind.

- Translation: Muhammad Hamidullah (French)
- Reciter: Mishary Alafasy

## Run it locally

Open `index.html` in a browser (internet connection required).

## Files

| File | Role |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | Design |
| `emotions.js` | States of mind and their verse references |
| `app.js` | API calls, verse cards, audio, karaoke |
| `record.js` | Record and compare |
| `game.js` | Guess the surah game |
| `hifdh.js` | Memorisation and complete-the-verse |
| `rafiq.js` | Tathbît: shared memorisation plans |
| `tajwid.js` | Tajwid lessons and quiz |
| `recite.js` | Recitation test (beta): speech recognition vs. API text, tajweed colors |
| `wheel.js` | Wheel of surahs with questions (number, verse count, place, meaning) |
| `mutash.js` | Similar verses (mutashabihat): differences highlighted + quiz |
| `maps.js` | Mind maps of surahs and prophets' stories |
| `daily.js` | Daily challenge |
| `space.js` | Favourites and progress page |
| `store.js` | Saved data (favourites, streak, scores) |
| `extras.js` | Favourite and image buttons, dark mode |

## Français

Sakîna propose des versets selon l'état d'esprit, une récitation avec mots surlignés, un outil pour réciter et comparer sa voix avec celle du récitateur, et un jeu « Devine la sourate ». Le texte, la traduction et l'audio viennent de l'API Quran.com.
