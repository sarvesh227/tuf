import React, { memo } from "react";
import DayNotePopup, { clampPopupPosition } from "./DayNotePopup";
import { holidays } from "../../lib/calendarUtils";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isWeekend: boolean;
  hasEnd: boolean;
  themeColor: string;
  onClick: () => void;
  hasNote: boolean;
  dayNotesList: string[];
  onAddNote: (text: string) => void;
  onDeleteNote: (index: number) => void;
  markedDates: Set<string>;
}

function CalendarDay({
  date, isCurrentMonth, isToday, isStart, isEnd,
  isInRange, isWeekend, hasEnd, themeColor,
  onClick, hasNote, dayNotesList, onAddNote, onDeleteNote,
}: CalendarDayProps) {
  const dayNum = date.getDate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState<{ x: number; y: number } | null>(null);

  // Holiday marker
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const holidayData = isCurrentMonth ? holidays[`${mm}-${dd}`] : null;

  // Red dot: has a saved day note
  const hasRedDot = hasNote;

  // Text color
  let textColor = "#2d3340";
  if (!isCurrentMonth) textColor = "#c5c5c5";
  else if (isWeekend) textColor = themeColor;

  // Range strip background
  let stripStyle: React.CSSProperties = {};
  if (isStart && isEnd) {
    stripStyle = {};
  } else if (isStart && hasEnd) {
    stripStyle = { background: `linear-gradient(to right, transparent 50%, ${themeColor}22 50%)` };
  } else if (isEnd) {
    stripStyle = { background: `linear-gradient(to right, ${themeColor}22 50%, transparent 50%)` };
  } else if (isInRange) {
    stripStyle = { background: `${themeColor}22` };
  }

  const isEndpoint = isStart || isEnd;
  const circleStyle: React.CSSProperties = isEndpoint
    ? { background: themeColor, color: "white", borderRadius: "50%" }
    : {};
  if (isEndpoint) textColor = "white";

  const todayRing = isToday && !isEndpoint
    ? { boxShadow: `0 0 0 1.5px ${themeColor}` }
    : {};

  return (
    <div
      className="flex items-center justify-center relative"
      style={{ height: "32px" }}
    >
      <div
        className="absolute w-full"
        style={{ height: "28px", top: "2px", ...stripStyle }}
      />
      <button
        onClick={onClick}
        disabled={!isCurrentMonth}
        className="flex items-center justify-center rounded-full transition-all duration-150 select-none relative z-10"
        style={{
          width: "28px", height: "28px", fontSize: "0.72rem",
          fontWeight: isEndpoint || isToday ? 700 : isCurrentMonth ? 500 : 400,
          color: textColor,
          cursor: isCurrentMonth ? "pointer" : "default",
          ...circleStyle, ...todayRing,
        }}
        onContextMenu={(e) => {
          if (!isCurrentMonth) return;
          e.preventDefault();
          setMenuPos(clampPopupPosition(e.clientX, e.clientY));
          setMenuOpen(true);
        }}
        onMouseEnter={(e) => {
          if (isCurrentMonth && !isEndpoint) {
            (e.currentTarget as HTMLButtonElement).style.background = `${themeColor}14`;
          }
        }}
        onMouseLeave={(e) => {
          if (isCurrentMonth && !isEndpoint) {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }
        }}
        title={holidayData ? `${holidayData.emoji} ${holidayData.name}` : undefined}
      >
        {dayNum}
      </button>

      {/* Holiday emoji badge */}
      {holidayData && (
        <span
          className="absolute pointer-events-none z-20 animate-pulse"
          style={{ top: "-2px", right: "-2px", fontSize: "10px", lineHeight: 1 }}
        >
          {holidayData.emoji}
        </span>
      )}

      {/* Red dot — has saved note */}
      {isCurrentMonth && hasRedDot && (
        <div
          aria-hidden
          className="absolute"
          style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#ef4444",
            bottom: "1px", left: "50%", transform: "translateX(-50%)", zIndex: 20,
          }}
        />
      )}

      {menuOpen && menuPos && (
        <DayNotePopup
          date={date}
          position={menuPos}
          notes={dayNotesList}
          onSave={onAddNote}
          onDelete={onDeleteNote}
          onClose={() => setMenuOpen(false)}
          themeColor={themeColor}
        />
      )}
    </div>
  );
}

export default memo(CalendarDay, (prev, next) =>
  prev.isStart === next.isStart &&
  prev.isEnd === next.isEnd &&
  prev.isInRange === next.isInRange &&
  prev.hasEnd === next.hasEnd &&
  prev.isToday === next.isToday &&
  prev.hasNote === next.hasNote &&
  prev.themeColor === next.themeColor &&
  prev.isCurrentMonth === next.isCurrentMonth
);
