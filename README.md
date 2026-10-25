# Compliance Copilot

Cafe demo for a small business. Upload a policy, extract rules across locations, run a mock inspection, and keep an audit trail on the device.

Locations: Cafe Downtown (Jackson, WI) and Cafe Airport Kiosk.

## App source

- `src/components/copilot/AppShell.tsx` — dashboard, upload, rules, inspection, audit trail
- `src/lib/compliance/model.ts` — seed rules and tax/food extraction
- `src/lib/compliance/store.ts` — Zustand store persisted in the browser
- `src/routes/index.tsx` — home route
- `src/styles.css` — theme

Built with React, TanStack Start, Tailwind, and Zustand.
