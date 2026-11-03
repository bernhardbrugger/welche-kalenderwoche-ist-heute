import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const InfoPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="py-8">
        <p className="kicker">ISO 8601</p>
        <h1 className="mt-3 font-display text-5xl leading-tight">Die Woche hat eine Nummer, damit man sich nicht verhaspelt.</h1>
      </header>
      <div className="space-y-4">
        <section className="panel p-6">
          <h2 className="font-display text-2xl">Wie gezählt wird</h2>
          <ul className="mt-4 space-y-3 leading-relaxed text-muted">
            <li>Die Woche beginnt am Montag und endet am Sonntag.</li>
            <li>Kalenderwoche 1 ist die Woche, in die der erste Donnerstag des Jahres fällt. Gleichwertig: die Woche, die den 4. Jänner enthält.</li>
            <li>Ein Jahr hat 52 oder 53 Wochen. 2026 hat 53, weil der 1. Jänner ein Donnerstag ist.</li>
            <li>Die Nummer gehört zum Jahr des Donnerstags. Der 29. Dezember 2025 ist schon KW 1 / 2026.</li>
          </ul>
        </section>
        <section className="panel p-6">
          <h2 className="font-display text-2xl">Warum die Google-Zeile die Wiener Zeit nimmt</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Wer „welche Kalenderwoche ist heute“ sucht, will die Woche in Österreich, Deutschland oder der Schweiz.
            Die Zeile im Suchergebnis wird deshalb nach der Uhr in Wien gesetzt, nicht nach der Uhr des Servers.
            Sonntag spätabends in UTC ist in Wien oft schon Montag, und dann gilt die neue Woche.
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            Jede einzelne Woche hat außerdem eine feste Adresse, zum Beispiel <Link className="text-ink underline" to="/kw/2026/45">KW 45 / 2026</Link>.
            Die ändert sich nicht, wenn die Woche vorbei ist. Die Startseite ist die einzige Seite, deren Antwort jede Woche neu ist.
          </p>
        </section>
        <section className="panel p-6">
          <h2 className="font-display text-2xl">Was die App sonst noch weiß</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Gesetzliche Feiertage für die Bundesländer in Österreich und Deutschland, die üblichen Feiertage der Schweiz,
            Fenstertage, Werktage, den Stand im Jahr und einen Satz zum Kopieren. Die Sonnenzeiten sind eine Näherung für Wien.
            Alles rechnet im Browser. Land und Bundesland bleiben lokal gespeichert.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default InfoPage;
