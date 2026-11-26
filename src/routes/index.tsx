import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, Recruit } from "@/components/rdl/Sections";
import { Intro } from "@/components/rdl/Intro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RDL Infernais — Priston Tale Zephira World" },
      { name: "description", content: "Portal oficial de recrutamento do clã RDL Infernais em Priston Tale, servidor Zephira World. Força. Honra. Lealdade." },
      { property: "og:title", content: "RDL Infernais — Priston Tale Zephira World" },
      { property: "og:description", content: "Portal oficial de recrutamento do clã RDL Infernais. Força. Honra. Lealdade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Intro />
      <Hero />
      <About />
      <Recruit />
    </>
  );
}
