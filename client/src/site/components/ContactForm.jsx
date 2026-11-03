import { useRef, useState } from 'react'
import { CONTACT_BUDGETS, CONTACT_LIMITS as L, CONTACT_NEEDS, PROFILE } from '../data'

const EMPTY = { name: '', email: '', phone: '', company: '', services: [], budget: '', message: '', website: '' }
const ORDER = ['name', 'email', 'phone', 'company', 'services', 'budget', 'message']

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const line = (v) => v.replace(/\s+/g, ' ').trim()

function phoneDigits(raw) {
  const s = line(raw)
  if (!/^\+?[\d\s().-]+$/.test(s)) return -1
  let d = s.replace(/\D/g, '')
  if (!s.startsWith('+') && d.startsWith('00')) d = d.slice(2)
  else if (!s.startsWith('+') && d.length === 11 && d.startsWith('0')) d = d.slice(1)
  if (!s.startsWith('+') && d.length === 10) d = `91${d}`
  return d.length
}

// The same rules and messages as the API (server/src/lib/validateInquiry.js),
// so mistakes show up before anything is sent.
const RULES = {
  name: (f) => {
    const v = line(f.name)
    if (!v) return 'Your name, please'
    if (v.length < L.nameMin || v.length > L.nameMax) return `${L.nameMin} to ${L.nameMax} characters`
    if (!NAME_RE.test(v)) return 'Letters, spaces, hyphens and apostrophes only'
  },
  email: (f) => {
    const v = line(f.email)
    if (!v) return 'An email so I can reply'
    if (v.length > L.emailMax || !EMAIL_RE.test(v)) return 'That email looks off'
  },
  phone: (f) => {
    if (!line(f.phone)) return 'A number to reach you on'
    const n = phoneDigits(f.phone)
    if (n < L.phoneDigitsMin || n > L.phoneDigitsMax) return 'Check the number (add the country code outside India)'
  },
  company: (f) => (line(f.company).length > L.companyMax ? `Up to ${L.companyMax} characters` : undefined),
  services: (f) => (f.services.length ? undefined : 'Pick at least one'),
  message: (f) => {
    const v = f.message.trim()
    if (!v) return 'A few lines about it'
    if (v.length < L.messageMin) return `A little more, at least ${L.messageMin} characters`
    if (v.length > L.messageMax) return `Up to ${L.messageMax} characters`
  },
}

function validate(form, keys = Object.keys(RULES)) {
  const errors = {}
  for (const k of keys) {
    const msg = RULES[k]?.(form)
    if (msg) errors[k] = msg
  }
  return errors
}

