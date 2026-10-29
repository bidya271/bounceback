"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import { COLOR_SCHEME_COOKIE, rememberPreference, type ColorScheme } from "@/lib/ui-preferences";

import { useSidebarCollapsed } from "./sidebar-frame";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function currentScheme(): ColorScheme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "dark") return "dark";
  return "light";
}

export function ThemeToggle({ serverScheme }: { serverScheme?: ColorScheme }) {
  const collapsed = useSidebarCollapsed();
  const scheme = useSyncExternalStore(subscribe, currentScheme, () => serverScheme ?? "light");
  const next: ColorScheme = scheme === "light" ? "dark" : "light";
  const label = next === "dark" ? "Switch to dark mode" : "Switch to light mode";
  const Icon = scheme === "light" ? Moon : Sun;

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    rememberPreference(COLOR_SCHEME_COOKIE, next);
    listeners.forEach((listener) => listener());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={collapsed ? label : undefined}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-control px-3 py-1.5 text-left text-sm font-medium text-muted hover:bg-hover hover:text-ink motion-safe:transition-colors",
        collapsed && "justify-center px-1.5",
      )}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{scheme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
