import { createFileRoute } from "@tanstack/react-router";
import { Ash } from "@/components/rdl/Ash";
import { Ornament } from "@/components/rdl/Reveal";
import { RecruitForm } from "@/components/rdl/recruit/RecruitForm";

export const Route = createFileRoute("/recrutamento")({
  head: () => ({
    meta: [
      { title: "Recrutamento — RDL Infernais" },
      { name: "description", content: "Inscreva seu personagem no RDL Infernais, clã de Priston Tale no servidor Zephira World." },
      { property: "og:title", content: "Recrutamento — RDL Infernais" },
      { property: "og:description", content: "Sua jornada começa aqui. Preencha a ficha oficial de recrutamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-28">
      <Ash count={20} />
      <div className="smoke absolute -left-1/4 top-0 h-96 w-[150%]" />
      <div className="relative mb-10 text-center">
        <h1 className="font-gothic text-4xl text-metal sm:text-6xl">Sua jornada começa aqui.</h1>
        <div className="mt-5"><Ornament /></div>
      </div>
      <div className="relative"><RecruitForm /></div>
    </div>
  );
}
