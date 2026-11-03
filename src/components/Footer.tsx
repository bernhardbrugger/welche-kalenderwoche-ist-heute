import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="mx-auto mt-16 flex max-w-6xl flex-col gap-4 px-4 pb-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
      <p>Gemacht in Österreich · ISO 8601 · Zeitangaben für Wien</p>
      <div className="flex gap-4">
        <Link to="/info" className="hover:text-ink">Wissen</Link>
        <Link to="/kontakt" className="hover:text-ink">Kontakt</Link>
        <Link to="/datenschutz" className="hover:text-ink">Datenschutz</Link>
      </div>
    </footer>
  );
};

export default Footer;
