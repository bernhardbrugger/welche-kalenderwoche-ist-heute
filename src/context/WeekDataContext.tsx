import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  currentWeek,
  sameWeek,
  shiftWeek,
  weekByNumber,
  type WeekInfo,
} from '../../netlify/edge-functions/lib/week.ts';
import {
  dateFromTag,
  eachDay,
  fromDe,
  sameCivilDay,
  tagOf,
  weekInfoOf,
} from '../utils/civil';
import { getHistoricalFact } from '../utils/factsUtils';
import {
  addDays,
  defaultRegion,
  holidaysBetween,
  isWorkday,
  regionsFor,
  upcomingTimeOff,
  type Country,
  type Holiday,
  type TimeOff,
} from '../utils/holidayUtils';
import { getWeeklyMotto } from '../utils/mottoUtils';
import { calculateSunTimes, type SunTimes } from '../utils/sunTimesUtils';
import { getZodiacSign } from '../utils/zodiacUtils';

interface WorkStats {
  weekDays: number;
  weekHours: number;
  yearDays: number;
  yearLeft: number;
  hoursPerDay: number;
}

interface WeekData {
  info: WeekInfo;
  todayInfo: WeekInfo;
  today: Date;
  now: Date;
  weekStart: Date;
  weekEnd: Date;
  days: Date[];
  focusDate: Date;
  isCurrentWeek: boolean;
  invalid: boolean;
  direction: number;
  relativeLabel: string;
  sentence: string;
  country: Country;
  region: string;
  setCountry: (country: Country) => void;
  setRegion: (region: string) => void;
  weekHolidays: Holiday[];
  breaks: TimeOff[];
  nextHoliday: { holiday: Holiday; days: number } | null;
  work: WorkStats;
  setHours: (hours: number) => void;
  motto: string;
  fact: string;
  zodiac: ReturnType<typeof getZodiacSign>;
  sun: SunTimes;
  navigateWeek: (direction: number) => void;
  goToday: () => void;
  goToDate: (date: Date) => void;
  goToWeek: (year: number, week: number, direction?: number) => void;
  focusDay: (date: Date) => void;
}

const WeekDataContext = createContext<WeekData | undefined>(undefined);

export const useWeekData = () => {
  const context = useContext(WeekDataContext);
  if (!context) throw new Error('useWeekData must be used within a WeekDataProvider');
  return context;
};

function readPrefs(): { country: Country; region: string; hours: number } {
  try {
    const storedCountry = localStorage.getItem('kw-country');
    const country: Country = storedCountry === 'DE' || storedCountry === 'CH' ? storedCountry : 'AT';
    const storedRegion = localStorage.getItem('kw-region');
    const ids = regionsFor(country).map((region) => region.id);
    const region = storedRegion && ids.includes(storedRegion) ? storedRegion : defaultRegion(country);
    const hours = Number(localStorage.getItem('kw-hours'));
    return { country, region, hours: hours >= 1 && hours <= 12 ? hours : 8 };
  } catch {
    return { country: 'AT', region: 'wien', hours: 8 };
  }
}

function relativeLabelFor(info: WeekInfo, todayInfo: WeekInfo): string {
  const diff = Math.round((fromDe(info.start).getTime() - fromDe(todayInfo.start).getTime()) / (7 * 86_400_000));
  if (diff === 0) return 'Diese Woche';
  if (diff === 1) return 'Nächste Woche';
  if (diff === -1) return 'Letzte Woche';
  if (diff > 1) return `In ${diff} Wochen`;
  return `Vor ${Math.abs(diff)} Wochen`;
}

