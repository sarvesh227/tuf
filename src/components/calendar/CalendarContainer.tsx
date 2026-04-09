import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "../../hooks/useCalendar";
import type { SelectionMode } from "../../hooks/useCalendar";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesSection from "./NotesSection";
import CalendarNavigation from "./CalendarNavigation";

// ── Month theme colors ────────────────────────────────────────────────────────
export const MONTH_THEME_COLORS = [
  "#1D94D5", // Jan — Blue
  "#E83E8C", // Feb — Pink
  "#28A745", // Mar — Green
  "#FD7E14", // Apr — Orange
  "#6F42C1", // May — Purple
  "#FFC107", // Jun — Gold
  "#DC3545", // Jul — Red
  "#20C997", // Aug — Teal
  "#007BFF", // Sep — Deep Blue
  "#D35400", // Oct — Autumn
  "#6C757D", // Nov — Slate
  "#17A2B8", // Dec — Cyan
];

// ── Page flip animation variants ─────────────────────────────────────────────
const pageVariants = {
  initial: (direction: number) => ({
    rotateX: direction > 0 ? 90 : -90,
    opacity: 0,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.5)",
  }),
  animate: {
    rotateX: 0,
    opacity: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    transition: { duration: 0.55 },
  },
  exit: (direction: number) => ({
    rotateX: direction < 0 ? 90 : -90,
    opacity: 0,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.5)",
    transition: { duration: 0.55 },
  }),
};

