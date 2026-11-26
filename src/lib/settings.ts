import { z } from "zod";
import { CLASSES } from "./recruitment";

export const settingsSchema = z.object({
  recruitment_open: z.boolean(),
  intro_text: z.string().trim().max(400),
  about_text: z.string().trim().max(1200),
  home_motto: z.string().trim().max(80),
  recruit_text: z.string().trim().max(600),
  clan_rules: z.array(z.string().trim().min(1).max(300)).max(40),
  classes: z.array(z.string().trim().min(1).max(40)).min(1).max(30),
});
export type SiteSettings = z.infer<typeof settingsSchema>;
export const SETTING_KEYS = Object.keys(settingsSchema.shape) as (keyof SiteSettings)[];

export const DEFAULT_SETTINGS: SiteSettings = {
  recruitment_open: true,
  intro_text: "Não buscamos apenas jogadores. Buscamos guerreiros dispostos a construir uma história.",
  about_text: "O RDL Infernais é uma comunidade que valoriza a união, a lealdade, o respeito, a evolução conjunta e a participação nas atividades do jogo.",
  home_motto: "FORÇA. HONRA. LEALDADE.",
  recruit_text: "Está preparado para fazer parte do RDL Infernais? Apresente seu personagem e demonstre por que merece fazer parte da nossa história.",
  clan_rules: [],
  classes: [...CLASSES],
};

/** Merge raw DB rows over defaults, ignoring any invalid value. */
export function mergeSettings(rows: { setting_key: string; setting_value: unknown }[]): SiteSettings {
  const out = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
  for (const r of rows) {
    const field = (settingsSchema.shape as Record<string, z.ZodTypeAny>)[r.setting_key];
    if (!field) continue;
    const p = field.safeParse(r.setting_value);
    if (p.success) out[r.setting_key] = p.data;
  }
  return out as SiteSettings;
}
