import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — RDL Infernais" },
      { name: "description", content: "Como o RDL Infernais usa os dados enviados na ficha de recrutamento." },
      { property: "og:title", content: "Política de Privacidade — RDL Infernais" },
      { property: "og:description", content: "Como usamos os dados da ficha de recrutamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28">
      <h1 className="font-gothic text-4xl text-metal sm:text-5xl">Política de Privacidade</h1>
      <div className="mt-8 space-y-5 text-foreground/80">
        <p>Os dados enviados na ficha de recrutamento são usados exclusivamente pela liderança do RDL Infernais para avaliar sua inscrição e entrar em contato com você.</p>
        <p>Não vendemos nem compartilhamos suas informações com terceiros. Somente os responsáveis pelo recrutamento têm acesso às inscrições, e nenhum candidato pode consultar a inscrição de outra pessoa.</p>
        <p>Você pode pedir a remoção dos seus dados a qualquer momento falando com a liderança do clã.</p>
      </div>
    </div>
  ),
});
