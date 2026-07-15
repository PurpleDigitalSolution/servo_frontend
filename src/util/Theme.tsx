import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "system";

    return (localStorage.getItem("theme") as "light" | "dark" | "system" | null) ?? "system";
  });

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    const isDark = selectedTheme === "dark" ||
      (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="relative rounded-full bg-surface-secondary border border-border p-1 shadow-md">
      <div className="flex items-center gap-1">
        {/* Light Mode */}
        <button
          onClick={() => handleThemeChange("light")}
          className={`relative rounded-full p-2 transition-all duration-200 ${
            theme === "light"
              ? "bg-primary text-white shadow-md"
              : "text-text-primary hover:bg-surface"
          }`}
          aria-label="Light mode"
        >
          <Sun className="w-5 h-5" />

        </button>

        {/* Dark Mode */}
        <button
          onClick={() => handleThemeChange("dark")}
          className={`relative rounded-full p-2 transition-all duration-200 ${
            theme === "dark"
              ? "bg-primary text-white shadow-md"
              : "text-text-primary hover:bg-surface"
          }`}
          aria-label="Dark mode"
        >
          <Moon className="w-5 h-5" />

        </button>

        {/* System Preference */}
        <button
          onClick={() => handleThemeChange("system")}
          className={`relative rounded-full p-2 transition-all duration-200 ${
            theme === "system"
              ? "bg-primary text-white shadow-md"
              : "text-text-primary hover:bg-surface"
          }`}
          aria-label="System preference"
        >
          <Monitor className="w-5 h-5" />

        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;