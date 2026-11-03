import React, { useMemo, useState } from 'react';
import { useWeekData } from '../context/WeekDataContext';
import { fromDe } from '../utils/civil';
import { holidaysBetween } from '../utils/holidayUtils';
import { interpret } from '../utils/interpret';
import { shiftWeek, weekByNumber, weeksInIsoYear, type WeekInfo } from '../../netlify/edge-functions/lib/week.ts';

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const Planner: React.FC = () => {
  const { info, country, region, goToWeek, goToDate, goToday, todayInfo } = useWeekData();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const atlas = useMemo(() => {
    const total = weeksInIsoYear(info.weekYear);
    const weeks = Array.from({ length: total }, (_, index) => weekByNumber(info.weekYear, index + 1)).filter(
      (week): week is WeekInfo => Boolean(week),
    );
    return MONTHS.map((label, month) => ({
      label,
      weeks: weeks.filter((week) => {
        const monday = fromDe(week.start);
        const thursday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3, 12);
        return thursday.getMonth() === month;
      }),
    }));
  }, [info.weekYear]);

  const upcoming = useMemo(() => {
    const list: WeekInfo[] = [todayInfo];
    for (let step = 1; step < 8; step += 1) list.push(shiftWeek(list[step - 1], 1));
    return list.map((week) => ({
      week,
      holidays: holidaysBetween(fromDe(week.start), fromDe(week.end), country, region),
    }));
  }, [country, region, todayInfo]);

  const jump = (event: React.FormEvent) => {
    event.preventDefault();
    const result = interpret(query, info.weekYear);
    if (!result) {
      setError('Versuch KW 45, 3.11.2026 oder 2026-W45.');
      return;
    }
    setError('');
    setQuery('');
    if (result.type === 'today') goToday();
    else if (result.type === 'date') goToDate(result.date);
    else {
      const found = weekByNumber(result.year, result.week);
      if (!found) {
        setError(`KW ${result.week} gibt es in ${result.year} nicht.`);
        return;
      }
      goToWeek(found.weekYear, found.week);
    }
  };

  return (
    <section className="space-y-3">
      <form className="panel flex flex-col gap-3 p-4 sm:flex-row" onSubmit={jump}>
        <label className="sr-only" htmlFor="jump">Woche oder Datum</label>
        <input
          id="jump"
          className="field"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="45, 3.11.2026, 2026-W45 oder heute"
          inputMode="text"
        />
        <button className="btn btn-accent shrink-0" type="submit">Springen</button>
      </form>
      {error && <p className="px-2 text-sm text-accent">{error}</p>}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {upcoming.map(({ week, holidays }) => {
          const active = week.iso === info.iso;
          return (
            <button
              key={week.iso}
              onClick={() => goToWeek(week.weekYear, week.week)}
              className={`min-w-[9.5rem] rounded-2xl border px-3 py-3 text-left ${active ? 'border-ink bg-ink text-paper' : 'border-line bg-paper-2'}`}
            >
              <span className="block font-display text-2xl">KW {week.week}</span>
              <span className={`mt-1 block text-xs ${active ? 'opacity-75' : 'text-muted'}`}>{week.range.replace(` ${week.weekYear}`, '')}</span>
              <span className={`mt-2 block truncate text-xs ${active ? 'opacity-80' : 'text-spruce'}`}>
                {holidays[0]?.name ?? 'ohne Feiertag'}
              </span>
            </button>
          );
        })}
      </div>

      <div id="jahr" className="panel scroll-mt-24 p-4 sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="kicker">Jahresatlas {info.weekYear}</p>
            <h2 className="mt-1 font-display text-3xl">Alle {weeksInIsoYear(info.weekYear)} Wochen</h2>
          </div>
          <p className="text-sm text-muted">Punkt = Feiertag in deiner Region</p>
        </div>
        <div className="space-y-3">
          {atlas.map((group) => (
            <div key={group.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-2 sm:grid-cols-[6rem_1fr]">
              <p className="text-sm text-muted">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.weeks.map((week) => {
                  const monday = fromDe(week.start);
                  const sunday = fromDe(week.end);
                  const holiday = holidaysBetween(monday, sunday, country, region).length > 0;
                  const active = week.iso === info.iso;
                  const current = week.iso === todayInfo.iso;
                  return (
                    <button
                      key={week.iso}
                      onClick={() => goToWeek(week.weekYear, week.week, week.week >= info.week ? 1 : -1)}
                      title={`${week.iso}: ${week.range}`}
                      className={`relative h-9 min-w-9 rounded-full px-2 text-sm tabular-nums ${
                        active ? 'bg-accent text-[var(--accent-ink)]' : current ? 'bg-ink text-paper' : 'bg-transparent hover:bg-[var(--weekend)]'
                      }`}
                    >
                      {week.week}
                      {holiday && !active && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-spruce" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Planner;
