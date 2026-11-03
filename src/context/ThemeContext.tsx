import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';

type ThemeContextType = {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'auto',
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
  } catch {
    /* private mode */
  }
  return 'auto';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(readMode);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    const apply = () => {
      const phase = root.dataset.phase;
      const dark = mode === 'dark' || (mode === 'auto' && phase === 'night');
      root.classList.toggle('dark', dark);
      setIsDark(dark);
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['data-phase'] });
    return () => observer.disconnect();
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode */
      }
      return next;
    });
  };

  return <ThemeContext.Provider value={{ mode, isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};
