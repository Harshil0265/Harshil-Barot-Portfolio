import { useEffect, useRef, useState } from 'react'
import { api } from './api'
import Icon from './icons'

const MIN = 8

export default function PasswordDialog({ onClose, onDone }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const first = useRef(null)

  useEffect(() => {
    first.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
    setMessage('')
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Enter your current password'
    if (form.newPassword.length < MIN) errs.newPassword = `At least ${MIN} characters`
    else if (form.newPassword === form.currentPassword) errs.newPassword = 'Choose a different password'
    if (form.confirm !== form.newPassword) errs.confirm = 'The passwords don’t match'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      const s = await api('/auth/password', {
        method: 'POST',
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      })
      onDone(s)
    } catch (err) {
      if (err.errors) setErrors(err.errors)
      else setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  const field = (key, label, autoComplete, ref) => (
    <label className={`afield ${errors[key] ? 'has-error' : ''}`}>
      <span className="afield__label">
        {label} {errors[key] && <em>{errors[key]}</em>}
      </span>
      <input ref={ref} type="password" value={form[key]} onChange={(e) => set(key, e.target.value)} autoComplete={autoComplete} />
    </label>
  )

  return (
    <div className="idlg" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="idlg__card" role="dialog" aria-modal="true" aria-labelledby="pw-title" onSubmit={submit} noValidate>
        <div className="lg__card-head">
          <h2 className="lg__card-title" id="pw-title">
            Change password
          </h2>
          <button type="button" className="ibtn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <p className="idlg__lead">You’ll stay signed in here; every other device is signed out.</p>
        {message && (
          <p className="lg__msg is-error" role="alert">
            <Icon name="alert" />
            <span>{message}</span>
          </p>
        )}
        {field('currentPassword', 'Current password', 'current-password', first)}
        {field('newPassword', 'New password', 'new-password')}
        {field('confirm', 'Repeat the new password', 'new-password')}
        <div className="idlg__foot">
          <button type="button" className="ibtn ibtn--text" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="pill pill--solid pill--sm" disabled={busy}>
            <span>{busy ? 'Saving…' : 'Save password'}</span>
            <span className="pill__icon">{busy ? <span className="adm-spin adm-spin--sm" /> : <Icon name="check" />}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
