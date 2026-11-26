import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Início" },
  { to: "/o-cla", label: "O Clã" },
  { to: "/recrutamento", label: "Recrutamento" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-abyss/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-10" />
          <span className="font-display text-sm font-bold tracking-[0.3em] text-primary">RDL INFERNAIS</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-steel transition-colors hover:text-primary data-[status=active]:text-primary">
              {n.label}
            </Link>
          ))}
          <Link to="/recrutamento" className="btn-metal px-5 py-2.5 text-[11px]">Ingressar no Clã</Link>
        </nav>
        <button className="md:hidden p-2 text-silver" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden stone-texture border-t border-border px-4 py-6 flex flex-col gap-5">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className="font-display text-sm uppercase tracking-[0.25em] text-silver">{n.label}</Link>
          ))}
          <Link to="/recrutamento" onClick={() => setOpen(false)} className="btn-metal px-5 py-3 text-xs text-center">Ingressar no Clã</Link>
        </nav>
      )}
    </header>
  );
}
