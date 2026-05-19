import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CalendarClock, DollarSign, ListChecks, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/stat-card";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { SourcePill } from "@/components/source-pill";
import { NespressoGroup } from "@/components/nespresso-group";
import { accounts, actionItems, sourceStatus } from "@/lib/mockData";
import { cn, daysUntil, formatCurrency, formatRelative, priorityClasses } from "@/lib/utils";

const TODAY = new Date("2026-05-13");

function attentionScore(a: (typeof accounts)[number]) {
  const days = daysUntil(a.renewalDate, TODAY);
  const renewalUrgency = days < 60 ? (60 - days) * 2 : 0;
  const healthGap = 100 - a.healthScore;
  const riskWeight = a.risks.reduce((s, r) => s + (r.severity === "high" ? 30 : r.severity === "medium" ? 15 : 5), 0);
  return renewalUrgency + healthGap + riskWeight;
}

const nespressoAccounts = accounts.filter((a) => a.id.startsWith("nespresso"));
const nonNespressoAccounts = accounts.filter((a) => !a.id.startsWith("nespresso"));

export default function DashboardPage() {
  const totalArr = accounts.reduce((s, a) => s + a.arr, 0);
  const atRiskArr = accounts.filter((a) => a.health === "at_risk" || a.health === "critical").reduce((s, a) => s + a.arr, 0);
  const renewalsNext90 = accounts.filter((a) => {
    const d = daysUntil(a.renewalDate, TODAY);
    return d >= 0 && d <= 90;
  });
  const openRisks = accounts.reduce((s, a) => s + a.risks.length, 0);
  const openActions = actionItems.filter((a) => a.status !== "done").length;

  const sortedAccounts = [...accounts].sort((a, b) => attentionScore(b) - attentionScore(a));
  const needsAttention = sortedAccounts.slice(0, 4);
  const urgentActions = [...actionItems]
    .filter((a) => a.status !== "done")
    .sort((a, b) => daysUntil(a.dueDate, TODAY) - daysUntil(b.dueDate, TODAY))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Daniel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {needsAttention.filter((a) => a.health === "critical" || a.health === "at_risk").length} accounts need attention today.
            You have {urgentActions.length} open actions due this week.
          </p>
        </div>
        <div className="hidden text-right text-xs text-muted-foreground sm:block">
          <div>Wednesday, May 13, 2026</div>
          <div className="mt-0.5">Showing your book of business</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Connected sources</span>
        {sourceStatus.map((s) => {
          const count =
            s.source === "slack"
              ? accounts.reduce((n, a) => n + a.slackSignals.length, 0)
              : s.source === "hubspot"
                ? accounts.length
                : s.source === "product"
                  ? accounts.filter((a) => a.product).length
                  : s.source === "jira"
                    ? accounts.reduce((n, a) => n + a.jiraTickets.length, 0)
                    : s.source === "gmail"
                      ? accounts.reduce((n, a) => n + a.emailThreads.length, 0)
                      : undefined;
          return (
            <SourcePill
              key={s.source}
              source={s.source}
              connected={s.connected}
              count={count}
            />
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">
          Snapshot generated 2026-05-13 · static, not live
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total ARR"
          value={formatCurrency(totalArr)}
          hint={`${accounts.length} accounts`}
          icon={DollarSign}
          tone="neutral"
        />
        <StatCard
          label="ARR at risk"
          value={formatCurrency(atRiskArr)}
          hint={`${accounts.filter((a) => a.health === "at_risk" || a.health === "critical").length} accounts`}
          icon={ShieldAlert}
          tone="danger"
        />
        <StatCard
          label="Renewals (90d)"
          value={renewalsNext90.length}
          hint={renewalsNext90.length ? formatCurrency(renewalsNext90.reduce((s, a) => s + a.arr, 0)) + " in motion" : "Nothing imminent"}
          icon={CalendarClock}
          tone="warning"
        />
        <StatCard
          label="Open actions"
          value={openActions}
          hint={`${openRisks} active risks`}
          icon={ListChecks}
          tone="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Accounts needing attention</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ranked by renewal proximity, health gap, and open risks
              </p>
            </div>
            <Link
              href="/actions"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              View all actions
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="divide-y">
              {needsAttention.map((a) => {
                const days = daysUntil(a.renewalDate, TODAY);
                return (
                  <li key={a.id}>
                    <Link
                      href={`/accounts/${a.id}`}
                      className="flex items-center gap-4 py-3 transition-colors hover:bg-slate-50/80"
                    >
                      <AccountAvatar initials={a.initials} color={a.logoColor} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{a.name}</p>
                          <HealthPill status={a.health} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {a.industry} · {a.segment} · {a.region}
                        </p>
                      </div>
                      <div className="hidden w-32 md:block">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Health</span>
                          <span className="font-medium tabular-nums">{a.healthScore}</span>
                        </div>
                        <Progress
                          value={a.healthScore}
                          className="mt-1 h-1.5"
                          indicatorClassName={
                            a.healthScore >= 75
                              ? "bg-emerald-500"
                              : a.healthScore >= 55
                                ? "bg-amber-500"
                                : a.healthScore >= 35
                                  ? "bg-orange-500"
                                  : "bg-rose-500"
                          }
                        />
                      </div>
                      <div className="hidden text-right md:block">
                        <div className="text-sm font-semibold tabular-nums">{formatCurrency(a.arr)}</div>
                        <div
                          className={cn(
                            "mt-0.5 text-xs tabular-nums",
                            days <= 60 ? "text-rose-600" : days <= 120 ? "text-amber-600" : "text-muted-foreground",
                          )}
                        >
                          Renews {formatRelative(a.renewalDate, TODAY)}
                        </div>
                      </div>
                      <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's priorities</CardTitle>
            <p className="text-xs text-muted-foreground">Open actions, soonest due first</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-3">
              {urgentActions.map((a) => {
                const days = daysUntil(a.dueDate, TODAY);
                return (
                  <li key={a.id}>
                    <Link
                      href={`/accounts/${a.accountId}`}
                      className="block rounded-lg border bg-card p-3 transition-colors hover:bg-slate-50/80"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-snug">{a.title}</p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
                            priorityClasses[a.priority],
                          )}
                        >
                          {a.priority}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{a.accountName}</span>
                        <span
                          className={cn(
                            "tabular-nums",
                            days < 0 ? "text-rose-600" : days <= 2 ? "text-amber-600" : "",
                          )}
                        >
                          Due {formatRelative(a.dueDate, TODAY)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All accounts</CardTitle>
          <p className="text-xs text-muted-foreground">Your full book — {accounts.length} accounts ({nespressoAccounts.length} Nespresso units grouped under NN HQ)</p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Account</th>
                  <th className="py-2 pr-4 font-medium">Health</th>
                  <th className="py-2 pr-4 font-medium">ARR</th>
                  <th className="py-2 pr-4 font-medium">Renewal</th>
                  <th className="py-2 pr-4 font-medium">Risks</th>
                  <th className="py-2 pr-4 font-medium">Usage</th>
                  <th className="py-2 pr-4 font-medium">Last touch</th>
                  <th className="py-2 pr-4 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {nonNespressoAccounts.map((a) => (
                  <tr key={a.id} className="group cursor-pointer">
                    <td className="py-3 pr-4">
                      <Link href={`/accounts/${a.id}`} className="flex items-center gap-3">
                        <AccountAvatar initials={a.initials} color={a.logoColor} size="sm" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground group-hover:underline">{a.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{a.industry}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <HealthPill status={a.health} />
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{formatCurrency(a.arr)}</td>
                    <td className="py-3 pr-4">
                      <div className="text-sm tabular-nums">{formatRelative(a.renewalDate, TODAY)}</div>
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
                        <span className="text-xs tabular-nums text-muted-foreground">{a.productUsage}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground">
                      {formatRelative(a.lastTouch, TODAY)}
                    </td>
                    <td className="py-3 pr-4 max-w-xs">
                      <p className="truncate text-xs text-muted-foreground" title={a.notes}>{a.notes ?? "—"}</p>
                    </td>
                  </tr>
                ))}
                <NespressoGroup accounts={nespressoAccounts} />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
