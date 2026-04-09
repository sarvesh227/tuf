/** Returns a "YYYY-MM-DD" key for a given date (local time, no timezone offset). */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns true if two dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns a new Date with the time component stripped (midnight local). */
export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Holiday map keyed by "MM-DD". */
export const holidays: Record<string, { emoji: string; name: string }> = {
  '01-01': { emoji: '🎆', name: "New Year's Day" },
  '02-14': { emoji: '💝', name: "Valentine's Day" },
  '03-17': { emoji: '☘️', name: "St. Patrick's Day" },
  '04-05': { emoji: '🐰', name: "Easter Sunday" },
  '07-04': { emoji: '🎇', name: "Independence Day" },
  '10-31': { emoji: '🎃', name: "Halloween" },
  '11-26': { emoji: '🦃', name: "Thanksgiving" },
  '12-25': { emoji: '🎄', name: "Christmas Day" },
  '12-31': { emoji: '🥂', name: "New Year's Eve" },
};
