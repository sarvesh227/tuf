import { useState } from "react";
import type { SelectedRange } from "../../hooks/useCalendar";

interface NotesSectionProps {
  // General month notes
  notes: string;
  onChange: (val: string) => void;
  themeColor: string;
  // Range-specific note
  range: SelectedRange;
  rangeNote: string;
  onRangeNoteChange: (val: string) => void;
  onSaveRangeNote: () => void;
  // General save (no selection)
  onSave?: () => void;
}

function formatRangeLabel(range: SelectedRange): string {
  if (!range.start) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startLabel = range.start.toLocaleDateString("en-US", opts);
  if (!range.end || range.end.toDateString() === range.start.toDateString()) {
    return startLabel;
  }
  return `${startLabel} – ${range.end.toLocaleDateString("en-US", opts)}`;
}

export default function NotesSection({
  notes, onChange, themeColor,
  range, rangeNote, onRangeNoteChange, onSaveRangeNote, onSave,
}: NotesSectionProps) {
  const [isSaved, setIsSaved] = useState(false);
  const hasSelection = !!range.start;
  const rangeLabel = formatRangeLabel(range);

  const handleSave = () => {
    if (hasSelection) {
      onSaveRangeNote();
    } else {
      onSave?.();
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const SaveIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  );
  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full" style={{ borderRight: "1px solid #eaeaea" }}>

      {/* Header */}
      <div
        className="px-3 pt-3 pb-2 flex items-center justify-between gap-2"
        style={{ borderBottom: `1px solid ${themeColor}30` }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: themeColor }}
          >
            Notes
          </div>
          {hasSelection && (
            <div
              className="text-xs font-medium mt-0.5 truncate"
              style={{ color: "#6b7280" }}
            >
              📅 {rangeLabel}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-all shrink-0"
          style={{
            background: isSaved ? `${themeColor}20` : `${themeColor}15`,
            color: isSaved ? themeColor : "#6b7280",
            border: `1px solid ${themeColor}30`,
          }}
        >
          {isSaved ? <><CheckIcon /> Saved!</> : <><SaveIcon /> Save</>}
        </button>
      </div>

      {/* Lined paper: range note when selection active, general month note otherwise */}
      <div className="relative flex-1 overflow-hidden">
        {/* Line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, #d1d5db 23px, #d1d5db 24px)",
            backgroundPosition: "0 28px",
          }}
        />

        {hasSelection ? (
          <textarea
            key={rangeLabel /* remount when range changes so value is fresh */}
            value={rangeNote}
            onChange={(e) => onRangeNoteChange(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent resize-none text-xs text-gray-700 focus:outline-none p-3"
            style={{ lineHeight: "24px", paddingTop: "30px", fontFamily: "inherit" }}
            placeholder={`Add a note for ${rangeLabel}...`}
            spellCheck={false}
          />
        ) : (
          <textarea
            value={notes}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full bg-transparent resize-none text-xs text-gray-700 focus:outline-none p-3"
            style={{ lineHeight: "24px", paddingTop: "30px", fontFamily: "inherit" }}
            placeholder="Select a date or range to add a note, or write general month notes here..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
