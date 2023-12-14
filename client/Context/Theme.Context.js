import { createContext, useEffect, useState } from 'react';


export const ThemeContext = createContext({
  themeMode: { darkMode: false, isTransition: false },
  toggleDarkMode() {},
});

export default function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState({
    darkMode: false,
    isTransition: false,
  });

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const next = themeMode.darkMode ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeMode({
      ...themeMode,
      darkMode: !themeMode.darkMode,
    });
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.theme;
      const html = document.documentElement;
      // html.setAttribute('data-theme', theme);
      html.setAttribute('data-theme', 'dark');
      setThemeMode({
        darkMode: theme === 'dark',
        isTransition: true,
      });
    }
  }, []);

  return <ThemeContext.Provider value={{ themeMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
}
