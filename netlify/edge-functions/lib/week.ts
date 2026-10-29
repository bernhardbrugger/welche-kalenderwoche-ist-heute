/** ISO calendar week of "today" in Austria, independent of the time zone of the server (edge functions run in UTC). */

const TIME_ZONE = 'Europe/Vienna';
const DAY_MS = 86_400_000;

export interface WeekInfo {
  /** ISO week number, 1-53 */
  week: number;
  /** Monday of that week, DD.MM.YYYY */
  start: string;
  /** Sunday of that week, DD.MM.YYYY */
  end: string;
}

/** The calendar day it is in Vienna at the given instant, as a UTC midnight (so all further arithmetic is time-zone free). */
function viennaDay(now: Date): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(part('year'), part('month') - 1, part('day')));
}

function format(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getUTCFullYear()}`;
}

export function currentWeek(now: Date = new Date()): WeekInfo {
  const today = viennaDay(now);
  const monday = new Date(today.getTime() - ((today.getUTCDay() + 6) % 7) * DAY_MS);
  const sunday = new Date(monday.getTime() + 6 * DAY_MS);
  // the ISO week belongs to the year that contains its Thursday
  const thursday = new Date(monday.getTime() + 3 * DAY_MS);
  const jan1 = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((thursday.getTime() - jan1) / DAY_MS + 1) / 7);
  return { week, start: format(monday), end: format(sunday) };
}
