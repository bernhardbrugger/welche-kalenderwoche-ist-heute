import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CloudSun, Menu, Moon, Sun, X } from 'lucide-react';
import WeekMark from './WeekMark';
import { useTheme } from '../context/ThemeContext';
import { useWeekData } from '../context/WeekDataContext';

const links = [
  { to: '/', label: 'Heute', end: true },
  { to: '/info', label: 'Wissen', end: false },
  { to: '/kontakt', label: 'Kontakt', end: false },
];

const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const themeLabel = mode === 'light' ? 'Dunkles Design' : mode === 'dark' ? 'Design folgt der Tageszeit' : 'Helles Design erzwingen';
  const { info, isCurrentWeek } = useWeekData();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onCalendar = pathname === '/' || pathname.startsWith('/kw/');
  const yearHref = onCalendar ? '#jahr' : '/#jahr';

  return (
    <header className="skybar sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="panel flex items-center gap-3 py-1.5 pl-1.5 pr-4" onClick={() => setOpen(false)}>
          <WeekMark />
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold tracking-wide">Wochenwarte</span>
            <span className="block text-xs text-muted">{isCurrentWeek ? `KW ${info.week}` : info.iso}</span>
          </span>
        </NavLink>

        <nav className="panel hidden items-center gap-1 p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-[2px_12px] px-4 py-2 font-display text-lg leading-none ${isActive ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a href={yearHref} className="rounded-[2px_12px] px-4 py-2 font-display text-lg leading-none text-muted hover:text-ink">
            Jahr
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost h-11 w-11 p-0" onClick={toggleTheme} aria-label={themeLabel}>
            {mode === 'light' ? <Sun className="h-4 w-4" /> : mode === 'dark' ? <Moon className="h-4 w-4" /> : <CloudSun className="h-4 w-4" />}
          </button>
          <button className="btn btn-ghost h-11 w-11 rounded-full p-0 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menü">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="panel mx-4 mb-3 flex flex-col p-2 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium"
            >
              {link.label}
            </NavLink>
          ))}
          <a href={yearHref} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium">
            Jahresatlas
          </a>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
