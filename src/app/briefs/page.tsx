import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthPill } from "@/components/health-pill";
import { AccountAvatar } from "@/components/account-avatar";
import { getAllBriefs } from "@/lib/mockData";
import { cn, daysUntil, formatDate, formatRelative } from "@/lib/utils";

const TODAY = new Date("2026-05-19");

export default function BriefsIndexPage() {
  const briefs = getAllBriefs().sort(
    (a, b) => new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime(),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meeting briefs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated prep for your upcoming customer meetings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {briefs.map(({ account, ...b }) => {
          const days = daysUntil(b.meetingDate, TODAY);
          return (
            <Link key={b.id} href={`/briefs/${b.id}`} className="block">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <AccountAvatar initials={account.initials} color={account.logoColor} />
                    <div className="min-w-0">
                      <CardTitle className="truncate">{account.name}</CardTitle>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{account.industry}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{b.meetingType}</Badge>
                    <HealthPill status={account.health} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">When</p>
                    <p
                      className={cn(
                        "mt-0.5 text-sm font-medium",
                        days <= 3 ? "text-rose-700" : days <= 7 ? "text-amber-700" : "text-foreground",
                      )}
                    >
                      {formatRelative(b.meetingDate, TODAY)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">({formatDate(b.meetingDate)})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Top recommendation</p>
                    <p className="mt-0.5 line-clamp-2 text-sm">{b.recommendedAsks[0]}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Open brief
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
