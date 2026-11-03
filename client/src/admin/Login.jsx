import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, Clock, Logo } from '../site/components/ui'
import { PROFILE } from '../site/data'
import { api } from './api'
import Icon from './icons'

const TITLE = 'Inbox.'

export default function Login({ notice, onSignedIn }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)
  const [caps, setCaps] = useState(false)
  const userRef = useRef(null)
  const passRef = useRef(null)

  useEffect(() => {
    document.title = `Sign in · ${PROFILE.name}`
    userRef.current?.focus()
  }, [])

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
    if (message) setMessage('')
  }
  const watchCaps = (e) => setCaps(!!e.getModifierState?.('CapsLock'))

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    const errs = {}
    if (!form.username.trim()) errs.username = 'Enter your username'
    if (!form.password) errs.password = 'Enter your password'
    setErrors(errs)
    if (errs.username) return userRef.current?.focus()
    if (errs.password) return passRef.current?.focus()

    setBusy(true)
    setMessage('')
    try {
      const s = await api('/auth/login', { method: 'POST', body: { username: form.username.trim(), password: form.password }, auth: false })
      onSignedIn(s)
    } catch (err) {
      setMessage(err.message)
      setForm((f) => ({ ...f, password: '' }))
      passRef.current?.focus()
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="lg">
      <header className="lg__top">
        <Link to="/" className="lg__logo" aria-label={`${PROFILE.name}, back to the site`}>
          <Logo />
        </Link>
        <p className="lg__meta">
          <span className="lbl">Vadodara</span> <Clock />
        </p>
      </header>

      <img className="lg__portrait" src="/portrait-particles.webp" alt="" aria-hidden="true" />

      <section className="lg__intro">
        <p className="lg__kicker">Private · Studio inbox</p>
        <h1 className="lg__title" aria-label={TITLE}>
          {TITLE.split('').map((ch, i) => (
            <span key={i} className="lg__char" style={{ '--i': i }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>
        <p className="lg__lead">Every brief from the site, in one place. Sign in to read, reply and keep track.</p>
      </section>

      <form className="lg__card" onSubmit={submit} noValidate>
        <div className="lg__card-head">
          <h2 className="lg__card-title">Sign in</h2>
          <span className="lg__lock">
            <Icon name="lock" />
          </span>
        </div>

        {(notice || message) && (
          <p className={`lg__msg ${message ? 'is-error' : ''}`} role="alert">
            {message ? <Icon name="alert" /> : <Icon name="check" />}
            <span>{message || notice}</span>
          </p>
        )}

        <label className={`afield ${errors.username ? 'has-error' : ''}`}>
          <span className="afield__label">
            Username {errors.username && <em>{errors.username}</em>}
          </span>
          <input
            ref={userRef}
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            aria-invalid={!!errors.username}
          />
        </label>

        <label className={`afield ${errors.password ? 'has-error' : ''}`}>
          <span className="afield__label">
            Password {errors.password ? <em>{errors.password}</em> : caps && <em className="is-warn">Caps Lock is on</em>}
          </span>
          <span className="afield__wrap">
            <input
              ref={passRef}
              type={show ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              onKeyDown={watchCaps}
              onKeyUp={watchCaps}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="afield__eye"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
              aria-pressed={show}
            >
              <Icon name={show ? 'eyeOff' : 'eye'} />
            </button>
          </span>
        </label>

        <button type="submit" className="pill pill--solid lg__submit" disabled={busy}>
          <span>{busy ? 'Signing in…' : 'Sign in'}</span>
          <span className="pill__icon">{busy ? <span className="adm-spin adm-spin--sm" /> : <Arrow dir="right" />}</span>
        </button>
        <p className="lg__fine">You’ll stay signed in on this device until the session expires.</p>
      </form>

      <footer className="lg__foot">
        <Link to="/" className="h-link">
          ← Back to the site
        </Link>
        <span>
          &copy; {new Date().getFullYear()} {PROFILE.name}
        </span>
      </footer>
    </main>
  )
}
