import { useState } from "react";

interface NotesSectionProps {
  notes: string;
  onChange: (val: string) => void;
  themeColor: string;
  onSave?: () => void;
}

export default function NotesSection({ notes, onChange, themeColor, onSave }: NotesSectionProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave?.();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid #eaeaea", minHeight: "200px" }}
    >
      {/* Header with Save button */}
      <div
        className="px-3 pt-3 pb-1 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${themeColor}30` }}
      >
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: themeColor }}
        >
          Notes
        </span>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-all"
          style={{
            background: isSaved ? `${themeColor}20` : `${themeColor}15`,
            color: isSaved ? themeColor : "#6b7280",
            border: `1px solid ${themeColor}30`,
          }}
        >
          {isSaved ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Saved!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Save
            </>
          )}
        </button>
      </div>

      {/* Lined paper area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, #d1d5db 23px, #d1d5db 24px)",
            backgroundPosition: "0 28px",
          }}
        />
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full bg-transparent resize-none text-xs text-gray-700 dark:text-gray-300 focus:outline-none p-3"
          style={{
            lineHeight: "24px",
            paddingTop: "30px",
            fontFamily: "inherit",
          }}
          placeholder="Scribble down your plans, highlight a special memory, or leave a quiet reminder for your future self..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
