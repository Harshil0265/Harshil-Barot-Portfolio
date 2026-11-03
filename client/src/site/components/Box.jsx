import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS, SOCIALS, TOOLKIT, projectBySlug } from '../data'
import { lockScroll } from '../motion'
import ContactForm from './ContactForm'
import { Arrow } from './ui'

const pad = (n) => String(n).padStart(2, '0')

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path d="m14.5 5.5-6.5 6.5 6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const caseStudyUrl = (slug) => `${window.location.origin}/work/${slug}`

// Copies the case study's address; the label confirms for a moment.
export function useCopyLink(slug) {
  const [copied, setCopied] = useState(false)
  useEffect(() => setCopied(false), [slug])
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(caseStudyUrl(slug))
      setCopied(true)
    } catch {
      window.prompt('Copy this link', caseStudyUrl(slug))
    }
  }
  return [copied, copy]
}

// Closing call to action: new work goes through the studio.
function StudioCta() {
  return (
    <div className="studio-cta">
      <div className="studio-cta__txt">
        <span className="studio-cta__k">Have something in mind?</span>
        <p className="studio-cta__t">Let’s make the next one yours.</p>
      </div>
      <div className="studio-cta__row">
        <a className="studio-cta__btn" href={PROFILE.company.contact} target="_blank" rel="noreferrer">
          Start a project
        </a>
        <a className="studio-cta__alt" href={PROFILE.company.url} target="_blank" rel="noreferrer">
          See the studio
        </a>
      </div>
    </div>
  )
}

// One view of the box: a head (Close + a label or actions) over a scroll area.
// Hidden views stay mounted (the contact form keeps what was typed) but inert.
function View({ name, active, onClose, side, children }) {
  return (
    <section className={`view view--${name} ${active ? 'is-on' : ''}`} aria-hidden={!active} inert={active ? undefined : ''}>
      <div className="view__head">
        <button className="box-btn view__close" onClick={onClose}>
          <Chevron />
          <span>Close</span>
        </button>
        {side}
      </div>
      <div className="view__scroll" data-lenis-prevent>
        {children}
      </div>
    </section>
  )
}

