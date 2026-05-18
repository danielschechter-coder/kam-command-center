import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Mail,
  MessageSquare,
  PhoneCall,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { SignalsPanel } from "@/components/signals-panel";
import { SourcePill } from "@/components/source-pill";
import {
  cn,
  formatCurrency,
  formatDate,
  formatRelative,
  priorityClasses,
  severityClasses,
  statusClasses,
  statusLabel,
} from "@/lib/utils";
import { accounts, getActionsForAccount } from "@/lib/mockData";

const TODAY = new Date("2026-05-13");

export function generateStaticParams() {
  return accounts.map((a) => ({ id: a.id }));
}

const activityIcon = {
  meeting: PhoneCall,
  email: Mail,
  support: CircleAlert,
  note: MessageSquare,
  milestone: TrendingUp,
};

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const account = accounts.find((a) => a.id === params.id);
  if (!account) return notFound();

  const actions = getActionsForAccount(account.id);
  const openActions = actions.filter((a) => a.status !== "done");
  const nextBrief = account.briefs[0];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex items-start gap-5">
        <AccountAvatar initials={account.initials} color={account.logoColor} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{account.name}</h1>
            <HealthPill status={account.health} />
            <Badge variant="outline">{account.segment}</Badge>
            <Badge variant="outline">{account.region}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {account.industry} · Owner: {account.owner}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <SourcePill source="hubspot" connected={true} />
            <SourcePill source="product" connected={!!account.product} count={account.product?.ppUsers} />
            <SourcePill source="slack" connected={true} count={account.slackSignals.length} />
            <SourcePill source="jira" connected={true} count={account.jiraTickets.length} />
            <SourcePill source="gmail" connected={true} count={account.emailThreads.length} />
          </div>
        </div>
        {nextBrief ? (
          <Link
            href={`/briefs/${nextBrief.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            Open meeting brief
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Health</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">{account.healthScore}</p>
            <Progress
              value={account.healthScore}
              className="mt-3 h-1.5"
              indicatorClassName={
                account.healthScore >= 75
                  ? "bg-emerald-500"
                  : account.healthScore >= 55
                    ? "bg-amber-500"
                    : account.healthScore >= 35
                      ? "bg-orange-500"
                      : "bg-rose-500"
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ARR</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">{formatCurrency(account.arr)}</p>
            <p className="mt-3 text-xs text-muted-foreground">Contract started {formatDate(account.contractStart)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Renewal</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums">{formatRelative(account.renewalDate, TODAY)}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              {formatDate(account.renewalDate)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">NPS</p>
            <p
              className={cn(
                "mt-1.5 text-2xl font-semibold tabular-nums",
                account.npsScore >= 30 ? "text-emerald-700" : account.npsScore >= 0 ? "text-amber-700" : "text-rose-700",
              )}
            >
              {account.npsScore > 0 ? `+${account.npsScore}` : account.npsScore}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Product usage {account.productUsage}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Open risks</CardTitle>
              <p className="text-xs text-muted-foreground">
                {account.risks.length
                  ? `${account.risks.length} risk${account.risks.length === 1 ? "" : "s"} on this account`
                  : "No active risks — keep momentum"}
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              {account.risks.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed bg-slate-50/60 p-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  All clear. This account is in a strong place.
                </div>
              ) : (
                <ul className="space-y-3">
                  {account.risks.map((r) => (
                    <li key={r.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <p className="font-medium">{r.title}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
                            severityClasses[r.severity],
                          )}
                        >
                          {r.severity}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Opened {formatRelative(r.openedOn, TODAY)}</span>
                        <span>Owner: {r.owner}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Action items</CardTitle>
              <p className="text-xs text-muted-foreground">
                {openActions.length} open · {actions.length - openActions.length} done
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              {actions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No actions yet for this account.</p>
              ) : (
                <ul className="divide-y">
                  {actions.map((a) => (
                    <li key={a.id} className="flex items-start gap-4 py-3">
                      <div
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 rounded-full ring-2 ring-inset",
                          a.status === "done" ? "bg-emerald-500 ring-emerald-500" : "bg-white ring-slate-300",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className={cn("text-sm font-medium", a.status === "done" && "text-muted-foreground line-through")}>
                            {a.title}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset",
                              priorityClasses[a.priority],
                            )}
                          >
                            {a.priority}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                              statusClasses[a.status],
                            )}
                          >
                            {statusLabel[a.status]}
                          </span>
                          <span>Due {formatRelative(a.dueDate, TODAY)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="relative space-y-4 border-l pl-5">
                {account.activity.map((ev) => {
                  const Icon = activityIcon[ev.type];
                  return (
                    <li key={ev.id} className="relative">
                      <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full bg-white ring-1 ring-border">
                        <Icon className="h-3 w-3 text-slate-600" />
                      </span>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm">{ev.summary}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(ev.date, TODAY)}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SignalsPanel account={account} />
          {nextBrief ? (
            <Card className="border-slate-900/10 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-700" />
                  Next meeting
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {nextBrief.meetingType} · {formatRelative(nextBrief.meetingDate, TODAY)} ({formatDate(nextBrief.meetingDate)})
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Attendees</p>
                  <p className="mt-1 text-sm">{nextBrief.attendees.join(", ")}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Top recommendations</p>
                  <ul className="mt-1.5 space-y-1.5 text-sm">
                    {nextBrief.recommendedAsks.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/briefs/${nextBrief.id}`}
                  className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Open full brief
                </Link>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Key contacts</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-3">
                {account.contacts.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      {c.isExecutiveSponsor ? <Badge variant="outline">Exec sponsor</Badge> : null}
                      {c.isChampion ? <Badge variant="outline">Champion</Badge> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm leading-relaxed text-muted-foreground">{account.notes}</p>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">Last touch {formatRelative(account.lastTouch, TODAY)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
