import { useMemo, useState, type FC } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { eachDay, fromDe, tagOf } from '../utils/civil';
import { consecutiveStreak, puzzleFor } from '../utils/puzzle';
import { viennaISODate } from '../../netlify/edge-functions/lib/week.ts';

const DAY = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const STORAGE = 'kw-solved';

function readSolved(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE) ?? '[]') as unknown;
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

const Wochenraetsel: FC = () => {
  const { now, todayInfo } = useWeekData();
  const reduce = useReducedMotion();
  const today = viennaISODate(now);
  const puzzle = useMemo(() => puzzleFor(today), [today]);
  const [solved, setSolved] = useState(readSolved);
  const [wrong, setWrong] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const done = solved.includes(today);
  const streak = consecutiveStreak(solved, today);
  const weekDays = eachDay(fromDe(todayInfo.start), 7);

  const choose = (index: number) => {
    if (done || wrong.includes(index)) return;
    if (index !== puzzle.answer) {
      setWrong((prev) => [...prev, index]);
      setShake(index);
      window.setTimeout(() => setShake(null), 420);
      return;
    }
    const next = [...new Set([...solved, today])].slice(-400);
    setSolved(next);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  };

  return (
    <section className="ticket relative p-5 sm:p-6" aria-labelledby="raetsel-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kicker">Tagesrätsel</p>
          <h2 id="raetsel-title" className="mt-1 font-display text-4xl leading-none">Eine Frage, dann liegt der Stempel.</h2>
        </div>
        <p className="text-right font-display text-3xl leading-none tabular-nums">
          {streak}
          <span className="mt-1 block text-xs font-sans uppercase tracking-[0.14em] text-muted">Tage Serie</span>
        </p>
      </div>
      <p className="mt-4 max-w-xl text-lg leading-snug">{puzzle.prompt}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Antworten">
        {puzzle.choices.map((choice, index) => {
          const correct = done && index === puzzle.answer;
          const missed = wrong.includes(index);
          return (
            <button
              key={choice}
              type="button"
              className={`ticket-choice ${correct ? 'is-right' : ''} ${missed ? 'is-wrong' : ''} ${shake === index && !reduce ? 'is-shake' : ''}`}
              onClick={() => choose(index)}
              disabled={done || missed}
              aria-pressed={correct}
            >
              {choice}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-label="Gelöste Tage dieser Woche">
          {weekDays.map((day, index) => {
            const hit = solved.includes(tagOf(day));
            return (
              <span key={tagOf(day)} className="text-center">
                <span className={`mx-auto block h-2.5 w-2.5 rounded-full ${hit ? 'bg-accent' : 'bg-line'}`} />
                <span className="mt-1 block text-[0.65rem] uppercase tracking-wider text-muted">{DAY[index]}</span>
              </span>
            );
          })}
        </div>
        {done && (
          <motion.p
            className="stamp"
            initial={reduce ? false : { scale: 1.4, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 16 }}
          >
            Stimmt
          </motion.p>
        )}
      </div>
      {done && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{puzzle.why}</p>}
      {!done && wrong.length > 0 && <p className="mt-3 text-sm text-muted">Noch nicht. Die falsche Antwort bleibt liegen.</p>}
    </section>
  );
};

export default Wochenraetsel;
