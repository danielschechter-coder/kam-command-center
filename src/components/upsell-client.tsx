"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Flame,
  Zap,
  Thermometer,
  AlertCircle,
  MessageSquare,
  Ticket,
  Mail,
  Building2,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { cn, formatCurrency } from "@/lib/utils";
import type { PPModule, UpsellOpportunity, UpsellTier, ModuleCoverageRow } from "@/lib/upsell";
import type { HealthStatus } from "@/lib/types";

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<
  UpsellTier,
  { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; ring: string }
> = {
  hot: { label: "Hot", icon: Flame, bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200" },
  warm: { label: "Warm", icon: Zap, bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  cool: { label: "Cool", icon: Thermometer, bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200" },
  gap: { label: "Gap", icon: AlertCircle, bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200" },
};

// ── Source config ─────────────────────────────────────────────────────────────

const SOURCE_CONFIG = {
  slack: { label: "Slack", icon: MessageSquare, bg: "bg-violet-100", text: "text-violet-700" },
  jira: { label: "Jira", icon: Ticket, bg: "bg-blue-100", text: "text-blue-700" },
  gmail: { label: "Gmail", icon: Mail, bg: "bg-red-100", text: "text-red-700" },
  hubspot: { label: "HubSpot", icon: Building2, bg: "bg-orange-100", text: "text-orange-700" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: UpsellTier }) {
  const cfg = TIER_CONFIG[tier];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", cfg.bg, cfg.text, cfg.ring)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function ModuleBadge({ module }: { module: PPModule }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", module.color.bg, module.color.text, module.color.ring)}>
      {module.shortName}
      {module.tier === "premium" && <span className="opacity-60">✦</span>}
    </span>
  );
}

function SourceBadge({ source }: { source: keyof typeof SOURCE_CONFIG }) {
  const cfg = SOURCE_CONFIG[source];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold", cfg.bg, cfg.text)}>
      <Icon className="h-2.5 w-2.5" />
      {cfg.label}
    </span>
  );
}

