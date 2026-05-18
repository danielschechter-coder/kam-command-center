# KAM Command Center

A clean, executive-friendly web app that helps Key Account Managers see at a glance:

- which accounts need attention
- upcoming renewals
- open risks
- pending actions
- AI-style meeting briefs

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**-style components (sources copied into `src/components/ui/`)
- **lucide-react** icons
- **Mock data only** — no backend, no database

## Run it

```bash
cd kam-command-center
npm install
npm run dev
```

Then open http://localhost:3000.

> Today's date in the app is fixed at **2026-05-12** so all relative dates in the mock data ("renews in 7 weeks", "due tomorrow") stay meaningful.

## Screens

| Route | Purpose |
|---|---|
| `/` | Dashboard with KPIs, accounts needing attention, today's priorities, full book table |
| `/accounts/[id]` | Account detail — health, ARR, renewal, NPS, risks, actions, activity, contacts, notes |
| `/actions` | Action tracker grouped by status (open / in progress / blocked / done) |
| `/briefs` | List of upcoming meeting briefs |
| `/briefs/[id]` | AI-style meeting brief with agenda, key points, risks, activity, recommended asks |

## Where to edit content

All mock data lives in **`src/lib/mockData.ts`** and is fully typed via `src/lib/types.ts`. Edit accounts, contacts, risks, actions, and briefs there — the UI updates automatically.

## Project structure

```
kam-command-center/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Shell + nav
│   │   ├── page.tsx                # Dashboard
│   │   ├── accounts/[id]/page.tsx  # Account detail
│   │   ├── actions/page.tsx        # Action tracker
│   │   ├── briefs/page.tsx         # Briefs index
│   │   └── briefs/[id]/page.tsx    # Meeting brief
│   ├── components/
│   │   ├── ui/                     # button, card, badge, progress, separator, avatar
│   │   ├── nav.tsx
│   │   ├── health-pill.tsx
│   │   ├── account-avatar.tsx
│   │   └── stat-card.tsx
│   └── lib/
│       ├── types.ts
│       ├── mockData.ts
│       └── utils.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

## What's intentionally not here

- No database, no API, no auth — this is UI-first validation.
- No write actions yet — buttons that imply mutation (e.g. "Open meeting brief") navigate; nothing persists.

Once the UI is validated, the natural next step is to swap `src/lib/mockData.ts` for fetches against a real CRM (HubSpot, Salesforce) and a small server for AI brief generation.
