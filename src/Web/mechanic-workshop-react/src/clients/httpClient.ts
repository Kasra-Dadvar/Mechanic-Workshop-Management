// All requests go through the Vite dev proxy, which forwards /api to the backend.
const BASE_URL = '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (body && typeof body === 'object') {
      if (typeof body.detail === 'string' && body.detail) return body.detail
      if (typeof body.title === 'string' && body.title) return body.title
    }
  } catch {
    // Body was empty or not JSON; fall through to the generic message.
  }
  return `Request failed (${response.status} ${response.statusText}).`
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { method = 'GET', body } = options

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Could not reach the server. Check that the API is running.', 0)
  }

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  // Delete returns 204 with no body, so only parse JSON when there is some.
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
