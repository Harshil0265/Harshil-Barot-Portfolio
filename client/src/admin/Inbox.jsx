import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Logo } from '../site/components/ui'
import { PROFILE } from '../site/data'
import { api } from './api'
import Icon from './icons'
import PasswordDialog from './PasswordDialog'

const FILTERS = [
  ['all', 'All'],
  ['new', 'New'],
  ['read', 'Read'],
  ['replied', 'Replied'],
  ['archived', 'Archived'],
]
const STATUS_LABEL = { new: 'New', read: 'Read', replied: 'Replied', archived: 'Archived' }
const PAGE_SIZE = 20
const REFRESH_MS = 60000

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  timeZone: PROFILE.timeZone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})
const dayFmt = new Intl.DateTimeFormat('en-IN', { timeZone: PROFILE.timeZone, day: 'numeric', month: 'short' })

function ago(date) {
  const s = (Date.now() - new Date(date)) / 1000
  if (s < 60) return 'Just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 172800) return 'Yesterday'
  return dayFmt.format(new Date(date))
}

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: PROFILE.timeZone, hour: 'numeric', hour12: false }).format(new Date()))
  return h < 5 ? 'Working late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const firstName = (name) => String(name).trim().split(/\s+/)[0]
const prettyPhone = (p = '') => (p.startsWith('+91') && p.length === 13 ? `+91 ${p.slice(3, 8)} ${p.slice(8)}` : p)
const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s)

function useDebounced(value, ms) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

