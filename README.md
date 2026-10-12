# Wardrobe Agent

An AI wardrobe assistant. Chat with an agent that knows your closet, plans outfits for your day, and tracks "closet rot" (items you never wear). Built as a mobile-first web app.

> **Portfolio project:** This is an independent product demonstration, not a commercial service or company announcement. The repository contains no production credentials or private user data.

## Features

- **Today** - context-aware outfit suggestions based on your day and events
- **Closet** - your wardrobe grid, closet-rot detection, and ROI insights
- **Agent** - a chat assistant with persisted, multi-thread history (stored locally per device)
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
cp .env.example .env
bun dev
```

Then open the local URL printed in the terminal.

The optional AI and retrieval integrations use server-side environment variables:

- `NEBIUS_API_KEY` for model inference
- `HYDRADB_API_KEY` for wardrobe context and memory

Use your own development credentials. Never commit a populated `.env` file.

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

## Privacy and data

- Demo closet content is synthetic and included only to illustrate the interface.
- Chat thread state is stored locally in the browser for this prototype.
- API credentials are read only from server-side environment variables.
- No analytics or production user-data pipeline is included.
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

[MIT](./LICENSE)
