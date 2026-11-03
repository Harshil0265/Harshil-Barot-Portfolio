const jwt = require('jsonwebtoken')
const { jwt: cfg } = require('../config')
const Admin = require('../models/Admin')
const { HttpError } = require('../lib/http')

// Admin routes: a valid, unexpired token for an admin who still exists and
// hasn't changed their password since it was issued.
module.exports = async function requireAdmin(req, res, next) {
  if (!cfg.secret) throw new HttpError(500, 'Sign-in is not set up on the server (JWT_SECRET).')
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) throw new HttpError(401, 'Please sign in.')

  let payload
  try {
    payload = jwt.verify(token, cfg.secret, { algorithms: ['HS256'], issuer: cfg.issuer, audience: cfg.audience })
  } catch (err) {
    throw new HttpError(401, err.name === 'TokenExpiredError' ? 'Your session has expired. Please sign in again.' : 'Please sign in again.')
  }

  const admin = await Admin.findById(payload.sub)
  if (!admin || admin.passwordChangedAt.getTime() > payload.iat * 1000) throw new HttpError(401, 'Please sign in again.')

  req.admin = admin
  req.tokenExp = payload.exp
  next()
}
