const { site, siteUrl } = require('../config')
const { C, SERIF, SANS, esc, nl2br, formatTime, firstName, buttons, chips, details, link, layout } = require('./layout')

const host = siteUrl.replace(/^https?:\/\//, '')
const waLink = (phone, text) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
const prettyPhone = (p) => (p.startsWith('+91') && p.length === 13 ? `+91 ${p.slice(3, 8)} ${p.slice(8)}` : p)
const needs = (q) => (q.services.length ? q.services.join(', ') : 'a project')

const heading = (text, size = 44) =>
  `<h1 class="h1" style="margin:0;font-family:${SERIF};font-style:italic;font-weight:400;font-size:${size}px;line-height:1.04;letter-spacing:-0.02em;color:${C.fg}">${text}</h1>`
const eyebrow = (text) =>
  `<p style="margin:0 0 14px;font-family:${SANS};font-size:13px;line-height:1.4;color:${C.dim}">${text}</p>`
const para = (html, { color = C.soft, size = 16, margin = '16px 0 0' } = {}) =>
  `<p style="margin:${margin};font-family:${SANS};font-size:${size}px;line-height:1.65;color:${color}">${html}</p>`
const label = (text) =>
  `<p style="margin:30px 0 10px;font-family:${SANS};font-size:13px;line-height:1.4;color:${C.dim}">${text}</p>`
const quote = (text) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.panel}" style="padding:20px 22px;background:${C.panel};border:1px solid ${C.line};border-radius:14px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.fg}">${nl2br(text)}</td></tr></table>`
const spacer = (h) => `<div style="height:${h}px;line-height:${h}px;font-size:0">&nbsp;</div>`

// To Harshil: everything in the brief, with one-tap ways to answer.
function notification(q) {
  const first = firstName(q.name)
  const subject = `New inquiry from ${q.name} · ${needs(q)}`
  const replyHref = `mailto:${q.email}?subject=${encodeURIComponent('Re: your project brief')}&body=${encodeURIComponent(`Hi ${first},\n\n`)}`
  const wa = waLink(q.phone, `Hi ${first}, this is ${site.name}. Thanks for your brief about ${needs(q).toLowerCase()}.`)
  const summary = [q.services.length ? esc(q.services.join(', ')) : '', q.budget ? `Budget ${esc(q.budget)}` : ''].filter(Boolean).join(' · ')

  const body = [
    eyebrow(esc(formatTime(q.createdAt))),
    heading(esc(q.name)),
    para(summary || 'Sent a brief from the site.', { margin: '12px 0 0' }),
    spacer(26),
    buttons([
      { href: replyHref, label: `Reply to ${first}`, solid: true },
      { href: wa, label: 'WhatsApp' },
      { href: `tel:${q.phone}`, label: 'Call' },
    ]),
    spacer(14),
    details([
      ['Email', link(`mailto:${q.email}`, q.email)],
      ['Phone', link(`tel:${q.phone}`, prettyPhone(q.phone))],
      ['Company', q.company ? esc(q.company) : ''],
      ['Needs', q.services.length ? chips(q.services) : ''],
      ['Budget', q.budget ? esc(q.budget) : ''],
    ]),
    label('About the project'),
    quote(q.message),
    spacer(30),
    buttons([{ href: `${siteUrl}/admin`, label: 'Open the inbox' }]),
    para(`Replying to this email answers ${esc(first)} directly.`, { color: C.dim, size: 13, margin: '6px 0 0' }),
  ].join('')

  const text = [
    `New brief from ${q.name}`,
    formatTime(q.createdAt),
    '',
    `Email:   ${q.email}`,
    `Phone:   ${prettyPhone(q.phone)}`,
    q.company ? `Company: ${q.company}` : null,
    q.services.length ? `Needs:   ${q.services.join(', ')}` : null,
    q.budget ? `Budget:  ${q.budget}` : null,
    '',
    'About the project:',
    q.message,
    '',
    `WhatsApp: ${wa}`,
    `Inbox:    ${siteUrl}/admin`,
    '',
    `Replying to this email answers ${first} directly.`,
  ]
    .filter((l) => l !== null)
    .join('\n')

  const html = layout({
    title: subject,
    preheader: `${needs(q)}${q.budget ? ` · ${q.budget}` : ''}: ${q.message.slice(0, 90)}`,
    kicker: 'New inquiry',
    body,
    footer: `Sent from the contact form on ${link(siteUrl, host)} · Inquiry ${esc(String(q._id).slice(-6))}`,
  })
  return { subject, html, text }
}

// To the client: a warm receipt of what they sent and what happens next.
function confirmation(q) {
  const first = firstName(q.name)
  const subject = `Thanks, ${first}. Your brief reached me`
  const whatsapp = site.socials.find((s) => s.label === 'WhatsApp')?.href
  const socials = site.socials.filter((s) => s.label !== 'WhatsApp')
  const excerpt = q.message.length > 420 ? `${q.message.slice(0, 420).trimEnd()}…` : q.message

  const body = [
    heading(`Thank you, ${esc(first)}.`),
    para(
      `Your brief reached me. I read every one myself and will reply within a day, usually sooner, at ${esc(q.email)}.`,
      { margin: '18px 0 0' },
    ),
    para(`If it’s urgent, message me on WhatsApp at ${link(whatsapp, site.phone)}.`),
    label('What you sent'),
    details([
      ['Needs', q.services.length ? chips(q.services) : ''],
      ['Budget', q.budget ? esc(q.budget) : ''],
      ['Company', q.company ? esc(q.company) : ''],
    ]),
    spacer(16),
    quote(excerpt),
    spacer(30),
    buttons([
      { href: `${siteUrl}/work`, label: 'See the work', solid: true },
      { href: whatsapp, label: 'WhatsApp me' },
    ]),
    spacer(22),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line}"><tr><td style="padding-top:24px">`,
    `<p style="margin:0;font-family:${SERIF};font-style:italic;font-size:24px;line-height:1.1;color:${C.fg}">${esc(site.name)}</p>`,
    para(`${esc(site.role)} · ${link(site.company.url, site.company.url.replace(/^https?:\/\//, ''))}`, { color: C.dim, size: 14, margin: '6px 0 0' }),
    para(socials.map((s) => link(s.href, s.label.replace(' / Twitter', ''))).join('&nbsp;&nbsp;·&nbsp;&nbsp;'), { size: 14, margin: '14px 0 0' }),
    `</td></tr></table>`,
  ].join('')

  const text = [
    `Thank you, ${first}.`,
    '',
    `Your brief reached me. I read every one myself and will reply within a day, usually sooner, at ${q.email}.`,
    `If it's urgent, message me on WhatsApp: ${whatsapp}`,
    '',
    'What you sent:',
    q.services.length ? `Needs:   ${q.services.join(', ')}` : null,
    q.budget ? `Budget:  ${q.budget}` : null,
    q.company ? `Company: ${q.company}` : null,
    '',
    excerpt,
    '',
    `See the work: ${siteUrl}/work`,
    '',
    site.name,
    site.role,
    ...socials.map((s) => `${s.label}: ${s.href}`),
  ]
    .filter((l) => l !== null)
    .join('\n')

  const html = layout({
    title: subject,
    preheader: 'I read every brief myself and will reply within a day.',
    kicker: 'Brief received',
    body,
    footer: `You’re receiving this because a brief was sent with this address on ${link(siteUrl, host)}. If that wasn’t you, you can ignore this email.`,
  })
  return { subject, html, text }
}

module.exports = { notification, confirmation }
