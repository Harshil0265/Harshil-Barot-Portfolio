const mongoose = require('mongoose')
const Inquiry = require('../models/Inquiry')
const { STATUSES } = require('../models/Inquiry')
const { validateInquiry } = require('../lib/validateInquiry')
const { sendInquiryEmails } = require('../lib/mailer')
const { HttpError, clientIp, escapeRegex } = require('../lib/http')

const WEEK = 7 * 24 * 60 * 60 * 1000

function findId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, 'That inquiry doesn’t exist.')
  return id
}

// Public: the "Start a project" form.
exports.create = async (req, res) => {
  const body = req.body || {}
  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (typeof body.website === 'string' && body.website.trim()) return res.status(201).json({ ok: true, confirmationSent: false })

  const { errors, data } = validateInquiry(body)
  if (Object.keys(errors).length) throw new HttpError(422, 'Please check the highlighted fields.', { errors })

  const inquiry = await Inquiry.create({
    ...data,
    meta: { ip: clientIp(req), userAgent: String(req.get('user-agent') || '').slice(0, 300) },
  })

  // Sent before replying: on Vercel the function may be frozen once the
  // response is out.
  const mail = await sendInquiryEmails(inquiry)
  await Inquiry.updateOne({ _id: inquiry._id }, { $set: { mail } })

  res.status(201).json({ ok: true, confirmationSent: mail.confirmed })
}

// Admin: one page of the inbox, newest first.
exports.list = async (req, res) => {
  const { status = 'all', q = '' } = req.query
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20))

  const filter = {}
  if (status !== 'all') {
    if (!STATUSES.includes(status)) throw new HttpError(400, 'Unknown status.')
    filter.status = status
  }
  const term = String(q).trim().slice(0, 80)
  if (term) {
    const re = new RegExp(escapeRegex(term), 'i')
    filter.$or = [{ name: re }, { email: re }, { company: re }, { phone: re }, { message: re }, { services: re }]
  }

  const [items, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-meta').lean(),
    Inquiry.countDocuments(filter),
  ])
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) })
}

// Admin: counts for the header and the filters.
exports.stats = async (req, res) => {
  const [row] = await Inquiry.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: '$status', n: { $sum: 1 } } }],
        week: [{ $match: { createdAt: { $gte: new Date(Date.now() - WEEK) } } }, { $count: 'n' }],
      },
    },
  ])
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]))
  for (const { _id, n } of row.byStatus) if (_id in counts) counts[_id] = n
  const total = STATUSES.reduce((sum, s) => sum + counts[s], 0)
  res.json({ ...counts, total, week: row.week[0]?.n || 0 })
}

exports.get = async (req, res) => {
  const inquiry = await Inquiry.findById(findId(req.params.id)).select('-meta').lean()
  if (!inquiry) throw new HttpError(404, 'That inquiry doesn’t exist.')
  res.json(inquiry)
}

// Admin: status and private notes.
exports.update = async (req, res) => {
  const { status, notes } = req.body || {}
  const set = {}
  if (status !== undefined) {
    if (!STATUSES.includes(status)) throw new HttpError(400, 'Unknown status.')
    set.status = status
    if (status === 'read') set.readAt = new Date()
    if (status === 'replied') set.repliedAt = new Date()
  }
  if (notes !== undefined) {
    if (typeof notes !== 'string' || notes.length > 5000) throw new HttpError(400, 'Notes can be up to 5000 characters.')
    set.notes = notes
  }
  if (!Object.keys(set).length) throw new HttpError(400, 'Nothing to update.')

  const inquiry = await Inquiry.findByIdAndUpdate(findId(req.params.id), { $set: set }, { new: true }).select('-meta').lean()
  if (!inquiry) throw new HttpError(404, 'That inquiry doesn’t exist.')
  res.json(inquiry)
}

exports.remove = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(findId(req.params.id))
  if (!inquiry) throw new HttpError(404, 'That inquiry doesn’t exist.')
  res.json({ ok: true })
}