function OpportunityCard({ opp }: { opp: UpsellOpportunity }) {
  const [expanded, setExpanded] = useState(false);
  const visibleSignals = expanded ? opp.topSignals : opp.topSignals.slice(0, 2);
  const hasMore = opp.allSignalCount > 2 && !expanded;

  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-slate-50/60">
      <div className="flex items-start gap-3">
        {/* Account avatar */}
        <Link href={`/accounts/${opp.accountId}`} className="shrink-0">
          <AccountAvatar initials={opp.initials} color={opp.logoColor} />
        </Link>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/accounts/${opp.accountId}`} className="text-sm font-semibold text-foreground hover:underline">
              {opp.accountName}
            </Link>
            <HealthPill status={opp.health as HealthStatus} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{formatCurrency(opp.arr)} ARR</p>
        </div>

        {/* Right: tier + module + score */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <TierBadge tier={opp.tier} />
            <ModuleBadge module={opp.module} />
          </div>
          {opp.totalScore > 0 && (
            <span className="text-[11px] text-muted-foreground tabular-nums">{opp.allSignalCount} signal{opp.allSignalCount !== 1 ? "s" : ""} · score {opp.totalScore}</span>
          )}
          {opp.isModuleGap && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Base module gap</span>
          )}
        </div>
      </div>

      {/* Module pitch */}
      <p className="mt-2 text-xs text-muted-foreground italic">{opp.module.upsellAngle}</p>

      {/* Signals */}
      {visibleSignals.length > 0 && (
        <div className="mt-3 space-y-2">
          {visibleSignals.map((s, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md bg-slate-50 px-2.5 py-2">
              <SourceBadge source={s.source} />
              <p className="min-w-0 text-xs text-foreground leading-relaxed line-clamp-2">
                {s.permalink ? (
                  <a href={s.permalink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {s.text}
                  </a>
                ) : (
                  s.text
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Expand / collapse */}
      {opp.allSignalCount > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? "Show less" : `${opp.allSignalCount - 2} more signal${opp.allSignalCount - 2 !== 1 ? "s" : ""}`}
        </button>
      )}
    </div>
  );
}

// ── Coverage matrix ───────────────────────────────────────────────────────────

function CoverageMatrix({ rows, modules }: { rows: ModuleCoverageRow[]; modules: PPModule[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="sticky left-0 z-10 min-w-[200px] bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Account
            </th>
            {modules.map((m) => (
              <th key={m.id} className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <ModuleBadge module={m} />
                  <span className="text-[10px] text-muted-foreground">{m.tier}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(({ account, cells }) => (
            <tr key={account.id} className="hover:bg-slate-50/60">
              <td className="sticky left-0 z-10 bg-card px-4 py-2.5">
                <Link href={`/accounts/${account.id}`} className="flex items-center gap-2 hover:underline">
                  <AccountAvatar initials={account.initials} color={account.logoColor} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{account.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatCurrency(account.arr)}</p>
                  </div>
                </Link>
              </td>
              {modules.map((m) => {
                const cell = cells[m.id];
                if (!cell) return <td key={m.id} className="px-3 py-2.5 text-center text-muted-foreground">—</td>;
                return (
                  <td key={m.id} className="px-3 py-2.5 text-center">
                    <MatrixCell cell={cell} module={m} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatrixCell({ cell, module }: { cell: { subscribed: boolean; signalScore: number; tier: string }; module: PPModule }) {
  if (cell.subscribed) {
    return (
      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", module.color.bg, module.color.text)}>
        ✓
      </span>
    );
  }
  if (cell.tier === "none") {
    return <span className="text-slate-200">·</span>;
  }
  const cfg = TIER_CONFIG[cell.tier as UpsellTier];
  const Icon = cfg.icon;
  return (
    <span title={`Score: ${cell.signalScore}`} className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-inset", cfg.bg, cfg.text, cfg.ring)}>
      <Icon className="h-3 w-3" />
    </span>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

interface Props {
  opportunities: UpsellOpportunity[];
  coverage: ModuleCoverageRow[];
  modules: PPModule[];
}

export function UpsellClient({ opportunities, coverage, modules }: Props) {
  const [view, setView] = useState<"opportunities" | "matrix">("opportunities");
  const [moduleFilter, setModuleFilter] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<UpsellTier | "all">("all");

  const stats = useMemo(() => {
    const hot = opportunities.filter((o) => o.tier === "hot").length;
    const warm = opportunities.filter((o) => o.tier === "warm").length;
    const gaps = opportunities.filter((o) => o.tier === "gap").length;
    const accountsWithSignals = new Set(opportunities.filter((o) => o.tier !== "gap").map((o) => o.accountId)).size;
    return { hot, warm, gaps, accountsWithSignals, total: opportunities.length };
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((o) => {
      if (moduleFilter !== null && o.module.id !== moduleFilter) return false;
      if (tierFilter !== "all" && o.tier !== tierFilter) return false;
      return true;
    });
  }, [opportunities, moduleFilter, tierFilter]);

  const filteredCoverage = useMemo(() => {
    if (moduleFilter === null) return coverage;
    const modId = moduleFilter; // narrowed to number
    return coverage.filter(({ cells }) => {
      const cell = cells[modId];
      return cell && !cell.subscribed;
    });
  }, [coverage, moduleFilter]);

  const tierOptions: { value: UpsellTier | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "hot", label: "Hot" },
    { value: "warm", label: "Warm" },
    { value: "cool", label: "Cool" },
    { value: "gap", label: "Gap only" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight">Upsell Engine</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Expansion opportunities identified from Slack, Gmail, Jira, and HubSpot signals across your book.
          </p>
        </div>
        <div className="hidden text-right text-xs text-muted-foreground sm:block">
          <div>Snapshot: May 19, 2026</div>
          <div className="mt-0.5">{coverage.length} accounts with PP data</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <StatTile
          label="Accounts with signals"
          value={stats.accountsWithSignals}
          sub={`of ${coverage.length} analysed`}
          tone="neutral"
        />
        <StatTile
          label="Hot opportunities"
          value={stats.hot}
          sub="Score ≥ 12"
          tone="hot"
        />
        <StatTile
          label="Warm opportunities"
          value={stats.warm}
          sub="Score 5 – 11"
          tone="warm"
        />
        <StatTile
          label="Module gaps"
          value={stats.gaps}
          sub="Base module missing"
          tone="neutral"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg border p-0.5">
          <button
            onClick={() => setView("opportunities")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "opportunities" ? "bg-slate-100 text-slate-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="h-3.5 w-3.5" />
            Opportunities
          </button>
          <button
            onClick={() => setView("matrix")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "matrix" ? "bg-slate-100 text-slate-900" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Coverage matrix
          </button>
        </div>

        {/* Module filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Module:</span>
          <button
            onClick={() => setModuleFilter(null)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
              moduleFilter === null
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100",
            )}
          >
            All
          </button>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setModuleFilter(moduleFilter === m.id ? null : m.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                moduleFilter === m.id
                  ? cn(m.color.bg, m.color.text, m.color.ring, "font-semibold")
                  : "bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100",
              )}
            >
              {m.shortName}
            </button>
          ))}
        </div>

        {/* Tier filter (opportunities view only) */}
        {view === "opportunities" && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Tier:</span>
            {tierOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => setTierFilter(t.value)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                  tierFilter === t.value
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-slate-50 text-slate-600 ring-slate-200 hover:bg-slate-100",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {view === "opportunities" ? (
        <>
          {filteredOpportunities.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
              No opportunities match the current filters.
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {filteredOpportunities.map((opp, i) => (
                <OpportunityCard key={`${opp.accountId}-${opp.module.id}-${i}`} opp={opp} />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">Signal guide:</span>
            {(["hot", "warm", "cool", "gap"] as UpsellTier[]).map((t) => {
              const cfg = TIER_CONFIG[t];
              const Icon = cfg.icon;
              const desc =
                t === "hot" ? "Score ≥ 12 — strong multi-source signal"
                : t === "warm" ? "Score 5–11 — some interest detected"
                : t === "cool" ? "Score 1–4 — weak / indirect signal"
                : "Base module not in subscription — no signals yet";
              return (
                <div key={t} className="flex items-center gap-1.5 text-xs">
                  <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 ring-1 ring-inset text-[10px] font-semibold", cfg.bg, cfg.text, cfg.ring)}>
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground">✦ = premium / add-on module</span>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">✓</strong> = subscribed&nbsp;&nbsp;
            <Flame className="inline h-3 w-3 text-rose-600" /> = hot signal&nbsp;&nbsp;
            <Zap className="inline h-3 w-3 text-amber-600" /> = warm signal&nbsp;&nbsp;
            <Thermometer className="inline h-3 w-3 text-sky-600" /> = cool signal&nbsp;&nbsp;
            · = no signal
          </p>
          <CoverageMatrix rows={filteredCoverage} modules={modules} />
        </>
      )}
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone: "neutral" | "hot" | "warm";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        tone === "hot" ? "border-rose-200 bg-rose-50" : tone === "warm" ? "border-amber-200 bg-amber-50" : "bg-card",
      )}
    >
      <div
        className={cn(
          "text-2xl font-bold tabular-nums",
          tone === "hot" ? "text-rose-700" : tone === "warm" ? "text-amber-700" : "text-foreground",
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs font-medium text-foreground">{label}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}
