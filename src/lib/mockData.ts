// Real cross-source snapshot for KAM Daniel Schechter
// Generated 2026-05-13 from five connected sources via MCP:
//   - HubSpot (companies, tasks, contacts, deals)
//   - Parcel Perform admin (orgs, contracts, user counts)
//   - Slack (customer channels + DMs)
//   - Atlassian (Jira issues — real ticket data including status, assignee, priority)
//   - Gmail (customer email threads)
import type { Account, ActionItem, EmailThread, HealthStatus, JiraTicket, ProductData, SlackSignal, SourceStatus } from "./types";

export const sourceStatus: SourceStatus[] = [
  { source: "hubspot", connected: true, note: "Companies, tasks, contacts" },
  { source: "product", connected: true, note: "Parcel Perform admin — contracts, usage, users" },
  { source: "slack", connected: true, note: "Customer channels + DMs" },
  { source: "jira", connected: true, note: "Atlassian — real ticket status, assignee, priority" },
  { source: "gmail", connected: true, note: "Customer email threads" },
];

const OWNER = "Daniel Schechter";
const TODAY = new Date("2026-05-13");

type Raw = {
  id: string;
  hsId: number;
  name: string;
  industryRaw: string;
  country: string;
  arr: number;
  contractStart: string;
  contacts: number;
  deals: number;
  openDeals: number;
  score: number;
  atRisk: boolean;
  lastTouch: string;
  notes?: string;
  contactList?: { name: string; title: string; email: string; isExecutiveSponsor?: boolean; isChampion?: boolean }[];
};

const industryMap: Record<string, string> = {
  RETAIL: "Retail",
  FOOD_BEVERAGES: "Food & Beverage",
  CONSUMER_GOODS: "Consumer Goods",
  LOGISTICS_AND_SUPPLY_CHAIN: "Logistics & Supply Chain",
  FURNITURE: "Furniture",
  AUTOMOTIVE: "Automotive",
  APPAREL_FASHION: "Apparel & Fashion",
  TELECOMMUNICATIONS: "Telecommunications",
  COSMETICS: "Cosmetics",
  "WMS & Software": "WMS & Software",
};

const amer = new Set(["United States", "Canada", "Mexico", "Brazil", "Argentina", "Colombia", "Chile"]);
const apac = new Set(["Korea", "Hong Kong", "Thailand", "Singapore", "Australia", "New Zealand"]);

function regionOf(country: string): string {
  if (amer.has(country)) return "AMER";
  if (apac.has(country)) return "APAC";
  return "EMEA";
}

function segmentOf(arr: number): "Enterprise" | "Mid-Market" | "SMB" {
  if (arr >= 50000) return "Enterprise";
  if (arr >= 10000) return "Mid-Market";
  return "SMB";
}

function initialsOf(name: string): string {
  const parts = name.replace(/\b(GmbH|KG|AG|Group|Inc|Ltd)\b\.?/gi, "").trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
}

const colorPalette = [
  "bg-slate-700",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-cyan-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return colorPalette[h % colorPalette.length];
}

function daysAgo(iso: string, today = TODAY): number {
  return Math.round((today.getTime() - new Date(iso).getTime()) / 86_400_000);
}

function nextAnniversary(contractStartISO: string, today = TODAY): string {
  const start = new Date(contractStartISO);
  const next = new Date(today.getFullYear(), start.getMonth(), start.getDate());
  if (next.getTime() < today.getTime()) next.setFullYear(today.getFullYear() + 1);
  return next.toISOString().slice(0, 10);
}

function deriveHealth(r: Raw): { health: HealthStatus; healthScore: number } {
  if (r.atRisk) return { health: "critical", healthScore: 25 + (r.score % 15) };
  if (r.score >= 50) return { health: "healthy", healthScore: 75 + Math.min(20, r.score - 50) };
  if (r.score >= 1) return { health: "watch", healthScore: 55 + r.score };
  const age = daysAgo(r.lastTouch);
  if (age > 60) return { health: "at_risk", healthScore: 38 };
  if (age > 30) return { health: "watch", healthScore: 60 };
  return { health: "healthy", healthScore: 78 };
}

function npsFor(health: HealthStatus): number {
  return health === "critical" ? -22 : health === "at_risk" ? 4 : health === "watch" ? 26 : 48;
}

function usageFor(health: HealthStatus): number {
  return health === "critical" ? 32 : health === "at_risk" ? 51 : health === "watch" ? 68 : 84;
}

