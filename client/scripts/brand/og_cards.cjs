// Link-preview images: public/og/home.jpg, work.jpg and <slug>.jpg (1200x630),
// the pictures WhatsApp, LinkedIn and X show when a page is shared.
// See README.md in this folder for how to run it.
const fs = require('fs')
const path = require('path')
const Module = require('module')
const esbuild = require('esbuild')
const puppeteer = require('puppeteer-core')

const CLIENT = path.join(__dirname, '..', '..')
const OUT = path.join(CLIENT, 'public', 'og')
const BASE = process.env.PREVIEW_URL || 'http://localhost:4173'
const QUALITY = 86
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function loadData() {
  const { outputFiles } = esbuild.buildSync({
    entryPoints: [path.join(CLIENT, 'src/site/data.js')],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
  })
  const m = new Module('data')
  m._compile(outputFiles[0].text, 'data.js')
  return m.exports
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..600;1,400..600&family=Inter+Tight:wght@400;500&display=swap'

const shell = (body, css = '') => `<!doctype html><html><head><base href="${BASE}/"><link href="${FONTS}" rel="stylesheet"><style>
  * { box-sizing: border-box; margin: 0; }
  body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: radial-gradient(90% 120% at 100% 0%, #1c1c1b, #0a0a0a 62%); color: #f2f0ec; font-family: 'Inter Tight', sans-serif; }
  .logo { position: absolute; left: 52px; top: 44px; width: 62px; height: 62px; border-radius: 12px; }
  .side { position: absolute; left: 56px; bottom: 112px; width: 430px; }
  .kind { margin-bottom: 18px; font-size: 22px; color: rgba(242, 240, 236, 0.62); }
  h1 { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: 76px; line-height: 0.98; letter-spacing: -0.025em; }
  .line { margin-top: 20px; font-family: 'Playfair Display', serif; font-style: italic; font-size: 30px; line-height: 1.15; color: rgba(242, 240, 236, 0.74); }
  .site { position: absolute; left: 56px; bottom: 46px; font-size: 22px; color: rgba(242, 240, 236, 0.62); }
  .shot { position: absolute; object-fit: cover; object-position: top; border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); }
  ${css}
</style></head><body><img class="logo" src="apple-touch-icon.png" alt="">${body}<p class="site">harshilbarot.in</p></body></html>`

const projectCard = (p) =>
  shell(
    `<div class="side"><p class="kind">Case study · ${p.type}</p><h1>${p.title}</h1><p class="line">${p.tagline}</p></div>
     <img class="shot" src="work/${p.slug}.webp" alt="" style="left:492px;top:105px;width:672px;height:420px;border-radius:16px">`,
  )

const workCard = (projects) =>
  shell(
    `<div class="side"><p class="kind">Selected work</p><h1 style="font-size:112px">The work.</h1><p class="line">Websites, products and brands</p></div>
     ${projects
       .slice(0, 3)
       .map((p, i) => {
         const place = [
           'left:640px;top:40px;transform:rotate(3deg)',
           'left:590px;top:190px;transform:rotate(-2deg)',
           'left:700px;top:340px;transform:rotate(1.5deg)',
         ][i]
         return `<img class="shot" src="work/${p.slug}.webp" alt="" style="width:600px;height:375px;border-radius:14px;${place}">`
       })
       .join('')}`,
  )

async function shootCard(page, name, html) {
  await page.setContent(html, { waitUntil: 'load', timeout: 60000 })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
  })
  await page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: QUALITY })
}

// The home card is the real hero: the pixel portrait above the name.
async function shootHome(browser, company) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 30000 })
  await page.addStyleTag({
    content: `.grain, .hdr__meta, .hero__cta { display: none !important; }
      .hero__intro { max-width: none; font-size: 30px; line-height: 1.2; font-family: 'Playfair Display', serif; font-style: italic; color: #f2f0ec; }
      .portrait__canvas { filter: brightness(1.3) contrast(1.05); }
      .og-site { font-size: 22px; color: rgba(242, 240, 236, 0.7); }`,
  })
  await page.evaluate((c) => {
    document.querySelector('.hero__intro').innerHTML = `Young entrepreneur.<br>Founder of ${c}.`
    const site = document.createElement('span')
    site.className = 'og-site'
    site.textContent = 'harshilbarot.in'
    document.querySelector('.hero__row').appendChild(site)
  }, company)
  await wait(5000)
  await page.screenshot({ path: path.join(OUT, 'home.jpg'), type: 'jpeg', quality: QUALITY })
  await page.close()
}

;(async () => {
  const { PROJECTS, PROFILE } = loadData()
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME, headless: true })
  await shootHome(browser, PROFILE.company.name)
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  await shootCard(page, 'work', workCard(PROJECTS))
  for (const p of PROJECTS) await shootCard(page, p.slug, projectCard(p))
  await browser.close()
  for (const f of fs.readdirSync(OUT)) console.log(f.padEnd(24), `${Math.round(fs.statSync(path.join(OUT, f)).size / 1024)} KB`)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
