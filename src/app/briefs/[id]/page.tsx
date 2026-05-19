import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { accounts, getBrief } from "@/lib/mockData";
import { cn, formatCurrency, formatDate, formatRelative } from "@/lib/utils";

const TODAY = new Date("2026-05-19");

export function generateStaticParams() {
  return accounts.flatMap((a) => a.briefs.map((b) => ({ id: b.id })));
}

export default function BriefDetailPage({ params }: { params: { id: string } }) {
  const result = getBrief(params.id);
  if (!result) return notFound();
  const { brief, account } = result;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href={`/accounts/${account.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {account.name}
        </Link>
        <Link href="/briefs" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          All briefs
        </Link>
      </div>

      <Card className="border-slate-900/10 bg-gradient-to-br from-slate-50 via-white to-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AccountAvatar initials={account.initials} color={account.logoColor} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI-generated brief
                </Badge>
                <Badge variant="outline" className="bg-white">{brief.meetingType}</Badge>
                <HealthPill status={account.health} />
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{account.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatRelative(brief.meetingDate, TODAY)} · {formatDate(brief.meetingDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {brief.attendees.length} attendees
                </span>
                <span>ARR {formatCurrency(account.arr)}</span>
              </div>
            </div>
          </div>
          <Separator className="my-5" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Executive summary</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{account.notes}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section icon={FileText} title="Proposed agenda">
            <ol className="space-y-2">
              {brief.agenda.map((a, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border bg-card p-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={Sparkles} title="Key points to land" tone="emphasis">
            <ul className="space-y-2">
              {brief.keyPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </Section>

          {brief.openRisks.length ? (
            <Section icon={AlertTriangle} title="Open risks heading in" tone="warning">
              <ul className="space-y-2">
                {brief.openRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          <Section icon={TrendingUp} title="Recent activity worth referencing">
            <ul className="space-y-2">
              {brief.recentActivity.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Target} title="Recommended asks">
            <ul className="space-y-2">
              {brief.recommendedAsks.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-slate-900/10 bg-slate-50/60 p-3 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendees</CardTitle>
              <p className="text-xs text-muted-foreground">{brief.attendees.length} people</p>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2">
                {brief.attendees.map((name, i) => {
                  const c = account.contacts.find((c) => c.name === name);
                  return (
                    <li key={i} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        {c ? <p className="text-xs text-muted-foreground">{c.title}</p> : null}
                      </div>
                      {c?.isExecutiveSponsor ? <Badge variant="outline">Exec</Badge> : null}
                      {c?.isChampion ? <Badge variant="outline">Champion</Badge> : null}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 text-sm">
              <Row label="Health" value={`${account.healthScore} / 100`} />
              <Row label="ARR" value={formatCurrency(account.arr)} />
              <Row label="Renewal" value={`${formatRelative(account.renewalDate, TODAY)} (${formatDate(account.renewalDate)})`} />
              <Row label="NPS" value={account.npsScore > 0 ? `+${account.npsScore}` : `${account.npsScore}`} />
              <Row label="Usage" value={`${account.productUsage}%`} />
              <Row label="Last touch" value={formatRelative(account.lastTouch, TODAY)} />
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Generated from CRM, support, product usage, and prior meeting notes. Always review before sharing externally.
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone?: "emphasis" | "warning";
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-4 w-4",
              tone === "warning" ? "text-amber-600" : tone === "emphasis" ? "text-slate-900" : "text-slate-700",
            )}
          />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-1.5 last:border-b-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}
