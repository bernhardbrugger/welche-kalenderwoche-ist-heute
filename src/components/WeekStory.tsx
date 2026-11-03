import React from 'react';
import { useWeekData } from '../context/WeekDataContext';
import { formatDay } from '../utils/civil';

const WeekStory: React.FC = () => {
  const { motto, fact, zodiac, sun, focusDate, info } = useWeekData();

  return (
    <section className="grid gap-3 md:grid-cols-2">
      <article className="panel p-5 md:col-span-2">
        <p className="kicker">Wochenmotto · KW {info.week}</p>
        <p className="mt-3 max-w-3xl font-display text-2xl leading-snug sm:text-3xl">{motto.replace(/^KW \d+:\s*/, '')}</p>
      </article>
      <article className="panel p-5">
        <p className="kicker">{formatDay(focusDate)}</p>
        <h2 className="mt-3 font-display text-3xl">
          {zodiac.symbol} {zodiac.name}
        </h2>
        <p className="mt-2 text-sm text-muted">{zodiac.dateRange}</p>
        <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-muted">Auf</dt>
            <dd className="font-display text-xl">{sun.sunrise}</dd>
          </div>
          <div>
            <dt className="text-muted">Unter</dt>
            <dd className="font-display text-xl">{sun.sunset}</dd>
          </div>
          <div>
            <dt className="text-muted">Tag</dt>
            <dd className="font-display text-xl">{sun.dayLength}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">Sonne ungefähr für Wien, {sun.accuracy}.</p>
      </article>
      <article className="panel p-5">
        <p className="kicker">An diesem Tag</p>
        <p className="mt-3 text-base leading-relaxed">{fact}</p>
      </article>
    </section>
  );
};

export default WeekStory;
