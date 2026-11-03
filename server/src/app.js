const express = require('express')
const { connect } = require('./db')
const { HttpError } = require('./lib/http')
const authRoutes = require('./routes/auth')
const inquiryRoutes = require('./routes/inquiries')

// The API, shared by the local server (server.js) and Vercel (api/index.js).
const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.json({ limit: '20kb' }))
app.use((req, res, next) => {
  res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  next()
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api', async (req, res, next) => {
  await connect()
  next()
})
app.use('/api/auth', authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api', (req, res) => res.status(404).json({ message: 'Not found.' }))

// Errors: the visitor gets a clear message, never internals.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message, ...err.extra })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'That request wasn’t valid JSON.' })
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'That’s more text than the form takes.' })
  console.error(err)
  const dbDown = /MONGO_URI|ECONNREFUSED|ENOTFOUND|querySrv|MongoServerSelectionError|MongooseServerSelectionError|buffering timed out/i.test(
    `${err.name} ${err.message}`,
  )
  res.status(dbDown ? 503 : 500).json({
    message: dbDown ? 'The inbox is unavailable right now. Please try again shortly.' : 'Something went wrong on our side. Please try again.',
  })
})

module.exports = app
