// Settings come from the environment: on Vercel the project's environment
// variables; locally server/.env, loaded by the local entry points
// (server.js, setup-admin.js; see loadEnv.js) so the deployed function never
// references, or bundles, that file. Every option: server/.env.example.
const site = require('../../shared/site.json')

const env = (key, fallback = '') => String(process.env[key] ?? fallback).trim()
const port = Number(env('SMTP_PORT', '465'))

module.exports = {
  site,
  onVercel: !!process.env.VERCEL,
  mongoUri: env('MONGO_URI'),
  jwt: {
    secret: env('JWT_SECRET'),
    ttl: env('JWT_TTL', '12h'),
    issuer: 'harshil-portfolio',
    audience: 'admin',
  },
  // First sign-in on a fresh database creates this admin (see authController).
  bootstrapAdmin: { username: env('ADMIN_USERNAME').toLowerCase(), password: env('ADMIN_PASSWORD') },
  siteUrl: env('SITE_URL', site.siteUrl).replace(/\/+$/, ''),
  mail: {
    host: env('SMTP_HOST', 'smtp.gmail.com'),
    port,
    secure: env('SMTP_SECURE', port === 465 ? 'true' : 'false') === 'true',
    user: env('SMTP_USER'),
    // Gmail shows app passwords in groups of four; the spaces are not part of it.
    pass: env('SMTP_PASS').replace(/\s+/g, ''),
    to: env('MAIL_TO', site.email),
    fromName: env('MAIL_FROM_NAME', site.name),
  },
}
