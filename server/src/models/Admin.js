const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3, maxlength: 40 },
    password: { type: String, required: true, select: false },
    // Tokens issued before this moment stop working (see middleware/auth).
    // Tokens carry whole seconds, so it sits a second back: a token signed
    // right after the account is created or the password changed still counts.
    passwordChangedAt: { type: Date, default: () => new Date(Date.now() - 1000) },
    lastLoginAt: Date,
  },
  { timestamps: true },
)

// Mongoose 9 runs async hooks without a `next` callback.
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000)
})

adminSchema.methods.checkPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
