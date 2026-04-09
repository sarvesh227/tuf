interface NotesSectionProps {
  notes: string;
  onChange: (val: string) => void;
  themeColor: string;
}

export default function NotesSection({ notes, onChange, themeColor }: NotesSectionProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid #eaeaea", minHeight: "200px" }}
    >
      {/* Header */}
      <div
        className="px-3 pt-3 pb-1 text-xs font-bold tracking-widest uppercase"
        style={{ color: themeColor, borderBottom: `1px solid ${themeColor}30` }}
      >
        Notes
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
