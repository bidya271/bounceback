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
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden group-data-collapsed/sidebar:hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-[18px] leading-tight font-bold tracking-tight text-ink">
                Bounceback
              </span>
              <span className="rounded-[3px] border border-line bg-hover px-1 py-0.5 text-[8.5px] font-mono tracking-wider uppercase text-muted">
                Quarkfin
              </span>
            </div>
            <span className="truncate text-[10.5px] text-muted">
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
          className="mb-2 flex min-h-[36px] items-center gap-1.5 rounded-control border border-line-control bg-primary px-3 text-sm font-medium text-on-primary shadow-control hover:bg-primary-hover hover:text-on-primary motion-safe:transition-all group-data-collapsed/sidebar:justify-center group-data-collapsed/sidebar:px-1.5"
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
          className="grid size-[26px] shrink-0 place-items-center rounded-control border border-line bg-hover text-[11px] font-mono font-bold text-ink"
        >
          {initials(userName)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col group-data-collapsed/sidebar:hidden">
          <span className="truncate text-xs font-medium">{userName}</span>
          <span className="truncate text-[10.5px] font-mono text-muted">Quarkfin Technology</span>
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
