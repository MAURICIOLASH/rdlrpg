import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { Recruit } from "@/components/rdl/Sections";
import { Reveal, Ornament } from "@/components/rdl/Reveal";

export const Route = createFileRoute("/recrutamento")({
  head: () => ({
    meta: [
      { title: "Recrutamento — RDL Infernais" },
      { name: "description", content: "Inscreva seu personagem no RDL Infernais, clã de Priston Tale no servidor Zephira World." },
      { property: "og:title", content: "Recrutamento — RDL Infernais" },
      { property: "og:description", content: "Sua jornada começa aqui." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="pt-16">
      <Recruit />
      <section id="formulario" className="px-4 py-20">
        <Reveal className="stone-texture metal-border mx-auto max-w-2xl p-10 text-center">
          <ScrollText className="mx-auto text-silver" size={36} />
          <h2 className="mt-4 font-display text-xl font-bold tracking-[0.3em] text-primary">FORMULÁRIO DE RECRUTAMENTO</h2>
          <div className="my-5"><Ornament /></div>
          <p className="text-foreground/75">O formulário de inscrição será aberto em breve. Prepare seu personagem, guerreiro.</p>
        </Reveal>
      </section>
    </div>
  );
}
