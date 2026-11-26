import { describe, expect, it } from "vitest";
import { countByStatus, dailySeries } from "./Dashboard";
import { EMPTY_FILTERS, filterApps } from "./Candidates";
import { mergeSettings, settingsSchema } from "@/lib/settings";
import type { AdminApp } from "./shared";

const mk = (p: Partial<AdminApp>) => ({ character_name: "Zed", character_class: "Knight", character_level: 100, status: "PENDING", created_at: "2026-11-20T12:00:00", ...p }) as AdminApp;
const apps = [mk({ character_name: "Alpha", status: "APPROVED", character_level: 80 }), mk({ character_name: "Beta", character_class: "Archer", status: "REJECTED", created_at: "2026-11-25T10:00:00" }), mk({ status: "CONTACT" })];

describe("admin dashboard", () => {
  it("counts each status from real rows", () => {
    expect(countByStatus(apps)).toMatchObject({ total: 3, PENDING: 0, APPROVED: 1, REJECTED: 1, CONTACT: 1 });
  });
  it("buckets applications per day in the chosen period", () => {
    const s = dailySeries(apps, 7, new Date("2026-11-26T15:00:00"));
    expect(s).toHaveLength(7);
    expect(s.reduce((n, b) => n + b.total, 0)).toBe(3);
    expect(s[5]?.total).toBe(1);
  });
});

describe("candidate filters", () => {
  it("filters by name, class, level, status and date", () => {
    expect(filterApps(apps, { ...EMPTY_FILTERS, q: "alp" }).map((a) => a.character_name)).toEqual(["Alpha"]);
    expect(filterApps(apps, { ...EMPTY_FILTERS, cls: "Archer" })).toHaveLength(1);
    expect(filterApps(apps, { ...EMPTY_FILTERS, minLvl: "90" })).toHaveLength(2);
    expect(filterApps(apps, { ...EMPTY_FILTERS, status: "CONTACT" })).toHaveLength(1);
    expect(filterApps(apps, { ...EMPTY_FILTERS, from: "2026-11-25", to: "2026-11-25" }).map((a) => a.character_name)).toEqual(["Beta"]);
  });
});

describe("site settings", () => {
  it("ignores invalid stored values and keeps recruitment toggle", () => {
    const s = mergeSettings([{ setting_key: "recruitment_open", setting_value: false }, { setting_key: "classes", setting_value: "oops" }]);
    expect(s.recruitment_open).toBe(false);
    expect(s.classes.length).toBeGreaterThan(0);
  });
  it("requires at least one class", () => {
    expect(settingsSchema.safeParse({ ...mergeSettings([]), classes: [] }).success).toBe(false);
  });
});
