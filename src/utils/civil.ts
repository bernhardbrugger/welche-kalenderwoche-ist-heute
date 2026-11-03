import {
  currentWeek,
  viennaNow,
  weekOfCivil,
  type WeekInfo,
} from '../../netlify/edge-functions/lib/week.ts';

export { viennaNow };

export function localNoon(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function fromDe(short: string): Date {
  const [day, month, year] = short.split('.').map(Number);
  return localNoon(year, month, day);
}

export function viennaToday(now: Date = new Date()): Date {
  return fromDe(currentWeek(now).today);
}

export function tagOf(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function dateFromTag(tag: string | null): Date | null {
  if (!tag || !/^\d{4}-\d{2}-\d{2}$/.test(tag)) return null;
  const [year, month, day] = tag.split('-').map(Number);
  const date = localNoon(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function weekInfoOf(date: Date): WeekInfo | null {
  return weekOfCivil(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function eachDay(start: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, index) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + index, 12, 0, 0, 0),
  );
}

export function calendarDaysBetween(later: Date, earlier: Date): number {
  const a = Date.UTC(later.getFullYear(), later.getMonth(), later.getDate());
  const b = Date.UTC(earlier.getFullYear(), earlier.getMonth(), earlier.getDate());
  return Math.round((a - b) / 86_400_000);
}

export function sameCivilDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatDayShort(date: Date): string {
  return date.toLocaleDateString('de-AT', { day: 'numeric', month: 'short' });
}

export function viennaClock(now: Date = new Date()): string {
  const clock = viennaNow(now);
  return `${String(clock.hour).padStart(2, '0')}:${String(clock.minute).padStart(2, '0')}`;
}

/** Hours and days until Saturday 00:00 in Vienna. Null on the weekend. */
export function untilWeekend(now: Date = new Date()): { days: number; hours: number } | null {
  const clock = viennaNow(now);
  const civil = new Date(Date.UTC(clock.year, clock.month - 1, clock.day));
  const sundayBased = civil.getUTCDay();
  if (sundayBased === 0 || sundayBased === 6) return null;
  const daysUntilSaturday = 6 - sundayBased;
  const hoursLeftToday = 24 - clock.hour - (clock.minute > 0 || clock.second > 0 ? 1 : 0);
  if (daysUntilSaturday === 0) return { days: 0, hours: Math.max(hoursLeftToday, 0) };
  return { days: daysUntilSaturday - (hoursLeftToday === 24 ? 0 : 0), hours: hoursLeftToday };
}

export function weekendPhrase(now: Date = new Date()): string {
  const left = untilWeekend(now);
  if (!left) return 'Wochenende';
  if (left.days <= 0) return left.hours <= 1 ? 'gleich Wochenende' : `noch ${left.hours} Std. bis Samstag`;
  if (left.days === 1) return 'morgen Wochenende';
  return `noch ${left.days} Tage bis Samstag`;
}
