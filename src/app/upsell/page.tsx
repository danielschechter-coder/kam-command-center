import { accounts } from "@/lib/mockData";
import { computeUpsellOpportunities, computeModuleCoverage, MODULES } from "@/lib/upsell";
import { UpsellClient } from "@/components/upsell-client";

export default function UpsellPage() {
  const opportunities = computeUpsellOpportunities(accounts);
  const coverage = computeModuleCoverage(accounts);

  return <UpsellClient opportunities={opportunities} coverage={coverage} modules={MODULES} />;
}
