# Wardrobe Agent

An AI wardrobe assistant. Chat with an agent that knows your closet, plans outfits for your day, and tracks "closet rot" (items you never wear). Built as a mobile-first web app.

## Features

- **Today** — context-aware outfit suggestions based on your day and events
- **Closet** — your wardrobe grid, closet-rot detection, and ROI insights
- **Agent** — a chat assistant with persisted, multi-thread history (stored locally per device)
- Integrations scaffolding (e.g. Google Photos) for importing your wardrobe

## Tech stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- Vite 8
- Built with [Lovable](https://lovable.dev)

## Getting started

This project uses [Bun](https://bun.sh).

```bash
bun install
bun dev
```

Then open the local URL printed in the terminal.

### Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format with Prettier |

## Project structure

```
src/
  components/
    agent/     # chat UI (composer, window, threads)
    closet/    # wardrobe grid, closet-rot, ROI, integrations
    today/     # outfit cards, context widgets
    ui/        # shadcn/ui primitives
  routes/      # TanStack Router routes (incl. /agent/$threadId)
  hooks/       # e.g. useAgentThreads
  lib/         # helpers (agent-threads, etc.)
```

## License

MIT
