import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/rdl/Header";
import { Footer } from "../components/rdl/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "../components/rdl/Logo";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <div className="smoke absolute -left-1/4 bottom-0 h-1/2 w-[150%]" />
      <div className="relative max-w-md text-center">
        <Logo className="mx-auto h-28 opacity-80" />
        <p className="mt-6 font-display text-6xl font-black tracking-[0.2em] text-metal">404</p>
        <h1 className="mt-4 font-gothic text-3xl text-metal sm:text-4xl">Caminho perdido nas trevas.</h1>
        <p className="mt-4 text-foreground/75">A página que você procura não existe ou foi movida.</p>
        <Link to="/" className="btn-metal mt-8 inline-block px-8 py-3 text-xs">Voltar ao início</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <div className="max-w-md text-center">
        <Logo className="mx-auto h-24 opacity-80" />
        <h1 className="mt-6 font-display text-xl font-bold tracking-[0.2em] text-primary">ALGO DEU ERRADO</h1>
        <p className="mt-3 text-foreground/75">Não foi possível carregar esta página. Tente novamente ou volte ao início.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-metal px-6 py-3 text-xs">Tentar novamente</button>
          <a href="/" className="btn-ghost-metal px-6 py-3 text-xs">Voltar ao início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RDL Infernais | Recrutamento Priston Tale" },
      { name: "description", content: "Portal oficial de recrutamento do clã RDL Infernais no servidor Zephira World de Priston Tale." },
      
      { property: "og:title", content: "RDL Infernais | Recrutamento Priston Tale" },
      { property: "og:site_name", content: "RDL Infernais" },
      { property: "og:description", content: "Portal oficial de recrutamento do clã RDL Infernais no servidor Zephira World de Priston Tale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cinzel:wght@500;600;700;900&family=Barlow:ital,wght@0,400;0,500;1,400&display=swap" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Header />
      <main>
        <Outlet />
        <Toaster theme="dark" position="bottom-right" />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