// --- Raw data straight from HubSpot ---------------------------------------
const raw: Raw[] = [
  {
    id: "puma",
    hsId: 407166658,
    name: "PUMA",
    industryRaw: "APPAREL_FASHION",
    country: "United States",
    arr: 159997,
    contractStart: "2024-01-02",
    contacts: 55,
    deals: 15,
    openDeals: 0,
    score: 54,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes:
      "Tier-1 ICP. Renewal cycle entering Q3. Cross-functional engagement with Fulfillment EU and Customer Service. Strong technical fit; expansion lever is post-purchase notifications across additional regions.",
    contactList: [
      { name: "Alexander Bube", title: "Head Fulfillment eCom Europe", email: "alexander.bube@puma.com", isExecutiveSponsor: true },
      { name: "Andrea Faretta", title: "Project Manager E-Commerce Europe", email: "andrea.faretta@puma.com", isChampion: true },
      { name: "Frederic Le Nouaille", title: "Junior Manager Customer Service E-Commerce Europe", email: "frederic.lenouaille@puma.com" },
      { name: "Carsten Senkbeil", title: "Fulfillment Specialist E-Commerce Europe", email: "carsten.senkbeil@puma.com" },
    ],
  },
  {
    id: "nespresso-ca",
    hsId: 2474525385,
    name: "Nespresso Canada",
    industryRaw: "FOOD_BEVERAGES",
    country: "Canada",
    arr: 72267,
    contractStart: "2020-04-06",
    contacts: 43,
    deals: 28,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "Mature Nespresso market with deep deal history (28 lifetime). Stable usage; no open risks in CRM. Renewal anniversary in April.",
  },
  {
    id: "vodafone-de",
    hsId: 767245079,
    name: "Vodafone Germany",
    industryRaw: "TELECOMMUNICATIONS",
    country: "United Kingdom",
    arr: 63410,
    contractStart: "2022-11-25",
    contacts: 65,
    deals: 19,
    openDeals: 0,
    score: 8,
    atRisk: false,
    lastTouch: "2026-04-29",
    notes:
      "Active upsell motion: 1M→2M shipments Post-Purchase. Two BDM-to-KAM handover items open from earlier this year. SC and Logistics Strategy are the engaged personas.",
    contactList: [
      { name: "Oliver Hobes", title: "Senior Manager Logistics Strategy", email: "oliver.hobes@vodafone.com", isExecutiveSponsor: true },
      { name: "Thorsten Halbach", title: "SC Manager / Freight / After Sales", email: "thorsten.halbach@vodafone.com", isChampion: true },
      { name: "Galina Berg", title: "Application Manager SAP", email: "galina.berg@vodafone.com" },
    ],
  },
  {
    id: "nespresso-uk",
    hsId: 8892037025,
    name: "Nespresso United Kingdom",
    industryRaw: "FOOD_BEVERAGES",
    country: "United Kingdom",
    arr: 44275,
    contractStart: "2022-06-10",
    contacts: 34,
    deals: 11,
    openDeals: 0,
    score: 64,
    atRisk: false,
    lastTouch: "2026-04-29",
    notes: "Healthy account, score 64. 11 lifetime deals. Renewal anniversary in June — start commercial review now.",
  },
  {
    id: "everstox",
    hsId: 3026368720,
    name: "everstox",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Germany",
    arr: 42237,
    contractStart: "2022-03-25",
    contacts: 31,
    deals: 9,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-03-17",
    notes:
      "Two open BDM-to-KAM handover tasks for Renewal & Upsell (2026-2027 and 2027-2028 cycles). Founder-led account with Co-CEO engaged. Time since last sales activity is creeping (~30 days) — re-engage.",
    contactList: [
      { name: "Johannes Tress", title: "Founder and Co-CEO", email: "johannes.tress@everstox.com", isExecutiveSponsor: true },
      { name: "Florian Bunk", title: "Head of Operations", email: "florian.bunk@everstox.com", isChampion: true },
      { name: "Niklas Binter", title: "Head of Growth", email: "niklas.binter@everstox.com" },
      { name: "Maximilian Gebuhr", title: "Carrier Manager", email: "maximilian.gebuhr@everstox.com" },
    ],
  },
  {
    id: "nespresso-nl",
    hsId: 857481602,
    name: "Nespresso Netherlands",
    industryRaw: "FOOD_BEVERAGES",
    country: "Netherlands",
    arr: 41545,
    contractStart: "2019-08-19",
    contacts: 32,
    deals: 13,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes: "Long-tenured Nespresso market (since 2019). Recently active in CRM. Renewal anniversary in August.",
  },
  {
    id: "byrd",
    hsId: 966484882,
    name: "byrd technologies GmbH",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Austria",
    arr: 40330,
    contractStart: "2018-09-27",
    contacts: 25,
    deals: 5,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-03-18",
    notes:
      "Director of Marketing David Mirzaei has been engaging via marketing emails — two open follow-up tasks. CTO is technical sponsor. Quiet on direct sales touchpoints for ~55 days.",
    contactList: [
      { name: "Sebastian Mach", title: "CTO", email: "sebastian.mach@getbyrd.com", isExecutiveSponsor: true },
      { name: "David Mirzaei", title: "Sr Director Marketing", email: "david@getbyrd.com", isChampion: true },
      { name: "Joao Mendes", title: "Director of Product", email: "joao.mendes@getbyrd.com" },
    ],
  },
  {
    id: "nespresso-kr",
    hsId: 7839637547,
    name: "Nespresso Korea",
    industryRaw: "FOOD_BEVERAGES",
    country: "Korea",
    arr: 36246,
    contractStart: "2022-02-07",
    contacts: 23,
    deals: 7,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-02-02",
    notes: "No notes update in 99 days — flagged at_risk by inactivity. Reach out to confirm sponsor health and book a check-in.",
  },
  {
    id: "seven-senders",
    hsId: 861880270,
    name: "Seven Senders",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Germany",
    arr: 35316,
    contractStart: "2019-02-01",
    contacts: 18,
    deals: 7,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes: "Active engagement today. 1 open deal in pipeline. Product Management is the primary persona.",
    contactList: [
      { name: "Grzegorz Lapanowski", title: "Senior Product Manager", email: "g.lapanowski@sevensenders.com", isChampion: true },
      { name: "Julian Wuertz", title: "Product Manager", email: "j.wuertz@sevensenders.com" },
      { name: "Ana Belen Garcia Sahagun", title: "Data Quality Manager", email: "a.garciasahagun@sevensenders.com" },
    ],
  },
  {
    id: "nespresso-gr",
    hsId: 6164447068,
    name: "Nespresso Greece",
    industryRaw: "RETAIL",
    country: "Greece",
    arr: 29442,
    contractStart: "2021-07-28",
    contacts: 23,
    deals: 22,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "22 lifetime deals — very active commercial relationship. Renewal anniversary late July.",
  },
  {
    id: "nespresso-ch",
    hsId: 8147274668,
    name: "Nespresso Switzerland",
    industryRaw: "CONSUMER_GOODS",
    country: "Switzerland",
    arr: 28609,
    contractStart: "2022-03-11",
    contacts: 94,
    deals: 13,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-16",
    notes: "Nespresso Switzerland HQ presence — 94 contacts in CRM. Strategic relationship for the global Nespresso family.",
  },
  {
    id: "expondo",
    hsId: 4702032227,
    name: "expondo.com",
    industryRaw: "CONSUMER_GOODS",
    country: "Germany",
    arr: 28174,
    contractStart: "2019-03-31",
    contacts: 202,
    deals: 18,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-05",
    notes: "Large contact footprint (202). Product Director engaged. One open deal — confirm closure path.",
    contactList: [
      { name: "Campbell Wu", title: "Product Director", email: "campbell.wu@expondo.com", isExecutiveSponsor: true },
      { name: "Izabela Sawczak", title: "Product Manager", email: "i.sawczak@expondo.com" },
      { name: "Lennart Brandes", title: "Logistics and Customs Coordinator", email: "l.brandes@expondo.com" },
    ],
  },
  {
    id: "sfs",
    hsId: 5546606168,
    name: "SFS",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Switzerland",
    arr: 26307,
    contractStart: "2021-03-04",
    contacts: 8,
    deals: 2,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-03-10",
    notes: "Quiet account (~63 days since last touch). Only 8 contacts — concentration risk. Re-establish sponsor before March anniversary.",
  },
  {
    id: "waterdrop-at",
    hsId: 5720899989,
    name: "Waterdrop Austria",
    industryRaw: "FOOD_BEVERAGES",
    country: "Austria",
    arr: 26100,
    contractStart: "2021-04-20",
    contacts: 55,
    deals: 12,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-01",
    notes: "DTC drinks brand. 55 contacts. Renewal anniversary mid-April — review commercial terms.",
  },
  {
    id: "motea",
    hsId: 5901015171,
    name: "MOTEA GmbH",
    industryRaw: "AUTOMOTIVE",
    country: "Germany",
    arr: 23160,
    contractStart: "2021-06-09",
    contacts: 10,
    deals: 10,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-03-25",
    notes: "10 contacts / 10 deals — narrow but deep. Aftermarket auto parts. Renewal in June.",
  },
  {
    id: "nespresso-at",
    hsId: 2418207129,
    name: "Nespresso Austria",
    industryRaw: "FOOD_BEVERAGES",
    country: "Austria",
    arr: 23073,
    contractStart: "2021-04-06",
    contacts: 16,
    deals: 11,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-07",
    notes: "Stable Nespresso DACH market. Renewal anniversary in April.",
  },
  {
    id: "flaconi",
    hsId: 452341418,
    name: "Flaconi GmbH",
    industryRaw: "COSMETICS",
    country: "Germany",
    arr: 22465,
    contractStart: "2017-05-15",
    contacts: 57,
    deals: 9,
    openDeals: 1,
    score: 5,
    atRisk: false,
    lastTouch: "2026-05-07",
    notes: "Tier-1 ICP. VP Ops and VP Engineering both engaged — strong technical fit. Marketing email re-engagement noted. One open deal in motion.",
    contactList: [
      { name: "Kjell Klingenberg", title: "VP Ops", email: "kjell.klingenberg@flaconi.de", isExecutiveSponsor: true },
      { name: "Adeel Younas", title: "VP of Engineering", email: "adeel.younas@flaconi.de", isChampion: true },
      { name: "Mohamed Sarwat", title: "Senior Product Manager", email: "mohamed.sarwat@flaconi.de" },
    ],
  },
  {
    id: "nespresso-it",
    hsId: 3855564217,
    name: "Nespresso Italy",
    industryRaw: "RETAIL",
    country: "Italy",
    arr: 19838,
    contractStart: "2020-04-06",
    contacts: 31,
    deals: 16,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-06",
    notes: "Mature market. 16 lifetime deals. Renewal anniversary in April — already passed for 2026, next is 2027.",
  },
  {
    id: "nespresso-anz",
    hsId: 3393145867,
    name: "Nespresso Australia & New Zealand",
    industryRaw: "RETAIL",
    country: "Australia",
    arr: 18785,
    contractStart: "2020-04-06",
    contacts: 31,
    deals: 23,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-28",
    notes: "Asia-Pacific anchor for Nespresso. 23 lifetime deals.",
  },
  {
    id: "nespresso-pt",
    hsId: 791141967,
    name: "Nespresso Portugal",
    industryRaw: "FOOD_BEVERAGES",
    country: "Portugal",
    arr: 15022,
    contractStart: "2019-08-19",
    contacts: 30,
    deals: 11,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-27",
    notes: "Long-running market. Renewal anniversary in August.",
  },
  {
    id: "charles-keith",
    hsId: 407171272,
    name: "Charles & Keith Group",
    industryRaw: "APPAREL_FASHION",
    country: "Singapore",
    arr: 14040,
    contractStart: "2024-07-18",
    contacts: 63,
    deals: 10,
    openDeals: 4,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes: "APAC fashion brand. 4 open deals — active expansion in pipeline. Singapore HQ.",
  },
  {
    id: "nespresso-be",
    hsId: 2372891936,
    name: "Nespresso Belgium & Luxembourg",
    industryRaw: "FOOD_BEVERAGES",
    country: "Belgium",
    arr: 14551,
    contractStart: "2020-04-06",
    contacts: 19,
    deals: 8,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-16",
    notes: "Smaller Nespresso market. Stable.",
  },
  {
    id: "nuki",
    hsId: 5967541268,
    name: "Nuki",
    industryRaw: "CONSUMER_GOODS",
    country: "Austria",
    arr: 13146,
    contractStart: "2022-05-20",
    contacts: 48,
    deals: 7,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-22",
    notes: "Smart lock hardware brand. Head of Operations engaged. 1 open deal.",
    contactList: [
      { name: "Alexander Ketter", title: "Head of Operations", email: "ak@nuki.io", isExecutiveSponsor: true, isChampion: true },
      { name: "Daniel Wolf", title: "Fulfillment Lead", email: "daniel.wolf@nuki.io" },
      { name: "Werner Sammer", title: "Marketing Manager", email: "werner.sammer@nuki.io" },
    ],
  },
  {
    id: "nespresso-mx",
    hsId: 1801701481,
    name: "Nespresso Mexico",
    industryRaw: "FOOD_BEVERAGES",
    country: "Mexico",
    arr: 7892,
    contractStart: "2019-08-19",
    contacts: 26,
    deals: 16,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-07",
    notes: "LATAM market. 16 lifetime deals.",
  },
  {
    id: "xxxlutz",
    hsId: 35757702172,
    name: "XXXLutz KG",
    industryRaw: "FURNITURE",
    country: "Austria",
    arr: 9449,
    contractStart: "2021-06-09",
    contacts: 48,
    deals: 11,
    openDeals: 3,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes:
      "Active today. 3 open deals — including a Kafka async feedback setup item in the handover backlog. Senior Product Owner is the technical contact.",
    contactList: [
      { name: "Paul Kneidinger", title: "Senior Product Owner", email: "paul.kneidinger@xxxl.digital", isChampion: true },
      { name: "Julian Zipfel", title: "Project Manager & Business Analyst", email: "v99@xxxlgroup.com" },
    ],
  },
  {
    id: "ms-direct",
    hsId: 10338655058,
    name: "MS Direct AG",
    industryRaw: "WMS & Software",
    country: "Switzerland",
    arr: 8535,
    contractStart: "2022-12-13",
    contacts: 18,
    deals: 5,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-02-17",
    notes: "Tier-1 ICP but ~84 days since last touch — flagged at_risk by inactivity. Has 1 open deal; reconnect immediately.",
  },
  {
    id: "alaiko",
    hsId: 3017122796,
    name: "Alaiko GmbH",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Germany",
    arr: 8720,
    contractStart: "2020-04-03",
    contacts: 10,
    deals: 5,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2025-12-10",
    notes:
      "5 months without a touch — at_risk by inactivity. Renewal anniversary in April just passed without a check-in. Recovery priority.",
  },
  {
    id: "nespresso-hu",
    hsId: 6165135110,
    name: "Nespresso Hungary",
    industryRaw: "RETAIL",
    country: "Hungary",
    arr: 8159,
    contractStart: "2021-05-31",
    contacts: 16,
    deals: 12,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes: "Smaller market. Active today.",
  },
  {
    id: "nespresso-ar",
    hsId: 6164471590,
    name: "Nespresso Argentina",
    industryRaw: "RETAIL",
    country: "Argentina",
    arr: 9800,
    contractStart: "2021-05-31",
    contacts: 32,
    deals: 9,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-06",
    notes: "LATAM market. Open BDM-to-KAM handover task for the 2026 renewal cycle.",
  },
  {
    id: "nespresso-nordics",
    hsId: 6164525890,
    name: "Nespresso Nordics",
    industryRaw: "RETAIL",
    country: "Nordics",
    arr: 7461,
    contractStart: "2019-08-19",
    contacts: 24,
    deals: 5,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-08",
    notes: "Combined Nordics market.",
  },
  {
    id: "fiege",
    hsId: 25684080692,
    name: "Fiege",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Germany",
    arr: 7521,
    contractStart: "2021-02-11",
    contacts: 20,
    deals: 5,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-06",
    notes: "Tier-1 ICP. Large logistics partner. 1 open deal. Watch open pipeline activity.",
  },
  {
    id: "zenfulfillment",
    hsId: 6905861406,
    name: "Zenfulfillment",
    industryRaw: "LOGISTICS_AND_SUPPLY_CHAIN",
    country: "Germany",
    arr: 6758,
    contractStart: "2023-02-17",
    contacts: 12,
    deals: 7,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-24",
    notes: "Open BDM-to-KAM handover for 2026-2027 renewal. CEO is reachable and engaged.",
    contactList: [
      { name: "Johannes Humpert", title: "CEO & Managing Director", email: "johannes.humpert@zenfulfillment.com", isExecutiveSponsor: true },
      { name: "Ievgen Demchenko", title: "CTO", email: "ievgen.demchenko@zenfulfillment.com", isChampion: true },
      { name: "Kevin Köster", title: "Head of Engineering", email: "kevin.koester@zenfulfillment.com" },
    ],
  },
  {
    id: "nespresso-co",
    hsId: 6164471470,
    name: "Nespresso Colombia",
    industryRaw: "RETAIL",
    country: "Colombia",
    arr: 4340,
    contractStart: "2023-07-06",
    contacts: 11,
    deals: 8,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-21",
    notes: "LATAM emerging market.",
  },
  {
    id: "nespresso-cl",
    hsId: 6164446886,
    name: "Nespresso Chile",
    industryRaw: "RETAIL",
    country: "Chile",
    arr: 4340,
    contractStart: "2021-05-31",
    contacts: 21,
    deals: 9,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "LATAM market.",
  },
  {
    id: "nespresso-th",
    hsId: 738261107,
    name: "Nespresso Thailand",
    industryRaw: "FOOD_BEVERAGES",
    country: "Thailand",
    arr: 2954,
    contractStart: "2019-08-19",
    contacts: 451,
    deals: 11,
    openDeals: 0,
    score: 64,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "Healthy score 64. Huge contact footprint (451) — likely a B2C bleed. Stable usage.",
  },
  {
    id: "nespresso-br",
    hsId: 5746101033,
    name: "Nespresso Brazil",
    industryRaw: "FOOD_BEVERAGES",
    country: "Brazil",
    arr: 1853,
    contractStart: "2021-07-28",
    contacts: 35,
    deals: 32,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "Most deals of any market (32) — very transactional. Recent ARR has compressed.",
  },
  {
    id: "nespresso-pl",
    hsId: 17689017011,
    name: "Nespresso Poland",
    industryRaw: "RETAIL",
    country: "Poland",
    arr: 1537,
    contractStart: "2023-10-16",
    contacts: 3,
    deals: 1,
    openDeals: 0,
    score: 64,
    atRisk: false,
    lastTouch: "2026-03-30",
    notes: "Healthy score 64 but only 3 contacts and 1 deal — relationship is thin. Build sponsor coverage.",
  },
  {
    id: "nespresso",
    hsId: 790736151,
    name: "Nespresso (Global)",
    industryRaw: "RETAIL",
    country: "Switzerland",
    arr: 1389,
    contractStart: "2018-08-20",
    contacts: 43,
    deals: 10,
    openDeals: 0,
    score: 64,
    atRisk: false,
    lastTouch: "2026-05-11",
    notes: "Global Nespresso parent record. Healthy score. Coordinates the 22 country units in this book.",
  },
  {
    id: "bettzeit-emma",
    hsId: 1118421430,
    name: "Bettzeit/Emma",
    industryRaw: "CONSUMER_GOODS",
    country: "United Kingdom",
    arr: 1095,
    contractStart: "2019-08-27",
    contacts: 368,
    deals: 58,
    openDeals: 4,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-12",
    notes: "Largest deal history in the book (58 deals). Recent ARR has collapsed but 4 open pipeline items show active commercial motion. Head of Logistics EU is key contact.",
    contactList: [
      { name: "Luis Lourenço Silva", title: "Head of Logistics [EU]", email: "luis.silva@emma-sleep.com", isExecutiveSponsor: true, isChampion: true },
      { name: "Cláudia Coelho Cardoso", title: "Customer Excellence Senior Lead", email: "claudia.cardoso@emma-sleep.com" },
      { name: "Richard Wylie", title: "Product Manager, eCommerce", email: "richard.wylie@emma-sleep.com" },
    ],
  },
  {
    id: "nespresso-hk",
    hsId: 3855558209,
    name: "Nespresso Hong Kong",
    industryRaw: "RETAIL",
    country: "Hong Kong",
    arr: 0,
    contractStart: "2020-04-06",
    contacts: 15,
    deals: 14,
    openDeals: 1,
    score: 0,
    atRisk: false,
    lastTouch: "2026-05-06",
    notes: "Recent deal amount zero — last close was administrative. 14 lifetime deals. 1 open. Confirm renewal commercial terms.",
  },
  {
    id: "nespresso-cz",
    hsId: 6164558428,
    name: "Nespresso Czech Republic & Slovakia",
    industryRaw: "RETAIL",
    country: "Czech Republic",
    arr: 0,
    contractStart: "2021-07-28",
    contacts: 16,
    deals: 19,
    openDeals: 0,
    score: 0,
    atRisk: false,
    lastTouch: "2026-04-16",
    notes: "Open SLA update handover (carrier & E2E). 19 lifetime deals but recent revenue trending to zero — investigate.",
  },
  {
    id: "limango",
    hsId: 407165213,
    name: "Limango",
    industryRaw: "APPAREL_FASHION",
    country: "Germany",
    arr: 0,
    contractStart: "2021-11-30",
    contacts: 9,
    deals: 9,
    openDeals: 0,
    score: 0,
    atRisk: true,
    lastTouch: "2026-04-14",
    notes:
      "Explicitly flagged At Risk in HubSpot. Two open BDM-to-KAM handover items for 2025/26 and 2026/27 renewals. Recent deal value is zero — credibility recovery and renewal save are this account's whole job right now.",
    contactList: [
      { name: "Katrin Voringer", title: "Head of Digital Services, Operations & BI", email: "katrin.voringer@limango.com", isExecutiveSponsor: true, isChampion: true },
      { name: "Daniela Zavelca", title: "Team Lead Engineering", email: "daniela.zavelca@limango.com" },
    ],
  },
];

