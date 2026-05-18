import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "KAM Command Center",
  description: "Account health, renewals, risks, and meeting prep for Key Account Managers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
