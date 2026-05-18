import { cn } from "@/lib/utils";
import type { SignalSource } from "@/lib/types";
import { Database, Hash, Mail, Package, Ticket } from "lucide-react";

const config: Record<SignalSource, { label: string; icon: typeof Hash; on: string; off: string }> = {
  hubspot: { label: "HubSpot", icon: Database, on: "bg-orange-50 text-orange-700 ring-orange-200", off: "bg-slate-50 text-slate-400 ring-slate-200" },
  product: { label: "Parcel Perform", icon: Package, on: "bg-emerald-50 text-emerald-700 ring-emerald-200", off: "bg-slate-50 text-slate-400 ring-slate-200" },
  slack: { label: "Slack", icon: Hash, on: "bg-violet-50 text-violet-700 ring-violet-200", off: "bg-slate-50 text-slate-400 ring-slate-200" },
  jira: { label: "Jira", icon: Ticket, on: "bg-sky-50 text-sky-700 ring-sky-200", off: "bg-slate-50 text-slate-400 ring-slate-200" },
  gmail: { label: "Gmail", icon: Mail, on: "bg-rose-50 text-rose-700 ring-rose-200", off: "bg-slate-50 text-slate-400 ring-slate-200" },
};

export function SourcePill({
  source,
  connected,
  count,
  indirectCount,
  className,
}: {
  source: SignalSource;
  connected: boolean;
  count?: number;
  indirectCount?: number;
  className?: string;
}) {
  const c = config[source];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        connected ? c.on : c.off,
        className,
      )}
      title={connected ? `${c.label} connected` : `${c.label} not connected`}
    >
      <Icon className="h-3 w-3" />
      {c.label}
      {connected && typeof count === "number" ? <span className="tabular-nums">· {count}</span> : null}
      {!connected && typeof indirectCount === "number" && indirectCount > 0 ? (
        <span className="tabular-nums">· {indirectCount} via Slack</span>
      ) : !connected ? (
        <span className="text-[10px] uppercase tracking-wide">off</span>
      ) : null}
    </span>
  );
}
