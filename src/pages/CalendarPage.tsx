import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Insights from '../components/Insights';
import Planner from '../components/Planner';
import WeekHero from '../components/WeekHero';
import WeekStory from '../components/WeekStory';
import WeekStrip from '../components/WeekStrip';
import { useWeekData } from '../context/WeekDataContext';

const CalendarPage: React.FC = () => {
  const { info, invalid, sentence, navigateWeek, goToday } = useWeekData();
  const home = useLocation().pathname === '/';
  const [dock, setDock] = useState(false);

  useEffect(() => {
    const controls = document.getElementById('week-controls');
    if (!controls) return;
    const observer = new IntersectionObserver(([entry]) => setDock(!entry.isIntersecting));
    observer.observe(controls);
    return () => observer.disconnect();
  }, [invalid, info.iso]);

  useEffect(() => {
    if (invalid) {
      document.title = 'Diese Kalenderwoche gibt es nicht';
      return;
    }
    const title = home
      ? `KW ${info.week} ist heute (${info.range}) | Welche Kalenderwoche?`
      : `KW ${info.week} ${info.weekYear} (${info.range})`;
    const description = home
      ? `Heute, ${info.weekday}, ${info.todayLong}, ist KW ${info.week} (${info.range}). Feiertage und Fenstertage für AT, DE und CH.`
      : `Kalenderwoche ${info.week} (${info.iso}) dauert vom ${info.startLong} bis ${info.endLong}.`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }, [home, info, invalid, sentence]);

  if (invalid) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="kicker">ISO 8601</p>
        <h1 className="mt-3 font-display text-5xl">Diese Woche gibt es nicht</h1>
        <p className="mt-4 text-muted">Ein Jahr hat 52 oder 53 Kalenderwochen. Die aufgerufene Nummer liegt außerhalb.</p>
        <Link to="/" className="btn btn-accent mt-6">Zur aktuellen Woche</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 pb-28 md:pb-8">
      <WeekHero />
      <WeekStrip />
      <Insights />
      <WeekStory />
      <Planner />

      <section className="panel space-y-4 px-5 py-8 sm:px-8">
        <h2 className="font-display text-3xl">Wofür die Zahl gut ist</h2>
        <p className="max-w-3xl leading-relaxed text-muted">
          KW {info.week} ist die Woche von Montag, {info.startLong}, bis Sonntag, {info.endLong}. Gezählt wird nach ISO 8601:
          die Woche beginnt am Montag, und Woche 1 ist die Woche mit dem ersten Donnerstag des Jahres. Deshalb kann der 1. Jänner
          noch zur letzten Woche des Vorjahres gehören.
        </p>
        <p className="max-w-3xl leading-relaxed text-muted">
          In Österreich sagt man Fenstertag, in Deutschland Brückentag: der Werktag zwischen einem Feiertag und dem Wochenende.
          Die App rechnet ihn für dein Bundesland aus, zusammen mit den Werktagen der Woche. Schulferien lässt sie weg, die legt jedes Land selbst fest.
        </p>
        <p className="text-sm text-muted">Pfeiltasten wechseln die Woche, T bringt dich auf heute.</p>
      </section>
      <Footer />

      <nav
        className={`fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 transition duration-200 md:hidden ${
          dock ? 'visible translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <button className="btn shadow-none" onClick={() => navigateWeek(-1)} aria-label="Vorherige Woche">Zurück</button>
        <button className="btn btn-accent" onClick={goToday}>Heute</button>
        <button className="btn" onClick={() => navigateWeek(1)} aria-label="Nächste Woche">Weiter</button>
      </nav>
    </div>
  );
};

export default CalendarPage;
