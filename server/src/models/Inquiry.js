const mongoose = require('mongoose')

const STATUSES = ['new', 'read', 'replied', 'archived']

// A brief sent through the site's "Start a project" form.
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 100, default: '' },
    services: { type: [String], default: [] },
    budget: { type: String, default: '' },
    message: { type: String, required: true, maxlength: 2000 },
    source: { type: String, default: 'website' },
    status: { type: String, enum: STATUSES, default: 'new' },
    // Private to the inbox.
    notes: { type: String, default: '', maxlength: 5000 },
    readAt: Date,
    repliedAt: Date,
    // Whether the two emails went out (the inquiry is saved either way).
    mail: {
      notified: { type: Boolean, default: false },
      confirmed: { type: Boolean, default: false },
      error: { type: String, default: '' },
    },
    meta: { ip: String, userAgent: String },
  },
  { timestamps: true },
)

inquirySchema.index({ createdAt: -1 })
inquirySchema.index({ status: 1, createdAt: -1 })

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)

module.exports = Inquiry
module.exports.STATUSES = STATUSES
