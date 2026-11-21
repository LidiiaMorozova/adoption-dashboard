const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

/** True in the static demo build, where requests are answered in the browser instead of by the API. */
export const IS_DEMO = import.meta.env.VITE_DEMO === 'true';

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

function toApiError(status: number, body: ErrorBody | null): ApiError {
  const message = Array.isArray(body?.message)
    ? body.message.join('. ')
    : body?.message ?? `Request failed with status ${status}.`;
  return new ApiError(status, body?.code, message);
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (IS_DEMO) {
    // Loaded on demand, so the regular build does not include the demo code.
    const {demoRequest} = await import('./demo');
    const result = await demoRequest(init.method ?? 'GET', path, init.body ? JSON.parse(String(init.body)) : undefined);
    if (result.status >= 400) throw toApiError(result.status, result.body as ErrorBody);
    return result.body as T;
  }

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
    throw toApiError(response.status, (await response.json().catch(() => null)) as ErrorBody | null);
  }

  return (await response.json()) as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
