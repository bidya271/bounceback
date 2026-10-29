import { LogOut, Plus } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { signOut } from "@/lib/auth/actions";
import type { Release } from "@/lib/releases";
import type { ColorScheme } from "@/lib/ui-preferences";

import { NavLinks } from "./nav-links";
import { RepositoryLink } from "./repository-link";
import { SidebarFrame } from "./sidebar-frame";
import { ThemeToggle } from "./theme-toggle";
import { UpdateNotice } from "./update-notice";

/** Up to two initials for the avatar, e.g. "Jane Doe" → "JD". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]!.toUpperCase()).join("") || "?";
}

export function Sidebar({
  userName,
  update,
  currentVersion,
  collapsed,
  colorScheme,
  counts,
}: {
  userName: string;
  update: Release | null;
  currentVersion: string;
  collapsed: boolean;
  colorScheme?: ColorScheme;
  counts?: Record<string, number>;
}) {
  return (
    <SidebarFrame
      initialCollapsed={collapsed}
      brand={
        <>
          <BrandMark />
          <div className="flex min-w-0 flex-col group-data-collapsed/sidebar:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl leading-none font-semibold tracking-[-0.02em] text-[#121211] dark:text-[#F7F5F0]">
                Bounceback
              </span>
              <span className="rounded-[4px] border border-[#DCD8CF] bg-[#EFECE5] px-1 py-0.2 text-[9px] font-mono tracking-wider uppercase text-[#595854] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Quarkfin
              </span>
            </div>
            <span className="truncate text-[11px] text-[#595854] dark:text-neutral-400">
              For everyone overcoming a layoff
            </span>
          </div>
        </>
      }
    >
      <div className="flex flex-1 flex-col gap-1 p-2 group-data-collapsed/sidebar:px-1">
        <Link
          href="/new?fresh=1"
          title="New application"
          className="mb-2 flex min-h-[36px] items-center gap-1.5 rounded-control border-[1.5px] border-[#121211] bg-[#121211] px-3 text-sm font-medium text-[#F7F5F0] shadow-[2px_2px_0px_#121211] hover:bg-[#D94E28] hover:border-[#D94E28] hover:text-[#FFFFFF] motion-safe:transition-all group-data-collapsed/sidebar:justify-center group-data-collapsed/sidebar:px-1.5 dark:border-white/20 dark:bg-white dark:text-[#121211] dark:shadow-none dark:hover:bg-[#D94E28] dark:hover:text-white"
        >
          <Plus size={16} aria-hidden="true" className="shrink-0" />
          <span className="group-data-collapsed/sidebar:sr-only font-mono text-xs tracking-tight uppercase">New application</span>
        </Link>

        <NavLinks counts={counts} />
      </div>

      {update && (
        <div className="px-2 pb-2 group-data-collapsed/sidebar:px-1">
          <UpdateNotice release={update} currentVersion={currentVersion} />
        </div>
      )}

      <div className="flex flex-col gap-0.5 border-t border-line p-2 group-data-collapsed/sidebar:px-1">
        <ThemeToggle serverScheme={colorScheme} />
        <RepositoryLink />
      </div>

      <div className="flex items-center gap-2 border-t border-line px-4 py-3 group-data-collapsed/sidebar:flex-col group-data-collapsed/sidebar:px-1">
        <span
          aria-hidden="true"
          title={userName}
          className="grid size-[26px] shrink-0 place-items-center rounded-control border border-[#121211] bg-[#EFECE5] text-[11px] font-mono font-bold text-[#121211]"
        >
          {initials(userName)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col group-data-collapsed/sidebar:hidden">
          <span className="truncate text-xs font-medium">{userName}</span>
          <span className="truncate text-[10.5px] font-mono text-[#595854] dark:text-neutral-400">Quarkfin System</span>
        </span>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="grid size-[26px] place-items-center rounded-control text-muted hover:bg-hover hover:text-ink"
          >
            <LogOut size={15} aria-hidden="true" />
          </button>
        </form>
      </div>
    </SidebarFrame>
  );
}
