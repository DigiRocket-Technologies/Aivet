const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

// The API answers with an envelope — { success, data } on success,
// { success: false, message } on failure. Callers only ever want `data`,
// so unwrap it here rather than in every hook.
interface Envelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the API running?", 0);
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok) {
    // A stale or forged token should drop the session rather than leave the
    // UI in a half-signed-in state.
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    throw new ApiError(body?.message ?? `Request failed (${res.status})`, res.status);
  }

  return (body && "data" in body ? body.data : body) as T;
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(path: string)                => request<T>(path, { method: "DELETE" }),
};
