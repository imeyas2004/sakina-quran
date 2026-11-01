# Sakîna – The Quran according to your state of mind

**Author:** Rahal imene – university project (TP)
**Live app:** _(add the deployed link here)_

Sakîna (سكينة, "inner peace") is a small Quranic web app built with plain HTML, CSS and JavaScript. No framework, no server, no account needed.

## Features

- **Verses by state of mind** – choose how you feel (anxious, sad, stressed by an exam, hopeful, grateful, lost, angry, remorseful, in need of patience) and get a hand-picked list of verses with the Arabic text and a French translation.
- **Karaoke recitation** – while the recitation plays, each Arabic word lights up at the moment it is recited (word timings come from the API). Words already recited turn green.
- **Recite and compare** – record your own recitation with the microphone, then listen to the reciter followed by you. The recording stays in your browser and is never uploaded.
- **Hifdh (memorisation)** – pick any verse and hide more and more of its words, click a hidden word to reveal it; or play "Complete the verse" where one word is missing and you choose among 4.
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

## Français

Sakîna propose des versets selon l'état d'esprit, une récitation avec mots surlignés, un outil pour réciter et comparer sa voix avec celle du récitateur, et un jeu « Devine la sourate ». Le texte, la traduction et l'audio viennent de l'API Quran.com.
