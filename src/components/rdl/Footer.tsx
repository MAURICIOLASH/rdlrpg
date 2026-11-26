import { Logo } from "./Logo";
import { Ornament } from "./Reveal";

export function Footer() {
  return (
    <footer className="stone-texture border-t border-border px-4 py-14 text-center">
      <Logo className="mx-auto h-24" />
      <p className="mt-4 font-display text-lg font-bold tracking-[0.35em] text-primary">RDL INFERNAIS</p>
      <p className="mt-2 font-display text-xs tracking-[0.3em] text-steel">PRISTON TALE — ZEPHIRA WORLD</p>
      <div className="my-6"><Ornament /></div>
      <p className="font-display text-xs tracking-[0.4em] text-silver">FORÇA. HONRA. LEALDADE.</p>
      <p className="mt-8 text-xs text-steel">© {new Date().getFullYear()} RDL Infernais. Todos os direitos reservados.</p>
    </footer>
  );
}
