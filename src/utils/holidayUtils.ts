export type Country = 'AT' | 'DE' | 'CH';

export interface Region {
  id: string;
  name: string;
}

export interface Holiday {
  date: Date;
  name: string;
  nationwide: boolean;
  /** Empty when the holiday applies in the whole country. */
  regions: string[];
  note?: string;
}

export interface TimeOff {
  kind: 'bridge' | 'long' | 'midweek';
  holidayName: string;
  holidayDate: Date;
  /** The weekday you would take off. Null for a long weekend that needs no extra day. */
  bridgeDate: Date | null;
  freeFrom: Date;
  freeUntil: Date;
  daysFree: number;
  title: string;
  detail: string;
}

type Scope = '*' | string[];

interface Spec {
  name: string;
  scope: Record<Country, Scope>;
  note?: string;
  month?: number;
  day?: number;
  easterOffset?: number;
  special?: 'buss-und-bettag';
}

const REGIONS: Record<Country, Region[]> = {
  AT: [
    { id: 'wien', name: 'Wien' },
    { id: 'noe', name: 'Niederösterreich' },
    { id: 'ooe', name: 'Oberösterreich' },
    { id: 'sbg', name: 'Salzburg' },
    { id: 'tir', name: 'Tirol' },
    { id: 'vbg', name: 'Vorarlberg' },
    { id: 'ktn', name: 'Kärnten' },
    { id: 'stm', name: 'Steiermark' },
    { id: 'bgl', name: 'Burgenland' },
  ],
  DE: [
    { id: 'bw', name: 'Baden-Württemberg' },
    { id: 'by', name: 'Bayern' },
    { id: 'be', name: 'Berlin' },
    { id: 'bb', name: 'Brandenburg' },
    { id: 'hb', name: 'Bremen' },
    { id: 'hh', name: 'Hamburg' },
    { id: 'he', name: 'Hessen' },
    { id: 'mv', name: 'Mecklenburg-Vorpommern' },
    { id: 'ni', name: 'Niedersachsen' },
    { id: 'nw', name: 'Nordrhein-Westfalen' },
    { id: 'rp', name: 'Rheinland-Pfalz' },
    { id: 'sl', name: 'Saarland' },
    { id: 'sn', name: 'Sachsen' },
    { id: 'st', name: 'Sachsen-Anhalt' },
    { id: 'sh', name: 'Schleswig-Holstein' },
    { id: 'th', name: 'Thüringen' },
  ],
  CH: [{ id: 'ch', name: 'Üblich in den meisten Kantonen' }],
};

const ALL = '*' as const;
const NONE: Scope = [];