// --- Transform into Account objects ----------------------------------------
function accountFromRaw(r: Raw): Account {
  const { health, healthScore } = deriveHealth(r);
  const risks =
    health === "critical"
      ? [
          {
            id: `${r.id}-r1`,
            title: "At-risk flag set in HubSpot",
            description: r.notes ?? "Marked at_risk in CRM.",
            severity: "high" as const,
            openedOn: r.lastTouch,
            owner: OWNER,
          },
        ]
      : health === "at_risk"
        ? [
            {
              id: `${r.id}-r1`,
              title: "Silent account",
              description: `${daysAgo(r.lastTouch)} days since last logged activity in HubSpot. Re-engage sponsor.`,
              severity: "medium" as const,
              openedOn: r.lastTouch,
              owner: OWNER,
            },
          ]
        : [];

  const contacts = (r.contactList ?? []).map((c, i) => ({ id: `${r.id}-c${i + 1}`, ...c }));

  const activity = [
    {
      id: `${r.id}-a1`,
      date: r.lastTouch,
      type: "note" as const,
      summary: `HubSpot notes last updated. ${r.deals} lifetime deals, ${r.openDeals} open in pipeline.`,
    },
    {
      id: `${r.id}-a2`,
      date: r.contractStart,
      type: "milestone" as const,
      summary: `Customer since ${new Date(r.contractStart).toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`,
    },
  ];

  return {
    id: r.id,
    name: r.name,
    industry: industryMap[r.industryRaw] ?? r.industryRaw,
    segment: segmentOf(r.arr),
    region: regionOf(r.country),
    logoColor: colorFor(r.name),
    initials: initialsOf(r.name).toUpperCase(),
    health,
    healthScore,
    arr: Math.round(r.arr),
    renewalDate: nextAnniversary(r.contractStart),
    contractStart: r.contractStart,
    owner: OWNER,
    lastTouch: r.lastTouch,
    productUsage: usageFor(health),
    npsScore: npsFor(health),
    contacts,
    risks,
    activity,
    briefs: [],
    notes: r.notes ?? "",
    slackSignals: [],
    jiraTickets: [],
    emailThreads: [],
  };
}

export const accounts: Account[] = raw.map(accountFromRaw);

// --- Cross-source signals --------------------------------------------------
// Slack signals are paraphrased one-line summaries from real Slack messages in
// each customer's channel. Jira keys (CI-XXXX) were extracted from links posted
// in those Slack threads (linking back to parcelperform.atlassian.net).

type AccountSignals = {
  slackChannel?: string;
  slackSignals?: SlackSignal[];
  jiraTickets?: JiraTicket[];
  emailThreads?: EmailThread[];
};

const jiraUrl = (key: string) => `https://parcelperform.atlassian.net/browse/${key}`;

const signalsById: Record<string, AccountSignals> = {
  puma: {
    slackChannel: "#customer_puma",
    slackSignals: [
      { id: "s1", date: "2026-05-08", channel: "#customer_puma", author: "Abbey Tran (CS)", summary: "Confirmed root cause for incorrect webhook notifications; runbook update in flight." },
      { id: "s2", date: "2026-05-05", channel: "#customer_puma", author: "Daniel Schechter", summary: "Swiss Post data-transfer customization approved by PUMA — asked Product for dev schedule." },
      { id: "s3", date: "2026-04-29", channel: "#customer_puma", author: "Daniel Schechter", summary: "Escalated ~5,300 RMA webhooks issue with Arvato — multiple 'Carrier booking successful' events triggered without bookings." },
      { id: "s4", date: "2026-04-22", channel: "#customer_inquiries", author: "Janna Nguyen (CS)", summary: "Shipments stuck in Open status — requested oncall-dev script to update affected shipments." },
    ],
    jiraTickets: [],
  },
  limango: {
    slackChannel: "#customer-limango",
    slackSignals: [
      { id: "s1", date: "2026-05-08", channel: "#customer-limango", author: "Daniel Schechter", summary: "Trial blocked: AI Visibility module not set up correctly — Trollkids benchmarking, not Limango directly." },
      { id: "s2", date: "2026-04-30", channel: "#customer-limango", author: "Daniel Schechter", summary: "Eric (CS) to file Jira ticket setting up AI VIS for marketplace use case (Germany, kids categories)." },
      { id: "s3", date: "2026-04-21", channel: "DM with Mavis Nguyen", author: "Daniel Schechter", summary: "Payment discrepancy on Limango invoice in Xero — followed up with Finance." },
      { id: "s4", date: "2026-04-11", channel: "Group DM (Chelsea, Loi)", author: "Loi Hoang", summary: "Renewal column = 0 for Limango in HubSpot — needs deal hygiene cleanup." },
    ],
    jiraTickets: [],
  },
  "vodafone-de": {
    slackChannel: "#customer_vodafone",
    slackSignals: [
      { id: "s1", date: "2026-05-04", channel: "#customer_vodafone", author: "Daniel Schechter", summary: "QBR prep — asked CS for data mapping file and clarification of carrier-field abbreviations." },
      { id: "s2", date: "2026-05-02", channel: "#customer_vodafone", author: "Daniel Schechter", summary: "Hermes time-stamp issue: UTC instead of UTC+1 — needs fix before QBR." },
      { id: "s3", date: "2026-04-29", channel: "#customer_vodafone", author: "Daniel Schechter", summary: "Requested returns demo experience prep for the Tuesday QBR." },
      { id: "s4", date: "2026-04-25", channel: "#customer_vodafone", author: "Daniel Schechter", summary: "Post-QBR debrief shared in Google Doc — section 9 needs CS follow-up." },
    ],
    jiraTickets: [
      { key: "CI-8177", url: jiraUrl("CI-8177"), title: "Hermes Germany timezone hardcode (Europe/Berlin)", source: "slack-crossref", context: "Hermes SFTP integration timezone fix." },
    ],
  },
  everstox: {
    slackChannel: "#ai-account-monitoring-alert",
    slackSignals: [
      { id: "s1", date: "2026-05-09", channel: "#ai-account-monitoring-alert", author: "Khai Ho (CS)", summary: "AI account-monitoring alert raised for everstox case — Eric (CS) asked to check." },
      { id: "s2", date: "2026-04-15", channel: "#hubspot-connect", author: "HubSpot", summary: "christofer.kraut@everstox.com started a Live Chat conversation through the website." },
      { id: "s3", date: "2026-04-11", channel: "Group DM (Chelsea, Loi)", author: "Loi Hoang", summary: "Everstox renewal deal showing 0 in HubSpot — needs cleanup." },
      { id: "s4", date: "2026-03-15", channel: "DM with Dana", author: "Daniel Schechter", summary: "Invoice INV-0656 (EUR 23,056.25) outstanding, due 20/02 — chased Finance." },
    ],
    jiraTickets: [],
  },
  flaconi: {
    slackChannel: "#customer_flaconi",
    slackSignals: [
      { id: "s1", date: "2026-05-06", channel: "#customer_flaconi", author: "Daniel Schechter", summary: "AI Visibility kickoff prep: competitor set (Notino, Parfumdreams, Douglas, Sephora, Pieper, Niche-Beauty, Ludwig Beck) + product bar fix." },
      { id: "s2", date: "2026-04-30", channel: "#product_release_ai_visibility", author: "Daniel Schechter", summary: "Posted AI Visibility kickoff visit report — onboarding, credit utilization, prompting strategy." },
      { id: "s3", date: "2026-04-25", channel: "#customer_flaconi", author: "Janna Nguyen (CS)", summary: "PostNL public connection enhancement — feasibility CI-7896 returned, 3 manday effort." },
      { id: "s4", date: "2026-04-20", channel: "DM with Mavis Nguyen", author: "Mavis Nguyen", summary: "Sent revised invoice INV-0711 to Flaconi (Parcel Perform Europe PPE GmbH)." },
      { id: "s5", date: "2026-04-18", channel: "Group DM (Arne, Dana, Charlotte)", author: "Dana von der Heide", summary: "Pre-brief for CEO-level AI Visibility demo with Flaconi — Charlotte's green-light on account state requested." },
    ],
    jiraTickets: [
      { key: "CI-7896", url: jiraUrl("CI-7896"), title: "PostNL public connection enhancement (PUDO scraping)", source: "slack-crossref", context: "3 manday — use recipient_address when shipment has PUDO tag." },
    ],
  },
  byrd: {
    slackChannel: "#ai-account-monitoring-alert",
    slackSignals: [
      { id: "s1", date: "2026-05-09", channel: "#ai-account-monitoring-alert", author: "Khai Ho (CS)", summary: "AI monitoring alert raised for byrd — Eric (CS) asked to check." },
      { id: "s2", date: "2026-04-02", channel: "#help-scraper", author: "Wendy Le (CS)", summary: "Scraper impact report: org 5029 Byrd showed 9,718 impacted shipments." },
      { id: "s3", date: "2026-03-15", channel: "DM with Dana", author: "Daniel Schechter", summary: "byrd technologies invoice INV-0687 (EUR 9,250) outstanding, due 01/03." },
    ],
    jiraTickets: [],
  },
  "bettzeit-emma": {
    slackChannel: "#customer_emma",
    slackSignals: [
      { id: "s1", date: "2026-05-05", channel: "#customer_emma", author: "Daniel Schechter", summary: "Pre-meeting check on B2B carrier integration; expecting Rita's replacement (Mickael Silva) to join." },
      { id: "s2", date: "2026-04-26", channel: "#customer_emma", author: "Janna Nguyen (CS)", summary: "Added new PIC mickael.silva@emma-sleep.com to thread — limited input from previous PIC for feasibility." },
      { id: "s3", date: "2026-03-23", channel: "#customer_emma", author: "Dana von der Heide", summary: "Weekly account summary canvas updated — KAM: Daniel · CSM: Janna · focus: AI Commerce Visibility demo follow-up + B2B carrier samples." },
      { id: "s4", date: "2026-03-20", channel: "#customer_emma", author: "Daniel Schechter", summary: "AI Commerce Visibility demo held with Sajal Chakravarty — Patrick & Richard follow-up required." },
    ],
    jiraTickets: [],
  },
  xxxlutz: {
    slackChannel: "#customer_xxxlutz",
    slackSignals: [
      { id: "s1", date: "2026-05-04", channel: "#customer_inquiries", author: "Eric Pham (CS)", summary: "Migrating 4 SFTP integrations from XXXLutz Test → Production (Rhenus, DHL Paket, Hermes Germany, plus 1 more)." },
      { id: "s2", date: "2026-04-22", channel: "#bugs", author: "Laure del Vecchio", summary: "Kafka shipment-update flow: messages failing AVRO schema validation on XXXLutz side." },
      { id: "s3", date: "2026-04-12", channel: "#bugs", author: "Laure del Vecchio", summary: "Email placeholders for line items not working — likely tied to missing tracking-page setup." },
      { id: "s4", date: "2026-03-19", channel: "#pricing-dach", author: "Chelsea Lee", summary: "Asked Daniel for SOW description for the Mailjet customization OF (order form)." },
    ],
    jiraTickets: [
      { key: "CI-8253", url: jiraUrl("CI-8253"), title: "SFTP migration — Rhenus Home Delivery (test → prod)", source: "slack-crossref" },
      { key: "CI-8251", url: jiraUrl("CI-8251"), title: "SFTP migration — DHL Paket (test → prod)", source: "slack-crossref" },
    ],
  },
  zenfulfillment: {
    slackChannel: "#dach_team",
    slackSignals: [
      { id: "s1", date: "2026-04-30", channel: "#dach_team", author: "Daniel Schechter", summary: "LinkedIn success story for Zenfulfillment live: resources.parcelperform.com/success-story/zenfulfillment." },
      { id: "s2", date: "2026-04-11", channel: "Group DM (Chelsea, Loi)", author: "Loi Hoang", summary: "Zenfulfillment renewal deal showing 0 in HubSpot — needs hygiene fix." },
    ],
    jiraTickets: [],
  },
  "charles-keith": {
    slackChannel: "#bugs",
    slackSignals: [
      { id: "s1", date: "2026-05-09", channel: "#bugs", author: "Wendy Le (CS)", summary: "Duty & Tax calc anomaly: 2 shipments in org 5491 Charles & Keith show very high tax amounts." },
      { id: "s2", date: "2026-04-25", channel: "#bugs", author: "Wendy Le (CS)", summary: "DHL Freight invoice upload stuck in Processing — flagged as critical blocker before C&K can go live." },
      { id: "s3", date: "2026-04-18", channel: "#pricing-dach", author: "Dana von der Heide", summary: "Rate-card update logic for cost audit feature — using C&K as the example for the general logic." },
    ],
    jiraTickets: [],
  },
  expondo: {
    slackChannel: "#customer_expondo",
    slackSignals: [
      { id: "s1", date: "2026-05-02", channel: "#customer_expondo", author: "Eric Pham (CS)", summary: "Confirmed Expondo notification templates are not a bug — preview shows correct per-shipment content; CS guidance needed." },
      { id: "s2", date: "2026-04-25", channel: "#customer_expondo", author: "Daniel Schechter", summary: "Requested standard playbook for notification setup improvements." },
      { id: "s3", date: "2026-04-15", channel: "#solconsult_requests", author: "Daniel Schechter", summary: "Asked Solutions Consulting for EDD-accuracy analysis comparing Expondo's EDD vs PP AI-based EDD." },
      { id: "s4", date: "2026-03-16", channel: "#customer_expondo", author: "Dana von der Heide", summary: "Expondo Account Summary canvas refreshed — focus on EDD performance validation and A/B experiment design." },
    ],
    jiraTickets: [],
  },
  "ms-direct": {
    slackChannel: "#help-carrier-integration",
    slackSignals: [
      { id: "s1", date: "2026-05-04", channel: "#help-carrier-integration", author: "Daniel Schechter", summary: "Asked Eric (CS) to check carrier reference directly with MS Direct as their CSM." },
      { id: "s2", date: "2026-05-02", channel: "#help-data-extraction", author: "Eric Pham (CS)", summary: "Investigating failed webhook alerts for MS Direct (org 6036) — no failed samples found in Athena query." },
      { id: "s3", date: "2026-04-20", channel: "DM with Dana", author: "Dana von der Heide", summary: "MS Direct Renewal deal re-assigned from Dana to Daniel in HubSpot." },
    ],
    jiraTickets: [],
  },
  fiege: {
    slackChannel: "#customer_fiege",
    slackSignals: [
      { id: "s1", date: "2026-05-08", channel: "#customer_fiege", author: "Eric Pham (CS)", summary: "Fiege requested Schmidt-Gevelsberg GmbH carrier onboarding (public integration). Feasibility positive, 3 manday — pricing decision pending." },
      { id: "s2", date: "2026-04-15", channel: "#product_release_cost_audit", author: "Dana von der Heide", summary: "Fiege Claims pricing brief shared internally — 70-90k shipments/month, ~0.14% claims rate. Two pricing models on the table." },
      { id: "s3", date: "2026-04-10", channel: "#customer_puma", author: "Janna Nguyen (CS)", summary: "Fiege flagged Correos Spain API change (SOAP → REST) — affects PUMA Spain shipments." },
    ],
    jiraTickets: [
      { key: "CI-8104", url: jiraUrl("CI-8104"), title: "Schmidt-Gevelsberg GmbH carrier onboarding (public)", source: "slack-crossref", context: "Feasibility confirmed, 3 manday effort." },
    ],
  },
  "seven-senders": {
    slackChannel: "#help-carrier-integration",
    slackSignals: [
      { id: "s1", date: "2026-05-03", channel: "#help-carrier-integration", author: "Janna Nguyen (CS)", summary: "Requested feasibility for InPost ES integration via Seven Senders (org 1422 SevenSenders) — sample tracking numbers provided." },
      { id: "s2", date: "2026-04-12", channel: "#customer_hermes", author: "Manish Patel", summary: "No carrier integration solution for Seven Senders edge cases — manual service is the only current option." },
    ],
    jiraTickets: [],
  },
  // Nespresso family — many CI tickets are scoped to a country unit.
  "nespresso-mx": {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-03", channel: "#customer_nespresso", author: "Khai Ho (CS)", summary: "Nespresso Mexico requested 2 new delivery modes (Estafeta 92 & 94) via SFTP integration." },
    ],
    jiraTickets: [
      { key: "CI-8165", url: jiraUrl("CI-8165"), title: "Register 2 new delivery modes for Nespresso Mexico (Estafeta 92 & 94)", source: "slack-crossref" },
    ],
  },
  "nespresso-cl": {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-06", channel: "#customer_nespresso", author: "Khai Ho (CS)", summary: "Nespresso Chile onboarding new carrier E-Darkstore via webhook integration — 450 EUR quote confirmed." },
    ],
    jiraTickets: [
      { key: "CI-8240", url: jiraUrl("CI-8240"), title: "Onboard new carrier E-Darkstore for Nespresso Chile (webhook)", source: "slack-crossref" },
    ],
  },
  "nespresso-at": {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-09", channel: "#customer_nespresso", author: "Abbey Tran (CS)", summary: "Nespresso Austria requested withdrawal/returns function — new use case under evaluation (cost, timeline, examples)." },
    ],
    jiraTickets: [
      { key: "CI-8280", url: jiraUrl("CI-8280"), title: "Nespresso Austria — withdrawal / full return solution scope", source: "slack-crossref" },
    ],
  },
  "nespresso-gr": {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-11", channel: "#customer_nespresso", author: "Abbey Tran (CS)", summary: "Nespresso Greece requested Carrier & E2E SLA update — new delivery modes plus adjusted event calculations." },
    ],
    jiraTickets: [
      { key: "CI-8286", url: jiraUrl("CI-8286"), title: "Nespresso Greece — Carrier & E2E SLA update", source: "slack-crossref" },
    ],
  },
  "nespresso-cz": {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-04", channel: "#customer_nespresso", author: "Abbey Tran (CS)", summary: "Nespresso Czech & Slovakia change scoped at 13 mandays — needs commercial confirmation; Tomas reviewing carrier references." },
    ],
    jiraTickets: [],
  },
  nespresso: {
    slackChannel: "#customer_nespresso",
    slackSignals: [
      { id: "s1", date: "2026-05-11", channel: "DM with Dana", author: "Daniel Schechter", summary: "Nespresso April report ready — latency for NN Canada is 7 min over target; draft logo issue noted." },
      { id: "s2", date: "2026-04-22", channel: "DM with Dana", author: "Daniel Schechter", summary: "Draft email to Bertrand pitching consolidated NN global account vs per-market — Portugal added to scope." },
      { id: "s3", date: "2026-04-18", channel: "#pp_da_work", author: "Daniel Schechter", summary: "Asked DA team to verify Portugal latency of 7 min — possible data anomaly." },
    ],
    jiraTickets: [],
  },
};

