// Local development: `npm run dev` (the site's Vite server proxies /api here).
// In production the same app runs as a Vercel function (api/index.js).
require('./loadEnv')
const app = require('./app')
const { connect } = require('./db')
const { mailConfigured } = require('./lib/mailer')

const port = Number(process.env.PORT) || 5000

app.listen(port, () => {
  console.log(`API on http://localhost:${port}`)
  if (!mailConfigured()) console.log('Email is off: set SMTP_USER and SMTP_PASS in server/.env to send inquiry emails.')
})

connect()
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(`MongoDB: ${err.message}`))
