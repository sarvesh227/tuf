import React, { useState } from 'react';
import { 
  format, addMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, 
  eachDayOfInterval, isWithinInterval, isBefore
} from 'date-fns';
// @ts-ignore - react-pageflip has patchy ts support
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, holidays } from '../lib/utils';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface CalendarProps {
  selection: DateRange;
  setSelection: (range: DateRange) => void;
  selectionMode?: 'single' | 'range';
}

const monthImages = [
  '/months/january_calendar_1775692610742.png',
  '/months/february_calendar_1775692624964.png',
  '/months/march_calendar_1775692639113.png',
  '/months/april_calendar_1775692658642.png',
  '/months/may_calendar_1775692676676.png',
  '/months/june_calendar_1775692696955.png',
  '/months/july_calendar_1775692718052.png',
  '/months/august_calendar_1775692730074.png',
  '/months/september_calendar_1775692791840.png',
  '/months/october_calendar_1775692807780.png',
  '/months/november_calendar_1775692822884.png',
  '/months/december_calendar_1775692838179.png',
];

const Page = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div 
      className="page bg-white dark:bg-gray-900 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_0_35px_rgba(59,130,246,0.35)] ring-1 ring-gray-200 dark:ring-blue-400/60" 
      ref={ref} 
      data-density="soft"
    >
      {props.children}
    </div>
  );
});
Page.displayName = 'Page';

