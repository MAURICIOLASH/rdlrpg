import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, MessageCircle, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listApplicationEvents, updateApplication, type STATUSES } from "@/lib/applications.functions";
import { STATUS_LABEL, fmtDateTime, type AdminApp } from "./shared";
import { StatusBadge } from "./StatusBadge";
import { copyText } from "./Candidates";

type Status = (typeof STATUSES)[number];
const ACTIONS: { s: Status; label: string; icon: typeof Check }[] = [
  { s: "APPROVED", label: "Aprovar", icon: Check },
  { s: "REJECTED", label: "Reprovar", icon: X },
  { s: "CONTACT", label: "Marcar como em contato", icon: MessageCircle },
  { s: "PENDING", label: "Voltar para pendente", icon: RotateCcw },
];

function Section({ title, rows }: { title: string; rows: [string, string | number | null | undefined][] }) {
  return (
    <section>
      <h3 className="mb-3 border-b border-border pb-2 font-display text-xs font-bold tracking-[0.3em] text-silver">{title}</h3>
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
        {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="text-xs uppercase tracking-wider text-steel">{k}</dt><dd className="whitespace-pre-wrap break-words text-sm text-primary">{v === null || v === undefined || v === "" ? "—" : v}</dd></div>))}
      </dl>
    </section>
  );
}

export function DetailDialog({ app, onClose }: { app: AdminApp | null; onClose: () => void }) {
  const qc = useQueryClient();
  const save = useServerFn(updateApplication);
  const fetchEvents = useServerFn(listApplicationEvents);
  const [notes, setNotes] = useState("");
  const [confirm, setConfirm] = useState<Status | null>(null);
  useEffect(() => { setNotes(app?.admin_notes ?? ""); }, [app?.id, app?.admin_notes]);
  const events = useQuery({ queryKey: ["app-events", app?.id], queryFn: () => fetchEvents({ data: { id: app!.id } }), enabled: !!app });

  const m = useMutation({
    mutationFn: (status: Status) => save({ data: { id: app!.id, status, admin_notes: notes } }),
    onSuccess: (_r, status) => {
      toast.success(status === app?.status ? "Observação salva." : `Status alterado para ${STATUS_LABEL[status]}.`);
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["app-events", app?.id] });
    },
    onError: () => toast.error("Não foi possível salvar. Verifique sua permissão."),
  });

  if (!app) return null;
  const a = app;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="stone-texture metal-border max-h-[90vh] max-w-3xl overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold tracking-wider text-primary">{a.character_name}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-3 text-xs text-steel">
            <span>Protocolo <b className="text-silver">{a.protocol}</b></span>
            <span>Inscrito em {fmtDateTime(a.created_at)}</span>
            <StatusBadge status={a.status} />
          </DialogDescription>
        </DialogHeader>
        {a.reviewed_at && <p className="text-xs text-steel">Última análise por <b className="text-silver">{a.reviewer_name}</b> em {fmtDateTime(a.reviewed_at)}</p>}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => copyText(a.discord, "Discord")} className="btn-ghost-metal inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px]"><Copy className="size-3.5" /> Copiar Discord</Button>
          {a.contact && <Button onClick={() => copyText(a.contact!, "Contato")} className="btn-ghost-metal inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px]"><Copy className="size-3.5" /> Copiar contato</Button>}
          <Button onClick={() => copyText(`${a.character_name} (${a.character_class} nv. ${a.character_level}) — Discord: ${a.discord}${a.contact ? ` — Contato: ${a.contact}` : ""}`, "Dados")} className="btn-ghost-metal inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px]"><Copy className="size-3.5" /> Copiar dados</Button>
        </div>

        <div className="space-y-6">
          <Section title="PERSONAGEM" rows={[["Nick", a.character_name], ["Classe", a.character_class], ["Nível", a.character_level], ["Servidor", a.server], ["Tempo de jogo", a.play_time]]} />
          <Section title="INFORMAÇÕES DO JOGADOR" rows={[["Nome", a.player_name], ["Idade", a.age], ["Discord", a.discord], ["Contato", a.contact], ["Disponibilidade", a.availability]]} />
          <Section title="RECRUTAMENTO" rows={[["Outros clãs", a.previous_clan ? "Sim" : "Não"], ["Experiência", a.previous_clan_details], ["Por que entrar", a.reason_to_join], ["Expectativas", a.expectations], ["Eventos", a.event_participation ? "Sim" : "Não"], ["Como conheceu", a.discovery_source]]} />
        </div>

        <section className="space-y-3 border-t border-border pt-5">
          <h3 className="font-display text-xs font-bold tracking-[0.3em] text-silver">OBSERVAÇÕES ADMINISTRATIVAS</h3>
          <textarea className="field-dark" rows={3} maxLength={2000} placeholder="Anotações visíveis só para a liderança" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button onClick={() => m.mutate(a.status as Status)} disabled={m.isPending || notes === (a.admin_notes ?? "")} className="btn-ghost-metal px-4 py-2 text-[10px] ">Salvar observação</Button>
        </section>

        <section className="space-y-3 border-t border-border pt-5">
          <h3 className="font-display text-xs font-bold tracking-[0.3em] text-silver">AÇÕES</h3>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.filter((x) => x.s !== a.status).map((x) => (
              <Button key={x.s} onClick={() => setConfirm(x.s)} disabled={m.isPending} className={`${x.s === "APPROVED" ? "btn-metal" : "btn-ghost-metal"} inline-flex items-center gap-1.5 px-4 py-2 text-[10px]`}>
                <x.icon className="size-3.5" /> {x.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-2 border-t border-border pt-5">
          <h3 className="font-display text-xs font-bold tracking-[0.3em] text-silver">HISTÓRICO</h3>
          {events.data?.length ? (
            <ul className="space-y-1.5 text-xs text-steel">
              {events.data.map((e) => (
                <li key={e.id}><span className="text-silver">{fmtDateTime(e.created_at)}</span> — {e.admin_name}: {e.note ?? `${STATUS_LABEL[e.old_status ?? ""] ?? "—"} → ${STATUS_LABEL[e.new_status] ?? e.new_status}`}</li>
              ))}
            </ul>
          ) : <p className="text-xs text-steel">Nenhuma alteração registrada.</p>}
        </section>

        <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
          <AlertDialogContent className="stone-texture metal-border rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display tracking-wider">Confirmar alteração</AlertDialogTitle>
              <AlertDialogDescription>
                Alterar o status de <b>{a.character_name}</b> de {STATUS_LABEL[a.status]} para <b>{confirm ? STATUS_LABEL[confirm] : ""}</b>?
                {notes !== (a.admin_notes ?? "") && " A observação digitada também será salva."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none">Cancelar</AlertDialogCancel>
              <AlertDialogAction className="btn-metal rounded-none" onClick={() => { if (confirm) m.mutate(confirm); setConfirm(null); }}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
