/** ISO calendar week for Austria, independent of the server clock (edge functions run in UTC). */

const TIME_ZONE = 'Europe/Vienna';
const DAY_MS = 86_400_000;

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export interface WeekInfo {
  /** ISO week number, 1–53 */
  week: number;
  /** ISO week-year (the year that owns the week's Thursday) */
  weekYear: number;
  /** Monday, DD.MM.YYYY */
  start: string;
  /** Sunday, DD.MM.YYYY */
  end: string;
  startLong: string;
  endLong: string;
  /** Compact range, e.g. "2.–8. November 2026" */
  range: string;
  /** Reference day, DD.MM.YYYY */
  today: string;
  todayLong: string;
  weekday: string;
  /** 2026-W45 */
  iso: string;
}

export interface ViennaNow {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Civil date and clock in Vienna. */
export function viennaNow(now: Date = new Date()): ViennaNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0');
  let hour = part('hour');
  if (hour === 24) hour = 0;
  return {
    year: part('year'),
    month: part('month'),
    day: part('day'),
    hour,
    minute: part('minute'),
    second: part('second'),
  };
}

/** Vienna's calendar day as UTC midnight, so later arithmetic is timezone-free. */
export function viennaDay(now: Date = new Date()): Date {
  const { year, month, day } = viennaNow(now);
  return new Date(Date.UTC(year, month - 1, day));
}

export function viennaISODate(now: Date = new Date()): string {
  const { year, month, day } = viennaNow(now);
  return `${year}-${pad(month)}-${pad(day)}`;
}

function formatShort(d: Date): string {
  return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

function formatLong(d: Date): string {
  return `${d.getUTCDate()}. ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatRange(start: Date, end: Date): string {
  const sameMonth = start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) {
    return `${start.getUTCDate()}.–${end.getUTCDate()}. ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  }
  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${start.getUTCDate()}. ${MONTHS[start.getUTCMonth()]} – ${end.getUTCDate()}. ${MONTHS[end.getUTCMonth()]} ${end.getUTCFullYear()}`;
  }
  return `${formatLong(start)} – ${formatLong(end)}`;
}

export function mondayOf(date: Date): Date {
  return new Date(date.getTime() - ((date.getUTCDay() + 6) % 7) * DAY_MS);
}

function weekNumberFromMonday(monday: Date): { week: number; weekYear: number } {
  const thursday = new Date(monday.getTime() + 3 * DAY_MS);
  const weekYear = thursday.getUTCFullYear();
  const jan1 = Date.UTC(weekYear, 0, 1);
  const week = Math.ceil(((thursday.getTime() - jan1) / DAY_MS + 1) / 7);
  return { week, weekYear };
}

function describe(monday: Date, reference: Date): WeekInfo {
  const sunday = new Date(monday.getTime() + 6 * DAY_MS);
  const { week, weekYear } = weekNumberFromMonday(monday);
  return {
    week,
    weekYear,
    start: formatShort(monday),
    end: formatShort(sunday),
    startLong: formatLong(monday),
    endLong: formatLong(sunday),
    range: formatRange(monday, sunday),
    today: formatShort(reference),
    todayLong: formatLong(reference),
    weekday: WEEKDAYS[reference.getUTCDay()],
    iso: `${weekYear}-W${pad(week)}`,
  };
}

export function currentWeek(now: Date = new Date()): WeekInfo {
  const today = viennaDay(now);
  return describe(mondayOf(today), today);
}

/** Thursday-rule: 53 weeks if 1 Jan is Thursday, or a leap year and 1 Jan is Wednesday. */
export function weeksInIsoYear(year: number): number {
  const dow = new Date(Date.UTC(year, 0, 1)).getUTCDay();
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  if (dow === 4 || (leap && dow === 3)) return 53;
  return 52;
}

export function weekByNumber(year: number, week: number): WeekInfo | null {
  if (!Number.isInteger(year) || !Number.isInteger(week)) return null;
  if (year < 1970 || year > 2100) return null;
  const max = weeksInIsoYear(year);
  if (week < 1 || week > max) return null;
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstMonday = mondayOf(jan4);
  const monday = new Date(firstMonday.getTime() + (week - 1) * 7 * DAY_MS);
  return describe(monday, monday);
}

/** Civil date (month is 1–12) → the ISO week that contains it. */
export function weekOfCivil(year: number, month: number, day: number): WeekInfo | null {
  if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return describe(mondayOf(date), date);
}

export function shiftWeek(info: WeekInfo, direction: number): WeekInfo {
  const [d, m, y] = info.start.split('.').map(Number);
  const monday = new Date(Date.UTC(y, m - 1, d + direction * 7));
  return describe(monday, monday);
}

export function sameWeek(a: WeekInfo, b: WeekInfo): boolean {
  return a.week === b.week && a.weekYear === b.weekYear;
}
