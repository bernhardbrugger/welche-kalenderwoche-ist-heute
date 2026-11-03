import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Copy, Share2 } from 'lucide-react';
import { useWeekData } from '../context/WeekDataContext';
import { calendarDaysBetween, viennaClock, viennaNow, weekendPhrase } from '../utils/civil';
import { buildWeekIcs, downloadIcs } from '../utils/ics';

const WeekHero: React.FC = () => {
  const {
    info,
    now,
    today,
    direction,
    relativeLabel,
    sentence,
    isCurrentWeek,
    weekStart,
    weekEnd,
    weekHolidays,
    navigateWeek,
    goToday,
  } = useWeekData();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const touchX = useRef<number | null>(null);

  const weekProgress = (() => {
    if (!isCurrentWeek) return now.getTime() > weekEnd.getTime() ? 1 : 0;
    const clock = viennaNow(now);
    const dayIndex = calendarDaysBetween(today, weekStart);
    return Math.min(1, Math.max(0, (dayIndex + (clock.hour + clock.minute / 60) / 24) / 7));
  })();
  const dayInWeek = calendarDaysBetween(isCurrentWeek ? today : weekStart, weekStart) + 1;

  const isoDrift = info.weekYear !== weekStart.getFullYear();

  const copySentence = async () => {
    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    const url = isCurrentWeek
      ? `${window.location.origin}/`
      : `${window.location.origin}/kw/${info.weekYear}/${info.week}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, text: sentence, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const saveIcs = () => {
    downloadIcs(`kw-${info.week}-${info.weekYear}.ics`, buildWeekIcs(info, weekStart, weekEnd, weekHolidays));
  };

  return (
    <section
      className="panel relative overflow-hidden px-4 py-5 sm:px-8 sm:py-10"
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchX.current == null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        if (delta > 56) navigateWeek(-1);
        if (delta < -56) navigateWeek(1);
        touchX.current = null;
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="kicker">{relativeLabel}</p>
        <p className="tabular-nums text-sm text-muted">{viennaClock(now)} Uhr · Wien</p>
      </div>

      <h1 className="mt-3 text-center font-display text-[1.55rem] leading-tight sm:mt-6 sm:text-4xl">
        {isCurrentWeek ? 'Welche Kalenderwoche ist heute?' : `Kalenderwoche ${info.week}`}
      </h1>

      <div id="week-controls" className="mt-2 flex items-center justify-center gap-2 sm:mt-4 sm:gap-8">
        <button className="btn h-12 w-12 rounded-full p-0" onClick={() => navigateWeek(-1)} aria-label="Vorherige Woche">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative h-[6.8rem] w-[10.5rem] sm:h-[11rem] sm:w-[16rem]" aria-live="polite">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.p
              key={info.iso}
              className="absolute inset-0 grid place-items-center font-display text-[6.2rem] leading-none tracking-[-0.06em] text-ink sm:text-[10rem]"
              initial={reduce ? false : { y: direction * 56, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={reduce ? undefined : { y: direction * -48, opacity: 0, filter: 'blur(8px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              {info.week}
            </motion.p>
          </AnimatePresence>
        </div>
        <button className="btn h-12 w-12 rounded-full p-0" onClick={() => navigateWeek(1)} aria-label="Nächste Woche">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center font-display text-2xl sm:text-3xl">{info.range}</p>
      <p className="mt-2 text-center text-sm text-muted">
        {info.iso}
        {isCurrentWeek ? ` · ${weekendPhrase(now)}` : ''}
        {isoDrift ? ` · ISO-Jahr ${info.weekYear}` : ''}
      </p>
      {isoDrift && (
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
          Ein Teil dieser Woche liegt im anderen Kalenderjahr. Gezählt wird sie trotzdem als KW {info.week} von {info.weekYear}, weil der Donnerstag dorthin gehört.
        </p>
      )}

      <div className="mx-auto mt-6 max-w-md">
        <div className="mb-2 flex justify-between text-xs text-muted">
          <span>Montag</span>
          <span>{isCurrentWeek ? `Tag ${dayInWeek} von 7` : weekProgress === 1 ? 'schon vorbei' : 'liegt noch vor uns'}</span>
          <span>Sonntag</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${weekProgress * 100}%` }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed">{sentence}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {!isCurrentWeek && (
          <button className="btn btn-accent" onClick={goToday}>Heute</button>
        )}
        <button className="btn" onClick={copySentence}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Kopiert' : 'Satz kopieren'}
        </button>
        <button className="btn" onClick={share}>
          <Share2 className="h-4 w-4" />
          Teilen
        </button>
        <button className="btn" onClick={saveIcs}>
          <CalendarPlus className="h-4 w-4" />
          In den Kalender
        </button>
      </div>
    </section>
  );
};

export default WeekHero;
