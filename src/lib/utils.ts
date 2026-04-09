import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const holidays: Record<string, { emoji: string, name: string }> = {
  '01-01': { emoji: '🎆', name: "New Year's Day" },
  '02-14': { emoji: '💝', name: "Valentine's Day" },
  '03-17': { emoji: '☘️', name: "St. Patrick's Day" },
  '04-05': { emoji: '🐰', name: "Easter Sunday" },
  '07-04': { emoji: '🎇', name: "Independence Day" },
  '10-31': { emoji: '🎃', name: "Halloween" },
  '11-26': { emoji: '🦃', name: "Thanksgiving" },
  '12-25': { emoji: '🎄', name: "Christmas Day" },
  '12-31': { emoji: '🥂', name: "New Year's Eve" }
};
