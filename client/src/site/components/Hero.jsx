import { useEffect, useLayoutEffect, useRef } from 'react'
import { PROFILE } from '../data'
import { gsap, prefersReducedMotion } from '../motion'
import { Arrow, SplitWords } from './ui'

export const DISPLAY_FONT = 'italic 400 100px "Playfair Display"'

// Size a single-line heading so it spans its container edge to edge.
export function useFitText(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    const fit = () => {
      el.style.fontSize = '100px'
      const w = el.getBoundingClientRect().width
      const avail = el.parentElement.clientWidth
      el.style.fontSize = `${(100 * avail) / w}px`
    }
    fit()
    // A freshly loaded font is applied on the next layout pass, so refit a
    // frame later. fonts.ready can resolve before the face is even requested,
    // hence the explicit load.
    let raf = 0
    const refit = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(fit)
    }
    document.fonts?.load(DISPLAY_FONT).then(refit, () => {})
    document.fonts?.addEventListener?.('loadingdone', refit)
    const ro = new ResizeObserver(refit)
    ro.observe(el.parentElement)
    return () => {
      cancelAnimationFrame(raf)
      document.fonts?.removeEventListener?.('loadingdone', refit)
      ro.disconnect()
    }
  }, [ref])
}

const NAME = PROFILE.name.split('')

export default function Hero({ intro }) {
  const root = useRef(null)
  const name = useRef(null)
  useFitText(name)

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root)
    gsap.set(q('.hero__char'), { yPercent: 115 })
    gsap.set(q('.hero__intro .w'), { yPercent: 110 })
    gsap.set(q('.hero__cta'), { opacity: 0, y: 24 })
  }, [])

  useEffect(() => {
    if (!intro) return
    const ctx = gsap.context(() => {
      // The hero copy is pinned to the bottom of the screen, so it has to
      // leave as the page scrolls on.
      const away = { trigger: root.current, start: 'top top', end: 'bottom top' }

      if (prefersReducedMotion()) {
        gsap.set('.hero__char, .hero__intro .w', { yPercent: 0 })
        gsap.set('.hero__cta', { opacity: 1, y: 0 })
        gsap.to('.hero__bottom', { autoAlpha: 0, ease: 'none', scrollTrigger: { ...away, scrub: true } })
        return
      }

      gsap
        .timeline({ delay: 0.3 })
        .to('.hero__char', { yPercent: 0, duration: 1.7, ease: 'expo.out', stagger: 0.045 }, 0)
        .to('.hero__intro .w', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.014 }, 0.55)
        .to('.hero__cta', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.95)

      // Scrolling away: while the portrait bursts into pixels, the name sinks
      // down out of view and its letters fade from the edges inward; the copy
      // above it goes first.
      gsap
        .timeline({ scrollTrigger: { ...away, scrub: 0.6 } })
        .to('.hero__row', { y: 40, autoAlpha: 0, ease: 'none', duration: 0.3 }, 0)
        .to('.hero__name-wrap', { y: () => window.innerHeight * 0.32, ease: 'power1.in', duration: 1 }, 0)
        .to('.hero__char', { opacity: 0, ease: 'none', duration: 0.4, stagger: { each: 0.03, from: 'edges' } }, 0.12)
        .set('.hero__bottom', { visibility: 'hidden' })
    }, root)
    return () => ctx.revert()
  }, [intro])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__bottom">
        <div className="hero__row">
          <p className="hero__intro">
            <SplitWords text={PROFILE.intro} />
            <span className="mask">
              <a className="w u-link" href={PROFILE.company.url} target="_blank" rel="noreferrer">
                {PROFILE.company.name}
              </a>
            </span>
            <span className="mask">
              <span className="w">.</span>
            </span>{' '}
            <SplitWords text="Scroll to fly through the work." />
          </p>
          <a className="hero__cta pill" href="#flight">
            <span className="pill__label">Explore the work</span>
            <span className="pill__icon">
              <Arrow dir="down" />
            </span>
          </a>
        </div>

        <div className="hero__name-wrap">
          <h1 className="hero__name" ref={name} aria-label={PROFILE.name}>
            {NAME.map((ch, i) =>
              ch === ' ' ? (
                <span key={i} className="hero__space" aria-hidden="true" />
              ) : (
                <span key={i} className="hero__char" aria-hidden="true">
                  {ch}
                </span>
              ),
            )}
          </h1>
        </div>
      </div>
    </section>
  )
}
