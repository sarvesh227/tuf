import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { type DateRange } from "./Calendar";
import { Save, Check, Trash } from "lucide-react";
import { holidays } from "../lib/utils";

interface NotesProps {
  selection: DateRange;
}

export function Notes({ selection }: NotesProps) {
  const [noteText, setNoteText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const getStorageKey = () => {
    if (!selection.start) return "notes_general";
    const startStr = format(selection.start, "yyyy-MM-dd");
    const endStr = (selection.end && !isSameDay(selection.start, selection.end)) 
      ? format(selection.end, "yyyy-MM-dd") 
      : "null";
    return `notes_${startStr}_${endStr}`;
  };

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    
    let defaultText = saved || "";

    // If no note is saved, auto-populate the festival name
    if (!saved && selection.start) {
      const isSingleDay = !selection.end || isSameDay(selection.start, selection.end);
      if (isSingleDay) {
        const monthDayStr = format(selection.start, "MM-dd");
        const holidayData = holidays[monthDayStr];
        if (holidayData) {
          defaultText = `✨ ${holidayData.name} ✨\n\n`;
        }
      }
    }

    setNoteText(defaultText);
    setIsSaved(false);
  }, [selection.start, selection.end]);

  const handleSave = () => {
    const key = getStorageKey();
    if (!noteText.trim() && !noteText.includes('✨')) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, noteText);
    }
    setIsSaved(true);
    window.dispatchEvent(new Event('notes-updated'));
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    const key = getStorageKey();
    localStorage.removeItem(key);
    setNoteText("");
    setIsSaved(false);
    window.dispatchEvent(new Event('notes-updated'));
  };

  const getRangeText = () => {
    if (!selection.start) return "General Notes";
    if (!selection.end) return format(selection.start, "MMM d, yyyy") + " - ...";
    return `${format(selection.start, "MMM d, yyyy")} to ${format(
      selection.end,
      "MMM d, yyyy"
    )}`;
  };

  return (
    <div className="bg-yellow-50/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl border border-yellow-200/50 dark:border-slate-800 flex flex-col h-[400px] md:h-full relative overflow-hidden transition-colors duration-300">
      {/* Tape effect on top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 dark:bg-white/10 rotate-2 shadow-sm rounded-sm transition-colors" />

      <div className="p-6 border-b border-yellow-200/60 dark:border-slate-800 bg-yellow-100/30 dark:bg-slate-800/50 transition-colors flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-500 text-lg flex items-center gap-2 transition-colors">
            📝 Sticky Notes
          </h3>
          <p className="text-yellow-700 dark:text-slate-400 text-sm mt-1 font-medium transition-colors">{getRangeText()}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            title="Clear Note"
            className="flex items-center justify-center p-2 rounded-lg bg-red-400/20 dark:bg-red-500/10 hover:bg-red-400/40 dark:hover:bg-red-500/20 text-red-800 dark:text-red-400 transition-all"
          >
            <Trash className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/20 dark:bg-yellow-600/20 hover:bg-yellow-400/40 dark:hover:bg-yellow-600/40 text-yellow-800 dark:text-yellow-500 transition-all font-semibold"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col w-full h-full">
        <div className="relative flex-1 w-full h-full flex flex-col">
          {/* Lined Paper Background effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20 z-0"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #eab308 31px, #eab308 32px)",
              backgroundPosition: "0 0",
            }}
          />

          <textarea
            value={noteText}
            onChange={(e) => {
              setNoteText(e.target.value);
              setIsSaved(false);
            }}
            className="flex-1 w-full bg-transparent resize-none focus:outline-none text-gray-800 dark:text-slate-200 leading-[32px] z-10 transition-colors p-0 m-0"
            placeholder="Scribble down your plans, highlight a special memory, or leave a quiet reminder for your future self..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
