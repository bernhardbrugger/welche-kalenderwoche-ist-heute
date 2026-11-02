# 📅 Welche Kalenderwoche ist heute?

> A minimal web app that answers one question: **What calendar week is it today?**

**Live: [welche-kalenderwoche-ist-heute.at](https://welche-kalenderwoche-ist-heute.at/)**

## ✨ Features

- 🕐 Shows the current **ISO 8601 calendar week** with its Monday–Sunday date range
- 🇦🇹 The server-rendered title and preview are calculated for **Vienna time**, not the server's UTC clock, so Sunday night and Monday morning are right
- 📱 Responsive design — works on mobile and desktop
- 🇩🇪 Designed for the German-speaking market (KW = Kalenderwoche)

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
