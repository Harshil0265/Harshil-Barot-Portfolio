// Titles, descriptions, link previews and structured data for every public page.
// vite.config.js writes these into each page's HTML at build time, because
// WhatsApp, LinkedIn and X read the raw HTML and never run JavaScript.
import site from '../../../shared/site.json'
import { EDUCATION, PROFILE, PROJECTS } from './data'

const BASE = site.siteUrl
const NAME = site.name
const COMPANY = site.company.name

const url = (path) => `${BASE}${path === '/' ? '/' : path}`
const personId = `${BASE}/#person`
const companyId = `${BASE}/#company`

const person = {
  '@type': 'Person',
  '@id': personId,
  name: NAME,
  url: url('/'),
  image: `${BASE}/profile-photo.jpg`,
  jobTitle: 'Founder',
  description: `Young entrepreneur and founder of ${COMPANY}, helping startups and growing businesses launch faster and grow online.`,
  worksFor: { '@id': companyId },
  alumniOf: { '@type': 'EducationalOrganization', name: EDUCATION.place },
  address: { '@type': 'PostalAddress', addressLocality: 'Vadodara', addressRegion: 'Gujarat', addressCountry: 'IN' },
  email: site.email,
  telephone: site.phoneE164,
  knowsAbout: ['Entrepreneurship', 'Startups', 'Web Development', 'Product Development', 'Branding', 'Digital Marketing'],
  sameAs: site.socials.filter((s) => s.label !== 'WhatsApp').map((s) => s.href),
}

const breadcrumbs = (...crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url(path) })),
})

const home = {
  path: '/',
  title: `${NAME} | Young Entrepreneur & Founder, ${COMPANY}`,
  description: `${NAME} is a young entrepreneur from Vadodara and founder of ${COMPANY}, helping startups and growing businesses launch faster and grow online.`,
  type: 'website',
  image: '/og/home.jpg',
  imageAlt: `${NAME}, young entrepreneur and founder of ${COMPANY}`,
  schema: [
    person,
    { '@type': 'Organization', '@id': companyId, name: COMPANY, url: site.company.url, founder: { '@id': personId } },
    { '@type': 'WebSite', '@id': `${BASE}/#website`, url: url('/'), name: NAME, inLanguage: 'en-IN', publisher: { '@id': personId } },
    { '@type': 'ProfilePage', url: url('/'), name: `${NAME}, young entrepreneur`, mainEntity: { '@id': personId } },
  ],
}

const work = {
  path: '/work',
  title: `Work by ${NAME} | Websites, Products & Brands`,
  description: `Case studies from ${NAME}: websites, platforms and brands for startups and growing businesses, from B2B and EdTech to cafes and immigration services.`,
  type: 'website',
  image: '/og/work.jpg',
  imageAlt: `Selected work by ${NAME}`,
  schema: [
    {
      '@type': 'CollectionPage',
      url: url('/work'),
      name: `Work by ${NAME}`,
      author: person,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: url(`/work/${p.slug}`) })),
      },
    },
    breadcrumbs(['Home', '/'], ['Work', '/work']),
  ],
}

const projects = PROJECTS.map((p) => {
  const path = `/work/${p.slug}`
  return {
    path,
    // Search results get the keyword; the preview card gets the project's own line.
    title: `${p.title} Case Study | ${NAME}`,
    shareTitle: `${p.title}: ${p.tagline}`,
    description: p.summary,
    type: 'article',
    image: `/og/${p.slug}.jpg`,
    imageAlt: `${p.title}, a ${p.type} case study by ${NAME}`,
    schema: [
      {
        '@type': 'CreativeWork',
        url: url(path),
        name: p.title,
        headline: `${p.title}: ${p.tagline}`,
        description: p.summary,
        image: `${BASE}/og/${p.slug}.jpg`,
        genre: p.type,
        creator: person,
      },
      breadcrumbs(['Home', '/'], ['Work', '/work'], [p.title, path]),
    ],
  }
})

export const PAGES = [home, work, ...projects]
export const pageByPath = (path) => PAGES.find((p) => p.path === path)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const xHandle = `@${site.socials.find((s) => s.label.startsWith('X')).href.split('/').pop()}`

// Everything search engines and link previews read for a page.
export function headTags(page) {
  const shareTitle = esc(page.shareTitle || page.title)
  const description = esc(page.description)
  const image = `${BASE}${page.image}`
  const imageAlt = esc(page.imageAlt)
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': page.schema }).replace(/</g, '\\u003c')
  return `<title>${esc(page.title)}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${esc(NAME)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${url(page.path)}" />

    <meta property="og:type" content="${page.type}" />
    <meta property="og:site_name" content="${esc(NAME)}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${url(page.path)}" />
    <meta property="og:title" content="${shareTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${xHandle}" />
    <meta name="twitter:creator" content="${xHandle}" />
    <meta name="twitter:title" content="${shareTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />

    <script type="application/ld+json">${jsonLd}</script>`
}

// Readable text and links for anything that doesn't run JavaScript.
export function fallbackBody(page) {
  const heading = page.path === '/' ? `${NAME}, young entrepreneur` : page.shareTitle || page.title
  const links = [['Home', '/'], ['Work', '/work'], ...PROJECTS.map((p) => [p.title, `/work/${p.slug}`])]
  return `<noscript>
      <main style="max-width:640px;margin:0 auto;padding:48px 24px;font-family:system-ui,sans-serif;line-height:1.6;color:#f2f0ec;background:#0a0a0a">
        <h1>${esc(heading)}</h1>
        <p>${esc(page.description)}</p>
        <nav>${links.map(([label, href]) => `<a style="color:inherit;margin-right:16px" href="${href}">${esc(label)}</a>`).join('')}</nav>
        <p><a style="color:inherit" href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a></p>
      </main>
    </noscript>`
}
