# Harshil Barot, portfolio

Personal site of Harshil Barot, founder of [Akshar Nirmaan](https://aksharnirmaan.com).
A pixel portrait that bursts into a 3D fly-through of the work, with case studies
for every project and a small API for the contact inbox.

## Structure

```
client/                  React + Vite front end (deployed to Vercel)
  public/                Static assets: portrait, favicons, résumé, project screenshots
    work/                Fly-through cards (<slug>.webp), thumbnails, tile atlas and
                         case-study galleries (<slug>/d1.webp…, m1.webp…)
  scripts/brand/         Generators for the portrait, logo paths and tile atlas
  src/
    App.jsx              Home page: hero, fly-through, the box (Selected / About / Contact / projects)
    main.jsx             Routes
    site/                The site
      data.js            All content: profile, projects, case-study copy, nav
      Scene.js           WebGL scene (portrait, tiles, project cards)
      CaseStudy.jsx      /work/:slug
      Work.jsx           /work
      components/        Header, Hero, Loader, Selected, Box, ContactForm, Footer…
    components/          Admin inbox (Ctrl + Shift + A)
server/                  Express + MongoDB API: contact form and admin auth
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: portrait, fly-through of the projects, Selected / About / Contact box |
| `/work` | All projects |
| `/work/:slug` | Case study |

## Getting started

Requires Node.js 18+ and MongoDB (local or Atlas).

```bash
npm install            # root: just `concurrently`
npm run install-all    # server + client dependencies
npm run dev            # API on :5000 and the site on :5173 (Vite proxies /api)
```

`server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=a-long-random-string
```

Create the admin account for the inbox once with `node server/src/setup-admin.js`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API and site together |
| `npm run client` / `npm run server` | One of them |
| `npm run build` | Production build of the site into `client/dist` |

## Editing content

Text, projects and links live in `client/src/site/data.js`. Each project has a
slug, its copy, and `shots: [desktop, mobile]`, the number of gallery images in
`client/public/work/<slug>/`. A new project's slug also goes in the
`/work/:slug(...)` list in `vercel.json` (any other path is a 404) and in
`client/public/sitemap.xml`. The brand generators are described in
`client/scripts/brand/README.md`.

## Deploying

`vercel.json` builds `client/` and serves the app only at `/`, `/work` and the
project slugs; every other path gets Vercel's 404. The API is a
separate Node service: host it (for example on Render or Railway) and route
`/api` to it, otherwise the contact form cannot deliver in production.
