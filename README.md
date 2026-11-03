# Harshil Barot, portfolio

Personal site of Harshil Barot, founder of [Akshar Nirmaan](https://aksharnirmaan.com).
A pixel portrait that bursts into a 3D fly-through of the work, case studies for
every project, background music, and a private inbox: briefs sent through the
contact form are saved, emailed to Harshil, confirmed to the sender, and managed
at `/admin`. The site and its API both run on Vercel.

## Structure

```
client/                  React + Vite front end
  public/                Portrait, favicons, résumé, project screenshots
    audio/               Background music (Opus + AAC)
    work/                Fly-through cards, thumbnails, tile atlas, case-study galleries
  scripts/brand/         Generators for the portrait, logo paths and tile atlas
  src/
    App.jsx              Home page: hero, fly-through, the box (Selected / About / Contact / projects)
    main.jsx             Routes, and Ctrl + Shift + A to open the inbox
    site/                The public site
      data.js            Content: projects, case-study copy, nav (profile from shared/)
      sound.js           Background music player
      components/        Header, Hero, Loader, Selected, Box, ContactForm, Footer…
    admin/               /admin: sign-in and the inbox
server/                  Express + MongoDB API
  src/
    app.js               The API (used by server.js locally and api/index.js on Vercel)
    routes/, controllers/, models/, middleware/
    lib/                 Validation, mailer, rate limits
    emails/              The two inquiry email templates
    setup-admin.js       Create the admin or reset its password
api/index.js             Vercel function: every /api/* request
shared/site.json         Name, email, phone, socials, contact form choices and limits
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: portrait, fly-through of the projects, Selected / About / Contact box |
| `/work` | All projects |
| `/work/:slug` | Case study |
| `/admin` | Private inbox (not linked, `noindex`). Also Ctrl + Shift + A on the site |

Any other path is a 404.

## How an inquiry flows

1. A visitor fills in "Start a project". The form checks every field as they go
   (the API repeats the same checks); a hidden honeypot field catches bots.
2. `POST /api/inquiries` saves the brief to MongoDB, then sends two emails with
   Nodemailer: a full brief to Harshil (reply goes straight to the client, with
   WhatsApp and Call buttons) and a branded confirmation to the client.
   If email fails the brief is still saved, and the inbox shows a warning.
3. Harshil signs in at `/admin` (JWT, 12 hours by default). The inbox lists the
   briefs with search, status filters and counts; opening one marks it read.
   Reply, WhatsApp and Call are one tap away; status, private notes and delete
   are on each brief. A new password signs out every other session.

The form allows 5 sends and sign-in 10 attempts per address every few minutes.

## Getting started

Requires Node.js 20+ and MongoDB (local, or a free MongoDB Atlas cluster).

```bash
npm install            # root: just `concurrently`
npm run install-all    # server + client dependencies
cp server/.env.example server/.env   # then fill it in
npm run dev            # API on :5000 and the site on :5173 (Vite proxies /api)
```

Create the admin once with `npm run setup-admin --prefix server` (or set
`ADMIN_USERNAME` / `ADMIN_PASSWORD` and sign in at `/admin`; see below).
Without `SMTP_USER` / `SMTP_PASS` the inbox still works, just without emails.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | API and site together |
| `npm run client` / `npm run server` | One of them |
| `npm run build` | Production build of the site into `client/dist` |
| `npm run setup-admin --prefix server` | Create the admin, or reset its password |

## Editing content

Name, email, phone, socials and the contact form's choices live in
`shared/site.json`; the site, the API and the emails all read it. Projects and
copy live in `client/src/site/data.js`. Each project has a slug, its copy, and
`shots: [desktop, mobile]`, the number of gallery images in
`client/public/work/<slug>/`. A new project's slug also goes in the
`/work/:slug(...)` list in `vercel.json` and in `client/public/sitemap.xml`.
The `sameAs` links and `twitter:creator` in `client/index.html` mirror the
socials. The brand generators are described in `client/scripts/brand/README.md`.

## Music

Chopin, Nocturne in E-flat major, Op. 9 No. 2, played by Frank Lévy for
Musopen's "Set Chopin Free" project, released into the public domain
([source](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._2_in_E-flat_major,_Op._9_No._2_(Frank_Levy).flac)).
It fades in on the visitor's first click, tap or key press, never on load,
remembers when someone turns it off, and pauses in background tabs.

## Deploying

`vercel.json` installs and builds `client/` and `server/`, serves the site at
`/`, `/work`, the project slugs and `/admin`, and runs the API as one function
(`api/index.js`) for `/api/*`. Deploy with `vercel --prod`.

Before the first deploy with the API, add these under Vercel → Project →
Settings → Environment Variables (Production):

| Variable | Value |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string. In Atlas → Network Access, allow `0.0.0.0/0` (Vercel has no fixed IPs) |
| `JWT_SECRET` | A long random string: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `SMTP_USER` | The Gmail address that sends the emails |
| `SMTP_PASS` | A Gmail App Password (Google Account → Security → 2-Step Verification → App passwords) |
| `MAIL_TO` | Where briefs are delivered (defaults to the email in `shared/site.json`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | First sign-in only: on an empty database, signing in with these creates the admin. Remove `ADMIN_PASSWORD` afterwards |

Optional: `SMTP_HOST` / `SMTP_PORT` (default Gmail, 465), `JWT_TTL` (default `12h`),
`SITE_URL` (links in emails, default `siteUrl` in `shared/site.json`).
Every option is described in `server/.env.example`.
