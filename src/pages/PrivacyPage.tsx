import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="py-8">
        <p className="kicker">Datenschutz</p>
        <h1 className="mt-3 font-display text-5xl">Nichts zum Anmelden.</h1>
      </header>
      <div className="panel space-y-6 p-6 leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-2xl text-ink">Verantwortlich</h2>
          <p className="mt-2">
            Bernhard Brugger<br />
            E-Mail: bernhard.brugger@outlook.com
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Was im Browser bleibt</h2>
          <p className="mt-2">
            Land, Bundesland, Stunden pro Tag und das helle oder dunkle Design werden im lokalen Speicher deines Browsers gemerkt.
            Es gibt kein Konto und keine Analyse- oder Werbe-Cookies. Die Kalenderwoche wird auf deinem Gerät berechnet.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Server-Logs</h2>
          <p className="mt-2">
            Beim Aufruf speichert der Hoster die üblichen technischen Zugriffsdaten: IP-Adresse, Zeitpunkt, aufgerufene Adresse,
            Browser und die Seite, von der du gekommen bist. Das passiert, damit die Seite ausgeliefert und abgesichert werden kann.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Kontakt per E-Mail</h2>
          <p className="mt-2">
            Wenn du schreibst, landen Empfänger, Inhalt und deine Adresse im E-Mail-Postfach und werden nur dafür verwendet, dir zu antworten.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-ink">Deine Rechte</h2>
          <p className="mt-2">
            Du kannst Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit verlangen,
            soweit diese Rechte auf die wenigen verarbeiteten Daten zutreffen. Eine Mail an die oben genannte Adresse genügt.
            Außerdem kannst du dich bei der Datenschutzbehörde beschweren.
          </p>
        </section>
        <p>
          <Link to="/kontakt" className="text-ink underline">Zum Kontakt</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
