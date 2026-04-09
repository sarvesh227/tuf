const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface HeroImageProps {
  year: number;
  month: number;
  themeColor: string;
  imageSrc: string;
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

export { monthImages };

export default function HeroImage({ year, month, themeColor }: HeroImageProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
      {/* Hero photograph */}
      <img
        src={monthImages[month]}
        alt={`${MONTH_NAMES[month]} ${year}`}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
        style={{ transform: "scale(1.02)" }}
      />

      {/* Geometric overlay SVG — same as reference */}
      <svg
        className="absolute bottom-0 left-0 w-full z-10 overflow-visible"
        style={{ height: "120px" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,25 L 28,55 Q 38,65 48,55 L 100,-20 L 100,120 L 0,120 Z"
          fill={themeColor}
        />
        <path
          d="M 0,65 L 28,95 Q 38,100 48,90 L 100,50 L 100,120 L 0,120 Z"
          fill="white"
        />
      </svg>

      {/* Month + Year label on the right blue triangle */}
      <div
        className="absolute right-4 text-right z-20"
        style={{ bottom: "65px" }}
      >
        <span
          className="block font-light tracking-widest"
          style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.82)" }}
        >
          {year}
        </span>
        <span
          className="block font-extrabold tracking-widest leading-none"
          style={{ fontSize: "1.4rem", color: "white" }}
        >
          {MONTH_NAMES[month]}
        </span>
      </div>
    </div>
  );
}