// ── Spiral Binding SVG (memoized) ─────────────────────────────────────────────
const SpiralBinding = React.memo(function SpiralBinding() {
  return (
    <div
      className="absolute top-0 left-0 w-full z-40 pointer-events-none"
      style={{ borderTopLeftRadius: "6px", borderTopRightRadius: "6px" }}
    >
      <div className="w-full flex justify-center items-start pt-1">
        <svg
          className="w-full h-auto overflow-visible select-none"
          style={{ maxWidth: "560px" }}
          viewBox="0 16 510 48"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e2024" />
              <stop offset="25%" stopColor="#555a64" />
              <stop offset="50%" stopColor="#7a808f" />
              <stop offset="75%" stopColor="#3c3f48" />
              <stop offset="100%" stopColor="#141518" />
            </linearGradient>
            <filter id="wire-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
            </filter>
            <filter id="wire-shadow-h" filterUnits="userSpaceOnUse" x="-10" y="-10" width="530" height="50">
              <feDropShadow dx="0" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Horizontal wire + hanger hook */}
          <path
            d="M 65,9 L 238,9 C 246,9 249,-2 255,-2 C 261,-2 264,9 272,9 L 445,9"
            fill="none"
            stroke="url(#metal)"
            strokeWidth="2.4"
            filter="url(#wire-shadow-h)"
            strokeLinecap="round"
          />
          <rect x="253.5" y="-3.5" width="3" height="5" rx="1.5" fill="#141518" filter="url(#wire-shadow-h)" />

          {/* Wire loops */}
          {Array.from({ length: 32 }).map((_, i) => {
            if (i === 15 || i === 16) return null;
            const x = i * 16 + 4;
            return (
              <g key={i} transform={`translate(${x},0)`}>
                <rect x="2.3" y="15.5" width="7.5" height="9" rx="1.2" fill="#141518" />
                <rect x="2.3" y="15.5" width="6" height="2.3" rx="1.2" fill="#000" opacity="0.7" />
                <path d="M3.6,16 C3.6,8 1.2,4 4.6,4 C8,4 5.6,8 5.6,20" fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
                <path d="M6.8,16 C6.8,8 4.4,4 7.8,4 C11.2,4 8.8,8 8.8,20" fill="none" stroke="url(#metal)" strokeWidth="1.6" filter="url(#wire-shadow)" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
});

// ── Mode Toggle ───────────────────────────────────────────────────────────────
interface ModeToggleProps {
  mode: SelectionMode;
  themeColor: string;
  onMode: (m: SelectionMode) => void;
}
function ModeToggle({ mode, themeColor, onMode }: ModeToggleProps) {
  return (
    <div
      className="flex items-center rounded-full overflow-hidden border text-xs font-semibold"
      style={{ borderColor: "#d1d5db" }}
    >
      {(["single", "range"] as SelectionMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onMode(m)}
          className="px-3 py-1 transition-all"
          style={{
            background: mode === m ? themeColor : "white",
            color: mode === m ? "white" : "#6b7280",
          }}
        >
          {m === "single" ? "Single" : "Range"}
        </button>
      ))}
    </div>
  );
}

// ── Icon helpers (no lucide dependency) ───────────────────────────────────────
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const EraserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M20 20H7L3 16l11-11 7 7-1 8z" /><line x1="6" y1="14" x2="14" y2="14" />
  </svg>
);

// ── CalendarContainer (main export) ──────────────────────────────────────────
export default function CalendarContainer() {
  const {
    today, currentYear, currentMonth, direction, range, notes, dayNotes,
    markedDates, selectionMode, isDarkMode,
    handleDayClick, handleNotesChange, addNoteForDay, deleteDayNote,
    clearAllNotes, goToPrevMonth, goToNextMonth, toggleDarkMode, handleModeChange,
  } = useCalendar();

  const themeColor = MONTH_THEME_COLORS[currentMonth];

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-300"
      style={{
        background: isDarkMode
          ? "radial-gradient(circle at 85% 15%, #1e293b 0%, #0f172a 100%)"
          : "radial-gradient(circle at 85% 15%, #ffffff 0%, #f0f1f5 40%, #e2e4e9 100%)",
      }}
    >
      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between px-4 py-3 max-w-[580px] w-full mx-auto mt-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight" style={{ color: themeColor }}>
            🗓 Wall Calendar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle mode={selectionMode} themeColor={themeColor} onMode={handleModeChange} />
          <button
            onClick={() => {
              if (window.confirm("Clear ALL saved notes?")) clearAllNotes();
            }}
            className="p-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all"
            title="Clear all notes"
          >
            <EraserIcon />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title="Toggle dark mode"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* ── Calendar card ── */}
      <div className="flex-1 flex items-start justify-center px-2 pb-8">
        <div
          className="w-full bg-white dark:bg-gray-900 relative mt-8"
          style={{
            maxWidth: "560px",
            borderRadius: "6px",
            perspective: "1200px",
            border: "1px solid #d4d8e0",
            boxShadow: isDarkMode
              ? "-8px 16px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.2)"
              : "-16px 20px 32px rgba(0,0,0,0.15), -4px 6px 12px rgba(0,0,0,0.08)",
          }}
        >
          {/* Spiral binding at top */}
          <SpiralBinding />

          {/* Navigation arrows */}
          <CalendarNavigation onPrev={goToPrevMonth} onNext={goToNextMonth} />

          {/* Animated month page */}
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={`${currentYear}-${currentMonth}`}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                transformOrigin: "top center",
                backfaceVisibility: "hidden",
                width: "100%",
                backgroundColor: isDarkMode ? "#111827" : "white",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {/* Hero image */}
              <HeroImage
                year={currentYear}
                month={currentMonth}
                themeColor={themeColor}
                imageSrc=""
              />

              {/* Body: Notes (left) + Grid (right) */}
              <div className="flex flex-col sm:flex-row">
                <div className="order-2 sm:order-1 sm:w-[38%] min-h-[220px]">
                  <NotesSection
                    notes={notes}
                    onChange={handleNotesChange}
                    themeColor={themeColor}
                  />
                </div>
                <div className="order-1 sm:order-2 sm:w-[62%]">
                  <CalendarGrid
                    year={currentYear}
                    month={currentMonth}
                    range={range}
                    today={today}
                    onDayClick={handleDayClick}
                    dayNotes={dayNotes}
                    markedDates={markedDates}
                    onAddNote={addNoteForDay}
                    onDeleteNote={deleteDayNote}
                    themeColor={themeColor}
                  />
                </div>
              </div>

              {/* Tip footer */}
              <div
                className="text-center py-2 text-gray-400 dark:text-gray-600"
                style={{ fontSize: "0.62rem", borderTop: "1px solid #f3f4f6" }}
              >
                Right-click any date to add a note · Red dot = saved note
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