export function Calendar({ selection, setSelection, selectionMode = 'range' }: CalendarProps) {
  const flipBookRef = React.useRef<any>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobileScreen(window.innerWidth < 768);
    checkMobile(); // initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const updateMarks = () => {
      const newMarked = new Set<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('notes_')) {
          const parts = key.split('_');
          if (parts.length === 3) {
            const startStr = parts[1];
            const endStr = parts[2];
            if (endStr === 'null') {
              newMarked.add(startStr);
            } else {
              try {
                const dates = eachDayOfInterval({ start: new Date(startStr), end: new Date(endStr) });
                dates.forEach(d => newMarked.add(format(d, 'yyyy-MM-dd')));
              } catch (e) {}
            }
          }
        }
      }
      setMarkedDates(newMarked);
    };

    updateMarks();

    const listener = () => updateMarks();
    window.addEventListener('notes-updated', listener);
    return () => window.removeEventListener('notes-updated', listener);
  }, []);

  const onDateClick = (day: Date) => {
    if (selectionMode === 'single') {
      if (selection.start && isSameDay(day, selection.start)) {
        setSelection({ start: null, end: null }); // toggle off if clicked again
      } else {
        setSelection({ start: day, end: null });
      }
      return;
    }

    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: day, end: null });
    } else {
      if (isSameDay(day, selection.start)) {
        setSelection({ start: day, end: null });
      } else if (isBefore(day, selection.start)) {
        setSelection({ start: day, end: selection.start });
      } else {
        setSelection({ start: selection.start, end: day });
      }
    }
  };

  const yearStart = new Date(currentYear, 0, 1);
  const monthsData = Array.from({ length: 12 }).map((_, i) => addMonths(yearStart, i));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative w-full flex justify-center items-center mt-8 md:mt-12">
      
      {/* Hanging Mechanism (Screw + Wire) */}
      <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center drop-shadow-md pb-1 pointer-events-none">
        {/* Screw/Nail */}
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-slate-300 to-slate-700 shadow-sm border border-slate-500/50 relative z-10 dark:from-slate-400 dark:to-slate-800" />
        {/* Wire Loop */}
        <div className="w-12 h-8 md:w-16 md:h-10 border-t-2 border-l-2 border-r-2 border-slate-700 dark:border-slate-500 rounded-t-xl md:rounded-t-2xl -mt-1.5 opacity-90" />
        {/* Metal Binder Base */}
        <div className="w-16 md:w-20 h-1.5 md:h-2 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 rounded-sm -mt-0.5 shadow-sm" />
      </div>

      {/* Navigation Helpers outside the book */}
      {/* Navigation Helpers outside the book */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1 md:-left-4 xl:-left-12 z-30">
        <button 
          onClick={() => {
            const pageFlip = flipBookRef.current?.pageFlip();
            if (pageFlip?.getCurrentPageIndex() === 0) {
              setCurrentYear(prev => prev - 1);
              setTimeout(() => {
                flipBookRef.current?.pageFlip()?.turnToPage(11);
              }, 10);
            } else {
              pageFlip?.flipPrev();
            }
          }}
          className="p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:scale-110 transition-all"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-1 md:-right-4 xl:-right-12 z-30">
        <button 
          onClick={() => {
            const pageFlip = flipBookRef.current?.pageFlip();
            if (pageFlip?.getCurrentPageIndex() === 11) {
              setCurrentYear(prev => prev + 1);
              setTimeout(() => {
                flipBookRef.current?.pageFlip()?.turnToPage(0);
              }, 10);
            } else {
              pageFlip?.flipNext();
            }
          }}
          className="p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:scale-110 transition-all"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* @ts-ignore */}
      <HTMLFlipBook
        width={400}
        height={650}
        size="stretch"
        minWidth={315}
        maxWidth={500}
        minHeight={600}
        maxHeight={1000}
        maxShadowOpacity={0.5}
        showCover={false}
        mobileScrollSupport={true}
        usePortrait={true}
        useMouseEvents={isMobileScreen}
        startPage={0}
        className="mx-auto"
        ref={flipBookRef}
      >

        {monthsData.map((monthDate, i) => {
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthStart);
          const startDate = startOfWeek(monthStart);
          const endDate = endOfWeek(monthEnd);
          const days = eachDayOfInterval({ start: startDate, end: endDate });

          return (
            <Page key={i}>
              <div className="flex flex-col h-full relative group">
                
                {/* Hero Header - Brightened! */}
                <div className="relative h-48 md:h-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img 
                    src={monthImages[i]} 
                    alt={`Calendar Hero ${format(monthDate, 'MMMM')}`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Reduced dark gradient substantially for brighter image display */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                    <div className="text-white drop-shadow-lg">
                      <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-1">{format(monthDate, 'MMMM')}</h2>
                      <p className="text-xl text-gray-200 font-bold drop-shadow-md">{format(monthDate, 'yyyy')}</p>
                    </div>
                  </div>
                </div>

                {/* Spiral Binder equivalent (middle margin tape) */}
                <div className="relative h-6 bg-white dark:bg-gray-900 z-10 flex justify-between px-8 -mt-3">
                  {Array.from({ length: 14 }).map((_, binderIdx) => (
                    <div key={binderIdx} className="relative w-4 h-full">
                      <div className="spiral-hole dark:bg-gray-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
                      <div className="spiral-binder absolute top-1 left-1/2 -translate-x-1/2 dark:from-gray-500 dark:via-gray-600 dark:to-gray-800" />
                    </div>
                  ))}
                </div>

                {/* Calendar Grid Container */}
                <div className="flex-1 px-4 py-4 lg:px-8 lg:py-6 relative bg-[#faf9f7] dark:bg-gray-950 transition-colors duration-300 flex flex-col">
                  <div className="grid grid-cols-7 mb-2 lg:mb-4">
                    {weekDays.map((dayName, idx) => (
                      <div key={idx} className="text-center text-xs lg:text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                        {dayName}
                      </div>
                    ))}
                  </div>

                  <div className="relative w-full h-full min-h-[250px] lg:min-h-[300px] flex flex-col justify-between">
                    <div className="grid grid-cols-7 gap-y-1 lg:gap-y-3 gap-x-1 lg:gap-x-2">
                      {days.map((day, idx) => {
                        const isSelectedStart = selection.start && isSameDay(day, selection.start);
                        const isSelectedEnd = selection.end && isSameDay(day, selection.end);
                        const isSelectedBetween = selection.start && selection.end && 
                          isWithinInterval(day, { start: selection.start, end: selection.end }) &&
                          !isSelectedStart && !isSelectedEnd;
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());
                        
                        const monthDayStr = format(day, 'MM-dd');
                        const holidayData = isCurrentMonth ? holidays[monthDayStr] : null;
                        
                        const hasNote = markedDates.has(format(day, "yyyy-MM-dd"));

                        return (
                          <div 
                            key={day.toString() + idx} 
                            className="relative flex items-center justify-center h-10 lg:h-12"
                          >
                            {isSelectedBetween && (
                              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30" />
                            )}
                            
                            {(isSelectedStart && selection.end && !isSameDay(selection.start!, selection.end)) && (
                              <div className="absolute inset-y-0 right-0 w-1/2 bg-blue-50 dark:bg-blue-900/30" />
                            )}
                            {(isSelectedEnd && selection.start && !isSameDay(selection.start, selection.end!)) && (
                              <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-50 dark:bg-blue-900/30" />
                            )}

                            <button
                              onClick={() => onDateClick(day)}
                              title={holidayData ? holidayData.name : format(day, "MMMM do, yyyy")}
                              className={cn(
                                "relative z-10 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full text-xs lg:text-sm transition-all font-medium",
                                !isCurrentMonth && "text-gray-300 dark:text-gray-600",
                                isCurrentMonth && !isSelectedStart && !isSelectedEnd && !isToday && "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-110",
                                isToday && !isSelectedStart && !isSelectedEnd && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold outline outline-2 outline-blue-200 dark:outline-blue-900/50 outline-offset-2",
                                (isSelectedStart || isSelectedEnd) && "bg-blue-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/40 scale-110 font-bold",
                                isSelectedBetween && "text-blue-800 dark:text-blue-200",
                                holidayData && isCurrentMonth && !isSelectedStart && !isSelectedEnd && "font-bold text-orange-600 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-900/50"
                              )}
                            >
                              {format(day, "d")}
                              {holidayData && (
                                <span className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 text-[10px] lg:text-xs z-20 animate-pulse drop-shadow-md pb-[2px]">
                                  {holidayData.emoji}
                                </span>
                              )}
                              {hasNote && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full shadow-sm" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Page>
          );
        })}
      </HTMLFlipBook>
    </div>
  );
}