export const WeekDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const onCalendar = location.pathname === '/' || location.pathname.startsWith('/kw/');
  const weekMatch = location.pathname.match(/^\/kw\/(\d{4})\/(\d{1,2})\/?$/);
  const [now, setNow] = useState(() => new Date());
  const [direction, setDirection] = useState(1);
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const todayInfo = useMemo(() => currentWeek(now), [now]);
  const today = useMemo(() => fromDe(todayInfo.today), [todayInfo]);

  const routed = weekMatch ? weekByNumber(Number(weekMatch[1]), Number(weekMatch[2])) : null;
  const invalid = Boolean(weekMatch && !routed);
  const info = routed ?? todayInfo;
  const isCurrentWeek = sameWeek(info, todayInfo);

  const days = useMemo(() => eachDay(fromDe(info.start), 7), [info.start]);
  const weekStart = days[0];
  const weekEnd = days[6];

  const tagged = dateFromTag(searchParams.get('tag'));
  const focusDate = tagged && days.some((day) => sameCivilDay(day, tagged)) ? tagged : isCurrentWeek ? today : weekStart;

  const setCountry = (country: Country) => {
    const region = defaultRegion(country);
    setPrefs((prev) => ({ ...prev, country, region }));
    try {
      localStorage.setItem('kw-country', country);
      localStorage.setItem('kw-region', region);
    } catch {
      /* private mode */
    }
  };

  const setRegion = (region: string) => {
    setPrefs((prev) => ({ ...prev, region }));
    try {
      localStorage.setItem('kw-region', region);
    } catch {
      /* private mode */
    }
  };

  const setHours = (hours: number) => {
    if (!Number.isFinite(hours)) return;
    const next = Math.min(12, Math.max(1, hours));
    setPrefs((prev) => ({ ...prev, hours: next }));
    try {
      localStorage.setItem('kw-hours', String(next));
    } catch {
      /* private mode */
    }
  };

  const goToWeek = useCallback((year: number, week: number, dir = 1) => {
    const target = weekByNumber(year, week);
    if (!target) return;
    setDirection(dir);
    if (sameWeek(target, currentWeek())) navigate('/');
    else navigate(`/kw/${target.weekYear}/${target.week}`);
  }, [navigate]);

  const goToday = useCallback(() => {
    setDirection(-1);
    navigate('/');
  }, [navigate]);

  const goToDate = useCallback((date: Date) => {
    const target = weekInfoOf(date);
    if (!target) return;
    const live = currentWeek();
    setDirection(date.getTime() >= fromDe(live.start).getTime() ? 1 : -1);
    if (sameWeek(target, live) && sameCivilDay(date, fromDe(live.today))) {
      navigate('/');
      return;
    }
    navigate(`/kw/${target.weekYear}/${target.week}?tag=${tagOf(date)}`);
  }, [navigate]);

  const focusDay = useCallback((date: Date) => {
    const target = weekInfoOf(date);
    if (!target) return;
    if (!sameWeek(target, info)) {
      goToDate(date);
      return;
    }
    if (isCurrentWeek && sameCivilDay(date, today)) {
      navigate('/');
      return;
    }
    navigate(`/kw/${info.weekYear}/${info.week}?tag=${tagOf(date)}`);
  }, [goToDate, info, isCurrentWeek, navigate, today]);

  const navigateWeek = useCallback((dir: number) => {
    const next = shiftWeek(info, dir);
    goToWeek(next.weekYear, next.week, dir);
  }, [goToWeek, info]);

  useEffect(() => {
    if (!onCalendar) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateWeek(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateWeek(-1);
      } else if (event.key === 'Home' || event.key === 't' || event.key === 'T') {
        event.preventDefault();
        goToday();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToday, navigateWeek, onCalendar]);

  const { country, region, hours } = prefs;

  const weekHolidays = useMemo(
    () => holidaysBetween(weekStart, weekEnd, country, region),
    [weekStart, weekEnd, country, region],
  );

  const breaks = useMemo(() => upcomingTimeOff(focusDate, country, region, 3), [focusDate, country, region]);

  const nextHoliday = useMemo(() => {
    const found = holidaysBetween(focusDate, addDays(focusDate, 400), country, region)[0];
    if (!found) return null;
    const daysUntil = Math.round((found.date.getTime() - focusDate.getTime()) / 86_400_000);
    return { holiday: found, days: daysUntil };
  }, [focusDate, country, region]);

  const work = useMemo<WorkStats>(() => {
    const year = focusDate.getFullYear();
    let yearDays = 0;
    let yearLeft = 0;
    for (let cursor = new Date(year, 0, 1, 12); cursor.getFullYear() === year; cursor = addDays(cursor, 1)) {
      if (!isWorkday(cursor, country, region)) continue;
      yearDays += 1;
      if (cursor.getTime() >= focusDate.getTime()) yearLeft += 1;
    }
    const weekDays = days.filter((day) => isWorkday(day, country, region)).length;
    return {
      weekDays,
      weekHours: weekDays * hours,
      yearDays,
      yearLeft,
      hoursPerDay: hours,
    };
  }, [country, days, focusDate, hours, region]);

  const sentence = isCurrentWeek
    ? `Heute ist KW ${info.week} (${info.range}).`
    : `KW ${info.week}/${info.weekYear} geht vom ${info.startLong} bis zum ${info.endLong}.`;

  const value: WeekData = {
    info,
    todayInfo,
    today,
    now,
    weekStart,
    weekEnd,
    days,
    focusDate,
    isCurrentWeek,
    invalid,
    direction,
    relativeLabel: relativeLabelFor(info, todayInfo),
    sentence,
    country,
    region,
    setCountry,
    setRegion,
    weekHolidays,
    breaks,
    nextHoliday,
    work,
    setHours,
    motto: getWeeklyMotto(info.week),
    fact: getHistoricalFact(focusDate),
    zodiac: getZodiacSign(focusDate),
    sun: calculateSunTimes(focusDate),
    navigateWeek,
    goToday,
    goToDate,
    goToWeek,
    focusDay,
  };

  return <WeekDataContext.Provider value={value}>{children}</WeekDataContext.Provider>;
};
