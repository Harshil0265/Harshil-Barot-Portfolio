const { site } = require('../config')

// The same rules and messages as the form (client/src/site/components/ContactForm.jsx);
// the choices and limits come from shared/site.json, so both stay in step.
const { services: SERVICES, budgets: BUDGETS, limits: L } = site.inquiry

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const line = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '')
const text = (v) =>
  typeof v === 'string'
    ? v.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
    : ''

// "+91 88669 82848", "088669 82848", "0091…" and "8866982848" all become
// "+918866982848". Ten digits without a country code are taken as Indian.
function normalizePhone(raw) {
  const s = line(raw)
  if (!s || !/^\+?[\d\s().-]+$/.test(s)) return null
  let digits = s.replace(/\D/g, '')
  if (s.startsWith('+')) return `+${digits}`
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length === 10) return `+91${digits}`
  return `+${digits}`
}

function validateInquiry(body = {}) {
  const errors = {}
  const name = line(body.name)
  const email = line(body.email).toLowerCase()
  const company = line(body.company)
  const budget = line(body.budget)
  const message = text(body.message)
  const services = Array.isArray(body.services) ? [...new Set(body.services.map(line))].filter(Boolean) : []
  const phone = normalizePhone(body.phone)
  const phoneDigits = phone ? phone.length - 1 : 0

  if (!name) errors.name = 'Your name, please'
  else if (name.length < L.nameMin || name.length > L.nameMax) errors.name = `${L.nameMin} to ${L.nameMax} characters`
  else if (!NAME_RE.test(name)) errors.name = 'Letters, spaces, hyphens and apostrophes only'

  if (!email) errors.email = 'An email so I can reply'
  else if (email.length > L.emailMax || !EMAIL_RE.test(email)) errors.email = 'That email looks off'

  if (!line(body.phone)) errors.phone = 'A number to reach you on'
  else if (!phone || phoneDigits < L.phoneDigitsMin || phoneDigits > L.phoneDigitsMax)
    errors.phone = 'Check the number (add the country code outside India)'

  if (company.length > L.companyMax) errors.company = `Up to ${L.companyMax} characters`

  if (!services.length) errors.services = 'Pick at least one'
  else if (services.some((s) => !SERVICES.includes(s))) errors.services = 'Pick from the list'

  if (budget && !BUDGETS.includes(budget)) errors.budget = 'Pick from the list'

  if (!message) errors.message = 'A few lines about it'
  else if (message.length < L.messageMin) errors.message = `A little more, at least ${L.messageMin} characters`
  else if (message.length > L.messageMax) errors.message = `Up to ${L.messageMax} characters`

  return { errors, data: { name, email, phone, company, services, budget, message } }
}

module.exports = { validateInquiry, normalizePhone }
