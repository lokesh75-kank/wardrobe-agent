// Server-only HydraDB v2 client. Docs: https://docs.hydradb.com/api-reference/v2
// All calls go through `fetch` so this stays Cloudflare Worker safe.

const BASE_URL = "https://api.hydradb.com";

export const TENANT_ID = "wardrobe_agent";
export const SUB_TENANT_ID = "user_demo";

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const key = process.env.HYDRADB_API_KEY;
  if (!key) throw new Error("Missing HYDRADB_API_KEY");
  return {
    Authorization: `Bearer ${key}`,
    "API-Version": "2",
    ...extra,
  };
}

type Envelope<T> = {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
};

async function hydraFetch<T>(
  path: string,
  init: RequestInit,
): Promise<Envelope<T>> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  let json: Envelope<T>;
  try {
    json = text ? (JSON.parse(text) as Envelope<T>) : ({ success: res.ok, data: null, error: null } as Envelope<T>);
  } catch {
    throw new Error(`Hydra ${path} non-JSON ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok && json?.error?.code !== "TENANT_ALREADY_EXISTS") {
    throw new Error(`Hydra ${path} ${res.status}: ${json?.error?.message ?? text.slice(0, 200)}`);
  }
  return json;
}

// --- Tenants ---

export async function createTenant(): Promise<void> {
  await hydraFetch("/tenants", {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      tenant_id: TENANT_ID,
      tenant_metadata_schema: [
        { name: "category", data_type: "VARCHAR", max_length: 64, enable_match: true },
        { name: "brand", data_type: "VARCHAR", max_length: 64, enable_match: true },
        { name: "image_key", data_type: "VARCHAR", max_length: 64, enable_match: true },
        { name: "item_id", data_type: "VARCHAR", max_length: 64, enable_match: true },
      ],
    }),
  }).catch((e) => {
    // Ignore "already exists" — POST is idempotent for our purposes.
    if (!String(e).includes("ALREADY_EXISTS")) throw e;
  });
}

export async function tenantStatus(): Promise<{ ready: boolean }> {
  try {
    const res = await hydraFetch<{ infra?: { ready_for_ingestion?: boolean } }>(
      `/tenants/status?tenant_id=${encodeURIComponent(TENANT_ID)}`,
      { method: "GET", headers: authHeaders() },
    );
    return { ready: Boolean(res.data?.infra?.ready_for_ingestion) };
  } catch {
    return { ready: false };
  }
}

// --- Ingest ---

export type KnowledgeItem = {
  id: string;
  title: string;
  text: string;
  metadata: Record<string, string | number>;
};

export async function ingestKnowledge(items: KnowledgeItem[]): Promise<void> {
  const form = new FormData();
  form.set("type", "knowledge");
  form.set("tenant_id", TENANT_ID);
  form.set("sub_tenant_id", SUB_TENANT_ID);
  form.set("upsert", "true");
  form.set(
    "app_knowledge",
    JSON.stringify(
      items.map((it) => ({
        id: it.id,
        tenant_id: TENANT_ID,
        sub_tenant_id: SUB_TENANT_ID,
        title: it.title,
        type: "wardrobe_item",
        content: { text: it.text },
        metadata: it.metadata,
      })),
    ),
  );
  await hydraFetch("/context/ingest", {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
}

export async function ingestMemory(
  text: string,
  metadata: Record<string, string | number>,
): Promise<void> {
  const form = new FormData();
  form.set("type", "memory");
  form.set("tenant_id", TENANT_ID);
  form.set("sub_tenant_id", SUB_TENANT_ID);
  form.set(
    "memories",
    JSON.stringify([{ text, infer: false, metadata }]),
  );
  await hydraFetch("/context/ingest", {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
}

// --- Query ---

export type QueryHit = {
  title?: string;
  text?: string;
  content?: { text?: string };
  metadata?: Record<string, unknown>;
  score?: number;
};

export async function query(opts: {
  query: string;
  type?: "knowledge" | "memory" | "all";
  mode?: "fast" | "thinking";
  maxResults?: number;
}): Promise<QueryHit[]> {
  const res = await hydraFetch<{ results?: QueryHit[]; hits?: QueryHit[] }>(
    "/query",
    {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        tenant_id: TENANT_ID,
        sub_tenant_id: SUB_TENANT_ID,
        query: opts.query,
        type: opts.type ?? "all",
        query_by: "hybrid",
        mode: opts.mode ?? "fast",
        max_results: opts.maxResults ?? 10,
      }),
    },
  );
  return res.data?.results ?? res.data?.hits ?? [];
}

// --- List (used for closet stats) ---

export type ListedSource = {
  id?: string;
  title?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
};

export async function listContext(
  type: "knowledge" | "memory",
  pageSize = 100,
): Promise<ListedSource[]> {
  try {
    const res = await hydraFetch<{ sources?: ListedSource[]; items?: ListedSource[] }>(
      "/context/list",
      {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          sub_tenant_id: SUB_TENANT_ID,
          type,
          page: 1,
          page_size: pageSize,
        }),
      },
    );
    return res.data?.sources ?? res.data?.items ?? [];
  } catch {
    return [];
  }
}

