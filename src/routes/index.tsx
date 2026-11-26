import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, Recruit } from "@/components/rdl/Sections";
import { Intro } from "@/components/rdl/Intro";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ origin: await getRequestOrigin() }),
  head: ({ loaderData }) => {
    const img = loaderData ? `${loaderData.origin}/og-share.jpg` : null;
    return {
      meta: [
        { title: "RDL Infernais | Recrutamento Priston Tale" },
        { name: "description", content: "Portal oficial de recrutamento do clã RDL Infernais no servidor Zephira World de Priston Tale." },
        { property: "og:title", content: "RDL Infernais | Recrutamento Priston Tale" },
        { property: "og:description", content: "Portal oficial de recrutamento do clã RDL Infernais no servidor Zephira World de Priston Tale." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(img ? [
          { property: "og:image", content: img },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { name: "twitter:image", content: img },
        ] : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
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
