import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NAV, PROFILE, SOCIALS } from '../data'
import { gsap, lockScroll, ScrollTrigger } from '../motion'
import { Clock, Logo, MaskLine, SectionLink } from './ui'

// `base`: set on pages other than home, so the links route back to it.
export default function Header({ intro, logoVisible, base }) {
  const root = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    gsap.set(root.current.querySelectorAll('.hdr__meta .mask__in, .hdr__menu-btn .mask__in'), { yPercent: 110 })
  }, [])

  useEffect(() => {
    if (!intro) return
    const ctx = gsap.context(() => {
      gsap.to('.hdr__meta .mask__in, .hdr__menu-btn .mask__in', {
        yPercent: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        delay: 0.35,
      })
      // "Currently" and "Based in" bow out once the hero is behind us.
      const el = root.current
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => el.classList.toggle('is-compact', self.scroll() > window.innerHeight * 0.6),
      })
    }, root)
    return () => ctx.revert()
  }, [intro])

  // Event-driven (not an effect) so it can never unlock scroll during the loader.
  const openRef = useRef(false)
  const setOpen = (open) => {
    openRef.current = open
    setMenuOpen(open)
    lockScroll(open)
    document.documentElement.classList.toggle('menu-open', open)
  }

  useEffect(() => {
    const close = () => openRef.current && setOpen(false)
    window.addEventListener('site:navigate', close)
    return () => {
      window.removeEventListener('site:navigate', close)
      // Leaving the page with the menu open (a route change) must not keep it locked.
      if (openRef.current) {
        lockScroll(false)
        document.documentElement.classList.remove('menu-open')
      }
    }
  }, [])

  return (
    <>
      <header className="hdr" ref={root}>
        <SectionLink base={base} id="site-logo" className={`hdr__logo ${logoVisible ? 'is-visible' : ''}`} href="#top" aria-label="Harshil Barot, back to top">
          <Logo />
        </SectionLink>

        <div className="hdr__meta hdr__meta--current">
          <MaskLine className="lbl">Currently:</MaskLine>
          <MaskLine>
            Founder,{' '}
            <a className="u-link" href={PROFILE.company.url} target="_blank" rel="noreferrer">
              {PROFILE.company.name}
            </a>
          </MaskLine>
        </div>

        <div className="hdr__meta hdr__meta--based">
          <MaskLine className="lbl">Based in:</MaskLine>
          <MaskLine>
            {PROFILE.location} (<Clock />)
          </MaskLine>
        </div>

        <nav className="hdr__meta hdr__meta--nav" aria-label="Primary">
          <MaskLine className="lbl">Navigation:</MaskLine>
          <MaskLine>
            {NAV.map((item, i) => (
              <span key={item.href}>
                <SectionLink base={base} className="nav-link" href={item.href}>
                  {item.label}
                </SectionLink>
                {i < NAV.length - 1 ? ', ' : ''}
              </span>
            ))}
          </MaskLine>
        </nav>

        <button
          className="hdr__menu-btn"
          onClick={() => setOpen(!openRef.current)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <MaskLine>{menuOpen ? 'Close' : 'Menu'}</MaskLine>
        </button>
      </header>

      <div id="mobile-menu" className={`mmenu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mmenu__nav" aria-label="Mobile">
          {NAV.map((item, i) => (
            <SectionLink
              key={item.href}
              base={base}
              href={item.href}
              style={{ '--i': i }}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="mmenu__n">0{i + 1}</span>
              {item.label}
            </SectionLink>
          ))}
        </nav>
        <div className="mmenu__foot">
          <div>
            <span className="lbl">Currently</span>
            <span>Founder, {PROFILE.company.name}</span>
          </div>
          <div>
            <span className="lbl">Based in</span>
            <span>
              {PROFILE.location} (<Clock />)
            </span>
          </div>
          <div className="mmenu__socials">
            {SOCIALS.slice(0, 4).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