function Field({ label, error, hint, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field__label">
        {label}
        {error ? <em className="field__error">{error}</em> : hint && <span className="field__hint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

// "Start a project": a short brief that lands in the inbox and by email.
export default function ContactForm({ onClose }) {
  const root = useRef(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [notice, setNotice] = useState('')
  const [sent, setSent] = useState({ name: '', email: '', confirmed: false })

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }
  // Checked as each field is left, once something has been typed.
  const check = (key) => {
    if (!form[key] || (Array.isArray(form[key]) && !form[key].length)) return
    setErrors((e) => ({ ...e, [key]: validate(form, [key])[key] }))
  }
  const toggleService = (s) => {
    const next = form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s]
    set('services', next)
  }

  const focusFirst = (errs) => {
    const key = ORDER.find((k) => errs[k])
    requestAnimationFrame(() => root.current?.querySelector(`[data-field="${key}"]`)?.focus())
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (status === 'sending') return
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setNotice('')
      return focusFirst(errs)
    }
    setStatus('sending')
    setNotice('')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: line(form.name),
          email: line(form.email),
          phone: line(form.phone),
          company: line(form.company),
          services: form.services,
          budget: form.budget,
          message: form.message.trim(),
          website: form.website,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 422 && data.errors) {
        setErrors(data.errors)
        setStatus('idle')
        return focusFirst(data.errors)
      }
      if (!res.ok) {
        setNotice(res.status === 429 ? data.message : '')
        throw new Error(data.message || 'Request failed')
      }
      setSent({ name: line(form.name).split(' ')[0], email: line(form.email), confirmed: !!data.confirmationSent })
      setStatus('sent')
      setForm(EMPTY)
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform__done" role="status">
        <h2 className="view__title">Thank you, {sent.name}.</h2>
        <p className="view__lead">
          Your brief is in. I read every one myself and will reply within a day.
          {sent.confirmed && (
            <>
              {' '}
              A confirmation is on its way to <strong className="cform__em">{sent.email}</strong>.
            </>
          )}
        </p>
        <div className="cform__foot">
          <button type="button" className="studio-cta__btn" onClick={onClose}>
            Back to the work
          </button>
          <button type="button" className="studio-cta__alt" onClick={() => setStatus('idle')}>
            Send another
          </button>
        </div>
      </div>
    )
  }

  const left = L.messageMax - form.message.trim().length
  return (
    <form className="cform" ref={root} onSubmit={submit} noValidate>
      <h2 className="view__title">Tell me what you’re building.</h2>
      <p className="view__lead">A few lines are enough. I read every brief myself and reply within a day.</p>

      <div className="cform__row">
        <Field label="Name" error={errors.name}>
          <input
            data-field="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => check('name')}
            autoComplete="name"
            maxLength={L.nameMax + 10}
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            data-field="email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => check('email')}
            autoComplete="email"
            maxLength={L.emailMax}
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>
      <div className="cform__row">
        <Field label="Phone or WhatsApp" error={errors.phone}>
          <input
            data-field="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            onBlur={() => check('phone')}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            maxLength={24}
            aria-invalid={!!errors.phone}
          />
        </Field>
        <Field label="Company or website" error={errors.company} hint="Optional">
          <input
            data-field="company"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            onBlur={() => check('company')}
            autoComplete="organization"
            maxLength={L.companyMax}
            aria-invalid={!!errors.company}
          />
        </Field>
      </div>

      <fieldset className={`field ${errors.services ? 'has-error' : ''}`}>
        <legend className="field__label">
          What do you need?
          {errors.services && <em className="field__error">{errors.services}</em>}
        </legend>
        <div className="chips">
          {CONTACT_NEEDS.map((n, i) => (
            <label className="chip" key={n}>
              <input
                type="checkbox"
                data-field={i === 0 ? 'services' : undefined}
                checked={form.services.includes(n)}
                onChange={() => toggleService(n)}
              />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">
          Budget <span className="field__hint">Optional</span>
        </legend>
        <div className="chips">
          {CONTACT_BUDGETS.map((b) => (
            <label className="chip" key={b}>
              <input
                type="radio"
                name="budget"
                checked={form.budget === b}
                onChange={() => set('budget', b)}
                onClick={() => form.budget === b && set('budget', '')}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="About the project"
        error={errors.message}
        hint={form.message && left < 300 ? `${Math.max(left, 0)} characters left` : undefined}
      >
        <textarea
          data-field="message"
          rows={5}
          value={form.message}
          maxLength={L.messageMax}
          onChange={(e) => set('message', e.target.value)}
          onBlur={() => check('message')}
          placeholder="What the business does, what you need and when."
          aria-invalid={!!errors.message}
        />
      </Field>

      {/* Hidden from people; bots that fill every field give themselves away. */}
      <div className="cform__trap" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <div className="cform__foot">
        <button type="submit" className="studio-cta__btn" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send the brief'}
        </button>
        <p className="cform__note" role="status" aria-live="polite">
          {status === 'error' ? (
            <span className="cform__fail">
              {notice || 'Couldn’t send right now.'} Email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </span>
          ) : (
            <>
              Or email <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </>
          )}
        </p>
      </div>
    </form>
  )
}
