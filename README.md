# 🗓 Interactive Wall Calendar

A production-quality, interactive wall calendar built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion**. It mimics a physical wall calendar with a skeuomorphic design, smooth page-flip animations, persistent notes, date-range selection, and holiday auto-fill.

**Live Repo:** [https://github.com/sarvesh227/tuf](https://github.com/sarvesh227/tuf)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📅 Single / Range Selection | Toggle between selecting a single date or a full date range with a highlighted band |
| 📝 Range Notes | Click a date or select a range → write a note in the panel → Save marks all dates with a 🔴 red dot |
| 🖱️ Right-Click Notes | Right-click any day cell for an inline popup to add/delete per-day notes |
| 🎉 Holiday Auto-Fill | Clicking a holiday date (Christmas, Halloween, etc.) auto-populates the note with a default message |
| 🔴 Persistent Red Dots | Saved notes persist across refreshes via `localStorage` and mark all relevant dates |
| 📖 Page Flip Animation | Framer Motion `rotateX` animation simulates physically flipping a calendar page between months |
| 🔩 Spiral Binding | Metallic SVG wire binding at the top makes it feel like a real wall calendar |
| 🖼️ Monthly Hero Images | Each month has a unique seasonal photo banner with a geometric SVG overlay |
| ♾️ Continuous Navigation | Navigate freely across all 12 months, years cycle automatically (no dead ends) |
| 💾 Full Persistence | All notes, dots, and markers stored in `localStorage` — no backend needed |

---

## 🏗️ Architecture & Design Choices

### Modular Component Architecture
The project was deliberately restructured away from a monolithic component into a clean, modular system inspired by the reference repository pattern:

```
src/
├── hooks/
│   └── useCalendar.ts          ← ALL business logic (state, persistence, navigation)
├── lib/
│   └── calendarUtils.ts        ← Pure utilities: dayKey(), isSameDay(), stripTime(), holidays
├── components/
│   └── calendar/
│       ├── CalendarContainer.tsx  ← Orchestrates layout, consumes useCalendar hook
│       ├── CalendarGrid.tsx       ← Builds 7×6 date matrix (Mon–Sun)
│       ├── CalendarDay.tsx        ← Single memoized day cell with range stripe logic
│       ├── CalendarNavigation.tsx ← Prev/Next arrow buttons
│       ├── HeroImage.tsx          ← Monthly hero photo + geometric SVG overlay
│       ├── NotesSection.tsx       ← Lined-paper notes panel with Save button
│       └── DayNotePopup.tsx       ← Right-click popup for per-day notes
└── App.tsx                     ← Single line: renders CalendarContainer
```

### Key Technical Decisions

**`useCalendar` Custom Hook**
All state, localStorage persistence, range selection logic, and date markers live in one hook. Components are pure layout — they receive data and callbacks, nothing more. This makes each component independently testable and reusable.

**Framer Motion instead of react-pageflip**
Replaced `react-pageflip` with a `framer-motion` `AnimatePresence` + `rotateX` variant. This gives fine-grained control over the animation direction (next = flip down, prev = flip up), works cleanly with React's reconciliation, and has no dependency on DOM imperatives.

**localStorage as the data layer**
All notes are stored under structured keys:
- `cal-notes-YYYY-M` — general month scratchpad
- `cal-day-notes-YYYY-M` — per-day notes (right-click)
- `cal-range-note-YYYY-MM-DD_YYYY-MM-DD` — notes tied to a specific date/range

**Monday-first grid**
Days are rendered Mon–Sun (ISO week standard) using `(date.getDay() + 6) % 7` to shift Sunday from index 0 to index 6.

**Memoized CalendarDay**
`React.memo` with a custom equality comparator prevents the entire 42-cell grid from re-rendering on every state change — only the cells whose selection/note state actually changed re-render.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Page flip animation |
| `localStorage` | Client-side note persistence |

---

## 🚀 Running Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/sarvesh227/tuf.git
cd tuf

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Other Commands

```bash
npm run build      # Production build (outputs to /dist)
npm run preview    # Preview the production build locally
npx tsc --noEmit   # Type-check without compiling
```

---

## 📖 How to Use

1. **Browse months** — Click the `‹` / `›` arrows on the hero image to navigate months
2. **Select a date** — Click any date in Single mode, or click two dates in Range mode
3. **Add a note** — Type in the Notes panel on the left, then click **Save** → red dots appear on all selected dates
4. **Right-click a date** — Opens a popup to add/delete quick per-day notes
5. **Holiday dates** — Clicking a holiday (🎄 Dec 25, 🎃 Oct 31, etc.) auto-fills a default note
6. **Clear everything** — Use the 🧹 Eraser button in the toolbar to wipe all saved data

---

## 📂 Reference

This project was restructured following the architecture patterns from [rookiemaniesh/tuf-assignment](https://github.com/rookiemaniesh/tuf-assignment) — specifically the `useCalendar` hook pattern and component separation strategy, adapted to Vite + Framer Motion instead of Next.js + react-pageflip.
