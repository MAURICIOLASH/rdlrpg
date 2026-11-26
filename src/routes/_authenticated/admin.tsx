import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { amIAdmin, listApplications } from "@/lib/applications.functions";
import { Dashboard } from "@/components/rdl/admin/Dashboard";
import { Candidates } from "@/components/rdl/admin/Candidates";
import { SettingsPanel } from "@/components/rdl/admin/SettingsPanel";
import { Ornament } from "@/components/rdl/Reveal";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de Comando — RDL Infernais" },
      { name: "description", content: "Painel restrito da liderança do RDL Infernais." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel de Comando — RDL Infernais" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const TABS = [["dash", "Painel"], ["cand", "Candidatos"], ["config", "Configurações"]] as const;

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("dash");
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
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-[10px] tracking-[0.4em] text-steel">RDL INFERNAIS</p>
          <h1 className="font-display text-2xl font-black tracking-[0.2em] text-metal sm:text-4xl">PAINEL DE COMANDO</h1>
        </div>
        <button onClick={signOut} className="btn-ghost-metal flex items-center gap-2 px-4 py-2 text-[11px]"><LogOut className="size-4" /> Sair</button>
      </div>
      {admin.isLoading ? <Loader2 className="mx-auto animate-spin text-silver" /> :
        admin.data !== true ? <p className="stone-texture metal-border p-6 text-foreground/80">Sua conta não tem permissão de administrador.</p> : (
        <>
          <nav className="mb-8 flex gap-1 border-b border-border" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`-mb-px border-b-2 px-4 py-3 font-display text-[11px] tracking-[0.25em] transition-colors ${tab === k ? "border-silver text-primary" : "border-transparent text-steel hover:text-silver"}`}>{l.toUpperCase()}</button>
            ))}
          </nav>
          {tab === "config" ? <SettingsPanel /> :
            list.isLoading ? <Loader2 className="mx-auto animate-spin text-silver" /> :
            list.error ? <p className="text-primary">Não foi possível carregar as inscrições.</p> :
            tab === "dash" ? <Dashboard apps={list.data ?? []} /> : <Candidates apps={list.data ?? []} />}
          <div className="mt-16"><Ornament /></div>
        </>
      )}
    </div>
  );
}
