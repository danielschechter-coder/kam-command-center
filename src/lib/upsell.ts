import type { Account } from "./types";

export type ModuleId = number;

export interface PPModule {
  id: ModuleId;
  name: string;
  shortName: string;
  tagline: string;
  tier: "base" | "premium";
  color: { bg: string; text: string; ring: string; dot: string };
  signalKeywords: string[];
  upsellAngle: string;
}

export const MODULES: PPModule[] = [
  {
    id: 1,
    name: "Tracking",
    shortName: "Tracking",
    tagline: "Carrier event visibility",
    tier: "base",
    color: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500" },
    signalKeywords: [
      "tracking",
      "carrier integration",
      "SFTP",
      "webhook",
      "shipment event",
      "event visibility",
      "carrier event",
      "integration setup",
      "carrier onboard",
      "delivery mode",
      "new carrier",
      "private integration",
      "public integration",
    ],
    upsellAngle: "Unlock real-time carrier visibility across all shipments.",
  },
  {
    id: 2,
    name: "Notifications",
    shortName: "Notifications",
    tagline: "Customer-facing email & SMS",
    tier: "base",
    color: { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200", dot: "bg-violet-500" },
    signalKeywords: [
      "notification",
      "email template",
      "SMS",
      "customer communication",
      "proactive",
      "post-purchase comm",
      "notification setup",
      "notification template",
      "Yalo",
      "WhatsApp",
      "missing notification",
      "B2B Order Messaging",
      "notification deliveries",
    ],
    upsellAngle: "Reduce WISMO with branded, proactive shipment notifications.",
  },
  {
    id: 4,
    name: "Post-Purchase",
    shortName: "PTP",
    tagline: "Branded tracking page",
    tier: "base",
    color: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
    signalKeywords: [
      "post-purchase",
      "tracking page",
      "PTP",
      "branded tracking",
      "customer portal",
      "order status page",
      "search form",
      "Label CTA",
      "PTP statistic",
    ],
    upsellAngle: "Drive re-purchase with a fully branded post-purchase experience.",
  },
  {
    id: 8,
    name: "Returns",
    shortName: "Returns",
    tagline: "Returns & reverse logistics portal",
    tier: "premium",
    color: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200", dot: "bg-orange-500" },
    signalKeywords: [
      "return",
      "withdrawal",
      "reverse logistics",
      "return shipment",
      "return use case",
      "RMA",
      "return overview",
      "return reason",
      "return report",
      "return portal",
      "Box Now",
      "return function",
      "returns demo",
      "return solutions",
      "SegMail",
      "B2B carrier",
    ],
    upsellAngle: "Cut return handling cost with an automated returns portal.",
  },
  {
    id: 16,
    name: "AI Commerce Visibility",
    shortName: "AI VIS",
    tagline: "Competitive delivery benchmarking",
    tier: "premium",
    color: { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200", dot: "bg-rose-500" },
    signalKeywords: [
      "AI visibility",
      "AI commerce",
      "AI VIS",
      "competitive",
      "benchmark",
      "competitor",
      "credit utilization",
      "prompting strategy",
      "AI kickoff",
      "marketplace use case",
      "product bar",
      "competitor set",
      "ai account monitoring",
    ],
    upsellAngle: "Outpace competitors with AI-powered delivery intelligence.",
  },
  {
    id: 32,
    name: "Cost Audit",
    shortName: "Cost Audit",
    tagline: "Freight invoice reconciliation",
    tier: "premium",
    color: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
    signalKeywords: [
      "invoice",
      "cost audit",
      "freight invoice",
      "rate card",
      "claims",
      "duty",
      "tax",
      "Skyquick",
      "chargeable weight",
      "cost reconciliation",
      "invoice module",
      "billing",
      "invoice processing",
      "invoice report",
      "cost audit",
    ],
    upsellAngle: "Recover freight overpayments with automated invoice auditing.",
  },
  {
    id: 64,
    name: "EDD",
    shortName: "EDD",
    tagline: "AI-powered estimated delivery dates",
    tier: "premium",
    color: { bg: "bg-cyan-100", text: "text-cyan-700", ring: "ring-cyan-200", dot: "bg-cyan-500" },
    signalKeywords: [
      "EDD",
      "estimated delivery",
      "delivery date",
      "AI EDD",
      "delivery accuracy",
      "lead time",
      "A/B experiment",
      "EDD calculation",
      "EDD lookup",
      "delivery time",
      "EDD performance",
      "Matrix",
      "city-level",
      "holidays",
    ],
    upsellAngle: "Boost conversion with AI-accurate delivery date promises.",
  },
];

export const MODULE_MAP: Record<number, PPModule> = Object.fromEntries(MODULES.map((m) => [m.id, m]));

// ── Signal scoring ────────────────────────────────────────────────────────────

function scoreText(text: string, module: PPModule): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of module.signalKeywords) {
    if (lower.includes(kw.toLowerCase())) score += 3;
  }
  if (lower.includes(module.name.toLowerCase()) || lower.includes(module.shortName.toLowerCase())) score += 4;
  if (/(demo|trial|kickoff|onboard|interest|discuss|explore|upsell|expand|propose|request|feasibility)/.test(lower)) score += 3;
  return Math.min(score, 20);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UpsellSignal {
  source: "slack" | "jira" | "gmail" | "hubspot";
  date: string;
  text: string;
  permalink?: string;
  score: number;
}

export type UpsellTier = "hot" | "warm" | "cool" | "gap";

export interface UpsellOpportunity {
  accountId: string;
  accountName: string;
  arr: number;
  health: string;
  logoColor: string;
  initials: string;
  module: PPModule;
  totalScore: number;
  tier: UpsellTier;
  topSignals: UpsellSignal[];
  allSignalCount: number;
  isModuleGap: boolean;
  subscribedModules: number[];
}

// ── Signal collection ─────────────────────────────────────────────────────────

function collectSignals(account: Account): UpsellSignal[] {
  const signals: UpsellSignal[] = [];

  for (const s of account.slackSignals) {
    signals.push({ source: "slack", date: s.date, text: s.summary, score: 0 });
  }
  for (const t of account.jiraTickets) {
    const text = [t.title, t.context].filter(Boolean).join(" · ");
    signals.push({ source: "jira", date: t.createdDate ?? t.updatedDate ?? "", text, permalink: t.url, score: 0 });
  }
  for (const e of account.emailThreads) {
    signals.push({ source: "gmail", date: e.date.slice(0, 10), text: `${e.subject} — ${e.preview}`, permalink: e.permalink, score: 0 });
  }
  if (account.notes) {
    signals.push({ source: "hubspot", date: account.lastTouch, text: account.notes, score: 0 });
  }
  return signals;
}

// ── Main compute functions ────────────────────────────────────────────────────

export function computeUpsellOpportunities(accounts: Account[]): UpsellOpportunity[] {
  const opportunities: UpsellOpportunity[] = [];

  for (const account of accounts) {
    if (!account.product) continue;

    const rawSignals = collectSignals(account);
    const subscribedModules = new Set(account.product.ppModules);
    const hasModuleData = account.product.ppModules.length > 0;

    for (const module of MODULES) {
      const alreadyHas = subscribedModules.has(module.id);
      if (alreadyHas) continue;

      const isGap = hasModuleData && module.tier === "base";

      // Skip base gap analysis for accounts where we don't have module data
      if (module.tier === "base" && !hasModuleData) continue;

      const scored: UpsellSignal[] = rawSignals
        .map((s) => ({ ...s, score: scoreText(s.text, module) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

      const totalScore = scored.reduce((sum, s) => sum + s.score, 0);

      // Skip premium modules with zero signals
      if (module.tier === "premium" && totalScore === 0) continue;

      // For low-ARR accounts with no signals and it's just a gap, skip noise
      if (isGap && totalScore === 0 && account.arr < 10_000) continue;

      const tier: UpsellTier =
        isGap && totalScore === 0 ? "gap" : totalScore >= 12 ? "hot" : totalScore >= 5 ? "warm" : "cool";

      opportunities.push({
        accountId: account.id,
        accountName: account.name,
        arr: account.arr,
        health: account.health,
        logoColor: account.logoColor,
        initials: account.initials,
        module,
        totalScore,
        tier,
        topSignals: scored.slice(0, 3),
        allSignalCount: scored.length,
        isModuleGap: isGap,
        subscribedModules: account.product.ppModules,
      });
    }
  }

  const tierOrder: Record<UpsellTier, number> = { hot: 0, warm: 1, cool: 2, gap: 3 };
  return opportunities.sort((a, b) => {
    const td = tierOrder[a.tier] - tierOrder[b.tier];
    return td !== 0 ? td : b.totalScore - a.totalScore;
  });
}

// ── Coverage matrix ───────────────────────────────────────────────────────────

export interface CoverageCell {
  subscribed: boolean;
  signalScore: number;
  tier: UpsellTier | "subscribed" | "none";
}

export interface ModuleCoverageRow {
  account: Account;
  cells: Record<ModuleId, CoverageCell>;
}

export function computeModuleCoverage(accounts: Account[]): ModuleCoverageRow[] {
  return accounts
    .filter((a) => a.product)
    .map((account) => {
      const rawSignals = collectSignals(account);
      const subscribedModules = new Set(account.product!.ppModules);

      const cells: Record<ModuleId, CoverageCell> = {} as Record<ModuleId, CoverageCell>;
      for (const module of MODULES) {
        const subscribed = subscribedModules.has(module.id);
        const signalScore = subscribed
          ? 0
          : rawSignals.map((s) => scoreText(s.text, module)).reduce((a, b) => a + b, 0);

        const tier: CoverageCell["tier"] = subscribed
          ? "subscribed"
          : signalScore >= 12
            ? "hot"
            : signalScore >= 5
              ? "warm"
              : signalScore > 0
                ? "cool"
                : "none";

        cells[module.id] = { subscribed, signalScore, tier };
      }
      return { account, cells };
    });
}
