import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  extractFromText,
  LOCATIONS,
  SEED_RULES,
  type Answer,
  type AuditEvent,
  type Rule,
  type StoreState,
} from "./model";

type Actions = {
  ingest: (name: string, text: string) => number;
  setAnswer: (ruleId: string, answer: Answer) => void;
  logInspection: (locationId: string) => void;
  resetDemo: () => void;
};

function event(type: string, detail: string): AuditEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ts: new Date().toISOString(),
    type,
    detail,
  };
}

const initial: StoreState = {
  locations: LOCATIONS,
  rules: SEED_RULES,
  answers: {},
  events: [
    event("seed", "Loaded Jackson cafe demo: food, fire, labor, privacy, and tax rules."),
  ],
  uploaded: ["Food safety policy", "Tax & recordkeeping policy", "Operations handbook"],
};

export const useCopilot = create<StoreState & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      ingest: (name, text) => {
        const rules = extractFromText(name, text);
        set((s) => ({
          rules: [...rules, ...s.rules],
          uploaded: [name || "Untitled policy", ...s.uploaded].slice(0, 12),
          events: [event("upload", `Extracted ${rules.length} rules from ${name || "a policy"}.`), ...s.events].slice(0, 40),
        }));
        return rules.length;
      },
      setAnswer: (ruleId, answer) =>
        set((s) => ({ answers: { ...s.answers, [ruleId]: answer } })),
      logInspection: (locationId) => {
        const loc = get().locations.find((l) => l.id === locationId);
        const items = get().rules.filter((r) => r.locationIds.includes(locationId));
        const answers = get().answers;
        const passed = items.filter((r) => answers[r.id] === "pass").length;
        set((s) => ({
          events: [
            event(
              "inspection",
              `${loc?.name ?? locationId}: ${passed} of ${items.length} items marked pass.`,
            ),
            ...s.events,
          ].slice(0, 40),
        }));
      },
      resetDemo: () => set({ ...initial, events: [event("reset", "Demo data restored.")] }),
    }),
    { name: "compliance-copilot-v1" },
  ),
);

export function rulesFor(rules: Rule[], locationId: string) {
  return rules.filter((r) => r.locationIds.includes(locationId));
}
