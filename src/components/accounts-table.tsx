"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpDown, ChevronDown, ChevronUp, Search, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { NespressoGroup } from "@/components/nespresso-group";
import type { Account, HealthStatus } from "@/lib/types";
import { cn, formatCurrency, formatRelative } from "@/lib/utils";
import { isRenewalAndVolumeRisk } from "@/lib/health";

const TODAY = new Date("2026-05-19");

type SortKey = "name" | "health" | "arr" | "renewal" | "risks" | "usage" | "lastTouch";
type SortDir = "asc" | "desc";

const HEALTH_RANK: Record<HealthStatus, number> = { critical: 0, at_risk: 1, watch: 2, healthy: 3 };

function sortAccounts(accounts: Account[], key: SortKey, dir: SortDir): Account[] {
  return [...accounts].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name":      cmp = a.name.localeCompare(b.name); break;
      case "health":    cmp = HEALTH_RANK[a.health] - HEALTH_RANK[b.health]; break;
      case "arr":       cmp = a.arr - b.arr; break;
      case "renewal":   cmp = a.renewalDate.localeCompare(b.renewalDate); break;
      case "risks":     cmp = a.risks.length - b.risks.length; break;
      case "usage":     cmp = a.productUsage - b.productUsage; break;
      case "lastTouch": cmp = a.lastTouch.localeCompare(b.lastTouch); break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

function SortIcon({ col, activeKey, dir }: { col: SortKey; activeKey: SortKey; dir: SortDir }) {
  if (col !== activeKey) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/40" />;
  return dir === "asc"
    ? <ChevronUp className="ml-1 inline h-3 w-3 text-foreground" />
    : <ChevronDown className="ml-1 inline h-3 w-3 text-foreground" />;
}

export function AccountsTable({ accounts, nespressoAccounts }: { accounts: Account[]; nespressoAccounts: Account[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "health" || key === "risks" || key === "usage" ? "asc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.industry.toLowerCase().includes(q) ||
            a.region.toLowerCase().includes(q) ||
            a.segment.toLowerCase().includes(q),
        )
      : accounts;
    return sortAccounts(base, sortKey, sortDir);
  }, [accounts, query, sortKey, sortDir]);

  const showNespresso = !query.trim();

  function Th({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="cursor-pointer select-none py-2 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
        onClick={() => toggleSort(col)}
      >
        {label}
        <SortIcon col={col} activeKey={sortKey} dir={sortDir} />
      </th>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter accounts…"
          className="w-full rounded-md border bg-background py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <Th col="name" label="Account" />
              <Th col="health" label="Health" />
              <Th col="arr" label="ARR" />
              <Th col="renewal" label="Renewal" />
              <Th col="risks" label="Risks" />
              <Th col="usage" label="Usage" />
              <Th col="lastTouch" label="Last touch" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => {
              const flagged = isRenewalAndVolumeRisk(a, TODAY);
              return (
                <tr key={a.id} className={cn("group cursor-pointer", flagged && "bg-rose-50/40")}>
                  <td className="py-3 pr-4">
                    <Link href={`/accounts/${a.id}`} className="flex items-center gap-3">
                      <AccountAvatar initials={a.initials} color={a.logoColor} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className="truncate font-medium text-foreground group-hover:underline">{a.name}</div>
                          {flagged && (
                            <span title="Renewal within 6 weeks and usage ≥90%">
                              <Zap className="h-3 w-3 shrink-0 text-rose-600" />
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{a.industry}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <HealthPill status={a.health} />
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{formatCurrency(a.arr)}</td>
                  <td className="py-3 pr-4">
                    <div className={cn("text-sm tabular-nums", flagged ? "font-semibold text-rose-600" : "")}>
                      {formatRelative(a.renewalDate, TODAY)}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {a.risks.length ? (
                      <span className="inline-flex items-center gap-1 text-sm text-rose-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {a.risks.length}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Progress value={a.productUsage} className="h-1.5 w-20" />
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          a.productUsage >= 90 ? "font-semibold text-rose-600" : "text-muted-foreground",
                        )}
                      >
                        {a.productUsage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">
                    {formatRelative(a.lastTouch, TODAY)}
                  </td>
                </tr>
              );
            })}
            {showNespresso && <NespressoGroup accounts={nespressoAccounts} />}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No accounts match &ldquo;{query}&rdquo;</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {query ? `${filtered.length} of ${accounts.length} accounts` : `${accounts.length} accounts`}
        {showNespresso && " · Nespresso units grouped under NN HQ"}
      </p>
    </div>
  );
}
