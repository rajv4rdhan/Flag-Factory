import type { AskResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

/** Send a prompt to the Maze backend. */
export async function ask(prompt: string, sessionId: string | null): Promise<AskResponse> {
  const res = await fetch(`${API_BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, session_id: sessionId }),
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { detail?: string };
      if (data.detail) detail = data.detail;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(detail);
  }

  return (await res.json()) as AskResponse;
}
