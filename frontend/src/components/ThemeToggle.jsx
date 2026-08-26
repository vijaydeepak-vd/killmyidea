import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const getInitial = () => {
  try {
    const stored = localStorage.getItem("kmi-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    try {
      localStorage.setItem("kmi-theme", next);
    } catch {}
    setTheme(next);
  };

  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      data-testid="theme-toggle"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line text-mist transition-colors duration-200 hover:bg-raise hover:text-body"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
