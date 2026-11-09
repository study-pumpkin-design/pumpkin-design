export type ApiResult = Record<string, unknown>;

const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api/v1";

export async function authRequest(path: string, body: Record<string, string>) {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (response.status === 204) return {};
  const data = (await response.json().catch(() => ({}))) as ApiResult;
  if (!response.ok)
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "We couldn’t complete that request. Please try again.",
    );
  return data;
}