function SelectedView({ onPick }) {
  return (
    <>
      <h2 className="view__title">A few to start with.</h2>
      <p className="view__lead">
        Six live projects, each one a business I helped launch or grow online. Pick one and the flight takes you straight to it.
      </p>
      <ul className="picks">
        {PROJECTS.map((p, i) => (
          <li key={p.slug}>
            <button className="pick" onClick={() => onPick(p.slug)}>
              <img src={p.thumb} alt="" loading="lazy" />
              <span className="pick__txt">
                <span className="pick__t">{p.title}</span>
                <span className="pick__k">{p.type}</span>
              </span>
              <span className="pick__n">{pad(i + 1)}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

function AboutView({ onPick, onView }) {
  const { company } = PROFILE
  return (
    <>
      <h2 className="view__title">I build websites and products for founders who are ready to grow.</h2>
      <div className="view__body">
        <p>
          I’m Harshil. I started building for the web while studying computer science, shipped real products for real
          businesses before I graduated, and never stopped. Today I run{' '}
          <a href={company.url} target="_blank" rel="noreferrer">
            {company.name}
          </a>
          , a studio for products, brands and growth under one roof.
        </p>
        <p>
          Most of my clients are startups and growing local businesses, from immigration consultancies and cafe chains to
          coaching institutes and uniform suppliers, ready to launch or level up online.
        </p>
      </div>
      <dl className="facts">
        <div>
          <dt>Selected clients</dt>
          <dd className="facts__links">
            {PROJECTS.map((p, i) => (
              <span key={p.slug}>
                <button onClick={() => onPick(p.slug)}>{p.title}</button>
                {i < PROJECTS.length - 1 ? ', ' : ''}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>
            {EXPERIENCE.map((e) => (
              <span className="facts__line" key={e.company}>
                {e.role}, {e.company}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>Toolkit</dt>
          <dd>{TOOLKIT.join(', ')}</dd>
        </div>
        <div>
          <dt>Education</dt>
          <dd>
            {EDUCATION.title}, {EDUCATION.place}
          </dd>
        </div>
        <div>
          <dt>Elsewhere</dt>
          <dd className="facts__links">
            {SOCIALS.map((s, i) => (
              <span key={s.label}>
                {i > 0 && ', '}
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd className="facts__links">
            <button onClick={() => onView('contact')}>Send me a message</button>,{' '}
            <a href={PROFILE.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </dd>
        </div>
      </dl>
      <StudioCta />
    </>
  )
}

// A project: the work itself (desktop screens, then phones), leading on to the case study.
function ProjectView({ project }) {
  const { title, tagline, type, year, summary, desktop, mobile, stack, url } = project
  return (
    <>
      <header className="pp__head">
        <span className="pp__kind">
          {type} · {year}
        </span>
        <h2 className="pp__title">
          {title}, <em>{tagline}</em>
        </h2>
        <p className="pp__desc">{summary}</p>
        <div className="pp__meta">
          <ul className="pp__stack">
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <a className="pp__live" href={url} target="_blank" rel="noreferrer">
            Visit live site <Arrow />
          </a>
        </div>
      </header>
      <figure className="pp__shot">
        <img src={desktop[0]} alt={`${title}, home page`} />
      </figure>
      {desktop[1] && (
        <figure className="pp__shot">
          <img src={desktop[1]} alt={`${title}, a section of the site`} loading="lazy" />
        </figure>
      )}
      {mobile.length > 0 && (
        <div className="pp__phones">
          {mobile.map((src, i) => (
            <img key={src} src={src} alt={`${title} on a phone, screen ${i + 1}`} loading="lazy" />
          ))}
        </div>
      )}
      {desktop.slice(2, 4).map((src) => (
        <figure className="pp__shot" key={src}>
          <img src={src} alt={`${title}, a section of the site`} loading="lazy" />
        </figure>
      ))}
      <StudioCta />
    </>
  )
}

function ProjectActions({ project }) {
  const [copied, copy] = useCopyLink(project.slug)
  return (
    <div className="view__actions">
      <button className="box-btn box-btn--icon" onClick={copy} aria-live="polite">
        <LinkIcon />
        <span>{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      <Link className="box-btn box-btn--solid" to={`/work/${project.slug}`}>
        Read the case study
      </Link>
    </div>
  )
}

const LABELS = { selected: 'Selected work', about: 'About', contact: 'Start a project' }

// The glass box on the left: Selected work, About, Contact and the projects,
// cross-fading in one frame. `state` is null (closed) or { view, slug }.
export default function Box({ state, onView, onPick, onClose }) {
  const open = !!state
  // Keep the last view on screen while the box slides away.
  const [last, setLast] = useState(state)
  const root = useRef(null)
  const shown = state || last
  const project = shown?.slug ? projectBySlug(shown.slug) : null

  useEffect(() => {
    if (state) setLast(state)
  }, [state])

  // Each newly shown view starts at the top.
  useEffect(() => {
    root.current?.querySelector('.view.is-on .view__scroll')?.scrollTo(0, 0)
  }, [shown?.view, shown?.slug])

  useEffect(() => {
    if (!open) return
    const before = document.activeElement
    lockScroll(true)
    const id = requestAnimationFrame(() => root.current.querySelector('.view.is-on .view__close')?.focus({ preventScroll: true }))
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // Keep Tab inside the open view.
      if (e.key === 'Tab') {
        const items = root.current.querySelectorAll('.view.is-on :is(a[href], button:not([disabled]), input, textarea)')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      before?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  const view = shown?.view
  return (
    <>
      {/* A click anywhere outside the box closes it. */}
      <div className={`box-catch ${open ? 'is-on' : ''}`} onClick={onClose} aria-hidden="true" />
      <div
        ref={root}
        className={`box ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={project && view === 'project' ? project.title : LABELS[view]}
        aria-hidden={!open}
        inert={open ? undefined : ''}
      >
        <View name="selected" active={view === 'selected'} onClose={onClose} side={<span className="view__label">{LABELS.selected}</span>}>
          <SelectedView onPick={onPick} />
        </View>
        <View name="about" active={view === 'about'} onClose={onClose} side={<span className="view__label">{LABELS.about}</span>}>
          <AboutView onPick={onPick} onView={onView} />
        </View>
        <View name="contact" active={view === 'contact'} onClose={onClose} side={<span className="view__label">{LABELS.contact}</span>}>
          <ContactForm onClose={onClose} />
        </View>
        {project && (
          <View name="project" active={view === 'project'} onClose={onClose} side={<ProjectActions project={project} />}>
            <ProjectView key={project.slug} project={project} />
          </View>
        )}
      </div>
    </>
  )
}
