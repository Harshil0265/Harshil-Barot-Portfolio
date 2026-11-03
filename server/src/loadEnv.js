// Local only: required first by server.js and setup-admin.js, never by the
// Vercel function.
const dns = require('dns')
const path = require('path')

// Reads server/.env into process.env (values already set win).
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true })

// mongodb+srv:// addresses need a DNS SRV lookup. VPNs and local DNS tools can
// leave Node with only a loopback resolver that refuses it (querySrv
// ECONNREFUSED), so fall back to public DNS for those lookups.
if (dns.getServers().every((s) => s === '127.0.0.1' || s === '::1')) dns.setServers(['1.1.1.1', '8.8.8.8'])