const SPECS: Spec[] = [
  { name: 'Neujahr', month: 1, day: 1, scope: { AT: ALL, DE: ALL, CH: ALL } },
  { name: 'Heilige Drei Könige', month: 1, day: 6, scope: { AT: ALL, DE: ['bw', 'by', 'st'], CH: NONE } },
  { name: 'Internationaler Frauentag', month: 3, day: 8, scope: { AT: NONE, DE: ['be', 'mv'], CH: NONE } },
  {
    name: 'Josefitag',
    month: 3,
    day: 19,
    scope: { AT: ['ktn', 'stm', 'tir', 'vbg'], DE: NONE, CH: NONE },
  },
  { name: 'Karfreitag', easterOffset: -2, scope: { AT: NONE, DE: ALL, CH: ['ch'] }, note: 'In der Schweiz nicht in jedem Kanton.' },
  { name: 'Ostermontag', easterOffset: 1, scope: { AT: ALL, DE: ALL, CH: ['ch'] }, note: 'In der Schweiz nicht in jedem Kanton.' },
  { name: 'Staatsfeiertag', month: 5, day: 1, scope: { AT: ALL, DE: NONE, CH: NONE } },
  { name: 'Tag der Arbeit', month: 5, day: 1, scope: { AT: NONE, DE: ALL, CH: NONE } },
  { name: 'Florianitag', month: 5, day: 4, scope: { AT: ['ooe'], DE: NONE, CH: NONE } },
  { name: 'Christi Himmelfahrt', easterOffset: 39, scope: { AT: ALL, DE: ALL, CH: ['ch'] } },
  { name: 'Pfingstmontag', easterOffset: 50, scope: { AT: ALL, DE: ALL, CH: ['ch'] } },
  {
    name: 'Fronleichnam',
    easterOffset: 60,
    scope: { AT: ALL, DE: ['bw', 'by', 'he', 'nw', 'rp', 'sl'], CH: NONE },
  },
  {
    name: 'Mariä Himmelfahrt',
    month: 8,
    day: 15,
    scope: { AT: ALL, DE: ['sl', 'by'], CH: NONE },
    note: 'In Bayern nur in überwiegend katholischen Gemeinden.',
  },
  { name: 'Bundesfeier', month: 8, day: 1, scope: { AT: NONE, DE: NONE, CH: ALL } },
  { name: 'Rupertitag', month: 9, day: 24, scope: { AT: ['sbg'], DE: NONE, CH: NONE } },
  { name: 'Weltkindertag', month: 9, day: 20, scope: { AT: NONE, DE: ['th'], CH: NONE } },
  { name: 'Tag der Deutschen Einheit', month: 10, day: 3, scope: { AT: NONE, DE: ALL, CH: NONE } },
  { name: 'Tag der Volksabstimmung', month: 10, day: 10, scope: { AT: ['ktn'], DE: NONE, CH: NONE } },
  { name: 'Nationalfeiertag', month: 10, day: 26, scope: { AT: ALL, DE: NONE, CH: NONE } },
  { name: 'Reformationstag', month: 10, day: 31, scope: { AT: NONE, DE: ['bb', 'hb', 'hh', 'mv', 'ni', 'sn', 'st', 'sh', 'th'], CH: NONE } },
  { name: 'Allerheiligen', month: 11, day: 1, scope: { AT: ALL, DE: ['bw', 'by', 'nw', 'rp', 'sl'], CH: NONE } },
  { name: 'Buß- und Bettag', special: 'buss-und-bettag', scope: { AT: NONE, DE: ['sn'], CH: NONE } },
  { name: 'Martinstag', month: 11, day: 11, scope: { AT: ['bgl'], DE: NONE, CH: NONE } },
  { name: 'Leopolditag', month: 11, day: 15, scope: { AT: ['wien', 'noe'], DE: NONE, CH: NONE } },
  { name: 'Mariä Empfängnis', month: 12, day: 8, scope: { AT: ALL, DE: NONE, CH: NONE } },
  { name: 'Christtag', month: 12, day: 25, scope: { AT: ALL, DE: NONE, CH: NONE } },
  { name: 'Weihnachtstag', month: 12, day: 25, scope: { AT: NONE, DE: ALL, CH: ALL } },
  { name: 'Stefanitag', month: 12, day: 26, scope: { AT: ALL, DE: NONE, CH: NONE } },
  {
    name: 'Zweiter Weihnachtstag',
    month: 12,
    day: 26,
    scope: { AT: NONE, DE: ALL, CH: ['ch'] },
    note: 'In der Schweiz nicht in jedem Kanton.',
  },
];

export const COUNTRY_NAMES: Record<Country, string> = {
  AT: 'Österreich',
  DE: 'Deutschland',
  CH: 'Schweiz',
};

export function regionsFor(country: Country): Region[] {
  const all =
    country === 'CH'
      ? []
      : [{ id: 'all', name: 'Nur bundesweite Feiertage' }];
  return [...all, ...REGIONS[country]];
}

export function defaultRegion(country: Country): string {
  if (country === 'AT') return 'wien';
  if (country === 'DE') return 'nw';
  return 'ch';
}

export function regionName(country: Country, region: string): string {
  if (region === 'all') return 'bundesweit';
  return REGIONS[country].find((item) => item.id === region)?.name ?? region;
}

export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return atNoon(year, month - 1, day);
}

