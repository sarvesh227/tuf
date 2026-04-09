import { useState, useEffect, useCallback, useMemo } from "react";
import { dayKey } from "../lib/calendarUtils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SelectedRange {
  start: Date | null;
  end: Date | null;
}

type DayNotes = Record<string, string[]>;

export type SelectionMode = "single" | "range";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCalendar() {
  const today = useMemo(() => new Date(), []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [direction, setDirection] = useState(0); // -1 = prev, +1 = next
  const [range, setRange] = useState<SelectedRange>({ start: null, end: null });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("range");
  const [notes, setNotes] = useState("");
  const [dayNotes, setDayNotes] = useState<DayNotes>({});
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // ── Dark Mode ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ── Marked dates (red dots) ────────────────────────────────────────────────
  const updateMarkedDates = useCallback(() => {
    const newMarked = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("cal-day-notes-")) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as DayNotes;
            Object.keys(parsed).forEach(k => newMarked.add(k));
          }
        } catch { /* ignore */ }
      }
    }
    setMarkedDates(newMarked);
  }, []);

  // ── Persistence ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setNotes(
      localStorage.getItem(`cal-notes-${currentYear}-${currentMonth}`) ?? ""
    );
    const raw = localStorage.getItem(`cal-day-notes-${currentYear}-${currentMonth}`);
    if (!raw) {
      setDayNotes({});
      updateMarkedDates();
      return;
    }
    try {
      const parsed = JSON.parse(raw) as DayNotes;
      setDayNotes(parsed && typeof parsed === "object" ? parsed : {});
    } catch {
      setDayNotes({});
    }
    updateMarkedDates();
  }, [currentYear, currentMonth, updateMarkedDates]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleNotesChange = useCallback(
    (val: string) => {
      setNotes(val);
      localStorage.setItem(`cal-notes-${currentYear}-${currentMonth}`, val);
    },
    [currentYear, currentMonth]
  );

  const addNoteForDay = useCallback(
    (date: Date, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const k = dayKey(date);
      const nextDayNotes: DayNotes = {
        ...dayNotes,
        [k]: [...(dayNotes[k] ?? []), trimmed],
      };
      setDayNotes(nextDayNotes);
      localStorage.setItem(
        `cal-day-notes-${currentYear}-${currentMonth}`,
        JSON.stringify(nextDayNotes)
      );
      const line = `${k}: ${trimmed}`;
      const nextNotes = notes.trim().length
        ? `${notes.trimEnd()}\n${line}\n`
        : `${line}\n`;
      handleNotesChange(nextNotes);
      updateMarkedDates();
    },
    [currentYear, currentMonth, dayNotes, notes, handleNotesChange, updateMarkedDates]
  );

  const deleteDayNote = useCallback(
    (date: Date, index: number) => {
      const k = dayKey(date);
      const existing = dayNotes[k] ?? [];
      const updated = existing.filter((_, i) => i !== index);
      const nextDayNotes: DayNotes = { ...dayNotes, [k]: updated };
      if (updated.length === 0) delete nextDayNotes[k];
      setDayNotes(nextDayNotes);
      localStorage.setItem(
        `cal-day-notes-${currentYear}-${currentMonth}`,
        JSON.stringify(nextDayNotes)
      );
      updateMarkedDates();
    },
    [currentYear, currentMonth, dayNotes, updateMarkedDates]
  );

  const clearAllNotes = useCallback(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("cal-notes-") || key.startsWith("cal-day-notes-"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setNotes("");
    setDayNotes({});
    setMarkedDates(new Set());
  }, []);

  const handleDayClick = useCallback(
    (date: Date) => {
      if (selectionMode === "single") {
        setRange(prev =>
          prev.start && isSameDayLocal(prev.start, date)
            ? { start: null, end: null }
            : { start: date, end: null }
        );
        return;
      }
      setRange(prev => {
        if (!prev.start || (prev.start && prev.end)) return { start: date, end: null };
        if (isSameDayLocal(date, prev.start)) return { start: date, end: null };
        if (date < prev.start) return { start: date, end: prev.start };
        return { start: prev.start, end: date };
      });
    },
    [selectionMode]
  );

  const goToPrevMonth = useCallback(() => {
    setDirection(-1);
    setRange({ start: null, end: null });
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
    setRange({ start: null, end: null });
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  }, [currentMonth]);

  const toggleDarkMode = useCallback(() => setIsDarkMode(d => !d), []);
  const handleModeChange = useCallback((mode: SelectionMode) => {
    setSelectionMode(mode);
    if (mode === "single" && range.end) {
      setRange(prev => ({ start: prev.start, end: null }));
    }
  }, [range.end]);

  return {
    today, currentYear, currentMonth, direction,
    range, notes, dayNotes, markedDates,
    selectionMode, isDarkMode,
    handleDayClick, handleNotesChange, addNoteForDay, deleteDayNote,
    clearAllNotes, goToPrevMonth, goToNextMonth,
    toggleDarkMode, handleModeChange,
  } as const;
}

function isSameDayLocal(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
