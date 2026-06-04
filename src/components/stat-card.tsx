import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "neutral" | "positive" | "warning" | "danger";
  href?: string;
}) {
  const toneIcon = {
    neutral: "bg-slate-100 text-slate-600",
    positive: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
  }[tone];

  const inner = (
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {Icon ? (
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneIcon)}>
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
    </CardContent>
  );

  if (href) {
    return (
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <Link href={href} className="block">
          {inner}
        </Link>
      </Card>
    );
  }

  return <Card>{inner}</Card>;
}
