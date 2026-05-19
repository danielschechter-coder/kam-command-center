"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import type { Account, HealthStatus } from "@/lib/types";
import { cn, formatCurrency, formatRelative } from "@/lib/utils";
import { isRenewalAndVolumeRisk } from "@/lib/health";

const TODAY = new Date("2026-05-19");

const HEALTH_RANK: Record<HealthStatus, number> = { critical: 0, at_risk: 1, watch: 2, healthy: 3 };

function worstHealth(accounts: Account[]): HealthStatus {
  return accounts.reduce<HealthStatus>(
    (worst, a) => (HEALTH_RANK[a.health] < HEALTH_RANK[worst] ? a.health : worst),
    "healthy",
  );
}

export function NespressoGroup({ accounts }: { accounts: Account[] }) {
  const [expanded, setExpanded] = useState(false);

  const totalArr = accounts.reduce((s, a) => s + a.arr, 0);
  const health = worstHealth(accounts);
  const totalRisks = accounts.reduce((s, a) => s + a.risks.length, 0);
  const avgUsage = Math.round(accounts.reduce((s, a) => s + a.productUsage, 0) / accounts.length);
  const flaggedUnits = accounts.filter((a) => isRenewalAndVolumeRisk(a, TODAY));
  const earliestRenewal = accounts.reduce(
    (min, a) => (!min || a.renewalDate < min ? a.renewalDate : min),
    "",
  );
  const mostRecentTouch = accounts.reduce(
    (max, a) => (!max || a.lastTouch > max ? a.lastTouch : max),
    "",
  );

  const sorted = [...accounts].sort((a, b) => {
    const hDiff = HEALTH_RANK[a.health] - HEALTH_RANK[b.health];
    return hDiff !== 0 ? hDiff : b.arr - a.arr;
  });

  return (
    <>
      {/* NN HQ aggregated parent row */}
      <tr
        className={cn("cursor-pointer bg-indigo-50/60 hover:bg-indigo-100/60", flaggedUnits.length > 0 && "bg-rose-50/40 hover:bg-rose-100/40")}
        onClick={() => setExpanded((x) => !x)}
      >
        <td className="py-3 pr-4">
          <div className="flex items-center gap-3">
            <button
              aria-label={expanded ? "Collapse Nespresso units" : "Expand Nespresso units"}
              className="flex h-5 w-5 shrink-0 items-center justify-center text-indigo-500"
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            <AccountAvatar initials="NN" color="#6366f1" size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">NN HQ</span>
                {flaggedUnits.length > 0 && (
                  <span title={`${flaggedUnits.length} unit(s) with renewal + usage alert`}><Zap className="h-3 w-3 text-rose-600" /></span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Nespresso Global · {accounts.length} country units
                {flaggedUnits.length > 0 && ` · ${flaggedUnits.length} flagged`}
              </div>
            </div>
          </div>
        </td>
        <td className="py-3 pr-4">
          <HealthPill status={health} />
        </td>
        <td className="py-3 pr-4 font-semibold tabular-nums">{formatCurrency(totalArr)}</td>
        <td className="py-3 pr-4">
          <div className="text-sm tabular-nums text-muted-foreground">
            {earliestRenewal ? formatRelative(earliestRenewal, TODAY) : "—"}
          </div>
        </td>
        <td className="py-3 pr-4">
          {totalRisks > 0 ? (
            <span className="inline-flex items-center gap-1 text-sm text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {totalRisks}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </td>
        <td className="py-3 pr-4">
          <div className="flex items-center gap-2">
            <Progress value={avgUsage} className="h-1.5 w-20" />
            <span className={cn("text-xs tabular-nums", avgUsage >= 90 ? "font-semibold text-rose-600" : "text-muted-foreground")}>
              {avgUsage}%
            </span>
          </div>
        </td>
        <td className="py-3 pr-4 text-xs text-muted-foreground">
          {mostRecentTouch ? formatRelative(mostRecentTouch, TODAY) : "—"}
        </td>
      </tr>

      {/* Individual Nespresso country unit rows */}
      {expanded &&
        sorted.map((a) => {
          const flagged = isRenewalAndVolumeRisk(a, TODAY);
          return (
            <tr key={a.id} className={cn(
              "group cursor-pointer border-l-2 border-l-indigo-300",
              flagged ? "bg-rose-50/30 hover:bg-rose-50/60" : "bg-white hover:bg-indigo-50/40"
            )}>
              <td className="py-2.5 pr-4">
                <Link href={`/accounts/${a.id}`} className="flex items-center gap-3 pl-8">
                  <AccountAvatar initials={a.initials} color={a.logoColor} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="truncate text-sm font-medium text-foreground group-hover:underline">
                        {a.name}
                      </div>
                      {flagged && <Zap className="h-3 w-3 shrink-0 text-rose-600" />}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{a.industry}</div>
                  </div>
                </Link>
              </td>
              <td className="py-2.5 pr-4">
                <HealthPill status={a.health} />
              </td>
              <td className="py-2.5 pr-4 tabular-nums text-sm">{formatCurrency(a.arr)}</td>
              <td className="py-2.5 pr-4">
                <div className={cn("text-sm tabular-nums", flagged ? "font-semibold text-rose-600" : "")}>
                  {formatRelative(a.renewalDate, TODAY)}
                </div>
              </td>
              <td className="py-2.5 pr-4">
                {a.risks.length ? (
                  <span className="inline-flex items-center gap-1 text-sm text-rose-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {a.risks.length}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-2">
                  <Progress value={a.productUsage} className="h-1.5 w-20" />
                  <span className={cn("text-xs tabular-nums", a.productUsage >= 90 ? "font-semibold text-rose-600" : "text-muted-foreground")}>
                    {a.productUsage}%
                  </span>
                </div>
              </td>
              <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                {formatRelative(a.lastTouch, TODAY)}
              </td>
            </tr>
          );
        })}
    </>
  );
}
