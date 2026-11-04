import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SubPage from './SubPage'
import { Arrow, SplitWords } from './components/ui'
import { PROFILE, PROJECTS } from './data'
import { gsap, prefersReducedMotion } from './motion'
import { pageByPath } from './seo'

const pad = (n) => String(n).padStart(2, '0')

function WorkList() {
  const root = useRef(null)

  useEffect(() => {
    document.title = pageByPath('/work').title
  }, [])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .from('.cs-title .w', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.05 }, 0)
        .from('.cs-crumbs, .cs-lead > *', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }, 0.3)
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 56, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <main className="cs" ref={root}>
      <section className="cs-hero">
        <nav className="cs-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Work</span>
        </nav>
        <h1 className="cs-title">
          <SplitWords text="All work," />
          <em>
            <SplitWords text="live and growing" />
          </em>
        </h1>
        <div className="cs-lead">
          <p>
            Websites, platforms and products for founders and growing businesses. Every project here is live; open one
            for the full story.
          </p>
          <span className="wk-count">{pad(PROJECTS.length)} projects</span>
        </div>
      </section>

      <ul className="wk-grid">
        {PROJECTS.map((p, i) => (
          <li key={p.slug} data-reveal>
            <Link className="wk-card" to={`/work/${p.slug}`}>
              <span className="wk-card__img">
                <img src={p.image} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
              </span>
              <span className="wk-card__head">
                <span className="wk-card__n">{pad(i + 1)}</span>
                <span className="wk-card__title">{p.title}</span>
                <span className="wk-card__go" aria-hidden="true">
                  <Arrow />
                </span>
              </span>
              <span className="wk-card__type">
                {p.type} · {p.year}
              </span>
              <span className="wk-card__desc">{p.summary}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="cs-cta" data-reveal>
        <span className="lbl">Your project next</span>
        <h2>
          Have something <em>in mind</em>?
        </h2>
        <p>Tell me about the product, the business behind it and where you want it to go.</p>
        <div className="cs-cta__row">
          <Link className="pill pill--solid" to="/#contact">
            <span className="pill__label">Start a project</span>
            <span className="pill__icon">
              <Arrow />
            </span>
          </Link>
          <a className="pill" href={`mailto:${PROFILE.email}`}>
            <span className="pill__label">Email me</span>
            <span className="pill__icon">
              <Arrow />
            </span>
          </a>
        </div>
      </section>
    </main>
  )
}

// Route: /work. Every project, each opening its case study.
export default function Work() {
  return (
    <SubPage pageKey="work">
      <WorkList />
    </SubPage>
  )
}
