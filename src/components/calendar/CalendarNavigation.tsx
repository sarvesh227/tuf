interface CalendarNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function CalendarNavigation({ onPrev, onNext }: CalendarNavigationProps) {
  const btnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.22)",
    backdropFilter: "blur(4px)",
  };

  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous month"
        className="absolute z-50 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110"
        style={{ ...btnStyle, top: "24px", left: "12px" }}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={onNext}
        aria-label="Next month"
        className="absolute z-50 flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 hover:scale-110"
        style={{ ...btnStyle, top: "24px", right: "12px" }}
      >
        <ChevronRight />
      </button>
    </>
  );
}
