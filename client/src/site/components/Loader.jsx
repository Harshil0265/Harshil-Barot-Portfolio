import { useEffect, useRef } from 'react'
import { LOGO_PARTS, LOGO_PATHS, LOGO_VIEWBOX } from '../logoPaths'
import { gsap, prefersReducedMotion } from '../motion'

const [, , VB_W, VB_H] = LOGO_VIEWBOX.split(' ').map(Number)

// Brush speed in viewBox units per second; short strokes get a floor.
const strokeDuration = (len) => Math.max(0.3, len / 1250)

// The intro is the monogram alone: H, then the swash, then B are written with
// brush strokes, a light sweep polishes it, and it flies into the header.
export default function Loader({ assets, onReveal, onDone }) {
  const root = useRef(null)
  const panel = useRef(null)
  const logo = useRef(null)

  useEffect(() => {
    let cancelled = false

    const ctx = gsap.context(() => {
      const brushes = [...root.current.querySelectorAll('.loader__brush')]
      const ghost = root.current.querySelector('.loader__ghost')
      const parts = root.current.querySelectorAll('.loader__part')
      const whole = root.current.querySelector('.loader__whole')
      const shine = root.current.querySelector('.loader__shine-grad')

      const exit = () => {
        const target = document.getElementById('site-logo')
        const from = logo.current.getBoundingClientRect()
        const to = target ? target.getBoundingClientRect() : from
        const dx = to.left + to.width / 2 - (from.left + from.width / 2)
        const dy = to.top + to.height / 2 - (from.top + from.height / 2)
        gsap
          .timeline({ onComplete: () => !cancelled && onDone() })
          .add(() => !cancelled && onReveal())
          .to(panel.current, { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, 0)
          .to(logo.current, { x: dx, y: dy, scale: to.height / from.height, duration: 1.25, ease: 'expo.inOut' }, 0)
      }

      if (prefersReducedMotion()) {
        gsap.set(whole, { opacity: 1 })
        assets.finally(() => {
          if (cancelled) return
          onReveal()
          gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: onDone })
        })
        return
      }

      const lens = brushes.map((b) => b.getTotalLength())
      brushes.forEach((b, i) => gsap.set(b, { strokeDasharray: `${lens[i]} ${lens[i] + 10}`, strokeDashoffset: lens[i] }))

      const tl = gsap.timeline({ delay: 0.25 })
      tl.fromTo(ghost, { opacity: 0 }, { opacity: 0.09, duration: 0.9, ease: 'power2.out' }, 0)
        .fromTo(logo.current, { scale: 0.94 }, { scale: 1, duration: 4.2, ease: 'power2.out' }, 0)

      // Strokes flow one into the next; a beat between letters.
      let at = 0.35
      let part = null
      brushes.forEach((b, i) => {
        if (part !== null && b.dataset.part !== part) at += 0.2
        part = b.dataset.part
        const d = strokeDuration(lens[i])
        tl.to(b, { strokeDashoffset: 0, duration: d, ease: 'power2.inOut' }, at)
        at += d * 0.82
      })

      tl.addLabel('written', at + 0.1)
        // Swap the three parts for the seamless single path, polish, lose the ghost.
        .set(whole, { opacity: 1 }, 'written')
        .set(parts, { opacity: 0 }, 'written')
        .to(ghost, { opacity: 0, duration: 0.4 }, 'written')
        .fromTo(shine, { attr: { x1: -1, x2: -0.4 } }, { attr: { x1: 1.4, x2: 2 }, duration: 1, ease: 'power2.inOut' }, 'written')

      // Hold on the finished mark until fonts, portrait and tiles are ready.
      Promise.all([tl.then(), assets.catch(() => {})]).then(() => !cancelled && exit())
    }, root)

    return () => {
      cancelled = true
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__panel" ref={panel} />
      <div className="loader__logo" ref={logo}>
        <svg viewBox={LOGO_VIEWBOX}>
          <defs>
            {LOGO_PARTS.map((p) => (
              <mask key={p.name} id={`loader-mask-${p.name}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={VB_W + 400} height={VB_H + 400}>
                {p.strokes.map((s, i) => (
                  <path key={i} className="loader__brush" data-part={p.name} d={s.d} strokeWidth={s.w} />
                ))}
              </mask>
            ))}
            <linearGradient className="loader__shine-grad" id="loader-shine" x1="-1" y1="0" x2="-0.4" y2="0.3">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="loader__ghost" d={LOGO_PATHS[0]} fillRule="evenodd" />
          {LOGO_PARTS.map((p) => (
            <path key={p.name} className="loader__part" d={p.d} fillRule="evenodd" mask={`url(#loader-mask-${p.name})`} />
          ))}
          <path className="loader__whole" d={LOGO_PATHS[0]} fillRule="evenodd" />
          <path d={LOGO_PATHS[0]} fillRule="evenodd" fill="url(#loader-shine)" />
        </svg>
      </div>
    </div>
  )
}
