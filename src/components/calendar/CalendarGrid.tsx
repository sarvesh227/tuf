import { useMemo } from "react";
import { dayKey, isSameDay, stripTime } from "../../lib/calendarUtils";
import CalendarDay from "./CalendarDay";
import type { SelectedRange } from "../../hooks/useCalendar";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarGridProps {
  year: number;
  month: number;
  range: SelectedRange;
  today: Date;
  onDayClick: (date: Date) => void;
  dayNotes: Record<string, string[]>;
  markedDates: Set<string>;
  onAddNote: (date: Date, text: string) => void;
  onDeleteNote: (date: Date, index: number) => void;
  themeColor: string;
}

function computeDayState(
  date: Date, isCurrentMonth: boolean, today: Date,
  range: { start: Date | null; end: Date | null }
) {
  const d = stripTime(date);
  const isToday = isSameDay(d, stripTime(today));
  const start = range.start ? stripTime(range.start) : null;
  const end = range.end ? stripTime(range.end) : null;
  let isStart = false, isEnd = false, isInRange = false;
  if (start) {
    isStart = isSameDay(d, start);
    if (end) {
      isEnd = isSameDay(d, end);
      isInRange = d > start && d < end;
    }
  }
  const dow = (date.getDay() + 6) % 7; // Mon=0…Sun=6
  const isWeekend = dow >= 5;
  return { isToday, isStart, isEnd, isInRange, isWeekend, isCurrentMonth, hasEnd: !!end };
}

export default function CalendarGrid({
  year, month, range, today, onDayClick,
  dayNotes, markedDates, onAddNote, onDeleteNote, themeColor,
}: CalendarGridProps) {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const grid: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      grid.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const remaining = 42 - grid.length;
    for (let d = 1; d <= remaining; d++) {
      grid.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }
    return grid;
  }, [year, month]);

  const cellStates = useMemo(
    () => cells.map(({ date, isCurrentMonth }) => computeDayState(date, isCurrentMonth, today, range)),
    [cells, range, today]
  );

  return (
    <div className="p-4 pt-5 pr-5 pb-5 pl-4">
      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className="text-center font-bold tracking-wider"
            style={{ fontSize: "0.6rem", paddingBottom: "4px", color: i >= 5 ? themeColor : "#888", letterSpacing: "0.08em" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map(({ date, isCurrentMonth }, idx) => {
          const state = cellStates[idx];
          const k = dayKey(date);
          const notesForDay = isCurrentMonth ? (dayNotes[k] ?? []) : [];
          const hasNote = isCurrentMonth && (notesForDay.length > 0 || markedDates.has(k));

          return (
            <CalendarDay
              key={idx}
              date={date}
              themeColor={themeColor}
              onClick={() => isCurrentMonth && onDayClick(date)}
              onAddNote={(text) => onAddNote(date, text)}
              onDeleteNote={(i) => onDeleteNote(date, i)}
              hasNote={hasNote}
              dayNotesList={notesForDay}
              markedDates={markedDates}
              {...state}
            />
          );
        })}
      </div>
    </div>
  );
}
