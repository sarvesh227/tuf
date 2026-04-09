# Interactive Wall Calendar

A skeuomorphic wall calendar built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion**.

🔗 **Repo:** https://github.com/sarvesh227/tuf

## Features
- Single date & date range selection
- Notes panel with save — marks all selected dates with red dots
- Right-click any date to add quick per-day notes
- Holiday auto-fill (Christmas, Halloween, etc.)
- Framer Motion page-flip animation between months
- All notes persisted via `localStorage`

## Tech Choices
- **`useCalendar` hook** — all business logic extracted from UI components
- **Framer Motion** — smooth `rotateX` page flip (replaced react-pageflip)
- **localStorage** — no backend needed, notes persist across refreshes
- **Modular components** — `CalendarGrid`, `CalendarDay`, `NotesSection`, etc.

## Run Locally

```bash
git clone https://github.com/sarvesh227/tuf.git
cd tuf
npm install
npm run dev
```

Open **http://localhost:5173**
