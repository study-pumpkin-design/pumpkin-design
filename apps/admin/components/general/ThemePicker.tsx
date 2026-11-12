"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { startTransition, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("admin-theme", theme);
}

function ThemePicker({ collapsed }: { collapsed: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme") as Theme | null;
    const nextTheme = savedTheme ?? "system";
    startTransition(() => setTheme(nextTheme));
    applyTheme(nextTheme);
  }, []);

  const themes = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <section
      aria-label="Appearance"
      className="border-t border-foreground/10 px-3 py-4"
    >
      {!collapsed && (
        <p className="mb-2 px-1 text-xs font-semibold text-foreground/55">
          Appearance
        </p>
      )}
      <div
        className={
          collapsed
            ? "flex flex-col gap-1"
            : "grid grid-cols-3 gap-1 rounded-xl bg-foreground/5 p-1"
        }
      >
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setTheme(value);
              applyTheme(value);
            }}
            aria-pressed={theme === value}
            title={collapsed ? label : undefined}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-purple ${theme === value ? "bg-background text-foreground shadow-sm" : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"}`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ThemePicker;
