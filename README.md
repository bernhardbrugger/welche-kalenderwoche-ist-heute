# 📅 Welche Kalenderwoche ist heute?

> A minimal web app that answers one question: **What calendar week is it today?**

**Live: [welche-kalenderwoche-ist-heute.at](https://welche-kalenderwoche-ist-heute.at/)**

## ✨ Features

- 🕐 Shows the current **ISO 8601 calendar week** with its Monday–Sunday date range
- 🇦🇹 The server-rendered title, description and first paragraph are calculated for **Vienna time**, not the server's UTC clock, so Sunday night and Monday morning are right. HTML is cached for two minutes, and `/sitemap.xml` marks the homepage as updated on Vienna's calendar day, so search snippets are not stuck on last week's crawl.
- 🔗 Every week has a stable URL (`/kw/2026/45`) whose title does not go stale
- 🗓 Bundesland holidays for Austria and Germany, common Swiss holidays, Fenstertage / Brückentage, working days
- ⌨️ Jump by date, KW or `2026-W45`. Arrow keys move between weeks
- 📱 Installable, light and dark, no account

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

## 💡 Why?

Because sometimes you just need to know what week it is — without ads, cookie banners, or slow page loads.

---

© Bernhard Brugger, 2025
