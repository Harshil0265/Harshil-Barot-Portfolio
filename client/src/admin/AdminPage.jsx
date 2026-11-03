import { useCallback, useEffect, useState } from 'react'
import { holdSound } from '../site/sound'
import { api, session, setUnauthorizedHandler } from './api'
import Inbox from './Inbox'
import Login from './Login'
import '../site/site.css'
import './admin.css'

// /admin: sign in, then the inbox of briefs from the contact form.
// Not linked anywhere and kept out of search engines (noindex).
export default function AdminPage() {
  const [auth, setAuth] = useState(() => session.get())
  const [checking, setChecking] = useState(() => !!session.get())
  const [notice, setNotice] = useState('')

  const signOut = useCallback((message = '') => {
    session.clear()
    setAuth(null)
    setNotice(message)
  }, [])

  const signedIn = useCallback((s) => {
    session.set(s)
    setAuth(s)
    setNotice('')
  }, [])

  // Page chrome: dark theme, no indexing, no background music.
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('is-site', 'is-admin')
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    holdSound(true)
    return () => {
      html.classList.remove('is-site', 'is-admin')
      robots.remove()
      holdSound(false)
    }
  }, [])

  // Any 401 from the API ends the session.
  useEffect(() => {
    setUnauthorizedHandler((message) => signOut(message || 'Please sign in again.'))
    return () => setUnauthorizedHandler(() => {})
  }, [signOut])

  // A stored session is confirmed with the server before the inbox shows.
  useEffect(() => {
    if (!checking) return
    let live = true
    api('/auth/me')
      .then((me) => live && setAuth((s) => (s ? { ...s, admin: me.admin } : s)))
      .catch(() => {})
      .finally(() => live && setChecking(false))
    return () => {
      live = false
    }
  }, [checking])

  // Sign out the moment the token expires.
  useEffect(() => {
    if (!auth) return
    const ms = new Date(auth.expiresAt) - Date.now()
    const id = setTimeout(() => signOut('Your session has expired. Please sign in again.'), Math.max(0, Math.min(ms, 2 ** 31 - 1)))
    return () => clearTimeout(id)
  }, [auth, signOut])

  return (
    <div className="site adm">
      <div className="grain" aria-hidden="true" />
      {checking ? (
        <div className="adm-boot" aria-live="polite">
          <span className="adm-spin" />
          <span className="sr">Checking your session…</span>
        </div>
      ) : auth ? (
        <Inbox auth={auth} onSignOut={() => signOut('You’ve signed out.')} onSession={signedIn} />
      ) : (
        <Login notice={notice} onSignedIn={signedIn} />
      )}
    </div>
  )
}
