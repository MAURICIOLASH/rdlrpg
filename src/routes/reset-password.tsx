import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/rdl/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — RDL Infernais" },
      { name: "description", content: "Defina uma nova senha de acesso da liderança." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Nova senha — RDL Infernais" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { setError("A senha precisa ter pelo menos 8 caracteres."); return; }
    if (pw !== pw2) { setError("As senhas não coincidem."); return; }
    setBusy(true); setError(null);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { setError("Link inválido ou expirado. Peça um novo na tela de acesso."); return; }
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <form onSubmit={onSubmit} className="stone-texture metal-border w-full max-w-sm space-y-5 p-8">
        <div className="text-center">
          <Logo className="mx-auto h-20" />
          <h1 className="mt-4 font-display text-sm font-bold tracking-[0.3em] text-primary">NOVA SENHA</h1>
        </div>
        <input className="field-dark" type="password" required autoComplete="new-password" placeholder="Nova senha" value={pw} onChange={(e) => setPw(e.target.value)} />
        <input className="field-dark" type="password" required autoComplete="new-password" placeholder="Confirmar senha" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        {error && <p role="alert" className="text-sm text-primary">⸸ {error}</p>}
        <button type="submit" disabled={busy} className="btn-metal flex w-full items-center justify-center gap-2 py-3 text-xs">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null} Salvar senha
        </button>
      </form>
    </div>
  );
}
