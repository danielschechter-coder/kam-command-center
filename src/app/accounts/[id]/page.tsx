import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Mail,
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Ticket,
  TrendingUp,
  Zap,
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
import { buildHealthRationale, isRenewalAndVolumeRisk } from "@/lib/health";
import { accounts, getActionsForAccount } from "@/lib/mockData";

const TODAY = new Date("2026-05-19");

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

// ── Jira priority tiers ────────────────────────────────────────────────────
const JIRA_PRIORITY_ORDER: Record<string, number> = {
  highest: 1,
  high: 2,
  medium: 3,
  low: 4,
  lowest: 5,
};

function jiraSortAge(
  a: { createdDate?: string },
  b: { createdDate?: string },
) {
  const da = a.createdDate ? new Date(a.createdDate).getTime() : Infinity;
  const db = b.createdDate ? new Date(b.createdDate).getTime() : Infinity;
  return da - db; // oldest first
}

const SOURCE_ICON: Record<string, string> = {
  gmail: "text-rose-600",
  slack: "text-violet-600",
  jira: "text-sky-600",
  product: "text-emerald-600",
  renewal: "text-orange-600",
  risk: "text-rose-700",
};

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const account = accounts.find((a) => a.id === params.id);
  if (!account) return notFound();

  const actions = getActionsForAccount(account.id);
  const openActions = actions.filter((a) => a.status !== "done");
  const nextBrief = account.briefs[0];
  const flagged = isRenewalAndVolumeRisk(account, TODAY);
  const rationale = buildHealthRationale(account, TODAY);

  // Jira tiers (exclude done)
  const openTickets = account.jiraTickets.filter((t) => t.statusCategory !== "done");
  const highTickets = [...openTickets]
    .filter((t) => ["highest", "high"].includes((t.priority ?? "").toLowerCase()))
    .sort(jiraSortAge);
  const medTickets = [...openTickets]
    .filter((t) => (t.priority ?? "").toLowerCase() === "medium")
    .sort(jiraSortAge);
  const lowTickets = [...openTickets]
    .filter((t) => ["low", "lowest"].includes((t.priority ?? "").toLowerCase()))
    .sort(jiraSortAge);
  const unknownTickets = [...openTickets]
    .filter((t) => !t.priority || !JIRA_PRIORITY_ORDER[(t.priority ?? "").toLowerCase()])
    .sort(jiraSortAge);

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
            {flagged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                <Zap className="h-3.5 w-3.5" />
                Renewal + usage alert
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {account.industry} · Owner: {account.owner}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <SourcePill source="gmail" connected={true} count={account.emailThreads.length} />
            <SourcePill source="slack" connected={true} count={account.slackSignals.length} />
            <SourcePill source="jira" connected={true} count={account.jiraTickets.length} />
            <SourcePill source="product" connected={!!account.product} count={account.product?.ppUsers} />
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
            <p className={cn("mt-1.5 text-2xl font-semibold tabular-nums", flagged && "text-rose-700")}>
              {formatRelative(account.renewalDate, TODAY)}
            </p>
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

      {/* Health rationale — always shown, based on Gmail / Slack / Jira / product data only */}
      <Card className={cn(
        "border-l-4",
        account.health === "critical" ? "border-l-rose-500" :
        account.health === "at_risk" ? "border-l-orange-500" :
        account.health === "watch" ? "border-l-amber-400" :
        "border-l-emerald-400"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Why this account is <HealthPill status={account.health} />
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Assessed from Gmail, Slack, Jira, and product usage — HubSpot notes excluded
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          {rationale.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-dashed bg-slate-50/60 p-4 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              No signals of concern from Gmail, Slack, Jira, or product usage.
            </div>
          ) : (
            <ul className="space-y-2">
              {rationale.map((r, i) => (
                <li key={i} className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  r.severity === "critical" ? "border-rose-200 bg-rose-50/60" :
                  r.severity === "warning" ? "border-amber-200 bg-amber-50/60" :
                  "border-slate-200 bg-slate-50/40"
                )}>
                  <span className={cn(
                    "mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                    r.severity === "critical" ? "bg-rose-100 text-rose-700" :
                    r.severity === "warning" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {r.source}
                  </span>
                  <p className="text-sm leading-snug">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

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

          {/* Jira tickets — grouped by priority tier */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-sky-600" />
                  Jira tickets
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {openTickets.length > 0
                    ? `${openTickets.length} open · sorted by priority then age`
                    : "no open tickets"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {openTickets.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed bg-slate-50/60 p-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No active Jira tickets for this account.
                </div>
              ) : (
                <>
                  {highTickets.length > 0 && (
                    <JiraTierBlock
                      label="Highest / High priority"
                      tickets={highTickets}
                      headerClass="text-rose-700 bg-rose-50"
                      borderClass="border-rose-200"
                    />
                  )}
                  {medTickets.length > 0 && (
                    <JiraTierBlock
                      label="Medium priority"
                      tickets={medTickets}
                      headerClass="text-amber-700 bg-amber-50"
                      borderClass="border-amber-200"
                    />
                  )}
                  {(lowTickets.length > 0 || unknownTickets.length > 0) && (
                    <JiraTierBlock
                      label="Low / Lowest priority"
                      tickets={[...lowTickets, ...unknownTickets]}
                      headerClass="text-slate-500 bg-slate-50"
                      borderClass="border-slate-200"
                    />
                  )}
                </>
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
        </div>
      </div>
    </div>
  );
}

// ── Jira tier block ────────────────────────────────────────────────────────
interface JiraTierBlockProps {
  label: string;
  tickets: NonNullable<ReturnType<typeof accounts.find>>["jiraTickets"];
  headerClass: string;
  borderClass: string;
}

function JiraTierBlock({ label, tickets, headerClass, borderClass }: JiraTierBlockProps) {
  const statusTone = (cat?: string) =>
    cat === "done"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : cat === "indeterminate"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <div>
      <div className={cn("mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest", headerClass)}>
        {label} · {tickets.length}
      </div>
      <ul className="space-y-2">
        {tickets.map((t) => {
          const daysOpen = t.createdDate
            ? Math.round((TODAY.getTime() - new Date(t.createdDate).getTime()) / 86_400_000)
            : null;
          return (
            <li key={t.key} className={cn("rounded-lg border bg-card p-3", borderClass)}>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline"
                >
                  {t.key}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {t.status ? (
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset", statusTone(t.statusCategory))}>
                    {t.status}
                  </span>
                ) : null}
                {daysOpen !== null ? (
                  <span className={cn("text-xs tabular-nums", daysOpen > 60 ? "font-semibold text-rose-600" : "text-muted-foreground")}>
                    Open {daysOpen}d
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-snug">{t.title}</p>
              {t.context ? <p className="mt-0.5 text-xs text-muted-foreground">{t.context}</p> : null}
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {t.assignee ? <span>Assignee: <span className="text-foreground">{t.assignee}</span></span> : null}
                {t.reporter ? <span>Reporter: <span className="text-foreground">{t.reporter}</span></span> : null}
                {t.updatedDate ? <span>Updated {formatRelative(t.updatedDate, TODAY)}</span> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
