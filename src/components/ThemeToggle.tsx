
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch on SSR (next-themes requirement)
  if (!mounted) return (
    <button
      aria-label="Toggle theme"
      disabled
      className="rounded-xl p-2.5 bg-sage-100 dark:bg-navy-700 text-sage-400 opacity-60 pointer-events-none border border-sage-200 dark:border-navy-600"
      tabIndex={-1}
    >
      <Sun className="w-5 h-5" />
    </button>
  );

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`group rounded-xl p-2.5 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 active:scale-95 border ${
        isDark 
          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 hover:from-yellow-200 hover:to-yellow-300 dark:hover:from-yellow-900/30 dark:hover:to-yellow-800/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50" 
          : "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900/20 dark:to-slate-800/20 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-900/30 dark:hover:to-slate-800/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800/50"
      }`}
      tabIndex={0}
      type="button"
    >
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
      {isDark ? (
        <Moon className="w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
