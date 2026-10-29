import type { Metadata } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";

import { Toaster } from "@/components/toast";
import { fontVariables } from "@/fonts";
import { COLOR_SCHEME_COOKIE, parseColorScheme } from "@/lib/ui-preferences";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Bounceback", template: "%s · Bounceback" },
  description: "Your job search, on your server.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  await connection();
  // Default explicitly to light mode unless the user explicitly requested dark in cookie
  const cookieVal = (await cookies()).get(COLOR_SCHEME_COOKIE)?.value;
  const scheme = parseColorScheme(cookieVal) ?? "light";

  return (
    <html lang="en" data-theme={scheme} className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