export default function Inbox({ auth, onSignOut, onSession }) {
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const q = useDebounced(query.trim(), 300)
  const [page, setPage] = useState(1)
  const [list, setList] = useState({ items: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [toasts, setToasts] = useState([])
  const [pwOpen, setPwOpen] = useState(false)
  const searchRef = useRef(null)
  const reqId = useRef(0)

  const toast = useCallback((text, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const loadStats = useCallback(() => api('/inquiries/stats').then(setStats).catch(() => {}), [])

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      const id = ++reqId.current
      if (!quiet) setLoading(true)
      try {
        const params = new URLSearchParams({ status, page: String(page), limit: String(PAGE_SIZE), ...(q && { q }) })
        const data = await api(`/inquiries?${params}`)
        if (id !== reqId.current) return
        setList(data)
        setLoadError('')
        if (page > data.pages) setPage(data.pages)
      } catch (err) {
        if (id === reqId.current && err.status !== 401) setLoadError(err.message)
      } finally {
        if (id === reqId.current) setLoading(false)
      }
    },
    [status, page, q],
  )

  useEffect(() => {
    load()
  }, [load])
  useEffect(() => {
    loadStats()
  }, [loadStats])
  useEffect(() => setPage(1), [status, q])

  // Fresh briefs arrive without a reload while the tab is open.
  useEffect(() => {
    const tick = () => {
      if (document.hidden) return
      load({ quiet: true })
      loadStats()
    }
    const id = setInterval(tick, REFRESH_MS)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [load, loadStats])

  useEffect(() => {
    const n = stats?.new || 0
    document.title = `${n ? `(${n}) ` : ''}Inbox · ${PROFILE.name}`
  }, [stats])

  // "/" jumps to search; Escape closes the open brief on small screens.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if (e.key === '/' && !typing && !pwOpen) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape' && !pwOpen && !typing) setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pwOpen])

  const selected = useMemo(() => list.items.find((i) => i._id === selectedId) || null, [list.items, selectedId])

  const patchLocal = (updated) =>
    setList((l) => ({ ...l, items: l.items.map((i) => (i._id === updated._id ? { ...i, ...updated } : i)) }))

  const update = useCallback(
    async (id, body, { silent = false } = {}) => {
      try {
        const updated = await api(`/inquiries/${id}`, { method: 'PATCH', body })
        patchLocal(updated)
        if (body.status) loadStats()
        if (!silent && body.status) toast(`Marked as ${STATUS_LABEL[body.status].toLowerCase()}`)
        return updated
      } catch (err) {
        if (err.status !== 401) toast(err.message, 'error')
        throw err
      }
    },
    [loadStats, toast],
  )

  const open = (item) => {
    setSelectedId(item._id)
    if (item.status === 'new') update(item._id, { status: 'read' }, { silent: true }).catch(() => {})
  }

  const remove = async (item) => {
    try {
      await api(`/inquiries/${item._id}`, { method: 'DELETE' })
      const idx = list.items.findIndex((i) => i._id === item._id)
      const rest = list.items.filter((i) => i._id !== item._id)
      setList((l) => ({ ...l, items: rest, total: Math.max(0, l.total - 1) }))
      setSelectedId(rest[idx]?._id || rest[idx - 1]?._id || null)
      loadStats()
      toast(`Deleted ${firstName(item.name)}’s brief`)
      if (!rest.length) load({ quiet: true })
    } catch (err) {
      if (err.status !== 401) toast(err.message, 'error')
    }
  }

  const refresh = () => {
    load()
    loadStats()
  }

  const from = list.total ? (page - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(page * PAGE_SIZE, list.total)
  const replyRate = stats && stats.total ? Math.round(((stats.replied + stats.archived) / stats.total) * 100) : 0

  return (
    <div className={`ibx ${selected ? 'has-selection' : ''}`}>
      <header className="ibx__top">
        <Link to="/" className="ibx__logo" aria-label={`${PROFILE.name}, back to the site`}>
          <Logo />
        </Link>
        <div className="ibx__where">
          <span className="lbl">Studio inbox</span>
          <span>
            Vadodara (<Clock />)
          </span>
        </div>
        <div className="ibx__tools">
          <span className="ibx__who">
            <span className="lbl">Signed in as</span> {auth.admin?.username}
          </span>
          <button className="ibtn" onClick={refresh} aria-label="Refresh" title="Refresh">
            <Icon name="refresh" />
          </button>
          <button className="ibtn" onClick={() => setPwOpen(true)} aria-label="Change password" title="Change password">
            <Icon name="key" />
          </button>
          <button className="ibtn ibtn--text" onClick={onSignOut}>
            <Icon name="logout" /> <span>Sign out</span>
          </button>
        </div>
      </header>

      <section className="ibx__hero">
        <div>
          <p className="ibx__hello">{greeting()}, {capitalize(auth.admin?.username || 'there')}.</p>
          <h1 className="ibx__title">
            {stats ? (
              stats.new ? (
                <>
                  <em>{stats.new}</em> new {stats.new === 1 ? 'brief' : 'briefs'} waiting.
                </>
              ) : (
                'All caught up.'
              )
            ) : (
              'Loading the inbox…'
            )}
          </h1>
        </div>
        <dl className="ibx__stats">
          <div>
            <dt>This week</dt>
            <dd>{stats?.week ?? '–'}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{stats?.total ?? '–'}</dd>
          </div>
          <div>
            <dt>Handled</dt>
            <dd>{stats ? `${replyRate}%` : '–'}</dd>
          </div>
        </dl>
      </section>

      <div className="ibx__bar">
        <label className="ibx__search">
          <Icon name="search" />
          <span className="sr">Search</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search briefs"
            title="Search names, emails, companies and messages"
            autoComplete="off"
          />
          {!query && <kbd>/</kbd>}
        </label>
        <div className="ibx__filters" role="tablist" aria-label="Filter by status">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={status === key}
              className={`ichip ${status === key ? 'is-on' : ''}`}
              onClick={() => setStatus(key)}
            >
              {label}
              {stats && <span className="ichip__n">{key === 'all' ? stats.total : stats[key]}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="ibx__main">
        <section className="ibx__list" aria-label="Briefs" aria-busy={loading}>
          {loadError ? (
            <div className="ibx__empty">
              <Icon name="alert" />
              <p>{loadError}</p>
              <button className="ibtn ibtn--text" onClick={refresh}>
                <Icon name="refresh" /> <span>Try again</span>
              </button>
            </div>
          ) : loading && !list.items.length ? (
            <ul className="ilist">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="irow irow--ghost" />
              ))}
            </ul>
          ) : !list.items.length ? (
            <div className="ibx__empty">
              <Icon name="inbox" />
              <p>{q ? `Nothing matches “${q}”.` : status === 'all' ? 'No briefs yet. They’ll appear here the moment someone writes.' : `Nothing marked ${STATUS_LABEL[status].toLowerCase()}.`}</p>
            </div>
          ) : (
            <>
              <ul className={`ilist ${loading ? 'is-loading' : ''}`}>
                {list.items.map((item) => (
                  <li key={item._id}>
                    <button
                      className={`irow ${item._id === selectedId ? 'is-on' : ''} is-${item.status}`}
                      onClick={() => open(item)}
                      aria-current={item._id === selectedId}
                    >
                      <span className="irow__top">
                        <span className="irow__name">
                          {item.status === 'new' && <i className="irow__dot" aria-label="New" />}
                          {item.name}
                        </span>
                        <time className="irow__time" dateTime={item.createdAt}>
                          {ago(item.createdAt)}
                        </time>
                      </span>
                      <span className="irow__meta">
                        {[item.services?.join(', '), item.budget].filter(Boolean).join(' · ') || item.email}
                      </span>
                      <span className="irow__msg">{item.message}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {list.pages > 1 && (
                <nav className="ibx__pager" aria-label="Pages">
                  <span>
                    {from}–{to} of {list.total}
                  </span>
                  <span>
                    <button className="ibtn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Newer">
                      <Icon name="back" />
                    </button>
                    <button className="ibtn ibtn--flip" disabled={page >= list.pages} onClick={() => setPage((p) => p + 1)} aria-label="Older">
                      <Icon name="back" />
                    </button>
                  </span>
                </nav>
              )}
            </>
          )}
        </section>

        <section className="ibx__detail" aria-label="Brief">
          {selected ? (
            <Detail key={selected._id} item={selected} onUpdate={update} onDelete={remove} onClose={() => setSelectedId(null)} toast={toast} />
          ) : (
            <div className="ibx__empty ibx__empty--detail">
              <p className="ibx__pick">Pick a brief to read it.</p>
              <p className="lbl">Press / to search.</p>
            </div>
          )}
        </section>
      </div>

      {pwOpen && (
        <PasswordDialog
          onClose={() => setPwOpen(false)}
          onDone={(s) => {
            onSession(s)
            setPwOpen(false)
            toast('Password changed. Other sessions are signed out.')
          }}
        />
      )}

      <div className="itoasts" aria-live="polite">
        {toasts.map((t) => (
          <p key={t.id} className={`itoast is-${t.tone}`}>
            <Icon name={t.tone === 'error' ? 'alert' : 'check'} />
            {t.text}
          </p>
        ))}
      </div>
    </div>
  )
}

function Detail({ item, onUpdate, onDelete, onClose, toast }) {
  const [notes, setNotes] = useState(item.notes || '')
  const [saved, setSaved] = useState('idle') // idle | saving | saved
  const [confirming, setConfirming] = useState(false)
  const first = firstName(item.name)
  const savedNotes = useRef(item.notes || '')

  // Notes save themselves a moment after typing stops.
  useEffect(() => {
    if (notes === savedNotes.current) return
    setSaved('saving')
    const id = setTimeout(() => {
      onUpdate(item._id, { notes }, { silent: true })
        .then(() => {
          savedNotes.current = notes
          setSaved('saved')
        })
        .catch(() => setSaved('idle'))
    }, 800)
    return () => clearTimeout(id)
  }, [notes, item._id, onUpdate])

  useEffect(() => {
    if (!confirming) return
    const id = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(id)
  }, [confirming])

  const quoted = item.message
    .split('\n')
    .map((l) => `> ${l}`)
    .join('\n')
  const replyHref = `mailto:${item.email}?subject=${encodeURIComponent('Re: your project brief')}&body=${encodeURIComponent(
    `Hi ${first},\n\nThanks for your brief${item.services?.length ? ` about ${item.services.join(', ').toLowerCase()}` : ''}.\n\n\n\n${PROFILE.name}\n\n${quoted}`,
  )}`
  const waHref = `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi ${first}, this is ${PROFILE.name}. Thanks for your brief${item.services?.length ? ` about ${item.services.join(', ').toLowerCase()}` : ''}.`,
  )}`

  const copy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${what} copied`)
    } catch {
      window.prompt(`Copy the ${what.toLowerCase()}`, text)
    }
  }

  const mail = item.mail || {}
  return (
    <article className="idetail">
      <div className="idetail__bar">
        <button className="ibtn ibtn--text idetail__back" onClick={onClose}>
          <Icon name="back" /> <span>All briefs</span>
        </button>
        <span className={`istatus is-${item.status}`}>{STATUS_LABEL[item.status]}</span>
        <time className="idetail__when" dateTime={item.createdAt}>
          {dateFmt.format(new Date(item.createdAt))}
        </time>
      </div>

      <h2 className="idetail__name">{item.name}</h2>
      <p className="idetail__sub">
        {[item.company, item.services?.join(', ')].filter(Boolean).join(' · ') || 'Sent a brief from the site'}
      </p>

      <div className="idetail__actions">
        <a className="pill pill--solid pill--sm" href={replyHref} onClick={() => item.status !== 'replied' && toast('Once you’ve sent it, mark the brief as Replied below.')}>
          <span>Reply to {first}</span>
          <span className="pill__icon">
            <Icon name="mail" />
          </span>
        </a>
        <a className="pill pill--sm" href={waHref} target="_blank" rel="noreferrer">
          <span>WhatsApp</span>
          <span className="pill__icon">
            <Icon name="whatsapp" />
          </span>
        </a>
        <a className="pill pill--sm" href={`tel:${item.phone}`}>
          <span>Call</span>
          <span className="pill__icon">
            <Icon name="phone" />
          </span>
        </a>
      </div>

      <dl className="idetail__facts">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${item.email}`}>{item.email}</a>
            <button className="ibtn ibtn--xs" onClick={() => copy(item.email, 'Email')} aria-label="Copy email">
              <Icon name="copy" />
            </button>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            <a href={`tel:${item.phone}`}>{prettyPhone(item.phone)}</a>
            <button className="ibtn ibtn--xs" onClick={() => copy(item.phone, 'Phone number')} aria-label="Copy phone number">
              <Icon name="copy" />
            </button>
          </dd>
        </div>
        <div>
          <dt>Needs</dt>
          <dd className="idetail__chips">
            {item.services?.length ? item.services.map((s) => <span key={s}>{s}</span>) : '–'}
          </dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{item.budget || 'Not given'}</dd>
        </div>
        {item.company && (
          <div>
            <dt>Company</dt>
            <dd>{item.company}</dd>
          </div>
        )}
      </dl>

      <div className="idetail__block">
        <h3 className="lbl">About the project</h3>
        <p className="idetail__msg">{item.message}</p>
      </div>

      <div className="idetail__block">
        <h3 className="lbl idetail__notes-head">
          Private notes
          <span className="idetail__saved" aria-live="polite">
            {saved === 'saving' ? 'Saving…' : saved === 'saved' ? 'Saved' : ''}
          </span>
        </h3>
        <textarea
          className="idetail__notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={5000}
          rows={3}
          placeholder="Call notes, quotes, follow-ups. Only you can see these."
        />
      </div>

      <div className="idetail__foot">
        <div className="iseg" role="radiogroup" aria-label="Status">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <button
              key={key}
              role="radio"
              aria-checked={item.status === key}
              className={item.status === key ? 'is-on' : ''}
              onClick={() => item.status !== key && onUpdate(item._id, { status: key }).catch(() => {})}
            >
              {label}
            </button>
          ))}
        </div>
        {confirming ? (
          <span className="idetail__confirm">
            Delete for good?
            <button className="ibtn ibtn--text ibtn--danger" onClick={() => onDelete(item)}>
              Delete
            </button>
            <button className="ibtn ibtn--text" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </span>
        ) : (
          <button className="ibtn ibtn--text ibtn--danger" onClick={() => setConfirming(true)}>
            <Icon name="trash" /> <span>Delete</span>
          </button>
        )}
      </div>

      <p className={`idetail__mail ${mail.error ? 'is-warn' : ''}`}>
        {mail.error ? (
          <>
            <Icon name="alert" /> Email didn’t go out: {mail.error}
          </>
        ) : (
          <>
            <Icon name="check" /> {mail.notified ? 'Emailed to you' : 'Saved to the inbox'}
            {mail.confirmed ? ` · Confirmation sent to ${first}` : ''}
          </>
        )}
      </p>
    </article>
  )
}
