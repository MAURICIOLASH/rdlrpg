import { createFileRoute } from "@tanstack/react-router";
import { About, Recruit } from "@/components/rdl/Sections";

export const Route = createFileRoute("/o-cla")({
  head: () => ({
    meta: [
      { title: "O Clã — RDL Infernais" },
      { name: "description", content: "Conheça o RDL Infernais: união, lealdade e guerra em Priston Tale, Zephira World." },
      { property: "og:title", content: "O Clã — RDL Infernais" },
      { property: "og:description", content: "Mais que um clã. Uma legião." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (<div className="pt-16"><About /><Recruit /></div>),
});
