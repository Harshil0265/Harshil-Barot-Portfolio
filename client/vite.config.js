import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PAGES, fallbackBody, headTags, pageByPath } from './src/site/seo.js'

const fill = (html, page) =>
  html.replace('<!--seo:head-->', () => headTags(page)).replace('<!--seo:body-->', () => fallbackBody(page))

// Gives each page its own HTML (dist/index.html, dist/work.html,
// dist/work/<slug>.html): link previews and crawlers read these tags without
// running any JavaScript. vercel.json routes each address to its file.
function seoPages() {
  let config
  return {
    name: 'seo-pages',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml(html, ctx) {
      if (config.command !== 'serve') return html
      return fill(html, pageByPath(ctx.path) || pageByPath('/'))
    },
    closeBundle() {
      if (config.command !== 'build') return
      const outDir = resolve(config.root, config.build.outDir)
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const page of PAGES) {
        const file = join(outDir, page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, fill(template, page))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPages()],
  server: {
    // shared/site.json (profile, socials, contact form choices) sits beside client/.
    fs: { allow: ['..'] },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
