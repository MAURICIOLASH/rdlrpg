import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/rdl/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso da Liderança — RDL Infernais" },
      { name: "description", content: "Área restrita da liderança do RDL Infernais." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso da Liderança — RDL Infernais" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setError("E-mail ou senha incorretos."); return; }
    navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <form onSubmit={onSubmit} className="stone-texture metal-border w-full max-w-sm space-y-5 p-8">
        <div className="text-center">
          <Logo className="mx-auto h-20" />
          <h1 className="mt-4 font-display text-sm font-bold tracking-[0.3em] text-primary">ACESSO DA LIDERANÇA</h1>
        </div>
        <input className="field-dark" type="email" required autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field-dark" type="password" required autoComplete="current-password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p role="alert" className="text-sm text-primary">⸸ {error}</p>}
        <button type="submit" disabled={busy} className="btn-metal flex w-full items-center justify-center gap-2 py-3 text-xs">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null} Entrar
        </button>
        <p className="text-center text-xs text-steel">Acesso somente para administradores autorizados.</p>
      </form>
    </div>
  );
}
