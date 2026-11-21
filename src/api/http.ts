const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    /** HTTP status, or 0 when the server could not be reached. */
    readonly status: number,
    /** Machine-readable error code from the API, such as `SLOT_TAKEN`. */
    readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ErrorBody {
  code?: string;
  message?: string | string[];
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? {'Content-Type': 'application/json'} : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'We could not reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorBody | null;
    const message = Array.isArray(body?.message)
      ? body.message.join('. ')
      : body?.message ?? `Request failed with status ${response.status}.`;
    throw new ApiError(response.status, body?.code, message);
  }

  return (await response.json()) as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
