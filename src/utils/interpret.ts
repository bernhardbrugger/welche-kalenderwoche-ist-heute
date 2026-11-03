import { weekByNumber, type WeekInfo } from '../../netlify/edge-functions/lib/week.ts';
import { localNoon, weekInfoOf } from './civil';

export type Jump =
  | { type: 'today' }
  | { type: 'week'; year: number; week: number }
  | { type: 'date'; date: Date };

export function interpret(raw: string, fallbackYear: number): Jump | null {
  const text = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!text) return null;
  if (text === 'heute' || text === 'today' || text === 'jetzt') return { type: 'today' };

  const isoWeek = text.match(/^(\d{4})-w(\d{1,2})$/);
  if (isoWeek) return { type: 'week', year: Number(isoWeek[1]), week: Number(isoWeek[2]) };

  const slash = text.match(/^(?:kw\s*)?(\d{1,2})\s*[/.]\s*(\d{4})$/);
  if (slash) return { type: 'week', year: Number(slash[2]), week: Number(slash[1]) };

  const plain = text.match(/^(?:kw\s*)?(\d{1,2})$/);
  if (plain) return { type: 'week', year: fallbackYear, week: Number(plain[1]) };

  const de = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (de) {
    const date = localNoon(Number(de[3]), Number(de[2]), Number(de[1]));
    if (date.getDate() !== Number(de[1]) || date.getMonth() !== Number(de[2]) - 1) return null;
    return { type: 'date', date };
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const date = localNoon(Number(iso[1]), Number(iso[2]), Number(iso[3]));
    if (date.getMonth() !== Number(iso[2]) - 1) return null;
    return { type: 'date', date };
  }

  return null;
}

export function resolveWeek(jump: Extract<Jump, { type: 'week' }>): WeekInfo | null {
  return weekByNumber(jump.year, jump.week);
}

export function resolveDate(date: Date): WeekInfo | null {
  return weekInfoOf(date);
}
