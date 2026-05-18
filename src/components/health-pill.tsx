import { cn, healthClasses, healthDot, healthLabel } from "@/lib/utils";
import type { HealthStatus } from "@/lib/types";

export function HealthPill({ status, className }: { status: HealthStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        healthClasses[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", healthDot[status])} />
      {healthLabel[status]}
    </span>
  );
}
