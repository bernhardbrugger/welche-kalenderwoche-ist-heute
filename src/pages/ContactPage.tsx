import React from 'react';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <header className="py-8">
        <p className="kicker">Kontakt</p>
        <h1 className="mt-3 font-display text-5xl">Eine Zeile reicht.</h1>
        <p className="mt-4 max-w-xl text-muted">
          Fehler bei einem Feiertag, eine fehlende Region oder einfach ein Hallo. Die Mail geht an Bernhard Brugger.
        </p>
      </header>
      <div className="panel p-6">
        <a className="btn btn-accent" href="mailto:bernhard.brugger@outlook.com?subject=Kalenderwoche">
          bernhard.brugger@outlook.com
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
