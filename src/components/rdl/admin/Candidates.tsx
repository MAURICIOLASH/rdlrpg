import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import { STATUS_LABEL, fmtDate, type AdminApp } from "./shared";
import { StatusBadge } from "./StatusBadge";
import { DetailDialog } from "./DetailDialog";

type SortKey = "character_name" | "character_class" | "character_level" | "player_name" | "created_at" | "status";
const PAGE = 15;

export type Filters = { q: string; cls: string; minLvl: string; maxLvl: string; status: string; from: string; to: string };
export const EMPTY_FILTERS: Filters = { q: "", cls: "", minLvl: "", maxLvl: "", status: "", from: "", to: "" };

export function filterApps(apps: AdminApp[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const from = f.from ? new Date(`${f.from}T00:00:00`).getTime() : null;
  const to = f.to ? new Date(`${f.to}T23:59:59.999`).getTime() : null;
  return apps.filter((a) => {
    if (q && !a.character_name.toLowerCase().includes(q)) return false;
    if (f.cls && a.character_class !== f.cls) return false;
    if (f.minLvl && a.character_level < Number(f.minLvl)) return false;
    if (f.maxLvl && a.character_level > Number(f.maxLvl)) return false;
    if (f.status && a.status !== f.status) return false;
    const t = new Date(a.created_at).getTime();
    if (from !== null && t < from) return false;
    if (to !== null && t > to) return false;
    return true;
  });
}

export async function copyText(text: string, what: string) {
  try { await navigator.clipboard.writeText(text); toast.success(`${what} copiado.`); } catch { toast.error("Não foi possível copiar."); }
}

export function Candidates({ apps }: { apps: AdminApp[] }) {
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<{ k: SortKey; asc: boolean }>({ k: "created_at", asc: false });
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const classes = useMemo(() => [...new Set(apps.map((a) => a.character_class))].sort(), [apps]);

  const rows = useMemo(() => {
    const r = filterApps(apps, f);
    const dir = sort.asc ? 1 : -1;
    return [...r].sort((a, b) => {
      const x = a[sort.k], y = b[sort.k];
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR")) * dir;
    });
  }, [apps, f, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const shown = rows.slice(cur * PAGE, cur * PAGE + PAGE);
  const set = (k: keyof Filters) => (e: { target: { value: string } }) => { setF({ ...f, [k]: e.target.value }); setPage(0); };
  const open = apps.find((a) => a.id === openId) ?? null;

  const Th = ({ k, children }: { k: SortKey; children: string }) => (
    <th className="px-3 py-3 text-left">
      <Button onClick={() => setSort({ k, asc: sort.k === k ? !sort.asc : true })} variant="ghost" size="sm" className="gap-1 text-[10px]">
        {children.toUpperCase()}{sort.k === k && (sort.asc ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
      </Button>
    </th>
  );

  return (
    <div className="space-y-5">
      <div className="stone-texture metal-border grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <input className="field-dark" placeholder="Pesquisar personagem" value={f.q} onChange={set("q")} aria-label="Pesquisar personagem" />
        <select className="field-dark" value={f.cls} onChange={set("cls")} aria-label="Classe">
          <option value="">Todas as classes</option>{classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="field-dark" value={f.status} onChange={set("status")} aria-label="Status">
          <option value="">Todos os status</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="field-dark" type="number" min={1} placeholder="Nível mín." value={f.minLvl} onChange={set("minLvl")} aria-label="Nível mínimo" />
          <input className="field-dark" type="number" min={1} placeholder="máx." value={f.maxLvl} onChange={set("maxLvl")} aria-label="Nível máximo" />
        </div>
        <div className="flex gap-2">
          <input className="field-dark" type="date" value={f.from} onChange={set("from")} aria-label="Data inicial" />
          <input className="field-dark" type="date" value={f.to} onChange={set("to")} aria-label="Data final" />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-steel">
        <span>{rows.length} inscrição(ões)</span>
        <Button onClick={() => { setF(EMPTY_FILTERS); setPage(0); }} variant="ghost" size="sm" className="text-xs">Limpar filtros</Button>
      </div>
      <div className="stone-texture metal-border overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border">
            <tr><Th k="character_name">Personagem</Th><Th k="character_class">Classe</Th><Th k="character_level">Nível</Th><Th k="player_name">Jogador</Th>
              <th className="px-3 py-3 text-left font-display text-[10px] tracking-[0.2em] text-steel">DISCORD</th><Th k="created_at">Data</Th><Th k="status">Status</Th>
              <th className="px-3 py-3 text-right font-display text-[10px] tracking-[0.2em] text-steel">AÇÕES</th></tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id} onClick={() => setOpenId(a.id)} className="cursor-pointer border-b border-border/60 hover:bg-muted/40">
                <td className="px-3 py-3 font-bold text-primary">{a.character_name}</td>
                <td className="px-3 py-3">{a.character_class}</td>
                <td className="px-3 py-3">{a.character_level}</td>
                <td className="px-3 py-3">{a.player_name}</td>
                <td className="px-3 py-3">
                  <Button onClick={(e) => { e.stopPropagation(); copyText(a.discord, "Discord"); }} variant="ghost" size="sm" className="gap-1.5 text-xs normal-case" title="Copiar Discord">
                    {a.discord}<Copy className="size-3 text-steel" />
                  </Button>
                </td>
                <td className="px-3 py-3 text-steel">{fmtDate(a.created_at)}</td>
                <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-3 py-3 text-right">
                  <Button onClick={(e) => { e.stopPropagation(); setOpenId(a.id); }} className="btn-ghost-metal inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px]"><Eye className="size-3.5" /> Ver</Button>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={8} className="px-3 py-10 text-center text-steel">{apps.length ? "Nenhuma inscrição encontrada com esses filtros." : "Nenhuma inscrição recebida ainda."}</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <Button disabled={cur === 0} onClick={() => setPage(cur - 1)} variant="ghost" size="icon" aria-label="Página anterior"><ChevronLeft className="size-4" /></Button>
          <span className="font-display text-xs tracking-[0.2em] text-steel">PÁGINA {cur + 1} DE {pages}</span>
          <Button disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} variant="ghost" size="icon" aria-label="Próxima página"><ChevronRight className="size-4" /></Button>
        </div>
      )}
      <DetailDialog app={open} onClose={() => setOpenId(null)} />
    </div>
  );
}
