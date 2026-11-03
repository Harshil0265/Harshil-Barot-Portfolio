const { site, siteUrl } = require('../config')

// Email-safe building blocks: tables, inline styles and web-safe fallbacks,
// in the site's palette (near-black, warm white, Playfair italic headings).
const C = {
  bg: '#0a0a0a',
  card: '#121212',
  panel: '#181817',
  line: '#262625',
  fg: '#f2f0ec',
  soft: '#c9c6bf',
  dim: '#8f8c85',
  faint: '#5d5b56',
}
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "'Inter Tight', 'Helvetica Neue', Helvetica, Arial, sans-serif"

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
const nl2br = (s) => esc(s).replace(/\n/g, '<br>')

const timeFmt = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})
const formatTime = (d) => `${timeFmt.format(new Date(d)).replace(/\b(am|pm)\b/i, (m) => m.toUpperCase())} IST`

const firstName = (name) => String(name).trim().split(/\s+/)[0]

// Pill buttons; they wrap onto a new line on narrow screens.
function buttons(list) {
  return `<div style="font-size:0;line-height:0">${list
    .map(
      ({ href, label, solid }) =>
        `<a href="${esc(href)}" target="_blank" style="display:inline-block;margin:0 10px 10px 0;padding:13px 22px;border-radius:999px;border:1px solid ${
          solid ? C.fg : '#3a3a38'
        };background:${solid ? C.fg : C.card};color:${solid ? C.bg : C.fg};font-family:${SANS};font-size:14px;font-weight:600;line-height:1;text-decoration:none;mso-padding-alt:0">${esc(
          label,
        )}</a>`,
    )
    .join('')}</div>`
}

function chips(items) {
  return items
    .map(
      (s) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border:1px solid ${C.line};border-radius:999px;background:${C.panel};font-family:${SANS};font-size:13px;line-height:1.2;color:${C.fg}">${esc(
          s,
        )}</span>`,
    )
    .join('')
}

// Label / value rows; on phones the label sits above the value.
function details(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line}">${rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr class="stack"><td width="132" valign="top" style="padding:14px 16px 14px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:13px;line-height:1.5;color:${C.dim}">${esc(
          label,
        )}</td><td valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;line-height:1.5;color:${C.fg}">${value}</td></tr>`,
    )
    .join('')}</table>`
}

const link = (href, label) => `<a href="${esc(href)}" target="_blank" style="color:${C.fg};text-decoration:underline;text-decoration-color:#55534f">${esc(label)}</a>`

function layout({ title, preheader, kicker, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; background: ${C.bg}; }
  a { color: ${C.fg}; }
  @media (max-width: 620px) {
    .card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 36px !important; }
    .stack td { display: block !important; width: 100% !important; }
    .stack td:first-child { padding: 14px 0 3px !important; border-bottom: 0 !important; }
    .stack td:last-child { padding-top: 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg}">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all">${esc(preheader)}${'&#8199;&#847;'.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg}">
  <tr>
    <td align="center" style="padding:28px 0 36px">
      <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="width:100%;max-width:600px;background:${C.card};border:1px solid #232322;border-radius:22px">
        <tr>
          <td class="pad" style="padding:26px 40px 0">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" width="52"><a href="${esc(siteUrl)}" target="_blank"><img src="${esc(siteUrl)}/apple-touch-icon.png" width="40" height="40" alt="HB" style="display:block;border:0;border-radius:10px;font-family:${SERIF};font-style:italic;font-size:18px;color:${C.fg}"></a></td>
                <td valign="middle" style="font-family:${SERIF};font-style:italic;font-size:20px;line-height:1;color:${C.fg}">${esc(site.name)}</td>
                <td valign="middle" align="right" style="font-family:${SANS};font-size:11px;line-height:1;letter-spacing:0.12em;text-transform:uppercase;color:${C.dim}">${esc(kicker)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="pad" style="padding:30px 40px 38px">${body}</td>
        </tr>
      </table>
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
        <tr>
          <td class="pad" align="center" style="padding:22px 40px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.faint}">${footer}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

module.exports = { C, SERIF, SANS, esc, nl2br, formatTime, firstName, buttons, chips, details, link, layout }
