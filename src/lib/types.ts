export type HealthStatus = "healthy" | "watch" | "at_risk" | "critical";

export type ActionPriority = "low" | "medium" | "high" | "urgent";

export type ActionStatus = "open" | "in_progress" | "blocked" | "done";

export type RiskSeverity = "low" | "medium" | "high";

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  isChampion?: boolean;
  isExecutiveSponsor?: boolean;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  openedOn: string; // ISO date
  owner: string;
}

export interface ActionItem {
  id: string;
  accountId: string;
  accountName: string;
  title: string;
  description: string;
  priority: ActionPriority;
  status: ActionStatus;
  dueDate: string; // ISO date
  owner: string;
}

export interface ActivityEvent {
  id: string;
  date: string; // ISO date
  type: "meeting" | "email" | "support" | "note" | "milestone";
  summary: string;
}

export interface MeetingBrief {
  id: string;
  accountId: string;
  meetingDate: string; // ISO date
  meetingType: "QBR" | "Check-in" | "Renewal" | "Exec Sync" | "Kickoff";
  attendees: string[];
  agenda: string[];
  keyPoints: string[];
  openRisks: string[];
  recentActivity: string[];
  recommendedAsks: string[];
}

export type SignalSource = "slack" | "jira" | "gmail" | "hubspot" | "product";

export interface ProductData {
  ppOrgId: number;
  ppSlug: string;
  ppName: string;
  contractedVolumeAnnual: number;
  ppUsers: number;
  ppContractStart: string; // ISO date
  ppContractEnd: string; // ISO date — this is the real renewal date
  ppModules: number[]; // 1=tracking, 2=notifications, 4=post-purchase (best guess from observation)
  adminUrl: string;
  country?: string;
  organizationType?: string;
  primaryEmail?: string;
  // Real usage pulled from PP shipment list API (current contract year)
  currentPeriodStart?: string; // ISO date — most recent contract anniversary
  currentPeriodShipments?: number; // count of shipments since currentPeriodStart
  currentPeriodUsagePct?: number; // shipments / annual contracted × 100
  // Most recent customer login (excluding @parcelperform.com staff)
  lastCustomerLoginDate?: string | null; // ISO timestamp, null if no non-PP login ever
  lastCustomerLoginEmail?: string;
  lastCustomerLoginName?: string;
}

export interface SourceStatus {
  source: SignalSource;
  connected: boolean;
  note?: string;
}

export interface SlackSignal {
  id: string;
  date: string; // ISO
  channel: string; // e.g. "#customer_puma"
  author: string;
  summary: string;
  permalink?: string;
}

export interface JiraTicket {
  key: string; // e.g. "CI-8177"
  url: string;
  title: string;
  source: "slack-crossref" | "jira-api"; // where we got the data
  context?: string;
  // Fields populated when source = "jira-api"
  status?: string; // e.g. "Offen", "Akzeptiert"
  statusCategory?: "new" | "indeterminate" | "done";
  priority?: string; // "Highest" | "High" | "Medium" | "Low" | "Lowest"
  assignee?: string;
  reporter?: string;
  issueType?: string; // "Task" | "Bug" | "Story"
  createdDate?: string;
  updatedDate?: string;
  project?: string; // e.g. "CI"
}

export interface EmailThread {
  id: string; // Gmail thread ID
  subject: string;
  from: string; // Full "Name <email>" string
  fromEmail?: string;
  date: string; // ISO timestamp
  preview: string;
  permalink?: string; // Gmail URL
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  region: string;
  logoColor: string; // tailwind color token e.g. "bg-blue-500"
  initials: string;
  health: HealthStatus;
  healthScore: number; // 0-100
  arr: number; // annual recurring revenue, USD
  renewalDate: string; // ISO date
  contractStart: string; // ISO date
  owner: string; // KAM
  lastTouch: string; // ISO date
  productUsage: number; // 0-100 active usage score
  npsScore: number; // -100 to 100
  contacts: Contact[];
  risks: Risk[];
  activity: ActivityEvent[];
  briefs: MeetingBrief[];
  notes: string;
  // Cross-source signals
  slackChannel?: string;
  slackSignals: SlackSignal[];
  jiraTickets: JiraTicket[];
  emailThreads: EmailThread[];
  product?: ProductData; // From Parcel Perform admin MCP
}
