import { useEffect, useRef } from 'react'
import { NAV, PROFILE, SOCIALS } from '../data'
import { gsap } from '../motion'
import { TRACK } from '../sound'
import { useFitText } from './Hero'
import { Arrow, Clock, SectionLink } from './ui'

// `base`: set on pages other than home, so the section links route back to it.
export default function Footer({ base }) {
  const root = useRef(null)
  const mark = useRef(null)
  useFitText(mark)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ftr__mark-char', {
        yPercent: 100,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.035,
        scrollTrigger: { trigger: '.ftr__mark-wrap', start: 'top 95%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="ftr" ref={root}>
      <div className="ftr__cols">
        <div className="ftr__col">
          <span className="lbl">Socials</span>
          {SOCIALS.map((s) => (
            <a key={s.label} className="h-link" href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <div className="ftr__col">
          <span className="lbl">Contact</span>
          <a className="h-link" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
          <a className="h-link" href={PROFILE.phoneHref}>
            {PROFILE.phone}
          </a>
          <a className="h-link" href={PROFILE.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
        <div className="ftr__col">
          <span className="lbl">Navigation</span>
          {NAV.map((n) => (
            <SectionLink key={n.href} base={base} className="h-link" href={n.href}>
              {n.label}
            </SectionLink>
          ))}
        </div>
        <div className="ftr__col">
          <span className="lbl">Local time</span>
          <span>
            {PROFILE.location}, <Clock /> IST
          </span>
          <a className="ftr__top" href="#top">
            Back to top <Arrow dir="up" />
          </a>
        </div>
      </div>

      <div className="ftr__mark-wrap">
        <div className="ftr__mark" ref={mark} aria-hidden="true">
          {PROFILE.name.split('').map((ch, i) =>
            ch === ' ' ? <span key={i} className="hero__space" /> : <span key={i} className="ftr__mark-char">{ch}</span>,
          )}
        </div>
      </div>

      <div className="ftr__base">
        <span>&copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</span>
        <span>
          Music: {TRACK.composer.split(' ').pop()}, Nocturne Op. 9 No. 2, played by {TRACK.performer} ({TRACK.credit})
        </span>
        <span>Designed &amp; developed by Harshil, in Vadodara.</span>
      </div>
    </footer>
  )
}
