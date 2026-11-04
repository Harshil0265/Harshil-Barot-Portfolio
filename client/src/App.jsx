import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import Box from './site/components/Box'
import Header from './site/components/Header'
import Hero, { DISPLAY_FONT } from './site/components/Hero'
import Loader from './site/components/Loader'
import SceneCanvas, { ATLAS_SRC, PORTRAIT_SRC } from './site/components/SceneCanvas'
import Selected from './site/components/Selected'
import { PROJECTS, SOCIALS } from './site/data'
import { ScrollTrigger, getLenis, initSmoothScroll, loadImage, lockScroll, scrollToTarget } from './site/motion'
import { cardProgress } from './site/Scene'
import { pageByPath } from './site/seo'
import './site/site.css'

// Survives route changes (not reloads): the loader plays once per visit, and
// coming back from a case study lands where the visitor left off.
const visit = { introSeen: false, scrollY: 0 }

// Nav anchors that open a view of the box instead of scrolling.
const BOX_VIEWS = { '#selected': 'selected', '#about': 'about', '#contact': 'contact' }

export default function App() {
  const navigationType = useNavigationType()
  const { hash } = useLocation()
  // An in-app link to a section ("Start a project" on a case study) skips the
  // intro too: the visitor asked for that section, not the show.
  const returning = useRef(visit.introSeen || (navigationType === 'PUSH' && !!hash)).current
  // Read before any effect runs (StrictMode's test remount saves a fresh 0).
  const restoreY = useRef(visit.scrollY).current
  // loading -> intro (curtain lifting, hero animating) -> done (loader gone)
  const [phase, setPhase] = useState(returning ? 'done' : 'loading')
  // The box on the left: null, or { view: selected | about | contact | project, slug }.
  const [box, setBox] = useState(null)
  const boxRef = useRef(box)
  const closeBox = useCallback(() => setBox(null), [])
  const openView = useCallback((view) => setBox({ view }), [])
  const openProject = useCallback((slug) => setBox({ view: 'project', slug }), [])
  const started = phase !== 'loading'

  const assets = useMemo(() => {
    const fonts = document.fonts
      ? Promise.all([DISPLAY_FONT, '400 16px "Inter Tight"', '500 16px "Inter Tight"'].map((f) => document.fonts.load(f)))
      : null
    const ready = Promise.all([
      fonts,
      loadImage(PORTRAIT_SRC),
      loadImage(ATLAS_SRC),
    ])
    // Never trap visitors behind the loader on a flaky connection.
    return Promise.race([ready, new Promise((r) => setTimeout(r, 7000))])
  }, [])

  useEffect(() => {
    document.title = pageByPath('/').title
    document.documentElement.classList.add('is-site')
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const destroy = initSmoothScroll()
    if (!returning) lockScroll(true)
    return () => {
      // Scroller first: restarting it here would fire scroll callbacks into a
      // page that is already unmounting.
      destroy()
      lockScroll(false)
      document.documentElement.classList.remove('is-site')
    }
  }, [])

  // Layout cleanup runs before the page leaves the DOM, while scrollY is still real.
  useLayoutEffect(
    () => () => {
      visit.scrollY = window.scrollY
    },
    [],
  )

  // Back from a case study: return to the same spot, or open / jump to the linked part.
  useEffect(() => {
    if (!returning) return
    visit.introSeen = true
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (BOX_VIEWS[hash]) setBox({ view: BOX_VIEWS[hash] })
      else if (hash) scrollToTarget(hash, { immediate: true })
      else if (navigationType === 'POP' && restoreY) getLenis()?.scrollTo(restoreY, { immediate: true })
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // In-page anchors: Selected, About and Contact open the box; the rest go
  // through the smooth scroller.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented) return
      e.preventDefault()
      window.dispatchEvent(new Event('site:navigate'))
      const href = a.getAttribute('href')
      if (BOX_VIEWS[href]) {
        setBox({ view: BOX_VIEWS[href] })
        return
      }
      // Anywhere else (the logo, Work) leaves the box: close it and release
      // the page before scrolling.
      if (boxRef.current) {
        setBox(null)
        lockScroll(false)
      }
      scrollToTarget(href)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    boxRef.current = box
    document.documentElement.classList.toggle('is-boxed', !!box)
  }, [box])
  useEffect(() => () => document.documentElement.classList.remove('is-boxed'), [])

  // Picked from a list: open the project and fly the view to its card.
  const pickProject = useCallback((slug) => {
    setBox({ view: 'project', slug })
    const i = PROJECTS.findIndex((p) => p.slug === slug)
    const flight = document.getElementById('flight')
    if (i < 0 || !flight) return
    const y = flight.offsetTop + (flight.offsetHeight - window.innerHeight) * cardProgress(i, PROJECTS.length)
    // The open box keeps the page locked; release it just for the flight.
    lockScroll(false)
    const relock = () => boxRef.current && lockScroll(true)
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(y, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: relock })
    } else {
      window.scrollTo(0, y)
      relock()
    }
  }, [])

  const reveal = () => {
    visit.introSeen = true
    setPhase('intro')
    lockScroll(false)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    // Arrived on a link to one of the box views (/#about).
    const view = BOX_VIEWS[window.location.hash]
    if (view) setBox({ view })
  }

  return (
    <div className="site">
      <a className="skip-link" href="#flight">
        Skip to work
      </a>
      <div className="grain" aria-hidden="true" />
      <SceneCanvas play={started} boxed={!!box} />
      <Header intro={started} logoVisible={phase === 'done'} />
      <main>
        <Hero intro={started} />
        <Selected onOpen={openProject} />
      </main>
      <Box state={box} onView={openView} onPick={pickProject} onClose={closeBox} />
      {/* Takes the hero's place in the corner while the box is open. */}
      <div className="elsewhere" aria-hidden={!box}>
        <span className="lbl">Elsewhere:</span>
        <span>
          {SOCIALS.slice(0, 3).map((s, i) => (
            <span key={s.label}>
              <a className="nav-link" href={s.href} target="_blank" rel="noreferrer" tabIndex={box ? 0 : -1}>
                {s.label}
              </a>
              {i < 2 ? ', ' : ''}
            </span>
          ))}
        </span>
      </div>
      {phase !== 'done' && <Loader assets={assets} onReveal={reveal} onDone={() => setPhase('done')} />}
    </div>
  )
}
