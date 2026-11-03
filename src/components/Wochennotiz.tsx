import { useEffect, useState, type FC } from 'react';
import { useWeekData } from '../context/WeekDataContext';

const Wochennotiz: FC = () => {
  const { info } = useWeekData();
  const key = `kw-note-${info.iso}`;
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      setText(localStorage.getItem(key) ?? '');
    } catch {
      setText('');
    }
  }, [key]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      try {
        if (text) localStorage.setItem(key, text);
        else localStorage.removeItem(key);
      } catch {
        /* private mode */
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [key, text]);

  return (
    <section className="notebook p-5 sm:p-6" aria-labelledby="notiz-title">
      <p className="kicker">Randnotiz</p>
      <h2 id="notiz-title" className="mt-1 font-display text-4xl leading-none">Für KW {info.week}</h2>
      <label className="sr-only" htmlFor="week-note">Notiz zu dieser Kalenderwoche</label>
      <textarea
        id="week-note"
        className="notebook-lines mt-4"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Abgabe, Fenstertag, wer diese Woche frei hat…"
        rows={6}
        maxLength={800}
      />
      <p className="mt-2 text-xs text-muted">Bleibt nur auf diesem Gerät, eine Notiz pro Woche.</p>
    </section>
  );
};

export default Wochennotiz;
