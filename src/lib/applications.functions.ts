import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { applicationSchema, makeProtocol, toApplicationRow } from "./recruitment";

const submitInput = z.object({
  form: z.unknown(),
  website: z.string().max(200).optional(), // honeypot: real people never fill it
  startedAt: z.number().int().positive(),
});

export type SubmitResult = { ok: true; protocol: string } | { ok: false; error: string };

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitInput.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    const parsed = applicationSchema.safeParse(data.form);
    if (!parsed.success) return { ok: false, error: "Dados inválidos. Revise o formulário." };
    const elapsed = Date.now() - data.startedAt;
    if (data.website || elapsed < 8000 || elapsed > 1000 * 60 * 60 * 24)
      return { ok: false, error: "Não foi possível registrar a inscrição. Tente novamente." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: open } = await supabaseAdmin
      .from("site_settings").select("setting_value").eq("setting_key", "recruitment_open").maybeSingle();
    if (open && open.setting_value === false) return { ok: false, error: "O recrutamento está fechado no momento." };

    const row = toApplicationRow(parsed.data);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("applications").select("id", { count: "exact", head: true })
      .or(`discord.ilike.${row.discord.replace(/[,()*%\\]/g, "")},character_name.ilike.${row.character_name.replace(/[,()*%\\]/g, "")}`)
      .gte("created_at", since);
    if ((count ?? 0) > 0)
      return { ok: false, error: "Já recebemos uma inscrição recente deste Discord ou personagem. Aguarde o contato da liderança." };

    for (let i = 0; i < 3; i++) {
      const protocol = makeProtocol();
      const { error } = await supabaseAdmin.from("applications").insert({ ...row, protocol });
      if (!error) return { ok: true, protocol };
      if (error.code !== "23505") { console.error("insert application failed", error); break; }
    }
    return { ok: false, error: "Não foi possível registrar a inscrição. Tente novamente em instantes." };
  });

export const getPublicClasses = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("setting_value").eq("setting_key", "classes").maybeSingle();
  const list = z.array(z.string().min(1).max(40)).safeParse(data?.setting_value);
  return list.success && list.data.length ? list.data : null;
});

// ---- Admin (RLS enforces the admin role on every query) ----
export const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CONTACT"] as const;

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return data === true;
  });

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("applications").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw new Error("Falha ao carregar inscrições.");
    return data;
  });

export const updateApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({
    id: z.string().uuid(),
    status: z.enum(STATUSES),
    admin_notes: z.string().max(2000),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from("applications")
      .update({ status: data.status, admin_notes: data.admin_notes || null, reviewed_by: context.userId, reviewed_at: new Date().toISOString() })
      .eq("id", data.id).select("id");
    if (error || !rows?.length) throw new Error("Sem permissão ou inscrição não encontrada.");
    return { ok: true };
  });
