import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data'
import { gsap, isFinePointer } from '../motion'
import { sceneBus } from '../sceneBus'
import { Arrow } from './ui'

const pad3 = (n) => String(n).padStart(3, '0')

// The fly-through itself is drawn by the WebGL scene (SceneCanvas); this
// section provides the scroll length, the HUD, the project's name beside the
// pointer when it is over a card, and a real link over that card (or the one in
// focus) which opens the project box (`onOpen`). The link itself points at the
// case study, so a new tab or a shared link still lands somewhere useful.
export default function Selected({ onOpen }) {
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(-1)
  // The name in the tip stays while it fades out.
  const [named, setNamed] = useState(0)
  const seen = useRef({ active: 0, hover: -1 })
  const hit = useRef(null)
  const tip = useRef(null)

  useEffect(
    () =>
      sceneBus.subscribe(({ active: a, hover: h, rect }) => {
        const was = seen.current
        if (a !== was.active) {
          was.active = a
          setActive(a)
        }
        if (h !== was.hover) {
          was.hover = h
          setHover(h)
          if (h >= 0) setNamed(h)
        }
        const el = hit.current
        if (!el) return
        if (!rect) {
          el.classList.remove('is-on')
          return
        }
        el.classList.add('is-on')
        el.style.transform = `translate3d(${rect.x.toFixed(1)}px, ${rect.y.toFixed(1)}px, 0)`
        el.style.width = `${rect.w.toFixed(1)}px`
        el.style.height = `${rect.h.toFixed(1)}px`
      }),
    [],
  )

  // The name tip trails the pointer.
  useEffect(() => {
    if (!isFinePointer()) return
    const xTo = gsap.quickTo(tip.current, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(tip.current, 'y', { duration: 0.35, ease: 'power3' })
    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const state = (i) => (i === active ? 'is-active' : i < active ? 'is-before' : 'is-after')
  // The link opens the card under the pointer, else the one in focus.
  const project = PROJECTS[hover >= 0 ? hover : active]

  return (
    <section
      id="flight"
      className="sel"
      style={{ height: `calc(100svh + ${(PROJECTS.length - 1) * 95 + 55}svh)` }}
      aria-label="Selected work"
    >
      <a
        ref={hit}
        className="sel__hit"
        href={`/work/${project.slug}`}
        aria-label={`${project.title}, open project`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          onOpen(project.slug)
        }}
      >
        <span className="sel__pill">
          {project.title} <Arrow />
        </span>
      </a>
      <div ref={tip} className={`sel__tip ${hover >= 0 ? 'is-on' : ''}`} aria-hidden="true">
        <span>{PROJECTS[named].title}</span>
      </div>

      <div className="sel__sticky">
        <div className="sel__hud">
          <div className="sel__id" aria-live="polite">
            <span className="sel__num">
              {PROJECTS.map((p, i) => (
                <span key={p.slug} className={state(i)}>
                  {pad3(i + 1)}
                </span>
              ))}
            </span>
            <span className="sel__titles">
              {PROJECTS.map((p, i) => (
                <span key={p.slug} className={`sel__title ${state(i)}`} aria-hidden={i !== active}>
                  <span className="sel__name">{p.title}</span>
                  <span className="sel__type">{p.type}</span>
                </span>
              ))}
            </span>
          </div>

          <div className="sel__side">
            <span className="sel__count">
              {active + 1} of {PROJECTS.length} works
            </span>
            <a className="pill pill--light" href="#top">
              <span className="pill__label">
                <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to home
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
