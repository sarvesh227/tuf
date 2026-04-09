import { useState, useEffect } from 'react';
import { Calendar, type DateRange } from './components/Calendar';
import { Notes } from './components/Notes';
import { Sparkles, Moon, Sun, Eraser } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const [selection, setSelection] = useState<DateRange>({ start: null, end: null });
  const [selectionMode, setSelectionMode] = useState<'single' | 'range'>('range');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const handleModeChange = (mode: 'single' | 'range') => {
    setSelectionMode(mode);
    // If switching to single mode while a range is active, collapse it
    if (mode === 'single' && selection.end) {
      setSelection({ start: selection.start, end: null });
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-900 transition-colors duration-300 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Wall Decor & Environment Elements (Z-0) */}
      <div 
        className="fixed inset-0 opacity-[0.04] dark:opacity-[0.05] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23000000' fill-opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '24px 24px' }}
      />
      {/* Ceiling Ambient Shadow */}
      <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black/[0.06] dark:from-black/40 to-transparent pointer-events-none z-0" />
      
      {/* Baseboard Trim (Bottom Wall Edge) */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-950 border-t-[3px] border-gray-200 dark:border-slate-700 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] pointer-events-none z-0 flex flex-col">
        <div className="w-full h-2 bg-white/60 dark:bg-white/5 border-b border-gray-300/60 dark:border-slate-900" />
      </div>

      {/* Main Workspace (Z-10) */}
      <div className="relative z-10 flex flex-col flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-28">
      
      <header className="max-w-6xl w-full mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            Wall Calendar <Sparkles className="text-yellow-500 w-6 h-6" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium transition-colors">Plan your schedule and capture your thoughts.</p>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-3 mt-2 md:mt-0">
          
          {/* Mode Toggle UI */}
          <div className="flex items-center bg-gray-200/50 dark:bg-slate-800/50 rounded-full p-1 border border-gray-200 dark:border-slate-700 mr-0 md:mr-2">
            <button 
              onClick={() => handleModeChange('single')} 
              className={cn("px-4 py-1.5 rounded-full text-sm font-semibold transition-all", selectionMode === 'single' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")}
            >
              Single Date
            </button>
            <button 
              onClick={() => handleModeChange('range')} 
              className={cn("px-4 py-1.5 rounded-full text-sm font-semibold transition-all", selectionMode === 'range' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")}
            >
              Date Range
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete ALL saved notes and clear all red dots?")) {
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('notes_')) keysToRemove.push(key);
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
                window.dispatchEvent(new Event('notes-updated'));
              }
            }}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all"
            aria-label="Clear all data"
            title="Clear all saved notes"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:scale-105 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Notes Section - Desktop Left Sidebar / Mobile Bottom */}
        <div className="lg:col-span-4 order-2 lg:order-1 h-full">
          <Notes selection={selection} />
        </div>

        {/* Interactive Calendar - Desktop Right Main / Mobile Top */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <Calendar selection={selection} setSelection={setSelection} selectionMode={selectionMode} />
        </div>
      </main>
      
      </div>
    </div>
  );
}

export default App;
