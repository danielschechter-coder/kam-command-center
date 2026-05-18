import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HealthStatus, ActionPriority, ActionStatus, RiskSeverity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return `$${value}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelative(iso: string, today: Date = new Date()) {
  const d = new Date(iso);
  const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  if (diffDays > 0 && diffDays < 30) return `in ${diffDays} days`;
  if (diffDays < 0 && diffDays > -30) return `${Math.abs(diffDays)} days ago`;
  if (diffDays >= 30 && diffDays < 365) return `in ${Math.round(diffDays / 30)} mo`;
  if (diffDays <= -30 && diffDays > -365) return `${Math.round(Math.abs(diffDays) / 30)} mo ago`;
  return formatDate(iso);
}

export function daysUntil(iso: string, today: Date = new Date()) {
  return Math.round((new Date(iso).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const healthLabel: Record<HealthStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  at_risk: "At risk",
  critical: "Critical",
};

export const healthClasses: Record<HealthStatus, string> = {
  healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  watch: "bg-amber-50 text-amber-700 ring-amber-200",
  at_risk: "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const healthDot: Record<HealthStatus, string> = {
  healthy: "bg-emerald-500",
  watch: "bg-amber-500",
  at_risk: "bg-orange-500",
  critical: "bg-rose-500",
};

export const priorityClasses: Record<ActionPriority, string> = {
  low: "bg-slate-50 text-slate-700 ring-slate-200",
  medium: "bg-sky-50 text-sky-700 ring-sky-200",
  high: "bg-amber-50 text-amber-700 ring-amber-200",
  urgent: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const statusClasses: Record<ActionStatus, string> = {
  open: "bg-slate-50 text-slate-700 ring-slate-200",
  in_progress: "bg-sky-50 text-sky-700 ring-sky-200",
  blocked: "bg-rose-50 text-rose-700 ring-rose-200",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const statusLabel: Record<ActionStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const severityClasses: Record<RiskSeverity, string> = {
  low: "bg-slate-50 text-slate-700 ring-slate-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};
