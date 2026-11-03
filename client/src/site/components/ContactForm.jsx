import { useState } from 'react'
import { CONTACT_BUDGETS, CONTACT_NEEDS, PROFILE } from '../data'

const EMPTY = { name: '', email: '', phone: '', company: '', needs: [], budget: '', about: '' }
// The API caps the message at 500 characters; company and budget ride along in it.
const ABOUT_MAX = 380

// Same rules as the API (server/src/routes/contact.js) so errors show before sending.
function validate(f) {
  const e = {}
  if (!f.name.trim()) e.name = 'Your name, please'
  else if (!/^[a-zA-Z\s]+$/.test(f.name)) e.name = 'Letters and spaces only'
  if (!f.email.trim()) e.email = 'An email so I can reply'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'That email looks off'
  if (f.phone.replace(/\D/g, '').length !== 10) e.phone = 'A 10-digit number'
  if (!f.about.trim()) e.about = 'A few lines about it'
  return e
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field__label">
        {label}
        {error && <em className="field__error">{error}</em>}
      </span>
      {children}
    </label>
  )
}

// "Start a project": a short brief that lands in the admin inbox.
export default function ContactForm({ onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [sentTo, setSentTo] = useState('')

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }
  const toggleNeed = (n) => set('needs', form.needs.includes(n) ? form.needs.filter((x) => x !== n) : [...form.needs, n])

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate(form)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setStatus('sending')
    const message = [
      form.about.trim(),
      form.company.trim() && `Company: ${form.company.trim()}`,
      form.budget && `Budget: ${form.budget}`,
    ]
      .filter(Boolean)
      .join('\n\n')
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/\D/g, ''),
          subject: form.needs.join(', ') || 'New project',
          message,
          source: ['Website'],
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (Array.isArray(data.errors)) {
          setErrors(Object.fromEntries(data.errors.map((er) => [er.path === 'message' ? 'about' : er.path, er.msg])))
        }
        throw new Error('Request failed')
      }
      setSentTo(form.name.trim().split(' ')[0])
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="cform__done">
        <h2 className="view__title">Thank you, {sentTo}.</h2>
        <p className="view__lead">Your brief is in. I read every one myself and will reply within a day.</p>
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

  return (
    <form className="cform" onSubmit={submit} noValidate>
      <h2 className="view__title">Tell me what you’re building.</h2>
      <p className="view__lead">A few lines are enough. I read every brief myself and reply within a day.</p>

      <div className="cform__row">
        <Field label="Name" error={errors.name}>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
        </Field>
      </div>
      <div className="cform__row">
        <Field label="Phone" error={errors.phone}>
          <input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel-national" />
        </Field>
        <Field label="Company or website">
          <input value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
        </Field>
      </div>

      <fieldset className="field">
        <legend className="field__label">What do you need?</legend>
        <div className="chips">
          {CONTACT_NEEDS.map((n) => (
            <label className="chip" key={n}>
              <input type="checkbox" checked={form.needs.includes(n)} onChange={() => toggleNeed(n)} />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Budget</legend>
        <div className="chips">
          {CONTACT_BUDGETS.map((b) => (
            <label className="chip" key={b}>
              <input type="radio" name="budget" checked={form.budget === b} onChange={() => set('budget', b)} />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="About the project" error={errors.about}>
        <textarea
          rows={4}
          value={form.about}
          maxLength={ABOUT_MAX}
          onChange={(e) => set('about', e.target.value)}
          placeholder="What the business does, what you need and when."
        />
      </Field>

      <div className="cform__foot">
        <button type="submit" className="studio-cta__btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send the brief'}
        </button>
        <p className="cform__note" role="status">
          {status === 'error' ? (
            <>
              Couldn’t send right now. Email me at <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </>
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
