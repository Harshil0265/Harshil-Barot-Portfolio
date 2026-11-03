const mongoose = require('mongoose')
const { mongoUri } = require('./config')

mongoose.set('strictQuery', true)

// One connection per process. On Vercel a warm function instance reuses it
// across requests instead of reconnecting every time.
let pending = null

async function connect() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (!mongoUri) throw new Error('MONGO_URI is not set')
  if (!pending) {
    pending = mongoose
      // dbName: an Atlas connection string often names no database, and the
      // driver would then fall back to one called "test".
      .connect(mongoUri, { dbName: 'portfolio', serverSelectionTimeoutMS: 8000, maxPoolSize: 5 })
      .catch((err) => {
        pending = null
        throw err
      })
  }
  await pending
  return mongoose.connection
}

module.exports = { connect }
