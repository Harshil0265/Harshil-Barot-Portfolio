const nodemailer = require('nodemailer')
const { mail } = require('../config')
const { notification, confirmation } = require('../emails/inquiryEmails')

let transport = null

function getTransport() {
  if (!mail.user || !mail.pass) return null
  if (!transport) {
    transport = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.secure,
      auth: { user: mail.user, pass: mail.pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    })
  }
  return transport
}

const mailConfigured = () => !!(mail.user && mail.pass)

// Sends the notification (to Harshil) and the confirmation (to the client)
// together. Never throws: the inquiry is already saved, so a mail outage only
// shows up as a warning in the inbox.
async function sendInquiryEmails(inquiry) {
  const t = getTransport()
  if (!t) return { notified: false, confirmed: false, error: 'Email is not configured (SMTP_USER / SMTP_PASS).' }

  const from = { name: mail.fromName, address: mail.user }
  const toOwner = notification(inquiry)
  const toClient = confirmation(inquiry)
  const ref = String(inquiry._id)

  const [owner, client] = await Promise.allSettled([
    t.sendMail({
      from,
      to: mail.to,
      replyTo: { name: inquiry.name, address: inquiry.email },
      subject: toOwner.subject,
      html: toOwner.html,
      text: toOwner.text,
      headers: { 'X-Entity-Ref-ID': ref },
    }),
    t.sendMail({
      from,
      to: { name: inquiry.name, address: inquiry.email },
      replyTo: mail.to,
      subject: toClient.subject,
      html: toClient.html,
      text: toClient.text,
      headers: { 'X-Entity-Ref-ID': `${ref}-c` },
    }),
  ])

  const errors = [owner, client].filter((r) => r.status === 'rejected').map((r) => r.reason?.message || String(r.reason))
  if (errors.length) console.error('Inquiry email failed:', errors.join(' | '))
  return { notified: owner.status === 'fulfilled', confirmed: client.status === 'fulfilled', error: errors.join(' | ').slice(0, 500) }
}

module.exports = { sendInquiryEmails, mailConfigured }
