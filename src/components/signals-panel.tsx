import { ExternalLink, Hash, LogIn, Mail, MessageSquare, Package, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, daysUntil, formatCurrency, formatDate, formatRelative } from "@/lib/utils";
import type { Account } from "@/lib/types";

const TODAY = new Date("2026-05-13");

export function SignalsPanel({ account }: { account: Account }) {
  const hasSlack = account.slackSignals.length > 0;
  const hasJira = account.jiraTickets.length > 0;
  const pp = account.product;
  const hasPp = !!pp;
  const ppRenewDays = pp?.ppContractEnd ? daysUntil(pp.ppContractEnd, TODAY) : null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Signals across connected sources</span>
          <span className="text-xs font-normal text-muted-foreground">
            Gmail · Slack · Parcel Perform · Jira
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {/* Gmail — highest priority */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-700">
              <Mail className="h-3.5 w-3.5" />
              Gmail
              <span className="ml-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                live
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              {account.emailThreads.length > 0
                ? `${account.emailThreads.length} recent thread${account.emailThreads.length === 1 ? "" : "s"}`
                : "no recent threads"}
            </span>
          </div>
          {account.emailThreads.length > 0 ? (
            <ul className="space-y-2">
              {account.emailThreads.map((e) => (
                <li key={e.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">{e.subject}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="text-foreground">{e.from}</span>
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{e.preview}</p>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatRelative(e.date, TODAY)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed bg-slate-50/60 p-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                No customer email threads in the last 60 days.
              </p>
            </div>
          )}
        </div>

        {/* Slack */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700">
              <Hash className="h-3.5 w-3.5" />
              Slack
              {account.slackChannel ? (
                <span className="ml-1 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
                  {account.slackChannel}
                </span>
              ) : null}
            </span>
            <span className="text-xs text-muted-foreground">{hasSlack ? `${account.slackSignals.length} recent` : "no recent signals"}</span>
          </div>
          {hasSlack ? (
            <ul className="space-y-2">
              {account.slackSignals.map((s) => (
                <li key={s.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed">{s.summary}</p>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {formatRelative(s.date, TODAY)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{s.author}</span> in {s.channel}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed bg-slate-50/60 p-3 text-sm text-muted-foreground">
              No recent Slack mentions for this account.
            </div>
          )}
        </div>

        {/* Parcel Perform */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <Package className="h-3.5 w-3.5" />
              Parcel Perform
              {pp ? (
                <a
                  href={pp.adminUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
                >
                  {pp.ppSlug}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ) : null}
            </span>
            {pp ? <span className="text-xs text-muted-foreground">Org #{pp.ppOrgId}</span> : null}
          </div>
          {hasPp && pp ? (
            <div className="grid gap-2 rounded-lg border bg-card p-3 sm:grid-cols-2">
              {pp.contractedVolumeAnnual > 0 ? (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Contracted volume</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums">
                    {pp.contractedVolumeAnnual.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">shipments / yr</span>
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Active PP users</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {pp.ppUsers}
                </p>
              </div>
              {typeof pp.currentPeriodUsagePct === "number" && typeof pp.currentPeriodShipments === "number" ? (
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Current contract-year usage
                    {pp.currentPeriodStart ? (
                      <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/70">
                        (since {formatDate(pp.currentPeriodStart)})
                      </span>
                    ) : null}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <p
                      className={cn(
                        "text-lg font-semibold tabular-nums",
                        pp.currentPeriodUsagePct > 100
                          ? "text-rose-700"
                          : pp.currentPeriodUsagePct > 90
                            ? "text-amber-700"
                            : "text-foreground",
                      )}
                    >
                      {pp.currentPeriodUsagePct.toFixed(1)}%
                      {pp.currentPeriodUsagePct > 100 ? (
                        <span className="ml-1.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-700">
                          over cap
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {pp.currentPeriodShipments.toLocaleString()} / {pp.contractedVolumeAnnual.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full transition-all",
                        pp.currentPeriodUsagePct > 100
                          ? "bg-rose-500"
                          : pp.currentPeriodUsagePct > 90
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                      )}
                      style={{ width: `${Math.min(100, pp.currentPeriodUsagePct)}%` }}
                    />
                  </div>
                </div>
              ) : null}
              {pp.ppContractEnd ? (
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Contract term (from PP admin)</p>
                  <p
                    className={cn(
                      "mt-0.5 text-sm font-semibold tabular-nums",
                      ppRenewDays !== null && ppRenewDays <= 30 ? "text-rose-700" : ppRenewDays !== null && ppRenewDays <= 90 ? "text-amber-700" : "text-foreground",
                    )}
                  >
                    {formatDate(pp.ppContractStart)} → {formatDate(pp.ppContractEnd)}
                    {ppRenewDays !== null ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({ppRenewDays >= 0 ? `${ppRenewDays} days to renewal` : `${Math.abs(ppRenewDays)} days overdue`})
                      </span>
                    ) : null}
                  </p>
                </div>
              ) : null}
              {typeof pp.lastCustomerLoginDate !== "undefined" ? (() => {
                const days = pp.lastCustomerLoginDate ? Math.round((TODAY.getTime() - new Date(pp.lastCustomerLoginDate).getTime()) / 86_400_000) : null;
                const tone = days === null ? "text-rose-700" : days > 90 ? "text-rose-700" : days > 30 ? "text-amber-700" : "text-emerald-700";
                return (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      <LogIn className="mr-1 inline h-3 w-3" />
                      Last customer login
                      <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/70">(excludes @parcelperform.com)</span>
                    </p>
                    {pp.lastCustomerLoginDate ? (
                      <div className="mt-1">
                        <p className={cn("text-sm font-semibold", tone)}>
                          {formatRelative(pp.lastCustomerLoginDate, TODAY)}
                          <span className="ml-1.5 text-xs font-normal text-muted-foreground">({formatDate(pp.lastCustomerLoginDate)})</span>
                        </p>
                        {pp.lastCustomerLoginEmail ? (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {pp.lastCustomerLoginEmail}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                        Never
                        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-700">
                          dormant
                        </span>
                      </p>
                    )}
                  </div>
                );
              })() : null}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-slate-50/60 p-3 text-sm text-muted-foreground">
              No Parcel Perform admin record matched for this account.
            </div>
          )}
        </div>

        {/* Jira */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-sky-700">
              <Ticket className="h-3.5 w-3.5" />
              Jira
              <span className="ml-1 rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
                live
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{hasJira ? `${account.jiraTickets.length} ticket${account.jiraTickets.length === 1 ? "" : "s"}` : "no open tickets"}</span>
          </div>
          {hasJira ? (
            <ul className="space-y-2">
              {account.jiraTickets.map((t) => {
                const statusTone =
                  t.statusCategory === "done"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : t.statusCategory === "indeterminate"
                      ? "bg-sky-50 text-sky-700 ring-sky-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200";
                return (
                  <li key={t.key} className="rounded-lg border bg-card p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
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
                            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset", statusTone)}>
                              {t.status}
                            </span>
                          ) : null}
                          {t.priority ? (
                            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 ring-1 ring-inset ring-slate-200">
                              {t.priority}
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
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-lg border border-dashed bg-slate-50/60 p-3 text-sm text-muted-foreground">
              No active Jira tickets for this account.
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
