# KAM Command Center — onboarding for a new Claude Code / Claude Desktop install

This is a Next.js 14 + TypeScript dashboard for Key Account Managers. It pulls real data from HubSpot, Slack, Parcel Perform admin, Jira (via Atlassian MCP), and Gmail.

The current `src/lib/mockData.ts` contains **a static snapshot of real Parcel Perform customer data** taken on 2026-05-13. Treat it as proprietary.

## What's inside

```
kam-command-center/
├── src/
│   ├── app/                        # Next.js routes (dashboard, account detail, actions, briefs)
│   ├── components/                 # shadcn-style UI + custom (signals-panel, source-pill, etc.)
│   └── lib/
│       ├── mockData.ts             # ← Real PP data snapshot (account list, contracts, usage %, last login, etc.)
│       ├── types.ts                # Full TypeScript model
│       └── utils.ts                # Formatters + Tailwind helpers
├── package.json
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── README.md
└── ONBOARDING.md                   # This file
```

## Step 1 — Install Node.js on the new machine

If you don't already have it:
- Windows: `winget install OpenJS.NodeJS.LTS` (or download from https://nodejs.org)
- macOS: `brew install node` (LTS)
- Linux: use your distro's Node 18+ package

Verify:
```
node --version    # should be v18 or higher
npm --version
```

## Step 2 — Extract the zip and install dependencies

```
cd kam-command-center
npm install        # ~3-5 minutes on first run
npm run dev
```

Open http://localhost:3000. You'll see the full dashboard with all the real data baked in. No further setup needed for the *app to work*.

## Step 3 (optional) — Reconnect the live MCP sources

The app uses a static data snapshot, so it works without MCP. You only need this if you want to **regenerate** the snapshot with fresh data later.

On the new Claude account, you need the same five connectors:

| Connector | How |
|---|---|
| **HubSpot** | Claude Desktop → Settings → Connectors → install HubSpot, OAuth on first use |
| **Slack** | Same: Settings → Connectors → Slack |
| **Parcel Perform Admin Gateway** | Internal PP extension. Same install: it's in your Claude Desktop extension list as `Parcel Perform MCP Gateway` |
| **Atlassian (Jira)** | Two options: (a) Claude Desktop connector if available, or (b) add to project `.mcp.json`: `{"atlassian": {"command": "npx", "args": ["-y", "mcp-remote", "https://mcp.atlassian.com/v1/sse"]}}` — restart, complete OAuth |
| **Gmail** | Claude Desktop connector with Google OAuth |

After all five are connected, you can re-run the snapshot generation steps documented inline in `src/lib/mockData.ts`.

## Step 4 (optional) — Carry over Claude's memory

If you want me (Claude) to remember things across accounts — like the "always flag placeholders" feedback rule — copy this folder too:

```
Source:      C:\Users\danie\.claude\projects\C--Users-danie-Documents-pp-qbr-reports\memory\
Destination: ~/.claude/projects/<your-new-project-folder>/memory/
```

The destination folder name mirrors the new project's absolute path with separators replaced by dashes.

## What you CAN'T transfer

These are tied to credentials and the original machine, and they should NOT be copied:

- `~/.mcp-auth/` — cached OAuth tokens for Atlassian (etc.). Each Claude account does its own OAuth.
- Claude Desktop's `~/AppData/Roaming/Claude/Local Storage/` — session cookies and login state.
- The Parcel Perform admin login session — has to be re-done with `pp_admin_login` on the new account.

## Notes on the data

`src/lib/mockData.ts` is the single source of truth for everything the app renders. It contains:

- 43 customer accounts owned by KAM Daniel Schechter (HubSpot snapshot)
- Real contracted volumes + contract end dates for 22 of them (from PP admin API)
- Real current-contract-year shipment counts and usage % (PP shipment list API)
- Real most-recent-customer-login per account (PP organization users, @parcelperform.com excluded)
- 16 open action items (HubSpot tasks)
- ~60 Slack signals across 18 accounts (paraphrased one-liners)
- 12 Jira tickets with real status/assignee/priority (Atlassian API)
- ~12 Gmail thread summaries (Gmail API)
- 5 hand-written meeting briefs

**Synthesized values that look real but aren't** (per the project's "always flag placeholders" rule):
- `npsScore` — derived from health bucket, not a real NPS survey
- `healthScore` 0-100 — formula based on `at_risk` flag + days since last activity
- `productUsage` for the 20 Nespresso country units (UK, NL, CA, AU, etc.) — still synthesized (real for the other 22)
- Account `notes` paragraphs — written based on the data, not a real notes field
- `isChampion` / `isExecutiveSponsor` contact flags — inferred from job titles
- 2 activity timeline entries per account — derived from contract start + notes timestamp
- Meeting briefs — hand-written from the cross-source signals

## App design choices worth knowing

- Today's date is hardcoded at `2026-05-13` in seven files (search the codebase for `"2026-05-13"`). If you want the relative dates to be relative to "real today," update those.
- The KAM owner name is hardcoded as "Daniel Schechter" in `nav.tsx` and `page.tsx`.
- Styling is shadcn/ui-style with Tailwind, no UI library installed via npm.

## Useful commands

```
npm run dev          # start dev server at localhost:3000
npm run build        # production build (verifies all TS / no lint errors)
npm run lint         # next.js ESLint
```

That's it. Tell future-Claude any of these for context-resume:
- "We built a 5-source KAM Command Center for Daniel Schechter."
- "Real data was injected from HubSpot + Slack + PP admin + Jira + Gmail, snapshot dated 2026-05-13."
- "Charles & Keith is the most interesting account — 105.5% over contracted shipment volume with 2 months still to go in the contract year."
