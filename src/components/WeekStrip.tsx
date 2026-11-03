import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWeekData } from '../context/WeekDataContext';
import { sameCivilDay } from '../utils/civil';
import { sameDay } from '../utils/holidayUtils';

const NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const WeekStrip: React.FC = () => {
  const { days, focusDate, today, info, direction, weekHolidays, focusDay } = useWeekData();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={info.iso}
      className="grid grid-cols-7 gap-1.5 sm:gap-2"
      initial={reduce ? false : { x: direction * 28, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
    >
        {days.map((day, index) => {
          const holiday = weekHolidays.find((item) => sameDay(item.date, day));
          const isToday = sameCivilDay(day, today);
          const focused = sameCivilDay(day, focusDate);
          const weekend = index >= 5;
          return (
            <button
              key={day.toISOString()}
              onClick={() => focusDay(day)}
              className={`relative rounded-2xl border px-1 py-3 text-center transition sm:py-4 ${
                focused
                  ? 'border-ink bg-ink text-paper'
                  : weekend
                    ? 'border-line bg-[var(--weekend)]'
                    : 'border-line bg-paper-2'
              }`}
              aria-pressed={focused}
              aria-label={`${NAMES[index]} ${day.getDate()}${holiday ? `, ${holiday.name}` : ''}${isToday ? ', heute' : ''}`}
            >
              <span className={`block text-[0.68rem] uppercase tracking-[0.14em] ${focused ? 'opacity-70' : 'text-muted'}`}>
                {NAMES[index]}
              </span>
              <span className={`relative mx-auto mt-2 grid h-9 w-9 place-items-center font-display text-2xl ${isToday ? 'today-pulse' : ''} ${isToday && !focused ? 'text-accent' : ''}`}>
                {day.getDate()}
              </span>
              <span className={`mx-auto mt-2 block h-1.5 w-1.5 rounded-full ${holiday ? 'bg-spruce' : 'bg-transparent'}`} />
              {holiday && (
                <span className={`mt-1 hidden truncate text-[0.65rem] sm:block ${focused ? 'opacity-80' : 'text-spruce'}`}>
                  {holiday.name}
                </span>
              )}
            </button>
          );
        })}
    </motion.div>
  );
};

export default WeekStrip;
