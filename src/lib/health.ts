import { daysUntil, formatDate } from "./utils";
import type { Account } from "./types";

export const RENEWAL_FLAG_DAYS = 42; // 6 weeks

/** True when the account is both within 6 weeks of renewal AND above 90% volume usage. */
export function isRenewalAndVolumeRisk(account: Account, today: Date): boolean {
  const days = daysUntil(account.renewalDate, today);
  const usagePct = account.product?.currentPeriodUsagePct ?? account.productUsage;
  return days >= 0 && days <= RENEWAL_FLAG_DAYS && usagePct >= 90;
}

export interface HealthReason {
  source: "gmail" | "slack" | "jira" | "product" | "renewal" | "risk";
  text: string;
  severity: "critical" | "warning" | "info";
}

/**
 * Derives WHY an account is flagged using Gmail, Slack, Jira, and product usage.
 * Intentionally ignores HubSpot notes.
 */
export function buildHealthRationale(account: Account, today: Date): HealthReason[] {
  const reasons: HealthReason[] = [];

  // ── Renewal proximity ──────────────────────────────────────────────────────
  const daysToRenewal = daysUntil(account.renewalDate, today);
  if (daysToRenewal >= 0 && daysToRenewal <= RENEWAL_FLAG_DAYS) {
    reasons.push({
      source: "renewal",
      text: `Renews in ${daysToRenewal} days (${formatDate(account.renewalDate)}) — within 6-week flag window`,
      severity: daysToRenewal <= 14 ? "critical" : "warning",
    });
  }

  // ── Product usage ──────────────────────────────────────────────────────────
  const pp = account.product;
  if (pp?.currentPeriodUsagePct !== undefined) {
    const pct = pp.currentPeriodUsagePct;
    if (pct > 100) {
      reasons.push({
        source: "product",
        text: `${pct.toFixed(1)}% of contracted shipment volume used (${(pp.currentPeriodShipments ?? 0).toLocaleString()} / ${(pp.contractedVolumeAnnual ?? 0).toLocaleString()}) — over cap`,
        severity: "critical",
      });
    } else if (pct >= 90) {
      reasons.push({
        source: "product",
        text: `${pct.toFixed(1)}% of contracted volume used this contract year — approaching cap`,
        severity: "warning",
      });
    }
  } else if (account.productUsage >= 90) {
    reasons.push({
      source: "product",
      text: `${account.productUsage}% product usage score — approaching capacity`,
      severity: "warning",
    });
  }

  // ── Last customer login ────────────────────────────────────────────────────
  if (pp) {
    if (pp.lastCustomerLoginDate === null) {
      reasons.push({
        source: "product",
        text: "No customer login on record — account may be dormant",
        severity: "critical",
      });
    } else if (pp.lastCustomerLoginDate) {
      const loginDays = Math.round(
        (today.getTime() - new Date(pp.lastCustomerLoginDate).getTime()) / 86_400_000,
      );
      if (loginDays > 90) {
        reasons.push({
          source: "product",
          text: `Last customer login ${loginDays} days ago (${pp.lastCustomerLoginEmail ?? "unknown"}) — engagement risk`,
          severity: loginDays > 180 ? "critical" : "warning",
        });
      }
    }
  }

  // ── Jira: high / medium priority open tickets ──────────────────────────────
  const openTickets = account.jiraTickets.filter((t) => t.statusCategory !== "done");
  const highTickets = openTickets.filter((t) =>
    ["highest", "high"].includes((t.priority ?? "").toLowerCase()),
  );
  const medTickets = openTickets.filter(
    (t) => (t.priority ?? "").toLowerCase() === "medium",
  );

  if (highTickets.length > 0) {
    reasons.push({
      source: "jira",
      text: `${highTickets.length} high-priority Jira ticket${highTickets.length > 1 ? "s" : ""} open: ${highTickets.map((t) => t.key).join(", ")}`,
      severity: "critical",
    });
  }
  if (medTickets.length > 0) {
    reasons.push({
      source: "jira",
      text: `${medTickets.length} medium-priority Jira ticket${medTickets.length > 1 ? "s" : ""} open`,
      severity: "warning",
    });
  }

  // ── Slack: recent signals ──────────────────────────────────────────────────
  const recentSlack = account.slackSignals.filter((s) => {
    const d = daysUntil(s.date, today);
    return d >= -30 && d <= 0; // within last 30 days
  });
  if (recentSlack.length > 0) {
    const latest = recentSlack[0];
    reasons.push({
      source: "slack",
      text: `${recentSlack.length} Slack signal${recentSlack.length > 1 ? "s" : ""} in the last 30 days — latest: "${latest.summary.slice(0, 90)}${latest.summary.length > 90 ? "…" : ""}"`,
      severity: "info",
    });
  }

  // ── Gmail: recent threads ──────────────────────────────────────────────────
  const recentEmail = account.emailThreads.filter((e) => {
    const d = daysUntil(e.date, today);
    return d >= -30 && d <= 0;
  });
  if (recentEmail.length > 0) {
    const subjectList = recentEmail
      .slice(0, 2)
      .map((e) => `"${e.subject}"`)
      .join(", ");
    reasons.push({
      source: "gmail",
      text: `${recentEmail.length} email thread${recentEmail.length > 1 ? "s" : ""} in last 30 days: ${subjectList}${recentEmail.length > 2 ? ` +${recentEmail.length - 2} more` : ""}`,
      severity: "info",
    });
  }

  // ── Formal risks ──────────────────────────────────────────────────────────
  const highRisks = account.risks.filter((r) => r.severity === "high");
  if (highRisks.length > 0) {
    reasons.push({
      source: "risk",
      text: `${highRisks.length} high-severity risk${highRisks.length > 1 ? "s" : ""} logged: ${highRisks.map((r) => r.title).join("; ")}`,
      severity: "critical",
    });
  }

  return reasons;
}
