// An error whose message is safe to show the visitor.
class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message)
    this.status = status
    this.extra = extra
  }
}

const { onVercel } = require('../config')

// The visitor's address. On Vercel the platform sets x-real-ip itself;
// anywhere else that header could be forged, so only the socket counts.
const clientIp = (req) => (onVercel && req.get('x-real-ip')) || req.ip || ''

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Fixed-window limiter kept in memory. On serverless each warm instance keeps
// its own count, so it is a speed bump for bots, not a hard guarantee.
function rateLimit({ windowMs, max, message }) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const key = clientIp(req)
    let entry = hits.get(key)
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs }
      hits.set(key, entry)
    }
    entry.count += 1
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k)
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)))
      return res.status(429).json({ message })
    }
    next()
  }
}

module.exports = { HttpError, clientIp, escapeRegex, rateLimit }
