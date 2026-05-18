"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ListChecks, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/actions", label: "Actions", icon: ListChecks },
  { href: "/briefs", label: "Meeting briefs", icon: Sparkles },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white">
            <span className="text-[11px] font-bold tracking-tight">KAM</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Command Center</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-slate-100 text-slate-900" : "text-muted-foreground hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right text-xs leading-tight sm:block">
            <div className="font-medium text-foreground">Daniel Schechter</div>
            <div className="text-muted-foreground">Key Account Manager · Parcel Perform</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            DS
          </div>
        </div>
      </div>
    </header>
  );
}
