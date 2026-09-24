import { create } from "zustand";

export interface BadgePayload {
  item: string;
  value: number | string;
}

/** Map of badgeKey -> value, used by the Sidebar */
export type BadgeMap = Record<string, number | string>;

export interface BadgeState {
  badges: BadgeMap;
  /** Set/replace one or many badges. Accepts a single badge or an array. */
  updateBadge: (data: BadgePayload | BadgePayload[]) => void;
  /** Convenience: bump a numeric badge by N (default 1). */
  increment: (item: string, by?: number) => void;
  /** Clear one badge (sets it to 0). */
  clearBadge: (item: string) => void;
  /** Wipe everything (call on logout). */
  reset: () => void;
}

export const useBadgeStore = create<BadgeState>((set) => ({
  badges: {},

  updateBadge: (data) => {
    console.log(data)
    const list = Array.isArray(data.badges) ? data.badges : [data.badges];
    console.log(list)
    set((state) => {
      const next = { ...state.badges };
      for (const { item, value } of list) {
        next[item] = value;
      }
      return { badges: next };
    });
  },

  increment: (item, by = 1) =>
    set((state) => {
      const current = state.badges[item];
      const base = typeof current === "number" ? current : 0;
      return { badges: { ...state.badges, [item]: base + by } };
    }),

  clearBadge: (item) =>
    set((state) => ({ badges: { ...state.badges, [item]: 0 } })),

  reset: () => set({ badges: {} }),
}));