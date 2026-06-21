import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { MobileFrame } from "../components/layout/MobileFrame";
import { BottomTabBar } from "../components/layout/BottomTabBar";

function NotFoundComponent() {
  return (
    <MobileFrame>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">404</p>
        <h1 className="mt-3 text-2xl font-light text-zinc-900">Not found</h1>
        <p className="mt-2 text-sm text-zinc-600">This page isn't in your closet.</p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-zinc-900 px-5 py-2 text-sm text-[#FFE3E3]"
        >
          Back to Today
        </Link>
      </div>
    </MobileFrame>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <MobileFrame>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-lg font-light text-zinc-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-zinc-600">Try again or head back home.</p>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-[#FFE3E3]"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-rose-300 px-5 py-2 text-sm text-zinc-900">
            Home
          </a>
        </div>
      </div>
    </MobileFrame>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#FFE3E3" },
      { title: "Wardrobe Agent" },
      { name: "description", content: "Your AI wardrobe concierge — daily outfits, chat, and closet insights." },
      { property: "og:title", content: "Wardrobe Agent" },
      { property: "og:description", content: "Your AI wardrobe concierge." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#FFE3E3]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MobileFrame>
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <BottomTabBar />
      </MobileFrame>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

