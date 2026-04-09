import React from "react";

const POPUP_W = 220;
const POPUP_H = 150;

interface DayNotePopupProps {
  date: Date;
  position: { x: number; y: number };
  notes: string[];
  onSave: (text: string) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
  themeColor: string;
}

export default function DayNotePopup({
  date, position, notes, onSave, onDelete, onClose, themeColor
}: DayNotePopupProps) {
  const [noteDraft, setNoteDraft] = React.useState("");

  const handleSave = () => {
    if (noteDraft.trim()) onSave(noteDraft);
    setNoteDraft("");
  };

  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      className="fixed"
      style={{ inset: 0, zIndex: 1000 }}
      onMouseDown={onClose}
    >
      <div
        className="fixed bg-white dark:bg-gray-900 shadow-2xl"
        style={{
          left: position.x,
          top: position.y,
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "10px",
          minWidth: `${POPUP_W}px`,
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="font-semibold mb-2 dark:text-gray-100"
          style={{ fontSize: "0.82rem", color: "#111827", borderBottom: `2px solid ${themeColor}`, paddingBottom: "6px" }}
        >
          📝 {label}
        </div>

        {/* Existing notes list */}
        {notes.length > 0 && (
          <div className="mb-2 max-h-[80px] overflow-y-auto space-y-1">
            {notes.map((n, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-2 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1"
              >
                <span className="flex-1 leading-snug">{n}</span>
                <button
                  onClick={() => onDelete(i)}
                  className="text-red-400 hover:text-red-600 shrink-0 leading-none"
                  title="Delete note"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <input
          autoFocus
          value={noteDraft}
          onChange={e => setNoteDraft(e.target.value)}
          placeholder="Add a note..."
          className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1.5 outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleSave(); }
            if (e.key === "Escape") { e.preventDefault(); onClose(); }
          }}
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >Cancel</button>
          <button
            type="button"
            onClick={handleSave}
            className="text-xs px-3 py-1.5 rounded-md text-white font-medium transition-colors"
            style={{ background: themeColor }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}

export function clampPopupPosition(clientX: number, clientY: number) {
  return {
    x: Math.min(clientX, window.innerWidth - POPUP_W - 8),
    y: Math.min(clientY, window.innerHeight - POPUP_H - 8),
  };
}