function atNoon(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

export function addDays(date: Date, days: number): Date {
  return atNoon(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function bussUndBettag(year: number): Date {
  const nov23 = atNoon(year, 10, 23);
  const back = (nov23.getDay() - 3 + 7) % 7;
  return addDays(nov23, -back);
}

function applies(spec: Spec, country: Country): { nationwide: boolean; regions: string[] } | null {
  const scope = spec.scope[country];
  if (scope === '*') return { nationwide: true, regions: [] };
  if (!scope || scope.length === 0) return null;
  return { nationwide: false, regions: scope };
}

export function holidaysForYear(year: number, country: Country): Holiday[] {
  const easter = easterSunday(year);
  const list: Holiday[] = [];
  for (const spec of SPECS) {
    const where = applies(spec, country);
    if (!where) continue;
    let date: Date;
    if (spec.special === 'buss-und-bettag') date = bussUndBettag(year);
    else if (spec.easterOffset !== undefined) date = addDays(easter, spec.easterOffset);
    else date = atNoon(year, (spec.month ?? 1) - 1, spec.day ?? 1);
    list.push({ date, name: spec.name, nationwide: where.nationwide, regions: where.regions, note: spec.note });
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function inRange(date: Date, start: Date, end: Date): boolean {
  const key = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
  const from = start.getFullYear() * 10000 + start.getMonth() * 100 + start.getDate();
  const to = end.getFullYear() * 10000 + end.getMonth() * 100 + end.getDate();
  return key >= from && key <= to;
}

function visible(holiday: Holiday, region: string): boolean {
  if (region === 'all') return holiday.nationwide;
  if (holiday.nationwide) return true;
  return holiday.regions.includes(region);
}

export function holidaysBetween(start: Date, end: Date, country: Country, region: string): Holiday[] {
  const years = new Set([start.getFullYear(), end.getFullYear()]);
  const list: Holiday[] = [];
  for (const year of years) {
    for (const holiday of holidaysForYear(year, country)) {
      if (!visible(holiday, region)) continue;
      if (inRange(holiday.date, start, end)) list.push(holiday);
    }
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function isWorkday(date: Date, country: Country, region: string): boolean {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  return holidaysBetween(date, date, country, region).length === 0;
}

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function timeOffAround(holiday: Holiday): TimeOff | null {
  const dow = holiday.date.getDay();
  if (dow === 2) {
    const bridge = addDays(holiday.date, -1);
    return {
      kind: 'bridge',
      holidayName: holiday.name,
      holidayDate: holiday.date,
      bridgeDate: bridge,
      freeFrom: addDays(holiday.date, -3),
      freeUntil: holiday.date,
      daysFree: 4,
      title: `${weekdayLabel(bridge)} freinehmen`,
      detail: `${holiday.name} ist am Dienstag. Mit dem Montag davor sind Samstag bis Dienstag frei.`,
    };
  }
  if (dow === 4) {
    const bridge = addDays(holiday.date, 1);
    return {
      kind: 'bridge',
      holidayName: holiday.name,
      holidayDate: holiday.date,
      bridgeDate: bridge,
      freeFrom: holiday.date,
      freeUntil: addDays(holiday.date, 3),
      daysFree: 4,
      title: `${weekdayLabel(bridge)} freinehmen`,
      detail: `${holiday.name} ist am Donnerstag. Mit dem Freitag danach sind Donnerstag bis Sonntag frei.`,
    };
  }
  if (dow === 1) {
    return {
      kind: 'long',
      holidayName: holiday.name,
      holidayDate: holiday.date,
      bridgeDate: null,
      freeFrom: addDays(holiday.date, -2),
      freeUntil: holiday.date,
      daysFree: 3,
      title: `Langes Wochenende um ${holiday.name}`,
      detail: `${holiday.name} fällt auf einen Montag. Samstag bis Montag ist frei, ohne Fenstertag.`,
    };
  }
  if (dow === 5) {
    return {
      kind: 'long',
      holidayName: holiday.name,
      holidayDate: holiday.date,
      bridgeDate: null,
      freeFrom: holiday.date,
      freeUntil: addDays(holiday.date, 2),
      daysFree: 3,
      title: `Langes Wochenende um ${holiday.name}`,
      detail: `${holiday.name} fällt auf einen Freitag. Freitag bis Sonntag ist frei, ohne Fenstertag.`,
    };
  }
  if (dow === 3) {
    return {
      kind: 'midweek',
      holidayName: holiday.name,
      holidayDate: holiday.date,
      bridgeDate: null,
      freeFrom: holiday.date,
      freeUntil: holiday.date,
      daysFree: 1,
      title: `${holiday.name} liegt mittig`,
      detail: 'Ein einzelner Fenstertag reicht nicht. Montag und Dienstag oder Donnerstag und Freitag machen daraus ein langes Wochenende.',
    };
  }
  return null;
}

export function upcomingTimeOff(from: Date, country: Country, region: string, limit = 3): TimeOff[] {
  const years = [from.getFullYear(), from.getFullYear() + 1];
  const items: TimeOff[] = [];
  for (const year of years) {
    for (const holiday of holidaysForYear(year, country)) {
      if (!visible(holiday, region)) continue;
      const item = timeOffAround(holiday);
      if (!item) continue;
      if (item.freeUntil.getTime() < from.getTime() && !sameDay(item.freeUntil, from)) continue;
      items.push(item);
    }
  }
  return items.slice(0, limit);
}

export function placeLabel(holiday: Holiday, country: Country): string | null {
  if (holiday.nationwide) return null;
  const names = holiday.regions
    .map((id) => REGIONS[country].find((region) => region.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  if (names.length === 0) return null;
  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
}
