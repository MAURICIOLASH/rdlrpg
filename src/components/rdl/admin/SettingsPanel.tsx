import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveSettings } from "@/lib/settings.functions";
import { settingsSchema, type SiteSettings } from "@/lib/settings";
import { SITE_SETTINGS_KEY, useSiteSettings } from "@/lib/use-site-settings";

function ListEditor({ label, items, onChange, placeholder, max }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string; max: number }) {
  const [draft, setDraft] = useState("");
  const add = () => { const v = draft.trim(); if (!v) return; onChange([...items, v]); setDraft(""); };
  return (
    <div className="space-y-2">
      <p className="font-display text-[11px] tracking-[0.25em] text-steel">{label}</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <input className="field-dark" maxLength={max} value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} aria-label={`${label} ${i + 1}`} />
            <Button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} variant="ghost" size="icon" className="self-center" aria-label="Remover" title="Remover"><Trash2 className="size-4" /></Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input className="field-dark" maxLength={max} placeholder={placeholder} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" onClick={add} className="btn-ghost-metal inline-flex items-center gap-1 px-3 text-[10px]"><Plus className="size-4" /> Adicionar</Button>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const qc = useQueryClient();
  const { settings, loaded } = useSiteSettings();
  const [s, setS] = useState<SiteSettings>(settings);
  useEffect(() => { if (loaded) setS(settings); }, [loaded, settings]);
  const save = useServerFn(saveSettings);
  const m = useMutation({
    mutationFn: (v: SiteSettings) => save({ data: v }),
    onSuccess: () => { toast.success("Configurações salvas."); qc.invalidateQueries({ queryKey: SITE_SETTINGS_KEY }); },
    onError: () => toast.error("Não foi possível salvar as configurações."),
  });
  const submit = () => {
    const clean = { ...s, clan_rules: s.clan_rules.map((r) => r.trim()).filter(Boolean), classes: s.classes.map((c) => c.trim()).filter(Boolean) };
    const p = settingsSchema.safeParse(clean);
    if (!p.success) { toast.error(p.error.issues[0]?.path.includes("classes") ? "Mantenha pelo menos uma classe." : "Revise os campos: algum texto está longo demais."); return; }
    m.mutate(p.data);
  };
  const text = (k: "intro_text" | "about_text" | "home_motto" | "recruit_text", label: string, rows: number, max: number) => (
    <label className="block space-y-2">
      <span className="font-display text-[11px] tracking-[0.25em] text-steel">{label}</span>
      {rows === 1
        ? <input className="field-dark" maxLength={max} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
        : <textarea className="field-dark" rows={rows} maxLength={max} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="stone-texture metal-border flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.3em] text-primary">{s.recruitment_open ? "RECRUTAMENTO ABERTO" : "RECRUTAMENTO TEMPORARIAMENTE FECHADO"}</p>
          <p className="mt-1 text-xs text-steel">Quando fechado, o site não aceita novas inscrições.</p>
        </div>
        <button type="button" role="switch" aria-checked={s.recruitment_open} onClick={() => setS({ ...s, recruitment_open: !s.recruitment_open })}
          className="rdl-switch relative h-8 w-16 shrink-0" aria-label="Recrutamento aberto">
          <span className={`absolute top-1 size-5 bg-silver transition-all ${s.recruitment_open ? "left-9" : "left-1 opacity-50"}`} />
        </button>
      </div>
      <div className="stone-texture metal-border space-y-5 p-5">
        <h2 className="font-display text-sm font-bold tracking-[0.3em] text-primary">TEXTOS DO SITE</h2>
        {text("home_motto", "LEMA (PÁGINA INICIAL)", 1, 80)}
        {text("intro_text", "FRASE DE DESTAQUE (PÁGINA INICIAL)", 2, 400)}
        {text("about_text", "APRESENTAÇÃO DO CLÃ", 4, 1200)}
        {text("recruit_text", "CHAMADA DE RECRUTAMENTO", 3, 600)}
      </div>
      <div className="stone-texture metal-border grid gap-8 p-5 md:grid-cols-2">
        <ListEditor label="REGRAS DO CLÃ" items={s.clan_rules} onChange={(v) => setS({ ...s, clan_rules: v })} placeholder="Nova regra" max={300} />
        <ListEditor label="CLASSES DISPONÍVEIS" items={s.classes} onChange={(v) => setS({ ...s, classes: v })} placeholder="Nova classe" max={40} />
      </div>
      <div className="flex justify-end">
        <Button onClick={submit} disabled={m.isPending || !loaded} className="btn-metal px-8 py-3 text-xs">{m.isPending ? "Salvando…" : "Salvar configurações"}</Button>
      </div>
    </div>
  );
}
