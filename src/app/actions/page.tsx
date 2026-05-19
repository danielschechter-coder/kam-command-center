import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actionItems } from "@/lib/mockData";
import { cn, daysUntil, formatRelative, priorityClasses, statusClasses, statusLabel } from "@/lib/utils";
import type { ActionStatus } from "@/lib/types";

const TODAY = new Date("2026-05-19");

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 } as const;

export default function ActionsPage() {
  const groups: { key: ActionStatus; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In progress" },
    { key: "blocked", label: "Blocked" },
    { key: "done", label: "Done" },
  ];

  const totalOpen = actionItems.filter((a) => a.status !== "done").length;
  const overdue = actionItems.filter((a) => a.status !== "done" && daysUntil(a.dueDate, TODAY) < 0).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Action tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalOpen} open · {overdue} overdue. Sorted by priority, then due date.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => {
          const items = actionItems
            .filter((a) => a.status === g.key)
            .sort((a, b) => {
              const p = priorityOrder[a.priority] - priorityOrder[b.priority];
              if (p !== 0) return p;
              return daysUntil(a.dueDate, TODAY) - daysUntil(b.dueDate, TODAY);
            });

          return (
            <Card key={g.key}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {g.label}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                        statusClasses[g.key],
                      )}
                    >
                      {items.length}
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing here.</p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((a) => {
                      const days = daysUntil(a.dueDate, TODAY);
                      const overdue = a.status !== "done" && days < 0;
                      return (
                        <li key={a.id}>
                          <Link
                            href={`/accounts/${a.accountId}`}
                            className="group block rounded-lg border bg-card p-4 transition-colors hover:bg-slate-50/80"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={cn(
                                  "text-sm font-medium leading-snug",
                                  a.status === "done" && "text-muted-foreground line-through",
                                )}
                              >
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
                            <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                              <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-foreground">
                                {a.accountName}
                                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                              </span>
                              <span
                                className={cn(
                                  "tabular-nums",
                                  overdue ? "text-rose-600" : days <= 2 && a.status !== "done" ? "text-amber-600" : "text-muted-foreground",
                                )}
                              >
                                {a.status === "done" ? `Completed ${formatRelative(a.dueDate, TODAY)}` : `Due ${formatRelative(a.dueDate, TODAY)}`}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Showing actions for: <span className="font-medium text-foreground">Daniel Schechter</span>
        <span className="mx-2">·</span>
        <Link href="/" className="font-medium text-foreground hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-static";
