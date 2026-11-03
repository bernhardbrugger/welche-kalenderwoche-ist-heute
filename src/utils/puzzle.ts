import { weekByNumber, weekOfCivil, weeksInIsoYear } from '../../netlify/edge-functions/lib/week.ts';

export interface Puzzle {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
}

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function shuffle<T>(rand: () => number, items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function withChoices(correct: string, pool: string[], rand: () => number): { choices: string[]; answer: number } {
  const rest = shuffle(rand, pool.filter((item) => item !== correct)).slice(0, 3);
  const choices = shuffle(rand, [correct, ...rest]);
  return { choices, answer: choices.indexOf(correct) };
}

function shiftCivil(year: number, month: number, day: number, delta: number) {
  const date = new Date(Date.UTC(year, month - 1, day + delta));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function stamp(year: number, month: number, day: number): string {
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
}

function longDate(year: number, month: number, day: number): string {
  const info = weekOfCivil(year, month, day);
  return info ? `${info.weekday}, ${info.todayLong}` : stamp(year, month, day);
}

function dayOfYear(year: number, month: number, day: number): number {
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86_400_000) + 1;
}

/** One puzzle per Vienna calendar day. Same date, same question, for everyone. */
export function puzzleFor(isoDate: string): Puzzle {
  const [year, month, day] = isoDate.split('-').map(Number);
  const rand = rng(hash(isoDate));
  const kind = dayOfYear(year, month, day) % 6;
  const jump = 12 + (hash(isoDate) % 48);
  const target = shiftCivil(year, month, day, jump);
  const targetInfo = weekOfCivil(target.year, target.month, target.day);

  if (kind === 0 && targetInfo) {
    const packed = withChoices(targetInfo.weekday, WEEKDAYS, rand);
    return {
      id: isoDate,
      prompt: `Welcher Wochentag ist der ${targetInfo.todayLong}?`,
      ...packed,
      why: `${targetInfo.todayLong} ist ein ${targetInfo.weekday}. Gezählt wird das ganz normale Kalenderdatum, unabhängig von der Kalenderwoche.`,
    };
  }

  if (kind === 1 && targetInfo) {
    const pool: string[] = [];
    for (let delta = 1; pool.length < 6 && delta < 10; delta += 1) {
      for (const sign of [1, -1]) {
        const week = targetInfo.week + sign * delta;
        if (week >= 1 && week <= 53) pool.push(`KW ${week}`);
      }
    }
    const packed = withChoices(`KW ${targetInfo.week}`, pool, rand);
    return {
      id: isoDate,
      prompt: `In welcher Kalenderwoche liegt der ${targetInfo.todayLong}?`,
      ...packed,
      why: `${targetInfo.todayLong} gehört zu ${targetInfo.iso}, also KW ${targetInfo.week} im ISO-Jahr ${targetInfo.weekYear}. Die Woche läuft von ${targetInfo.startLong} bis ${targetInfo.endLong}.`,
    };
  }

  if (kind === 2) {
    const asked = year + ((hash(isoDate) >> 3) % 5) - 2;
    const count = weeksInIsoYear(asked);
    const packed = withChoices(String(count), ['51', '52', '53', '54'], rand);
    return {
      id: isoDate,
      prompt: `Wie viele ISO-Wochen hat ${asked}?`,
      ...packed,
      why: `${asked} hat ${count} Wochen. 53 gibt es nur, wenn der 1. Jänner ein Donnerstag ist, oder in einem Schaltjahr ein Mittwoch.`,
    };
  }

  if (kind === 3) {
    const asked = year + ((hash(`${isoDate}j`) >> 4) % 3);
    const info = weekOfCivil(asked, 1, 1);
    const correct = info ? `KW ${info.week} / ${info.weekYear}` : `KW 1 / ${asked}`;
    const pool = [
      `KW 1 / ${asked}`,
      `KW 52 / ${asked - 1}`,
      `KW 53 / ${asked - 1}`,
      `KW 1 / ${asked - 1}`,
    ];
    const packed = withChoices(correct, pool, rand);
    return {
      id: isoDate,
      prompt: `Wohin gehört der 1. Jänner ${asked}?`,
      ...packed,
      why: info
        ? `Der 1. Jänner ${asked} ist ein ${info.weekday} und liegt in ${info.iso}. Die Nummer folgt dem Donnerstag der Woche, nicht dem Kalenderjahr des Tages.`
        : 'Die Woche folgt dem Donnerstag.',
    };
  }

  if (kind === 4) {
    const askedYear = year + ((hash(`${isoDate}w`) >> 2) % 2);
    const week = 1 + (hash(`${isoDate}n`) % weeksInIsoYear(askedYear));
    const info = weekByNumber(askedYear, week)!;
    const [d, m, y] = info.start.split('.').map(Number);
    const neighbors = [-7, -1, 1, 7].map((delta) => {
      const next = shiftCivil(y, m, d, delta);
      return stamp(next.year, next.month, next.day);
    });
    const packed = withChoices(info.start, neighbors, rand);
    return {
      id: isoDate,
      prompt: `An welchem Datum beginnt KW ${week} im ISO-Jahr ${askedYear}?`,
      ...packed,
      why: `KW ${info.week} beginnt am Montag, ${info.startLong}, und endet am Sonntag, ${info.endLong}.`,
    };
  }

  const asked = year + ((hash(`${isoDate}t`) >> 5) % 3);
  let cursor = { year: asked, month: 1, day: 1 };
  let info = weekOfCivil(cursor.year, cursor.month, cursor.day)!;
  while (info.weekday !== 'Donnerstag') {
    cursor = shiftCivil(cursor.year, cursor.month, cursor.day, 1);
    info = weekOfCivil(cursor.year, cursor.month, cursor.day)!;
  }
  const neighbors = [-2, -1, 1, 2].map((delta) => {
    const next = shiftCivil(cursor.year, cursor.month, cursor.day, delta);
    return stamp(next.year, next.month, next.day);
  });
  const packed = withChoices(stamp(cursor.year, cursor.month, cursor.day), neighbors, rand);
  return {
    id: isoDate,
    prompt: `Auf welches Datum fällt der erste Donnerstag ${asked}? Der legt KW 1 fest.`,
    ...packed,
    why: `Der erste Donnerstag ${asked} ist der ${longDate(cursor.year, cursor.month, cursor.day)}. Die Woche, in der er liegt, ist KW 1.`,
  };
}

export function consecutiveStreak(solved: string[], today: string): number {
  const has = new Set(solved);
  const [year, month, day] = today.split('-').map(Number);
  let cursor = has.has(today) ? { year, month, day } : shiftCivil(year, month, day, -1);
  let count = 0;
  let guard = 0;
  while (guard < 400) {
    const key = `${cursor.year}-${String(cursor.month).padStart(2, '0')}-${String(cursor.day).padStart(2, '0')}`;
    if (!has.has(key)) break;
    count += 1;
    cursor = shiftCivil(cursor.year, cursor.month, cursor.day, -1);
    guard += 1;
  }
  return count;
}
