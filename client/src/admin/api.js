// The signed-in session: the JWT, when it expires and who it belongs to.
const KEY = 'hb-admin'

export const session = {
  get() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null')
      return s?.token && new Date(s.expiresAt) > new Date() ? s : null
    } catch {
      return null
    }
  },
  set(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      // Storage blocked: the session lasts until the tab is closed.
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch {
      // Nothing stored.
    }
  },
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const token = auth ? session.get()?.token : null
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Can’t reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new ApiError(res.status, data.message || `Request failed (${res.status}).`, data.errors)
    if (res.status === 401 && auth) onUnauthorized(err.message)
    throw err
  }
  return data
}
