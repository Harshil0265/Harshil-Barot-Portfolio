const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const { jwt: cfg, bootstrapAdmin } = require('../config')
const { HttpError } = require('../lib/http')

// Compared against when the username doesn't exist, so a wrong username
// takes as long as a wrong password.
const DUMMY_HASH = '$2b$12$co/GW4SduZUgrfK.uNmhr.MzeXeE.rdqLkxAa/dI9PEVvO8owBNgm'
const PASSWORD_MIN = 8

const str = (v) => (typeof v === 'string' ? v : '')
const sameText = (a, b) => {
  const x = crypto.createHash('sha256').update(a).digest()
  const y = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(x, y)
}

function issue(admin) {
  const token = jwt.sign({ sub: String(admin._id), username: admin.username }, cfg.secret, {
    algorithm: 'HS256',
    expiresIn: cfg.ttl,
    issuer: cfg.issuer,
    audience: cfg.audience,
  })
  const { exp } = jwt.decode(token)
  return { token, expiresAt: new Date(exp * 1000).toISOString(), admin: { username: admin.username } }
}

// First run on a fresh database: signing in with ADMIN_USERNAME and
// ADMIN_PASSWORD from the environment creates that admin. Once any admin
// exists this does nothing, so those variables can then be removed.
async function bootstrap(username, password) {
  if (!bootstrapAdmin.username || !bootstrapAdmin.password) return null
  if (!sameText(username, bootstrapAdmin.username) || !sameText(password, bootstrapAdmin.password)) return null
  if ((await Admin.estimatedDocumentCount()) > 0) return null
  if (password.length < PASSWORD_MIN) throw new HttpError(400, `ADMIN_PASSWORD must be at least ${PASSWORD_MIN} characters.`)
  await Admin.create({ username, password })
  return Admin.findOne({ username }).select('+password')
}

exports.login = async (req, res) => {
  if (!cfg.secret) throw new HttpError(500, 'Sign-in is not set up on the server (JWT_SECRET).')
  const username = str(req.body?.username).trim().toLowerCase()
  const password = str(req.body?.password)
  if (!username || !password) throw new HttpError(400, 'Enter your username and password.')

  const admin = (await Admin.findOne({ username }).select('+password')) || (await bootstrap(username, password))
  const ok = admin ? await admin.checkPassword(password) : await bcrypt.compare(password, DUMMY_HASH)
  if (!admin || !ok) throw new HttpError(401, 'That username and password don’t match.')

  admin.lastLoginAt = new Date()
  await admin.save()
  res.json(issue(admin))
}

exports.me = async (req, res) => {
  res.json({
    admin: { username: req.admin.username, lastLoginAt: req.admin.lastLoginAt },
    expiresAt: new Date(req.tokenExp * 1000).toISOString(),
  })
}

// Changing the password signs out every other session.
exports.changePassword = async (req, res) => {
  const current = str(req.body?.currentPassword)
  const next = str(req.body?.newPassword)
  const errors = {}
  if (!current) errors.currentPassword = 'Enter your current password'
  if (next.length < PASSWORD_MIN) errors.newPassword = `At least ${PASSWORD_MIN} characters`
  else if (next === current) errors.newPassword = 'Choose a different password'
  if (Object.keys(errors).length) throw new HttpError(422, 'Please check the highlighted fields.', { errors })

  const admin = await Admin.findById(req.admin._id).select('+password')
  if (!(await admin.checkPassword(current)))
    throw new HttpError(422, 'Please check the highlighted fields.', { errors: { currentPassword: 'That’s not your current password' } })

  admin.password = next
  await admin.save()
  res.json(issue(admin))
}
