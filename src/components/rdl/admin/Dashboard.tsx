import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminApp } from "./shared";

const PERIODS = [{ d: 7, l: "7 dias" }, { d: 30, l: "30 dias" }, { d: 90, l: "90 dias" }];

export function countByStatus(apps: { status: string }[]) {
  const c = { total: apps.length, PENDING: 0, APPROVED: 0, REJECTED: 0, CONTACT: 0 };
  for (const a of apps) if (a.status in c && a.status !== "total") c[a.status as "PENDING"]++;
  return c;
}

/** Daily counts for the last `days` days (today included), oldest first. */
export function dailySeries(apps: { created_at: string }[], days: number, now = new Date()) {
  const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const buckets: { key: string; label: string; total: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    buckets.push({ key: key(d), label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), total: 0 });
  }
  const idx = new Map(buckets.map((b, i) => [b.key, i]));
  for (const a of apps) { const i = idx.get(key(new Date(a.created_at))); if (i !== undefined) buckets[i]!.total++; }
  return buckets;
}

export function Dashboard({ apps }: { apps: AdminApp[] }) {
  const [days, setDays] = useState(30);
  const c = countByStatus(apps);
  const series = useMemo(() => dailySeries(apps, days), [apps, days]);
  const cards = [
    ["Total de inscrições", c.total], ["Pendentes", c.PENDING], ["Aprovados", c.APPROVED], ["Reprovados", c.REJECTED], ["Em contato", c.CONTACT],
  ] as const;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map(([l, v], i) => (
          <div key={l} className={`stone-texture metal-border p-5 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
            <p className="font-display text-[10px] tracking-[0.25em] text-steel">{l.toUpperCase()}</p>
            <p className="mt-2 font-display text-4xl font-black text-metal">{v ?? 0}</p>
          </div>
        ))}
      </div>
      <div className="stone-texture metal-border p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-sm font-bold tracking-[0.3em] text-primary">INSCRIÇÕES POR PERÍODO</h2>
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <Button key={p.d} onClick={() => setDays(p.d)} variant="ghost" size="sm" aria-pressed={days === p.d} className="text-[10px]">{p.l}</Button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={10} width={28} />
              <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} formatter={(v) => [v, "Inscrições"]} />
              <Bar dataKey="total" fill="var(--silver)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {c.total === 0 && <p className="mt-3 text-center text-sm text-steel">Nenhuma inscrição recebida ainda.</p>}
      </div>
    </div>
  );
}
