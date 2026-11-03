// Vercel serverless function. vercel.json rewrites every /api/* request to
// /api, and Vercel passes the rest of the path as ?path=<rest> (alongside the
// original query). Restore the original URL, then hand it to Express.
const app = require('../server/src/app')

module.exports = (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/api' && url.searchParams.has('path')) {
    const rest = url.searchParams.get('path')
    url.searchParams.delete('path')
    req.url = `/api/${rest}${url.search}`
  }
  return app(req, res)
}
