# 📅 Welche Kalenderwoche ist heute?

[![CI](https://github.com/bernhardbrugger/welche-kalenderwoche-ist-heute/actions/workflows/ci.yml/badge.svg)](https://github.com/bernhardbrugger/welche-kalenderwoche-ist-heute/actions/workflows/ci.yml)

> A minimal web app that answers one question: **What calendar week is it today?**

**Live: [welche-kalenderwoche-ist-heute.at](https://welche-kalenderwoche-ist-heute.at/)**

## ✨ Features

- 🕐 Shows the current **ISO 8601 calendar week** with its Monday–Sunday date range
- 🇦🇹 The server-rendered title, description and first paragraph are calculated for **Vienna time**, not the server's UTC clock, so Sunday night and Monday morning are right. HTML is cached for two minutes, and `/sitemap.xml` marks the homepage as updated on Vienna's calendar day, so search snippets are not stuck on last week's crawl.
- 🔗 Every week has a stable URL (`/kw/2026/45`) whose title does not go stale
- 🗓 Bundesland holidays for Austria and Germany, common Swiss holidays, Fenstertage / Brückentage, working days
- ⌨️ Jump by date, KW or `2026-W45`. Arrow keys move between weeks
- 🌤 Sky, sun and particles follow the season, the time of day in Vienna, and the weather of the selected region (Open-Meteo)
- 🎟 One daily ISO-week puzzle, a streak, and a note stored on the device for each week
- 📱 Installable. The plates follow the night automatically, or stay light or dark if you pin them

## 🛠 Tech Stack

React 18, TypeScript, Vite and Tailwind CSS, deployed on Netlify. A Netlify edge function
(`netlify/edge-functions/transform-meta.ts`) fills the page title, description and Open Graph tags with the
current week, so search results and link previews show the right week.
[Try it on StackBlitz →](https://stackblitz.com/~/github.com/bernhardbrugger/welche-kalenderwoche-ist-heute)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Check the edge function's week calculation against known dates (year boundaries, 53-week years, leap day, the Vienna/UTC boundary):

```bash
npm run check:week
```

## ⚠️ Limits

- **"Today" is Vienna's day, everywhere.** The page and the edge function both take the date in `Europe/Vienna`, so a
  visitor in New York sees the new week from Sunday 18:00 local time. The clock, sunrise and sunset are Vienna's too.
- **Holidays are coded by hand**, not loaded from an official source: Austria and Germany by Bundesland, Switzerland
  only with the holidays common to most cantons (no cantonal list). School holidays are not included.
- **Tests cover the week calculation only.** `npm run check:week` checks the edge function's ISO week against known
  dates and against date-fns for every day from 2019 to 2030; CI runs lint, that check and the build. Holidays,
  Fenstertage, the puzzle and the UI have no automated tests.
- **The weather line needs the network** (Open-Meteo); without it the line leaves the forecast out.
- **Notes, the puzzle streak and settings live in the browser's `localStorage`**: not synced between devices, and gone
  when the site data is cleared.
- **`npm run dev` does not run the edge function.** The week in the page title, description and preview tags is
  filled only on Netlify (or with the Netlify CLI).

## 💡 Why?

Because sometimes you just need to know what week it is — without ads, cookie banners, or slow page loads.

## 📄 License

MIT — see [LICENSE](LICENSE).

---

© Bernhard Brugger, 2025
