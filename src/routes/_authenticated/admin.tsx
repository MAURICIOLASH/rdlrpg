import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { amIAdmin, listApplications, updateApplication, STATUSES } from "@/lib/applications.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de Inscrições — RDL Infernais" },
      { name: "description", content: "Painel restrito da liderança." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel — RDL Infernais" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const LABEL: Record<string, string> = { PENDING: "Pendente", APPROVED: "Aprovado", REJECTED: "Reprovado", CONTACT: "Em contato" };

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkAdmin = useServerFn(amIAdmin);
  const fetchList = useServerFn(listApplications);
  const admin = useQuery({ queryKey: ["am-admin"], queryFn: () => checkAdmin() });
  const list = useQuery({ queryKey: ["applications"], queryFn: () => fetchList(), enabled: admin.data === true });

  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-gothic text-3xl text-metal sm:text-5xl">Inscrições</h1>
        <button onClick={signOut} className="btn-ghost-metal flex items-center gap-2 px-4 py-2 text-[11px]"><LogOut className="size-4" /> Sair</button>
      </div>
      {admin.isLoading || list.isLoading ? <Loader2 className="mx-auto animate-spin text-silver" /> :
        admin.data !== true ? <p className="stone-texture metal-border p-6 text-foreground/80">Sua conta não tem permissão de administrador.</p> :
        list.error ? <p className="text-primary">Não foi possível carregar as inscrições.</p> :
        !list.data?.length ? <p className="text-steel">Nenhuma inscrição recebida ainda.</p> :
        <div className="space-y-4">{list.data.map((a) => <Row key={a.id} a={a} />)}</div>}
    </div>
  );
}

type App = Awaited<ReturnType<typeof listApplications>>[number];

function Row({ a }: { a: App }) {
  const qc = useQueryClient();
  const save = useServerFn(updateApplication);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(a.status as (typeof STATUSES)[number]);
  const [notes, setNotes] = useState(a.admin_notes ?? "");
  const m = useMutation({
    mutationFn: () => save({ data: { id: a.id, status, admin_notes: notes } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
  const info: [string, string | number | null][] = [
    ["Classe", a.character_class], ["Nível", a.character_level], ["Tempo de jogo", a.play_time], ["Jogador", a.player_name],
    ["Idade", a.age], ["Discord", a.discord], ["Contato", a.contact], ["Disponibilidade", a.availability],
    ["Outros clãs", a.previous_clan ? "Sim" : "Não"], ["Experiência", a.previous_clan_details], ["Motivo", a.reason_to_join],
    ["Expectativa", a.expectations], ["Eventos", a.event_participation ? "Sim" : "Não"], ["Como conheceu", a.discovery_source],
  ];
  return (
    <div className="stone-texture metal-border p-5">
      <button onClick={() => setOpen(!open)} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
        <div>
          <p className="font-display text-lg font-bold tracking-wider text-primary">{a.character_name}</p>
          <p className="text-xs text-steel">{a.protocol} · {new Date(a.created_at).toLocaleString("pt-BR")}</p>
        </div>
        <span className="border border-silver px-3 py-1 font-display text-[11px] tracking-[0.2em] text-silver">{LABEL[a.status] ?? a.status}</span>
      </button>
      {open && (
        <div className="mt-5 space-y-5 border-t border-border pt-5">
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
            {info.map(([k, v]) => (<div key={k} className="contents"><dt className="text-xs uppercase tracking-wider text-steel">{k}</dt><dd className="whitespace-pre-wrap break-words text-sm text-primary">{v ?? "—"}</dd></div>))}
          </dl>
          <div className="grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-start">
            <select className="field-dark" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
            </select>
            <textarea className="field-dark" rows={2} maxLength={2000} placeholder="Observações da liderança" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button onClick={() => m.mutate()} disabled={m.isPending} className="btn-metal px-6 py-3 text-xs">{m.isPending ? "Salvando…" : "Salvar"}</button>
          </div>
          {m.isError && <p className="text-sm text-primary">⸸ Não foi possível salvar.</p>}
          {m.isSuccess && <p className="text-sm text-steel">Salvo.</p>}
        </div>
      )}
    </div>
  );
}
