import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { getSession } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · Bounceback" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getSession()) redirect("/");
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen bg-[#F7F5F0] text-[#121211] min-[960px]:grid-cols-[1.1fr_0.9fr] dark:bg-[#121211] dark:text-[#F7F5F0]">
      {/* Left panel: Sign in */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="flex w-full max-w-[420px] flex-col gap-8 rounded-panel border-[1.5px] border-[#121211] bg-[#FFFFFF] p-8 shadow-[4px_4px_0px_#121211] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <BrandMark className="size-9" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#595854] dark:text-neutral-400">
                [ Quarkfin Labs ]
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif text-[32px] font-normal tracking-[-0.02em] leading-tight text-[#121211] dark:text-white">
                Bounceback
              </h1>
              <p className="text-sm font-medium text-[#D94E28]">
                Dedicated to everyone overcoming a layoff.
              </p>
            </div>
          </div>

          <LoginForm next={typeof next === "string" ? next : undefined} />

          <div className="border-t border-[#DCD8CF] pt-4 dark:border-neutral-800">
            <p className="font-mono text-[11px] leading-relaxed text-[#595854] dark:text-neutral-400">
              Private, self-hosted career command center. Your data never leaves your machine.
            </p>
          </div>
        </div>
      </div>

      {/* Right editorial panel */}
      <div
        aria-hidden="true"
        className="hidden border-l-[1.5px] border-[#121211] bg-[#EFECE5] p-12 min-[960px]:flex min-[960px]:flex-col min-[960px]:justify-between dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex items-center justify-between border-b border-[#DCD8CF] pb-4 dark:border-neutral-800">
          <span className="font-mono text-xs tracking-widest uppercase text-[#595854]">
            REBOUND & REBUILD
          </span>
          <span className="font-mono text-xs text-[#595854]">
            BUILD 2026.10
          </span>
        </div>

        <div className="max-w-[460px] space-y-6">
          <div className="inline-block rounded-control border border-[#D94E28] bg-[#FCECE8] px-2.5 py-1 font-mono text-xs font-semibold text-[#D94E28]">
            ANTI-GRAVITY SUITE
          </div>
          <h2 className="font-serif text-[42px] font-normal leading-[1.04] tracking-[-0.02em] text-[#121211] dark:text-white">
            Layoffs happen. <br />
            <span className="italic text-[#D94E28]">The comeback is deliberate.</span>
          </h2>
          <p className="text-[15px] leading-relaxed text-[#595854] dark:text-neutral-400">
            Bounceback transforms your complete career history into role-specific, ATS-aligned applications in seconds. Powered by 100% private, on-device intelligence.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-control border border-[#DCD8CF] bg-white p-3 shadow-[2px_2px_0px_#121211] dark:border-neutral-800 dark:bg-neutral-900">
              <div className="font-mono text-[11px] text-[#595854]">PRIVACY</div>
              <div className="font-serif text-lg font-medium">100% Local</div>
            </div>
            <div className="rounded-control border border-[#DCD8CF] bg-white p-3 shadow-[2px_2px_0px_#121211] dark:border-neutral-800 dark:bg-neutral-900">
              <div className="font-mono text-[11px] text-[#595854]">ACCELERATION</div>
              <div className="font-serif text-lg font-medium">Tailored Output</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DCD8CF] pt-4 font-mono text-[11px] text-[#595854] dark:border-neutral-800">
          QUARKFIN · CRAFTED FOR RESILIENCE
        </div>
      </div>
    </main>
  );
}
