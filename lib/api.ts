const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/**
 * Typed wrapper around native fetch targeting the GoFastrr backend.
 * Never sends credentials or merchant keys from the browser.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = new Error(body?.error ?? `API ${res.status}`);
    (err as ApiError).status = res.status;
    (err as ApiError).body = body;
    throw err;
  }

  return res.json();
}

export interface ApiError extends Error {
  status: number;
  body: unknown;
}
