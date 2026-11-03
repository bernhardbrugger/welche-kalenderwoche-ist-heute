import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { formatDay } from '../utils/civil';
import {
  COUNTRY_NAMES,
  placeLabel,
  regionsFor,
  regionName,
  type Country,
} from '../utils/holidayUtils';

const Insights: React.FC = () => {
  const data = useWeekData();
  const reduce = useReducedMotion();
  const year = data.focusDate.getFullYear();
  const leap = new Date(year, 1, 29).getDate() === 29;
  const dayOfYear =
    Math.round(
      (Date.UTC(year, data.focusDate.getMonth(), data.focusDate.getDate()) - Date.UTC(year, 0, 1)) / 86_400_000,
    ) + 1;
  const daysInYear = leap ? 366 : 365;
  const progress = dayOfYear / daysInYear;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const quarter = Math.floor(data.focusDate.getMonth() / 3) + 1;

  return (
    <section className="space-y-3">
      <div className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Für wen die Feiertage gelten</p>
          <p className="mt-1 text-sm text-muted">
            {data.country === 'CH'
              ? 'Schweizer Kantone haben zusätzliche Feiertage. Gezeigt werden die üblichen.'
              : `Gesetzliche Feiertage für ${regionName(data.country, data.region)}. Schulferien sind extra.`}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:w-[28rem]">
          <select
            className="field"
            aria-label="Land"
            value={data.country}
            onChange={(event) => data.setCountry(event.target.value as Country)}
          >
            {(Object.keys(COUNTRY_NAMES) as Country[]).map((country) => (
              <option key={country} value={country}>{COUNTRY_NAMES[country]}</option>
            ))}
          </select>
          <select
            className="field"
            aria-label="Region"
            value={data.region}
            onChange={(event) => data.setRegion(event.target.value)}
          >
            {regionsFor(data.country).map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <motion.article className="panel p-5" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="kicker">Nächster Feiertag</p>
          {data.nextHoliday ? (
            <>
              <h2 className="mt-3 font-display text-3xl leading-tight">{data.nextHoliday.holiday.name}</h2>
              <p className="mt-2 text-muted">
                {data.nextHoliday.days === 0 ? 'Heute' : data.nextHoliday.days === 1 ? 'Morgen' : `in ${data.nextHoliday.days} Tagen`}
                {' · '}
                {formatDay(data.nextHoliday.holiday.date)}
              </p>
              {placeLabel(data.nextHoliday.holiday, data.country) && (
                <p className="mt-2 text-sm text-spruce">{placeLabel(data.nextHoliday.holiday, data.country)}</p>
              )}
              {data.nextHoliday.holiday.note && <p className="mt-2 text-sm text-muted">{data.nextHoliday.holiday.note}</p>}
              {(data.nextHoliday.holiday.date.getDay() === 0 || data.nextHoliday.holiday.date.getDay() === 6) && (
                <p className="mt-2 text-sm text-muted">Fällt aufs Wochenende, also kein zusätzlicher freier Tag.</p>
              )}
            </>
          ) : (
            <p className="mt-3">Kein Feiertag in den nächsten Monaten.</p>
          )}
          <div className="mt-4 space-y-2 text-sm">
            {data.weekHolidays.length === 0 && <p className="text-muted">In dieser Woche ist keiner.</p>}
            {data.weekHolidays.map((holiday) => (
              <p key={holiday.name}>
                <span className="text-muted">{formatDay(holiday.date)} · </span>
                {holiday.name}
              </p>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="panel flex items-center gap-5 p-5"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" aria-hidden>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--line)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transform="rotate(-90 60 60)"
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 60, damping: 18 }}
            />
            <text x="60" y="58" textAnchor="middle" fill="var(--ink)" fontSize="22" fontFamily="Fraunces, Georgia, serif">
              {dayOfYear}
            </text>
            <text x="60" y="76" textAnchor="middle" fill="var(--muted)" fontSize="10">
              von {daysInYear}
            </text>
          </svg>
          <div>
            <p className="kicker">Stand im Jahr</p>
            <h2 className="mt-2 font-display text-3xl">Q{quarter}</h2>
            <p className="mt-2 text-sm text-muted">
              Tag {dayOfYear}. Noch {daysInYear - dayOfYear} Tage in {year}. KW {data.info.week} von diesem ISO-Jahr.
            </p>
          </div>
        </motion.article>

        <motion.article
          className="panel p-5"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="kicker">Werktage</p>
          <h2 className="mt-3 font-display text-3xl">
            {data.work.weekDays} <span className="text-xl text-muted">diese Woche</span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            {data.work.weekHours} Stunden bei {data.work.hoursPerDay} Stunden am Tag. {year} hat {data.work.yearDays} Werktage, davon noch {data.work.yearLeft} inklusive heute.
          </p>
          <label className="mt-4 block text-sm text-muted">
            Stunden pro Tag
            <input
              className="field mt-2"
              type="number"
              min={1}
              max={12}
              step={0.5}
              value={data.work.hoursPerDay}
              onChange={(event) => data.setHours(Number(event.target.value))}
            />
          </label>
        </motion.article>
      </div>

      <article className="panel p-5">
        <p className="kicker">Brückentage und Fenstertage</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {data.breaks.length === 0 && <p className="text-muted">In den nächsten Monaten liegt kein Fenstertag.</p>}
          {data.breaks.map((item) => (
            <div key={`${item.holidayName}-${item.holidayDate.toISOString()}`}>
              <p className="font-display text-2xl leading-tight">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default Insights;
