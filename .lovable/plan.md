# Persisted thread history for the Agent tab

Add multi-thread chat history to `/agent`, stored in browser localStorage. Each thread has its own URL so reloading restores the right conversation, and threads stay scoped to the device.

## UX

- `/agent` route becomes a layout with a left thread list + right active-thread chat (on the 480px mobile frame, the list collapses into a drawer toggled from the header).
- Active thread lives at `/agent/$threadId`. Visiting `/agent` selects the most recent thread, or creates a new empty one if none exist, then navigates to its URL.
- Header gains: agent title, "New chat" button (➕), and a "Threads" toggle that opens a slide-in panel listing threads (title, last message preview, relative time, delete button).
- Auto-title: first user message (truncated to ~40 chars) becomes the thread title. Editable inline later (out of scope now).
- Empty state for a brand-new thread shows the existing seed message.

## Technical

**Storage shape** (single key `wardrobe.agent.threads.v1`):
```ts
type StoredThread = { id: string; title: string; updatedAt: number; messages: ChatMessage[] };
type Store = { threads: StoredThread[] };
```

**New files**
- `src/lib/agent-threads.ts` — pure helpers: `loadStore`, `saveStore`, `createThread`, `updateThread`, `deleteThread`, `getThread`. All SSR-safe (`typeof window` guard). Idempotent bootstrap returns existing store or `{ threads: [] }`.
- `src/hooks/useAgentThreads.ts` — React hook wrapping the helpers, exposing `threads`, `activeThread`, `sendMessage`, `newThread`, `deleteThread`, plus `typing` state. Persists on every mutation inside the same setter (no `useEffect` race). Bootstraps default thread once, guarded by a ref to survive StrictMode.
- `src/routes/agent.tsx` — converted to a layout route: header + `<Outlet />`. Index handler (`/agent`) redirects to latest/new thread.
- `src/routes/agent.$threadId.tsx` — renders `<ChatWindow threadId={...} />`, keyed by `threadId` so messages can't bleed across threads.
- `src/components/agent/ThreadList.tsx` — slide-in panel; non-nested buttons (row = `div`, select + delete are sibling `<button>`s).

**Changed files**
- `src/components/agent/ChatWindow.tsx` — accepts `threadId` prop; reads/writes that thread via the hook instead of local `useState`. Keeps focus behavior (focus on mount, after send, after stream, after thread switch).
- `src/components/layout/BottomTabBar.tsx` — `/agent` tab uses `activeOptions={{ exact: false }}` (already does) so child routes stay highlighted.

**Server functions** — unchanged. `sendAgentMessage` continues to receive the full message history of the active thread, so Nebius gets correct context per thread.

**Pink palette** — all new UI uses the existing `#FFE3E3` / `rose-200` / `zinc-900` tokens already in the app.

## Out of scope

- Cloud sync, multi-device, rename UI, export, search across threads.
- Server-side persistence (would require Lovable Cloud + auth — user explicitly chose localStorage).

## Verification

1. Send a message → reload `/agent/<id>` → messages restored.
2. Click "New chat" → navigates to a new `/agent/<id>` URL → seed message visible, old thread still in list.
3. Switch threads via the list → URL changes, message history swaps, composer stays focused.
4. Delete active thread → falls back to next thread (or creates a new one if list is empty).
5. Open in a fresh incognito → empty state, one default thread bootstrapped (no duplicates from StrictMode).
