# Laptop Stickers — Design Spec

**Date:** 2026-04-18  
**Project:** `/Users/sara/builds/laptop-stickers`  
**Status:** Approved

---

## Overview

A single-page interactive toy where users drag stickers onto the back of a realistic MacBook lid. Stickers are provided by Sara as PNG/SVG files. Layout persists via localStorage. Sounds play on add and remove.

---

## Scene & Visual Design

- **Background:** Near-black (`#0a0a0a`), full viewport
- **MacBook:** Realistic aluminium lid rendered in CSS (gradient + highlights + inset shadows). No photo — high-fidelity CSS mockup so it scales cleanly and needs no external image assets for the chassis.
- **Lid drop zone:** The lid surface is the interactive canvas. Stickers can be dropped anywhere within it.
- **Glow:** A soft white radial glow beneath the MacBook base for depth.
- **Apple logo:** Subtle, desaturated — rendered in the lid centre, purely decorative.

---

## Layout

Three-column layout centred on the page:

| Column | Contents |
|--------|----------|
| Left (130px) | Sticker panel — 2-column grid of all available stickers |
| Centre (flex) | MacBook lid canvas |
| Right (90px) | Actions — Clear All, Screenshot |

The sticker panel scrolls vertically if there are many stickers.

---

## Sticker Panel

- Sara drops her PNG/SVG files into `src/stickers/` at build time
- Vite's `import.meta.glob` auto-discovers all files in that folder — no manual registration
- Each sticker renders in the panel as a draggable thumbnail (60×60px, object-fit: contain)
- Stickers in the panel are **source items** — dragging from the panel creates a copy on the lid; the panel item stays

---

## MacBook Lid Canvas

- The lid is the **drop zone** — accepts dragged stickers from the panel
- Each dropped sticker gets:
  - Position: drop coordinates relative to lid (clamped to lid bounds)
  - Random rotation: ±12° on drop for a natural, organic look
  - Size: 64px default, same for all stickers
- **Reposition:** Dragged freely within the lid after placement
- **Remove:** Single click on any placed sticker removes it from the lid
- **Stacking:** Later drops render on top (z-index by insertion order)

---

## Interactions

| Action | Behaviour |
|--------|-----------|
| Drag sticker from panel | Lifts a ghost image, cursor changes to grabbing |
| Drop onto lid | Sticker placed at drop position with random rotation |
| Drop outside lid | Cancelled, sticker returns to panel (no change) |
| Click placed sticker | Removes it from the lid |
| Drag placed sticker | Repositions it freely within lid bounds |
| Clear All button | Removes all stickers from lid, clears localStorage |
| Screenshot button | Uses `html2canvas` to capture the MacBook area, downloads as PNG |

---

## Sound Design

Implemented with the **Web Audio API** — zero audio files, zero dependencies.

| Event | Sound |
|-------|-------|
| Sticker added | Short high-pitched pop: oscillator at 800Hz → 400Hz over 120ms, type: `sine` |
| Sticker removed | Quick descending tone: oscillator at 400Hz → 200Hz over 80ms, type: `triangle` |

Both sounds use a `GainNode` with a fast attack (0ms) and quick exponential decay to avoid clicks.

---

## Persistence

- On every state change (add, remove, reposition), the full sticker layout is serialised to `localStorage` as JSON
- Key: `laptop-stickers-layout`
- Shape: `Array<{ id: string, src: string, x: number, y: number, rotation: number }>`
- On page load, layout is restored from localStorage before first render

---

## Tech Stack

| | |
|--|--|
| **Bundler** | Vite |
| **Framework** | React 18 |
| **Drag** | `react-draggable` for placed stickers on lid · HTML5 native drag API for panel → lid |
| **Sound** | Web Audio API (no library) |
| **Screenshot** | `html2canvas` |
| **Styling** | Plain CSS (no Tailwind needed at this scale) |
| **Sticker assets** | Sara's PNG/SVG files in `src/stickers/`, auto-imported via `import.meta.glob` |

---

## File Structure

```
laptop-stickers/
├── src/
│   ├── stickers/          ← Sara drops her PNG/SVG files here
│   ├── components/
│   │   ├── MacBook.jsx    ← Lid canvas + drop zone
│   │   ├── StickerPanel.jsx  ← Left panel with draggable source stickers
│   │   ├── PlacedSticker.jsx ← Individual sticker on the lid
│   │   └── Actions.jsx    ← Clear All + Screenshot buttons
│   ├── hooks/
│   │   ├── useSound.js    ← Web Audio API sound effects
│   │   └── useLayout.js   ← localStorage read/write
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Out of Scope

- User uploading custom stickers at runtime
- Backend or sharing via URL
- Sticker resizing or rotation controls
- Mobile / touch support (desktop-only for now)
