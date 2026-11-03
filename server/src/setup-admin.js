/**
 * Create the admin account, or reset its password.
 *
 *   npm run setup-admin --prefix server
 *   npm run setup-admin --prefix server -- --username harshil --password "a long password"
 *
 * Uses MONGO_URI from server/.env. Point it at the production database
 * (MongoDB Atlas) to set up the live inbox. On Vercel you can skip this:
 * set ADMIN_USERNAME and ADMIN_PASSWORD and sign in once (see README).
 */
require('./loadEnv')
const readline = require('readline')
const mongoose = require('mongoose')
const { connect } = require('./db')
const Admin = require('./models/Admin')

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise((resolve) => rl.question(q, resolve))
  try {
    await connect()
    console.log('Connected to MongoDB')

    const existing = await Admin.findOne()
    let username = (arg('username') || '').trim().toLowerCase()
    if (existing) {
      console.log(`An admin already exists: ${existing.username}. This resets its password.`)
      username = existing.username
    } else if (!username) {
      username = (await ask('Admin username: ')).trim().toLowerCase()
    }
    const password = arg('password') || (await ask('New password (8+ characters): '))

    if (username.length < 3) throw new Error('The username needs at least 3 characters.')
    if (password.length < 8) throw new Error('The password needs at least 8 characters.')

    if (existing) {
      const admin = await Admin.findById(existing._id).select('+password')
      admin.password = password
      await admin.save()
      console.log(`Password updated for ${username}. Other sessions are signed out.`)
    } else {
      await Admin.create({ username, password })
      console.log(`Admin ${username} created. Sign in at /admin (or press Ctrl + Shift + A on the site).`)
    }
  } catch (err) {
    console.error(`Setup failed: ${err.message}`)
    process.exitCode = 1
  } finally {
    rl.close()
    await mongoose.disconnect()
  }
}

main()