function attachSignals() {
  for (const a of accounts) {
    const sig = signalsById[a.id];
    a.slackChannel = sig?.slackChannel;
    a.slackSignals = sig?.slackSignals ?? [];
    a.jiraTickets = sig?.jiraTickets ?? [];
    a.emailThreads = sig?.emailThreads ?? [];
  }
}
attachSignals();

// --- Real Jira tickets from Atlassian MCP -----------------------------------
// Pulled 2026-05-19. These OVERRIDE the Slack-extracted placeholders above
// (where the keys match) with real ticket status, assignee, priority, dates.
// Query: project = CI AND statusCategory != Done AND priority in (Highest, High)
// filtered to Daniel's book of business. "done" records kept for history.

const realJiraTickets: (Omit<JiraTicket, "source"> & { accountId: string })[] = [
  // ── Previously resolved (done) — kept for history ─────────────────────────
  { accountId: "puma", key: "CI-8113", url: jiraUrl("CI-8113"), title: "PUMA — Return report & analysis: return reasons % on Product ID", status: "Akzeptiert", statusCategory: "done", priority: "High", assignee: "Charlotte Roos", reporter: "Daniel Schechter", issueType: "Task", createdDate: "2026-04-09", updatedDate: "2026-05-13", project: "CI", context: "Feasibility check. Solution proposed: add a return-reasons-per-product table to the R&A report. 20 manday effort." },
  { accountId: "puma", key: "CI-7913", url: jiraUrl("CI-7913"), title: "PUMA — Return report & analysis: report on return reasons related to sizes", status: "Akzeptiert", statusCategory: "done", priority: "High", assignee: "Sally Wong", reporter: "Daniel Schechter", issueType: "Task", createdDate: "2026-03-11", updatedDate: "2026-04-21", project: "CI", context: "Support PUMA's 'size up / size down' recommendation engine. 10 manday effort." },
  { accountId: "bettzeit-emma", key: "CI-8121", url: jiraUrl("CI-8121"), title: "EMMA — Onboard new carrier SegMail via public integration", status: "Akzeptiert", statusCategory: "done", priority: "High", assignee: "Thuan Nguyen (Bill)", reporter: "Daniel Schechter", issueType: "Task", createdDate: "2026-04-10", updatedDate: "2026-04-17", project: "CI" },
  { accountId: "xxxlutz", key: "CI-8253", url: jiraUrl("CI-8253"), title: "XXXLutz — Migrate SFTP integration for Rhenus Home Delivery (test → prod)", status: "Akzeptiert", statusCategory: "done", priority: "Medium", assignee: "Huy Pham", reporter: "Eric — Anh (CS)", issueType: "Task", createdDate: "2026-05-04", updatedDate: "2026-05-11", project: "CI" },
  { accountId: "xxxlutz", key: "CI-8251", url: jiraUrl("CI-8251"), title: "XXXLutz — Migrate SFTP integration for DHL Paket (test → prod)", status: "Akzeptiert", statusCategory: "done", priority: "Medium", assignee: "Huy Pham", reporter: "Eric — Anh (CS)", issueType: "Task", createdDate: "2026-05-04", updatedDate: "2026-05-11", project: "CI" },
  { accountId: "vodafone-de", key: "CI-8177", url: jiraUrl("CI-8177"), title: "Vodafone — Customize to hardcode timezone for Hermes Germany", status: "Akzeptiert", statusCategory: "done", priority: "Medium", assignee: "Sally Wong", reporter: "Eric — Anh (CS)", issueType: "Task", createdDate: "2026-04-20", updatedDate: "2026-05-04", project: "CI" },
  { accountId: "nespresso-mx", key: "CI-8165", url: jiraUrl("CI-8165"), title: "Nespresso Mexico — Register 2 new delivery modes (Estafeta 92 & 94)", status: "Akzeptiert", statusCategory: "done", priority: "High", assignee: "Huy Pham", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-04-16", updatedDate: "2026-04-20", project: "CI" },
  { accountId: "fiege", key: "CI-8104", url: jiraUrl("CI-8104"), title: "Fiege — Feasibility check to onboard Schmidt-Gevelsberg GmbH via public integration", status: "Akzeptiert", statusCategory: "done", priority: "Medium", assignee: "Thuan Nguyen (Bill)", reporter: "Eric — Anh (CS)", issueType: "Task", createdDate: "2026-04-08", updatedDate: "2026-04-10", project: "CI" },
  { accountId: "flaconi", key: "CI-7896", url: jiraUrl("CI-7896"), title: "Flaconi — Check feasibility: get scraping param from recipient_address postal code for PostNL", status: "Akzeptiert", statusCategory: "done", priority: "High", assignee: "Huy Pham", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-03-09", updatedDate: "2026-04-24", project: "CI" },
  // ── PUMA — 9 open High-priority tickets (live as of 2026-05-19) ────────────
  { accountId: "puma", key: "CI-7360", url: jiraUrl("CI-7360"), title: "PUMA — BUG: shipments are not getting booked", status: "Review", statusCategory: "indeterminate", priority: "High", assignee: "Lam Doan", reporter: "Janna — Chau (CS)", issueType: "Bug", createdDate: "2025-11-03", updatedDate: "2026-05-17", project: "CI" },
  { accountId: "puma", key: "CI-7705", url: jiraUrl("CI-7705"), title: "PUMA — EST — Reports: Lead time charts and report [PAUSED]", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Bianca Jimeno", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-01-22", updatedDate: "2026-04-12", project: "CI" },
  { accountId: "puma", key: "CI-7910", url: jiraUrl("CI-7910"), title: "PUMA — General improvements for Return Overview: search by Product Name", status: "Offen", statusCategory: "new", priority: "High", assignee: "Charlotte Roos", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-03-11", updatedDate: "2026-05-18", project: "CI" },
  { accountId: "puma", key: "CI-8102", url: jiraUrl("CI-8102"), title: "PUMA — EST — Calculate H19 event based on transit time requirements", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Ilham Othman", reporter: "Laure del Vecchio", issueType: "Task", createdDate: "2026-04-08", updatedDate: "2026-05-17", project: "CI" },
  { accountId: "puma", key: "CI-8137", url: jiraUrl("CI-8137"), title: "PUMA — Long PO report waiting time with >50k shipments", status: "Offen", statusCategory: "new", priority: "High", assignee: "Lam Doan", reporter: "Janna — Chau (CS)", issueType: "Bug", createdDate: "2026-04-13", updatedDate: "2026-05-13", project: "CI" },
  { accountId: "puma", key: "CI-8146", url: jiraUrl("CI-8146"), title: "PUMA — Check feasibility: text customization for Label CTA", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Charlotte Roos", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-04-14", updatedDate: "2026-05-17", project: "CI" },
  { accountId: "puma", key: "CI-8195", url: jiraUrl("CI-8195"), title: "PUMA — PTP: allow using HTML code for Search form text", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Charlotte Roos", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-04-22", updatedDate: "2026-05-18", project: "CI" },
  { accountId: "puma", key: "CI-8209", url: jiraUrl("CI-8209"), title: "PUMA — Critical API error investigation", status: "Offen", statusCategory: "new", priority: "High", assignee: "Tsani (Heimdall - CTOO)", reporter: "Janna — Chau (CS)", issueType: "Bug", createdDate: "2026-04-22", updatedDate: "2026-05-15", project: "CI" },
  { accountId: "puma", key: "CI-8296", url: jiraUrl("CI-8296"), title: "PUMA — Setup custom report for return shipments of SwissPost", status: "Offen", statusCategory: "new", priority: "High", assignee: "Quan Nguyen Minh", reporter: "Janna — Chau (CS)", issueType: "Task", createdDate: "2026-05-11", updatedDate: "2026-05-13", project: "CI" },
  // ── Vodafone ───────────────────────────────────────────────────────────────
  { accountId: "vodafone-de", key: "CI-8248", url: jiraUrl("CI-8248"), title: "Vodafone — Improve the PTP statistic display", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Charlotte Roos", reporter: "Eric — Anh (CS)", issueType: "Task", createdDate: "2026-05-04", updatedDate: "2026-05-18", project: "CI" },
  // ── Charles & Keith — 5 open High tickets (Skyquick invoice cluster) ───────
  { accountId: "charles-keith", key: "CI-8275", url: jiraUrl("CI-8275"), title: "Charles & Keith — Enhancement for case sensitivity issue", status: "Offen", statusCategory: "new", priority: "High", assignee: "Xiaoyue Zhang", reporter: "Wendy — Dy (CS)", issueType: "Task", createdDate: "2026-05-07", updatedDate: "2026-05-17", project: "CI" },
  { accountId: "charles-keith", key: "CI-8332", url: jiraUrl("CI-8332"), title: "Charles & Keith — Skyquick Freight Invoice processing", status: "Offen", statusCategory: "new", priority: "High", assignee: "The Nguyen", reporter: "Wendy — Dy (CS)", issueType: "Task", createdDate: "2026-05-14", updatedDate: "2026-05-14", project: "CI" },
  { accountId: "charles-keith", key: "CI-8333", url: jiraUrl("CI-8333"), title: "Charles & Keith — Skyquick Rate card processing (freight, duty & tax, other charges)", status: "Offen", statusCategory: "new", priority: "High", assignee: "Xiaoyue Zhang", reporter: "Wendy — Dy (CS)", issueType: "Task", createdDate: "2026-05-14", updatedDate: "2026-05-14", project: "CI" },
  { accountId: "charles-keith", key: "CI-8334", url: jiraUrl("CI-8334"), title: "Charles & Keith — Skyquick Invoice processing for duty & tax", status: "Offen", statusCategory: "new", priority: "High", assignee: "Xiaoyue Zhang", reporter: "Wendy — Dy (CS)", issueType: "Task", createdDate: "2026-05-14", updatedDate: "2026-05-14", project: "CI" },
  { accountId: "charles-keith", key: "CI-8337", url: jiraUrl("CI-8337"), title: "Charles & Keith — Invoice module: update Chargeable Weight column in Invoice Report", status: "Offen", statusCategory: "new", priority: "High", assignee: "Xiaoyue Zhang", reporter: "Wendy — Dy (CS)", issueType: "Task", createdDate: "2026-05-14", updatedDate: "2026-05-14", project: "CI" },
  // ── Nespresso Global / HQ ─────────────────────────────────────────────────
  { accountId: "nespresso", key: "CI-7764", url: jiraUrl("CI-7764"), title: "Nespresso Global — Shipping events missing / out of sync", status: "Offen", statusCategory: "new", priority: "High", assignee: "Ilham Othman", reporter: "Kai — Khai (CS)", issueType: "Bug", createdDate: "2026-02-02", updatedDate: "2026-05-13", project: "CI" },
  { accountId: "nespresso", key: "CI-7827", url: jiraUrl("CI-7827"), title: "Nespresso HQ — Solution for creating shipments from Order ID and adding tracking number afterwards", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Huy Pham", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-02-19", updatedDate: "2026-05-18", project: "CI" },
  { accountId: "nespresso", key: "CI-7983", url: jiraUrl("CI-7983"), title: "All Nespresso Accounts — PII data deletion rollout to production", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Tsani (Heimdall - CTOO)", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-03-20", updatedDate: "2026-05-14", project: "CI" },
  // ── Nespresso Brazil ───────────────────────────────────────────────────────
  { accountId: "nespresso-br", key: "CI-7863", url: jiraUrl("CI-7863"), title: "Nespresso Brazil — Enable visibility of carrier event received time (private integrations)", status: "Offen", statusCategory: "new", priority: "High", assignee: "Ilham Othman", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-02-27", updatedDate: "2026-04-08", project: "CI" },
  { accountId: "nespresso-br", key: "CI-8100", url: jiraUrl("CI-8100"), title: "Nespresso Brazil — Update warehouse postal code", status: "Offen", statusCategory: "new", priority: "High", assignee: "Huy Pham", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-04-07", updatedDate: "2026-04-29", project: "CI" },
  { accountId: "nespresso-br", key: "CI-8222", url: jiraUrl("CI-8222"), title: "Nespresso Brazil — [Matrix] Add city-level holidays into EDD calculation", status: "Offen", statusCategory: "new", priority: "High", assignee: "Quan Nguyen Minh", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-04-24", updatedDate: "2026-05-18", project: "CI" },
  { accountId: "nespresso-br", key: "CI-8316", url: jiraUrl("CI-8316"), title: "Nespresso Brazil — Update new EDD Lookup table [14 May]", status: "Offen", statusCategory: "new", priority: "High", assignee: "Quan Nguyen Minh", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-05-13", updatedDate: "2026-05-13", project: "CI" },
  { accountId: "nespresso-br", key: "CI-8350", url: jiraUrl("CI-8350"), title: "Nespresso Brazil — Yalo WhatsApp B2B Order Messaging / Notifications Integration Setup", status: "Offen", statusCategory: "new", priority: "High", assignee: "Sally Wong", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-05-18", updatedDate: "2026-05-18", project: "CI" },
  // ── Nespresso Greece ───────────────────────────────────────────────────────
  { accountId: "nespresso-gr", key: "CI-8159", url: jiraUrl("CI-8159"), title: "Nespresso Greece — Box Now Integration for Return Use Case", status: "Review", statusCategory: "indeterminate", priority: "High", assignee: "Xiaoyue Zhang", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-04-15", updatedDate: "2026-05-14", project: "CI" },
  { accountId: "nespresso-gr", key: "CI-8286", url: jiraUrl("CI-8286"), title: "Nespresso Greece — Feasibility to update Carrier SLA rules", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "The Nguyen", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-05-08", updatedDate: "2026-05-17", project: "CI" },
  { accountId: "nespresso-gr", key: "CI-8341", url: jiraUrl("CI-8341"), title: "Nespresso Greece — Feasibility to update E2E SLA rules", status: "Offen", statusCategory: "new", priority: "High", assignee: "The Nguyen", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-05-15", updatedDate: "2026-05-15", project: "CI" },
  // ── Nespresso Chile ────────────────────────────────────────────────────────
  { accountId: "nespresso-cl", key: "CI-8240", url: jiraUrl("CI-8240"), title: "Nespresso Chile — Onboard new carrier E-Darkstore via webhook integration", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Huy Pham", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-04-30", updatedDate: "2026-05-18", project: "CI" },
  { accountId: "nespresso-cl", key: "CI-8299", url: jiraUrl("CI-8299"), title: "Nespresso Chile — [Horizon] Update Carrier SLA for 3 new E-Darkstore delivery modes", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "The Nguyen", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-05-11", updatedDate: "2026-05-15", project: "CI" },
  { accountId: "nespresso-cl", key: "CI-8300", url: jiraUrl("CI-8300"), title: "Nespresso Chile — [Matrix] Update E2E SLA for 3 new E-Darkstore delivery modes", status: "Offen", statusCategory: "new", priority: "High", assignee: "Quan Nguyen Minh", reporter: "Kai — Khai (CS)", issueType: "Task", createdDate: "2026-05-11", updatedDate: "2026-05-11", project: "CI" },
  // ── Nespresso Austria ──────────────────────────────────────────────────────
  { accountId: "nespresso-at", key: "CI-8280", url: jiraUrl("CI-8280"), title: "Nespresso Austria — Support Withdrawal Function", status: "In Arbeit", statusCategory: "indeterminate", priority: "High", assignee: "Charlotte Roos", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-05-07", updatedDate: "2026-05-18", project: "CI" },
  // ── Nespresso Hungary ──────────────────────────────────────────────────────
  { accountId: "nespresso-hu", key: "CI-8304", url: jiraUrl("CI-8304"), title: "Nespresso Hungary — Feasibility: get parcel_id2 without new events via DHL Hungary Private API", status: "Offen", statusCategory: "new", priority: "High", assignee: "Huy Pham", reporter: "Abbey — Nghi (CS)", issueType: "Task", createdDate: "2026-05-12", updatedDate: "2026-05-17", project: "CI" },
];

function attachRealJira() {
  // Clear placeholder Jira and replace with real ticket data
  for (const a of accounts) a.jiraTickets = [];
  for (const t of realJiraTickets) {
    const a = accounts.find((x) => x.id === t.accountId);
    if (!a) continue;
    const { accountId: _aid, ...rest } = t;
    a.jiraTickets.push({ ...rest, source: "jira-api" });
  }
}
attachRealJira();

// --- Real Gmail threads from Gmail MCP --------------------------------------
// Pulled 2026-05-19 — last 60 days, filtered to customer-domain senders.

const realEmailThreads: (EmailThread & { accountId: string })[] = [
  // PUMA
  { accountId: "puma", id: "g-puma-1", subject: "Salesforce x Parcel Perform integration for withdrawal button", from: "Alexander Bartha <alexander.bartha@puma.com>", fromEmail: "alexander.bartha@puma.com", date: "2026-05-13T12:29:16Z", preview: "Customer Service Europe — request to integrate the withdrawal button between Salesforce and Parcel Perform." },
  { accountId: "puma", id: "g-puma-2", subject: "Re: PUMA x Parcel Perform Approach", from: "Alexander Bube <alexander.bube@puma.com>", fromEmail: "alexander.bube@puma.com", date: "2026-05-07T09:14:35Z", preview: "Follow-up on approach for the renewal cycle and Europe rollout sequencing." },
  { accountId: "puma", id: "g-puma-3", subject: "Re: New API Credential set", from: "Alexander Bartha <alexander.bartha@puma.com>", fromEmail: "alexander.bartha@puma.com", date: "2026-05-07T11:52:00Z", preview: "Confirmation of new API credential set delivery." },
  // Charles & Keith
  { accountId: "charles-keith", id: "g-ck-1", subject: "Reschedule Bi Weekly to 14th May", from: "Alfred LOW <Alfred.LOW@charleskeith.com>", fromEmail: "alfred.low@charleskeith.com", date: "2026-05-12T01:48:31Z", preview: "Bi-weekly sync moved to May 14 — agenda will follow." },
  { accountId: "charles-keith", id: "g-ck-2", subject: "Recall: (C&K x Parcel Perform) Invoice Module (Logistics Experience) Trial", from: "Alfred LOW <Alfred.LOW@charleskeith.com>", fromEmail: "alfred.low@charleskeith.com", date: "2026-05-06T08:24:20Z", preview: "Trial recall — DHL Freight invoice upload still stuck in processing." },
  // expondo
  { accountId: "expondo", id: "g-expondo-1", subject: "ODP: expondo: Upcoming changes impacting post-purchase communication", from: "Izabela Sawczak <i.sawczak@expondo.com>", fromEmail: "i.sawczak@expondo.com", date: "2026-05-12T06:20:01Z", preview: "Heads up on upcoming changes to expondo's post-purchase comms — needs PP team alignment." },
  // Nespresso (multi-country — assigned by content)
  { accountId: "nespresso-it", id: "g-nes-1", subject: "Parcel Perform — New DM91 Italmondo Ritiro con Facchinaggio", from: "Davide Marcon <Davide.Marcon@nespresso.com>", fromEmail: "davide.marcon@nespresso.com", date: "2026-05-08T08:50:03Z", preview: "Nespresso Italy — new delivery mode Italmondo Ritiro con Facchinaggio (DM91) registration." },
  { accountId: "nespresso", id: "g-nes-2", subject: "Automatic reply: Parcel Perform — Quarterly performance review meeting", from: "Bertrand Chabloz <Bertrand.Chabloz1@nespresso.com>", fromEmail: "bertrand.chabloz1@nespresso.com", date: "2026-05-08T08:49:30Z", preview: "Out-of-office auto-reply from Bertrand — QBR follow-up will need to wait." },
  { accountId: "nespresso-pt", id: "g-nes-3", subject: "RES: Parcel Perform — Missing Notifications", from: "Daniela Rocha <Daniela.Rocha1@nespresso.com>", fromEmail: "daniela.rocha1@nespresso.com", date: "2026-05-07T18:54:37Z", preview: "Nespresso Portugal flagging missing notification deliveries — needs investigation." },
  { accountId: "nespresso-th", id: "g-nes-4", subject: "RE: Order Tracking not EDI to Parcel Perform — Nespresso Thailand DONES72452533", from: "Khuanchanok Mutukan <khuanchanok.mutukan@kex-express.com>", fromEmail: "khuanchanok.mutukan@kex-express.com", date: "2026-05-08T02:38:25Z", preview: "KEX Express (carrier) confirming EDI tracking discrepancy for a Nespresso Thailand shipment." },
  // XXXLutz
  { accountId: "xxxlutz", id: "g-xxxl-1", subject: "AW: [EXTERNAL] Re: Parcel Perform x XXXLutz — Kafka Async Feedback flow", from: "V99 <V99@xxxlgroup.com>", fromEmail: "v99@xxxlgroup.com", date: "2026-05-12T09:27:00Z", preview: "XXXLutz IT confirming the Kafka async feedback flow setup — AVRO schema validation still failing." },
  // Vodafone
  { accountId: "vodafone-de", id: "g-vod-1", subject: "AW: DHL API Schnittstelle", from: "Thorsten Halbach <thorsten.halbach@vodafone.com>", fromEmail: "thorsten.halbach@vodafone.com", date: "2026-05-13T11:14:02Z", preview: "Vodafone SC Manager replying re: DHL API integration topic." },
];

function attachRealEmails() {
  for (const a of accounts) a.emailThreads = [];
  for (const t of realEmailThreads) {
    const a = accounts.find((x) => x.id === t.accountId);
    if (!a) continue;
    const { accountId: _aid, ...rest } = t;
    a.emailThreads.push(rest);
  }
}
attachRealEmails();

// --- Parcel Perform product data -------------------------------------------
// Real org/membership data pulled from the Parcel Perform admin MCP.
// The contract end date overrides our synthesized renewal anniversary —
// e.g. Nuki actually renews 2026-05-22 (3 days from today 2026-05-19), not the
// estimated June anniversary.

const ppAdmin = (slug: string) => `https://admin.parcelperform.com/merchant/${slug}/`;

const ppDataById: Record<string, ProductData> = {
  // Returns confirmed: CI-7910/8113/8296 Return Overview & report tickets; Slack RMA webhooks; Gmail withdrawal button
  puma: { ppOrgId: 5438, ppSlug: "pf7fc5bf378", ppName: "PUMA Europe GmbH", contractedVolumeAnnual: 6_000_000, ppUsers: 25, ppContractStart: "2026-02-28", ppContractEnd: "2028-02-27", ppModules: [1, 2, 4, 8], adminUrl: ppAdmin("pf7fc5bf378"), country: "US", organizationType: "enterprise" },
  xxxlutz: { ppOrgId: 6865, ppSlug: "p2eb02f9af1", ppName: "XXXLutz Group", contractedVolumeAnnual: 15_000_000, ppUsers: 36, ppContractStart: "2025-01-01", ppContractEnd: "2027-12-31", ppModules: [1, 2, 4], adminUrl: ppAdmin("p2eb02f9af1"), country: "AT", organizationType: "enterprise" },
  expondo: { ppOrgId: 2585, ppSlug: "p2300a45a7a", ppName: "Expondo", contractedVolumeAnnual: 1_200_000, ppUsers: 96, ppContractStart: "2025-01-01", ppContractEnd: "2027-01-02", ppModules: [1, 2, 4], adminUrl: ppAdmin("p2300a45a7a"), country: "DE", organizationType: "enterprise" },
  "vodafone-de": { ppOrgId: 5321, ppSlug: "p21193e8543", ppName: "Vodafone", contractedVolumeAnnual: 3_000_000, ppUsers: 19, ppContractStart: "2026-04-01", ppContractEnd: "2027-04-02", ppModules: [1, 2, 4], adminUrl: ppAdmin("p21193e8543"), country: "DE", organizationType: "enterprise" },
  // Cost Audit confirmed: CI-8332/8333/8334/8337 Skyquick invoice processing tickets; Slack "DHL Freight invoice upload" blocker
  "charles-keith": { ppOrgId: 5491, ppSlug: "pa8c9704fda", ppName: "Charles & Keith", contractedVolumeAnnual: 900_000, ppUsers: 43, ppContractStart: "2024-07-18", ppContractEnd: "2026-07-18", ppModules: [1, 2, 4, 32], adminUrl: ppAdmin("pa8c9704fda"), country: "SG", organizationType: "enterprise" },
  "ms-direct": { ppOrgId: 6036, ppSlug: "p32d43b05bf", ppName: "MS Direct", contractedVolumeAnnual: 500_000, ppUsers: 4, ppContractStart: "2026-03-31", ppContractEnd: "2027-03-30", ppModules: [2, 4], adminUrl: ppAdmin("p32d43b05bf"), country: "CH", organizationType: "enterprise" },
  "nespresso-mx": { ppOrgId: 2831, ppSlug: "pc8203a0148", ppName: "Nespresso Mexico", contractedVolumeAnnual: 296_135, ppUsers: 29, ppContractStart: "2025-01-01", ppContractEnd: "2027-01-02", ppModules: [1, 2, 4], adminUrl: ppAdmin("pc8203a0148"), country: "MX", organizationType: "enterprise" },
  // SLA confirmed: CI-8299 [Horizon] Carrier SLA update for E-Darkstore; CI-8300 [Matrix] E2E SLA update
  "nespresso-cl": { ppOrgId: 4526, ppSlug: "p4fbec0bf10", ppName: "Nespresso Chile", contractedVolumeAnnual: 120_000, ppUsers: 18, ppContractStart: "2025-01-01", ppContractEnd: "2027-01-02", ppModules: [1, 2, 4, 128], adminUrl: ppAdmin("p4fbec0bf10"), country: "CL", organizationType: "enterprise" },
  "nespresso-at": { ppOrgId: 3748, ppSlug: "p20ec38750f", ppName: "Nespresso Austria", contractedVolumeAnnual: 812_243, ppUsers: 25, ppContractStart: "2025-01-01", ppContractEnd: "2027-01-02", ppModules: [1, 2, 4], adminUrl: ppAdmin("p20ec38750f"), country: "AT", organizationType: "enterprise" },
  limango: { ppOrgId: 4707, ppSlug: "p816b010016", ppName: "Limango", contractedVolumeAnnual: 2_000_000, ppUsers: 7, ppContractStart: "2026-02-28", ppContractEnd: "2027-05-28", ppModules: [2, 4], adminUrl: ppAdmin("p816b010016"), country: "DE", organizationType: "enterprise" },
  "bettzeit-emma": { ppOrgId: 3624, ppSlug: "p6d25cda79a", ppName: "EMMA", contractedVolumeAnnual: 6_000_000, ppUsers: 248, ppContractStart: "2025-08-28", ppContractEnd: "2026-08-29", ppModules: [1, 2, 4], adminUrl: ppAdmin("p6d25cda79a"), country: "GB", organizationType: "enterprise" },
  // AI VIS confirmed: Slack kickoff visit report posted (onboarding, credit utilization, prompting strategy); CEO-level demo completed
  flaconi: { ppOrgId: 6035, ppSlug: "p2771141cf8", ppName: "Flaconi Production", contractedVolumeAnnual: 10_000_000, ppUsers: 48, ppContractStart: "2026-03-31", ppContractEnd: "2027-03-30", ppModules: [2, 4, 16], adminUrl: ppAdmin("p2771141cf8"), country: "DE", organizationType: "enterprise" },
  byrd: { ppOrgId: 5029, ppSlug: "p389f6644a3", ppName: "Byrd", contractedVolumeAnnual: 2_000_000, ppUsers: 6, ppContractStart: "2025-03-01", ppContractEnd: "2027-03-02", ppModules: [1, 2, 4], adminUrl: ppAdmin("p389f6644a3"), country: "AT", organizationType: "enterprise" },
  fiege: { ppOrgId: 5758, ppSlug: "p344a9e0bf8", ppName: "Fiege", contractedVolumeAnnual: 100_000, ppUsers: 2, ppContractStart: "2026-02-27", ppContractEnd: "2027-02-26", ppModules: [4], adminUrl: ppAdmin("p344a9e0bf8"), country: "DE", organizationType: "enterprise" },
  zenfulfillment: { ppOrgId: 4740, ppSlug: "p66f7cecf7e", ppName: "Zenfulfillment", contractedVolumeAnnual: 1_000_000, ppUsers: 10, ppContractStart: "2023-02-18", ppContractEnd: "2027-02-18", ppModules: [1, 2, 4], adminUrl: ppAdmin("p66f7cecf7e"), country: "DE", organizationType: "enterprise" },
  nuki: { ppOrgId: 4538, ppSlug: "p724c066acc", ppName: "Nuki", contractedVolumeAnnual: 200_000, ppUsers: 84, ppContractStart: "2025-05-21", ppContractEnd: "2026-05-22", ppModules: [1, 2, 4], adminUrl: ppAdmin("p724c066acc"), country: "AT", organizationType: "enterprise" },
  motea: { ppOrgId: 4384, ppSlug: "p2514e4e5da", ppName: "MOTEA - MOTORRAD. EINFACH. ONLINE", contractedVolumeAnnual: 550_000, ppUsers: 10, ppContractStart: "2026-04-13", ppContractEnd: "2029-04-13", ppModules: [1, 2, 4], adminUrl: ppAdmin("p2514e4e5da"), country: "DE", organizationType: "enterprise" },
  "waterdrop-at": { ppOrgId: 4364, ppSlug: "p2d7bcf6f85", ppName: "Waterdrop", contractedVolumeAnnual: 1_500_000, ppUsers: 29, ppContractStart: "2026-04-19", ppContractEnd: "2027-04-18", ppModules: [2, 4], adminUrl: ppAdmin("p2d7bcf6f85"), country: "AT", organizationType: "enterprise" },
  sfs: { ppOrgId: 5164, ppSlug: "pe18eb37c86", ppName: "SFS Group Schweiz AG", contractedVolumeAnnual: 650_000, ppUsers: 10, ppContractStart: "2023-06-22", ppContractEnd: "2026-06-22", ppModules: [1, 2, 4], adminUrl: ppAdmin("pe18eb37c86"), country: "CH", organizationType: "enterprise" },
  alaiko: { ppOrgId: 3886, ppSlug: "pa44806b6e7", ppName: "Alaiko GmbH", contractedVolumeAnnual: 600_000, ppUsers: 11, ppContractStart: "2024-11-18", ppContractEnd: "2026-11-19", ppModules: [2, 4], adminUrl: ppAdmin("pa44806b6e7"), country: "DE", organizationType: "enterprise" },
  everstox: { ppOrgId: 4478, ppSlug: "p639895098c", ppName: "everstox", contractedVolumeAnnual: 2_000_000, ppUsers: 23, ppContractStart: "2026-03-30", ppContractEnd: "2027-03-29", ppModules: [1, 2, 4], adminUrl: ppAdmin("p639895098c"), country: "DE", organizationType: "enterprise" },
  "seven-senders": { ppOrgId: 1422, ppSlug: "pa79f37570e", ppName: "SevenSenders", contractedVolumeAnnual: 2_400_000, ppUsers: 0, ppContractStart: "2025-11-02", ppContractEnd: "2026-11-03", ppModules: [1, 2, 4], adminUrl: ppAdmin("pa79f37570e"), country: "DE", organizationType: "enterprise" },
  // Nespresso country units — modules inferred from Jira tickets, Slack signals, Gmail threads, and user counts
  // All markets have been on the platform ≥ 2 years; [1,2,4] = standard Tracking + Notifications + Post-Purchase package
  "nespresso-uk": { ppOrgId: 4797, ppSlug: "p65f4510dc7", ppName: "Nespresso UK", contractedVolumeAnnual: 0, ppUsers: 385, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p65f4510dc7"), country: "GB", organizationType: "enterprise" },
  "nespresso-ch": { ppOrgId: 4791, ppSlug: "p4dac4840f6", ppName: "Nespresso Switzerland", contractedVolumeAnnual: 0, ppUsers: 222, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p4dac4840f6"), country: "CH", organizationType: "enterprise" },
  "nespresso-ca": { ppOrgId: 3883, ppSlug: "p559ab7b0f7", ppName: "Nespresso Canada", contractedVolumeAnnual: 0, ppUsers: 348, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p559ab7b0f7"), country: "CA", organizationType: "enterprise" },
  "nespresso-anz": { ppOrgId: 4050, ppSlug: "p4700594191", ppName: "Nespresso Australia", contractedVolumeAnnual: 0, ppUsers: 168, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p4700594191"), country: "AU", organizationType: "enterprise" },
  "nespresso-nl": { ppOrgId: 1594, ppSlug: "p91c4b0ea1d", ppName: "Nespresso Netherlands", contractedVolumeAnnual: 0, ppUsers: 178, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p91c4b0ea1d"), country: "NL", organizationType: "enterprise" },
  // EDD confirmed: CI-8222 [Matrix] city-level holidays in EDD calculation; CI-8316 EDD Lookup table update
  "nespresso-br": { ppOrgId: 4407, ppSlug: "pff3c787c3c", ppName: "Nespresso Brazil", contractedVolumeAnnual: 0, ppUsers: 150, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4, 64], adminUrl: ppAdmin("pff3c787c3c"), country: "BR", organizationType: "enterprise" },
  "nespresso-be": { ppOrgId: 3719, ppSlug: "pd0ae3a4844", ppName: "Nespresso Belgium", contractedVolumeAnnual: 0, ppUsers: 97, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("pd0ae3a4844"), country: "BE", organizationType: "enterprise" },
  // Returns confirmed: CI-8159 Box Now Integration for Return Use Case (status: Review); SLA in feasibility only
  "nespresso-gr": { ppOrgId: 4441, ppSlug: "p1806673af0", ppName: "Nespresso Greece", contractedVolumeAnnual: 0, ppUsers: 93, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4, 8], adminUrl: ppAdmin("p1806673af0"), country: "GR", organizationType: "enterprise" },
  // Slack: "Carrier & E2E SLA update — 13 mandays scoped"
  "nespresso-cz": { ppOrgId: 4443, ppSlug: "pc618a5b2fd", ppName: "Nespresso Czech Republic", contractedVolumeAnnual: 0, ppUsers: 42, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("pc618a5b2fd"), country: "CZ", organizationType: "enterprise" },
  // CI-8304 DHL Hungary private API integration
  "nespresso-hu": { ppOrgId: 4442, ppSlug: "p34c346031a", ppName: "Nespresso Hungary", contractedVolumeAnnual: 0, ppUsers: 37, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p34c346031a"), country: "HU", organizationType: "enterprise" },
  "nespresso-ar": { ppOrgId: 4528, ppSlug: "pe42d2cb5fc", ppName: "Nespresso Argentina", contractedVolumeAnnual: 0, ppUsers: 35, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("pe42d2cb5fc"), country: "AR", organizationType: "enterprise" },
  "nespresso-pl": { ppOrgId: 6022, ppSlug: "p40d3809129", ppName: "Nespresso Poland", contractedVolumeAnnual: 0, ppUsers: 29, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p40d3809129"), country: "PL", organizationType: "enterprise" },
  // Emerging LATAM market (since 2023) — Tracking + Notifications confirmed; PTP not yet rolled out
  "nespresso-co": { ppOrgId: 4530, ppSlug: "p7e7ffb2796", ppName: "Nespresso Colombia", contractedVolumeAnnual: 0, ppUsers: 19, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2], adminUrl: ppAdmin("p7e7ffb2796"), country: "CO", organizationType: "enterprise" },
  // Gmail: "Missing Notifications" — confirms Notifications module active
  "nespresso-pt": { ppOrgId: 1595, ppSlug: "pb40340d1ba", ppName: "Nespresso Portugal", contractedVolumeAnnual: 0, ppUsers: 18, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("pb40340d1ba"), country: "PT", organizationType: "enterprise" },
  "nespresso-kr": { ppOrgId: 4656, ppSlug: "p49ce23e8f9", ppName: "Nespresso Korea", contractedVolumeAnnual: 0, ppUsers: 15, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p49ce23e8f9"), country: "KR", organizationType: "enterprise" },
  "nespresso-hk": { ppOrgId: 4059, ppSlug: "p1d3364fdef", ppName: "Nespresso Hong Kong", contractedVolumeAnnual: 0, ppUsers: 14, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p1d3364fdef"), country: "HK", organizationType: "enterprise" },
  "nespresso-nordics": { ppOrgId: 4445, ppSlug: "p2c74510ea8", ppName: "Nespresso Nordics", contractedVolumeAnnual: 0, ppUsers: 13, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p2c74510ea8"), country: "DK", organizationType: "enterprise" },
  // Gmail: "Order Tracking not EDI to Parcel Perform" — confirms Tracking module
  "nespresso-th": { ppOrgId: 1596, ppSlug: "p28ec2800b2", ppName: "Nespresso Thailand", contractedVolumeAnnual: 0, ppUsers: 12, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p28ec2800b2"), country: "TH", organizationType: "enterprise" },
  // Gmail: new delivery mode DM91 Italmondo — confirms Tracking module
  "nespresso-it": { ppOrgId: 4042, ppSlug: "p0fb8a1ce52", ppName: "Nespresso Italy", contractedVolumeAnnual: 0, ppUsers: 16, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p0fb8a1ce52"), country: "IT", organizationType: "enterprise" },
  // CI-7764 shipping events, CI-7827 shipments from Order ID, CI-7983 PII deletion rollout
  nespresso: { ppOrgId: 1171, ppSlug: "p24d961cf8d", ppName: "Nespresso HQ", contractedVolumeAnnual: 0, ppUsers: 17, ppContractStart: "", ppContractEnd: "", ppModules: [1, 2, 4], adminUrl: ppAdmin("p24d961cf8d"), country: "CH", organizationType: "enterprise" },
};

function attachProductData() {
  for (const a of accounts) {
    const pp = ppDataById[a.id];
    if (!pp) continue;
    a.product = pp;
    // Real PP contract end overrides our synthesized renewal anniversary
    if (pp.ppContractEnd) {
      a.renewalDate = pp.ppContractEnd;
      a.contractStart = pp.ppContractStart || a.contractStart;
    }
  }
}
attachProductData();

// --- Real shipment counts pulled from PP admin (2026-05-13) -----------------
// Each entry: { shipments in current contract year, period start }.
// Usage % = shipments / contracted annual × 100.
// C&K contracted volume corrected to 900,000 (from PP admin plan_name) → 843,927/900,000 = 93.8%.

const realUsageById: Record<string, { shipments: number; periodStart: string }> = {
  "charles-keith": { shipments: 843927, periodStart: "2025-07-18" },
  puma: { shipments: 629895, periodStart: "2026-02-28" },
  xxxlutz: { shipments: 383007, periodStart: "2026-01-01" },
  expondo: { shipments: 169657, periodStart: "2026-01-01" },
  "vodafone-de": { shipments: 495990, periodStart: "2026-04-01" },
  "bettzeit-emma": { shipments: 3534183, periodStart: "2025-08-28" },
  flaconi: { shipments: 1318354, periodStart: "2026-03-31" },
  "ms-direct": { shipments: 73197, periodStart: "2026-03-31" },
  "nespresso-mx": { shipments: 91125, periodStart: "2026-01-01" },
  "nespresso-cl": { shipments: 19224, periodStart: "2026-01-01" },
  "nespresso-at": { shipments: 303496, periodStart: "2026-01-01" },
  limango: { shipments: 322106, periodStart: "2026-02-28" },
  byrd: { shipments: 224610, periodStart: "2026-03-01" },
  fiege: { shipments: 2381, periodStart: "2026-02-27" },
  zenfulfillment: { shipments: 982, periodStart: "2026-02-18" },
  nuki: { shipments: 153526, periodStart: "2025-05-21" },
  motea: { shipments: 65529, periodStart: "2026-04-13" },
  "waterdrop-at": { shipments: 86120, periodStart: "2026-04-19" },
  sfs: { shipments: 496838, periodStart: "2025-06-22" },
  alaiko: { shipments: 380720, periodStart: "2025-11-18" },
  everstox: { shipments: 276401, periodStart: "2026-03-30" },
  "seven-senders": { shipments: 1425039, periodStart: "2025-11-02" },
};

function attachRealUsage() {
  for (const a of accounts) {
    const usage = realUsageById[a.id];
    if (!usage || !a.product) continue;
    const annual = a.product.contractedVolumeAnnual;
    const pct = annual > 0 ? (usage.shipments / annual) * 100 : 0;
    a.product.currentPeriodShipments = usage.shipments;
    a.product.currentPeriodStart = usage.periodStart;
    a.product.currentPeriodUsagePct = pct;
    // Override the synthesized productUsage with the real percentage (cap at 999 for sanity)
    a.productUsage = Math.min(999, Math.round(pct));
  }
}
attachRealUsage();

// --- Last customer login (PP admin org users, excluding @parcelperform.com) -
// Partially refreshed 2026-05-19 (PUMA, Nuki, C&K, Vodafone, Nespresso AT, Everstox).
// Remaining accounts carry forward from 2026-05-13 snapshot.
// "Customer user" = anyone whose email is NOT @parcelperform.com.

type LastLoginEntry = { date: string | null; email?: string; name?: string };

const lastLoginById: Record<string, LastLoginEntry> = {
  // Refreshed 2026-05-19:
  puma: { date: "2026-05-19", email: "marcoantonio.guaschi@concentrix.com" },
  nuki: { date: "2026-05-19", email: "mohamed.jemni@5ca.com" },
  "charles-keith": { date: "2026-05-19", email: "desmond.wong@charleskeith.com" },
  everstox: { date: "2026-05-19", email: "vladan.vasic@everstox.com" },
  "vodafone-de": { date: "2026-05-18", email: "mike.limke1@vodafone.com" },
  "nespresso-at": { date: "2026-05-18", email: "philip.konvicka@nestle.com" },
  // Carried forward from 2026-05-13 snapshot:
  "nespresso-mx": { date: "2026-05-13", email: "yessicaisabel.pazaran@nestle.com" },
  flaconi: { date: "2026-05-13", email: "sebastian.wieloch@flaconi.de" },
  "bettzeit-emma": { date: "2026-05-13", email: "bastien.jausseran@emma-sleep.com" },
  xxxlutz: { date: "2026-05-13", email: "julian.zipfel@xxxl.digital" },
  expondo: { date: "2026-05-13", email: "h.mahmoud.external@expondo.com" },
  "nespresso-cl": { date: "2026-05-08", email: "adria.ferret@nestle.com" },
  motea: { date: "2026-05-08", email: "stefan.keller@motea.com" },
  byrd: { date: "2026-05-04", email: "developers@getbyrd.com" },
  "ms-direct": { date: "2026-05-04", email: "ana.petrovic.ext@ms-direct.ch" },
  limango: { date: "2026-04-28", email: "kordian.kramek@limango.com" },
  fiege: { date: "2026-04-09", email: "axel.schubert@big-picture.com" },
  alaiko: { date: "2026-03-10", email: "aurimas.rimkus@zenfulfillment.com" },
  "waterdrop-at": { date: "2026-01-28", email: "tung.nguyen@waterdrop.com" },
  sfs: { date: "2026-01-12", email: "harald.senn@sfs.ch" },
  zenfulfillment: { date: "2025-12-29", email: "ievgen.demchenko@zenfulfillment.com" },
  "seven-senders": { date: null }, // No non-PP user has ever logged in
};

function attachLastLogin() {
  for (const a of accounts) {
    const entry = lastLoginById[a.id];
    if (!entry || !a.product) continue;
    a.product.lastCustomerLoginDate = entry.date;
    a.product.lastCustomerLoginEmail = entry.email;
    a.product.lastCustomerLoginName = entry.name;
  }
}
attachLastLogin();


// --- Meeting briefs for the most strategic accounts -------------------------
function attachBrief(accountId: string, brief: Account["briefs"][number]) {
  const a = accounts.find((x) => x.id === accountId);
  if (a) a.briefs.push(brief);
}

attachBrief("limango", {
  id: "brief-limango",
  accountId: "limango",
  meetingDate: "2026-05-18",
  meetingType: "Renewal",
  attendees: ["Katrin Voringer", "Daniela Zavelca", "Daniel Schechter"],
  agenda: [
    "Status of 2025/26 renewal — recovery options",
    "Adoption review and root cause of zero recent invoicing",
    "Commercial path for 2026/27 cycle",
    "Decision point: renew, restructure, or wind down",
  ],
  keyPoints: [
    "Limango is the only account in the book explicitly flagged At Risk in HubSpot.",
    "Recent deal value is zero — relationship is functionally inactive.",
    "Two BDM-to-KAM handover items are open from January and February — clear them on this call.",
  ],
  openRisks: [
    "At-risk flag set in CRM.",
    "No closed-won activity in recent cycle.",
    "Thin sponsor coverage (only 9 contacts, 1 confirmed champion).",
  ],
  recentActivity: [
    "Katrin Voringer remains the engaged sponsor for Digital Services & Ops.",
    "Engineering lead Daniela Zavelca is reachable for technical discussion.",
  ],
  recommendedAsks: [
    "Get a clear renew / restructure / churn decision from Katrin.",
    "If renewing, agree adoption guarantees tied to a commercial credit.",
    "Schedule a follow-up within 14 days with a clear next step.",
  ],
});

attachBrief("everstox", {
  id: "brief-everstox",
  accountId: "everstox",
  meetingDate: "2026-05-21",
  meetingType: "Renewal",
  attendees: ["Johannes Tress", "Florian Bunk", "Daniel Schechter"],
  agenda: [
    "BDM-to-KAM handover summary — close out December and March tasks",
    "2026-2027 renewal commercial review",
    "2027-2028 expansion scope — Carrier Manager input",
    "Founder-level relationship reset",
  ],
  keyPoints: [
    "Founder-led account; Johannes Tress is exec sponsor.",
    "Two handover backlog items from BDM still open — bring them to closure.",
    "Last logged sales touch is ~30 days old; this meeting is the re-engagement moment.",
  ],
  openRisks: [
    "Two stale handover tasks still open.",
    "Sales touch cadence is slipping (~30 days).",
  ],
  recentActivity: [
    "9 lifetime deals across a 4-year relationship.",
    "Niklas Binter (Head of Growth) and Maximilian Gebuhr (Carrier) remain active.",
  ],
  recommendedAsks: [
    "Confirm 2026-2027 renewal commercial direction.",
    "Get verbal alignment on 2027-2028 expansion scope.",
    "Set a recurring quarterly cadence with Florian.",
  ],
});

attachBrief("puma", {
  id: "brief-puma",
  accountId: "puma",
  meetingDate: "2026-05-26",
  meetingType: "QBR",
  attendees: ["Alexander Bube", "Andrea Faretta", "Frederic Le Nouaille", "Daniel Schechter"],
  agenda: [
    "Q1 performance: fulfillment SLA and CX metrics",
    "PUMA renewal 2026/2027 framing",
    "Post-purchase notification expansion — Europe rollout map",
    "Account scorecard and reference opportunity",
  ],
  keyPoints: [
    "Tier-1 ICP and currently the highest ARR in the book.",
    "Score 54 — healthy but not flagship; close the gap with a strong QBR.",
    "Renewal handover task from March is still open — clear it.",
  ],
  openRisks: [
    "March handover BDM-to-KAM task still open.",
    "Coverage concentrated in Fulfillment EU — expand to CS leadership.",
  ],
  recentActivity: [
    "Active engagement today across multiple PUMA contacts.",
    "15 lifetime deals — long-standing commercial relationship.",
  ],
  recommendedAsks: [
    "Get verbal commitment on 2026/2027 renewal direction.",
    "Secure a reference opportunity (case study or panel).",
    "Lock the post-purchase notification expansion scope by EOQ.",
  ],
});

attachBrief("vodafone-de", {
  id: "brief-vodafone",
  accountId: "vodafone-de",
  meetingDate: "2026-05-20",
  meetingType: "Exec Sync",
  attendees: ["Oliver Hobes", "Thorsten Halbach", "Daniel Schechter"],
  agenda: [
    "1M → 2M shipment upsell — close the last open items from January handover",
    "Post-purchase notification SLA review",
    "Application Manager SAP alignment on integration health",
    "Renewal direction for late-2026 cycle",
  ],
  keyPoints: [
    "Active expansion motion in progress (1M → 2M shipments).",
    "Two BDM-to-KAM handover items from January still open.",
    "Score 8 — healthy by activity but Vodafone wants stronger strategic narrative.",
  ],
  openRisks: [
    "Stale handover tasks from January and March.",
    "Score is low (8); narrative depth matters in this account.",
  ],
  recentActivity: [
    "Engagement two weeks ago with logistics strategy.",
    "Strong technical alignment across SC, Logistics Strategy, and SAP application teams.",
  ],
  recommendedAsks: [
    "Confirm 1M → 2M expansion sign-off.",
    "Get Oliver's view on 2026 renewal commercial framing.",
    "Schedule SAP integration health check with Galina.",
  ],
});

attachBrief("flaconi", {
  id: "brief-flaconi",
  accountId: "flaconi",
  meetingDate: "2026-05-22",
  meetingType: "Check-in",
  attendees: ["Kjell Klingenberg", "Adeel Younas", "Daniel Schechter"],
  agenda: [
    "Marketing re-engagement follow-up (Q1 email campaign signals)",
    "Open pipeline deal — closure plan",
    "Technical roadmap with VP Engineering",
    "Tier-1 strategic relationship cadence",
  ],
  keyPoints: [
    "Tier-1 ICP with VP Ops and VP Engineering both engaged.",
    "Active marketing signals indicate buying interest.",
    "One open deal in pipeline — confirm close path.",
  ],
  openRisks: [
    "Marketing follow-up task still open from January.",
  ],
  recentActivity: [
    "Engagement within the last week.",
    "Strong cross-functional coverage (Ops, Eng, Product).",
  ],
  recommendedAsks: [
    "Close out the marketing follow-up loop.",
    "Get clarity on open deal timing.",
    "Establish a quarterly exec sync with Kjell.",
  ],
});

// --- Action items from open HubSpot tasks (priority: HIGH → high, MEDIUM → medium, NONE → low) ---
const today = TODAY;
function ageStatus(dueDateISO: string): { priority: ActionItem["priority"] } {
  const days = (today.getTime() - new Date(dueDateISO).getTime()) / 86_400_000;
  if (days > 60) return { priority: "urgent" };
  return { priority: "high" };
}

export const actionItems: ActionItem[] = [
  // ── Timely actions derived from live signals (added 2026-05-19) ────────────
  {
    id: "task-nuki-renewal",
    accountId: "nuki",
    accountName: "Nuki",
    title: "Confirm Nuki renewal — contract expires Friday 22 May",
    description: "PP contract (200k shipments/yr) ends 2026-05-22 in 3 days. Confirm renewal terms with Daniel Wolf (Graz) before the contract lapses.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-05-21",
    owner: OWNER,
  },
  {
    id: "task-puma-api-bug",
    accountId: "puma",
    accountName: "PUMA",
    title: "PUMA CI-8209 — critical API error needs escalation",
    description: "Open since 2026-04-22, assigned to Tsani (CTOO). Confirm investigation status before QBR on 26 May.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-05-22",
    owner: OWNER,
    url: "https://parcelperform.atlassian.net/browse/CI-8209",
  },
  {
    id: "task-ck-renewal-prep",
    accountId: "charles-keith",
    accountName: "Charles & Keith Group",
    title: "Start C&K renewal prep — contract ends 2026-07-18",
    description: "60 days to renewal. 5 open Jira tickets (Skyquick invoice cluster) and 93.8% volume usage. Prepare commercial brief and schedule QBR.",
    priority: "high",
    status: "open",
    dueDate: "2026-06-06",
    owner: OWNER,
  },
  {
    id: "task-sfs-renewal-prep",
    accountId: "sfs",
    accountName: "SFS",
    title: "SFS renewal in 34 days — schedule exec conversation",
    description: "Contract ends 2026-06-22. Last customer login was January. Low engagement risk — set up a call with Harald Senn before end of May.",
    priority: "high",
    status: "open",
    dueDate: "2026-05-29",
    owner: OWNER,
  },
  // ── HubSpot open tasks (owner: Daniel Schechter, as of 2026-05-19) ─────────
  {
    id: "task-98454533390",
    accountId: "puma",
    accountName: "PUMA",
    title: "Follow up with PUMA",
    description: "Regarding meeting logged 11 December 2025. Long overdue — reach out today.",
    priority: "urgent",
    status: "open",
    dueDate: "2025-12-18",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/98454533390",
  },
  {
    id: "task-99119312304",
    accountId: "everstox",
    accountName: "everstox",
    title: "BDM-to-KAM handover — Renewal & Upsell 2026-2027",
    description: "Align with Dana, prepare carrier assessment / presentations / NDAs / signed CO, capture stakeholders & billing.",
    priority: "urgent",
    status: "open",
    dueDate: "2025-12-22",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/99119312304",
  },
  {
    id: "task-99419676758",
    accountId: "byrd",
    accountName: "byrd technologies GmbH",
    title: "Follow up with David Mirzaei (byrd)",
    description: "Director of Marketing engaged via the PUDO API customer-delight email campaign.",
    priority: "urgent",
    status: "open",
    dueDate: "2025-12-25",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/99419676758",
  },
  {
    id: "task-100618761618",
    accountId: "limango",
    accountName: "Limango",
    title: "BDM-to-KAM handover — Limango Renewal 2025/2026",
    description: "Prepare full renewal package: carrier assessment, presentations, NDAs, signed CO, billing info, upsell opportunities.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-11",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/100618761618",
  },
  {
    id: "task-100942858405",
    accountId: "flaconi",
    accountName: "Flaconi GmbH",
    title: "Follow up on marketing engagement (Flaconi alerts inbox)",
    description: "parcelperform.alerts@flaconi.de clicked the weekly secret parcel customer campaign — confirm right human contact and re-route.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-15",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/100942858405",
  },
  {
    id: "task-101380810882",
    accountId: "zenfulfillment",
    accountName: "Zenfulfillment",
    title: "BDM-to-KAM handover — Renewal 2026-2027",
    description: "Carrier assessment, presentations, NDAs, signed CO, stakeholder map, billing info, upsell opportunities.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-19",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/101380810882",
  },
  {
    id: "task-101413617517",
    accountId: "vodafone-de",
    accountName: "Vodafone Germany",
    title: "BDM-to-KAM handover — Vodafone 2M core and notify",
    description: "Prepare full handover pack for the core platform + notify expansion.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-19",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/101413617517",
  },
  {
    id: "task-101599691362",
    accountId: "fiege",
    accountName: "Fiege",
    title: "Upgrade subscription tier to 1M",
    description: "Please upgrade the current subscription to the 1 million tier (cc: Fiona, Abbey — Customer Success).",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-22",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/101599691362",
  },
  {
    id: "task-101661334860",
    accountId: "byrd",
    accountName: "byrd technologies GmbH",
    title: "Follow up with David Mirzaei (byrd) — campaign #33",
    description: "Second marketing engagement signal from byrd's Director of Marketing.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-01-23",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/101661334860",
  },
  {
    id: "task-104927354509",
    accountId: "limango",
    accountName: "Limango",
    title: "BDM-to-KAM handover — Limango Renewal 2026/2027",
    description: "Second Limango handover task (next renewal cycle) — overdue.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-02-26",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/104927354509",
  },
  {
    id: "task-105258996616",
    accountId: "puma",
    accountName: "PUMA",
    title: "BDM-to-KAM handover — PUMA Renewal 2026/2027",
    description: "Prepare full renewal package for PUMA.",
    priority: "urgent",
    status: "open",
    dueDate: "2026-03-02",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/105258996616",
  },
  {
    id: "task-105761631091",
    accountId: "everstox",
    accountName: "everstox",
    title: "BDM-to-KAM handover — Renewal & Upsell 2027-2028",
    description: "Forward-looking renewal cycle handover.",
    priority: "high",
    status: "open",
    dueDate: "2026-03-08",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/105761631091",
  },
  {
    id: "task-105843965534",
    accountId: "xxxlutz",
    accountName: "XXXLutz KG",
    title: "BDM-to-KAM handover — Kafka async feedback setup",
    description: "Technical scope: set up async feedback for shipment creation on Kafka.",
    priority: "high",
    status: "open",
    dueDate: "2026-03-09",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/105843965534",
  },
  {
    id: "task-106018074945",
    accountId: "nespresso-ar",
    accountName: "Nespresso Argentina",
    title: "BDM-to-KAM handover — Nespresso Argentina Renewal 2026",
    description: "Prepare Argentina renewal handover package.",
    priority: "high",
    status: "open",
    dueDate: "2026-03-12",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/106018074945",
  },
  {
    id: "task-106081406244",
    accountId: "vodafone-de",
    accountName: "Vodafone Germany",
    title: "BDM-to-KAM handover — 1M to 2M shipments Post-Purchase upsell",
    description: "Expansion handover for Vodafone DE Post-Purchase volume tier.",
    priority: "high",
    status: "open",
    dueDate: "2026-03-13",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/106081406244",
  },
  {
    id: "task-106190977924",
    accountId: "nespresso-cz",
    accountName: "Nespresso Czech Republic & Slovakia",
    title: "BDM-to-KAM handover — SLA update (Carrier & E2E)",
    description: "Czech & Slovakia SLA update handover for both carrier and end-to-end scope.",
    priority: "high",
    status: "open",
    dueDate: "2026-03-14",
    owner: OWNER,
    url: "https://app.hubspot.com/contacts/2453247/engagement/106190977924",
  },
];

// --- Helpers used by pages -------------------------------------------------
export function getAccount(id: string) {
  return accounts.find((a) => a.id === id);
}

export function getAllBriefs() {
  return accounts.flatMap((a) => a.briefs.map((b) => ({ ...b, account: a })));
}

export function getBrief(briefId: string) {
  for (const a of accounts) {
    const b = a.briefs.find((br) => br.id === briefId);
    if (b) return { brief: b, account: a };
  }
  return null;
}

export function getActionsForAccount(accountId: string) {
  return actionItems.filter((a) => a.accountId === accountId);
}
