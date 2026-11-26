import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { mergeSettings, settingsSchema, SETTING_KEYS } from "./settings";

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
  const { data } = await sb.from("site_settings").select("setting_key, setting_value");
  return mergeSettings(data ?? []);
});

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => settingsSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (isAdmin !== true) throw new Error("Sem permissão.");
    const rows = SETTING_KEYS.map((k) => ({ setting_key: k, setting_value: data[k], updated_at: new Date().toISOString() }));
    const { error } = await context.supabase.from("site_settings").upsert(rows, { onConflict: "setting_key" });
    if (error) { console.error(error); throw new Error("Falha ao salvar configurações."); }
    return { ok: true };
  });
