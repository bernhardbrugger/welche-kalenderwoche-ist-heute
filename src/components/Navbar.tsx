import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWeekData } from '../context/WeekDataContext';

const links = [
  { to: '/', label: 'Heute', end: true },
  { to: '/info', label: 'Wissen', end: false },
  { to: '/kontakt', label: 'Kontakt', end: false },
];

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { info, isCurrentWeek } = useWeekData();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onCalendar = pathname === '/' || pathname.startsWith('/kw/');
  const yearHref = onCalendar ? '#jahr' : '/#jahr';

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="panel flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1c1712] font-display text-sm text-[#f6f1e8]">KW</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">heute</span>
            <span className="block text-xs text-muted">{isCurrentWeek ? `KW ${info.week}` : info.iso}</span>
          </span>
        </NavLink>

        <nav className="panel hidden items-center gap-1 rounded-full p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a href={yearHref} className="rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-ink">
            Jahr
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost h-11 w-11 rounded-full p-0" onClick={toggleTheme} aria-label={isDark ? 'Helles Design' : 'Dunkles Design'}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
