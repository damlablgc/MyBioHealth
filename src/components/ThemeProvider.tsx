import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  useEffect(() => {
    let appliedTheme = theme;
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      appliedTheme = prefersDark ? "dark" : "light";
    }
    document.documentElement.classList.toggle("dark", appliedTheme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}; 