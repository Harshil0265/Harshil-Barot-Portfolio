import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SubPage from './SubPage'
import { LinkIcon, useCopyLink } from './components/Box'
import { Arrow, SplitWords } from './components/ui'
import { PROFILE, PROJECTS, TESTIMONIALS, projectBySlug } from './data'
import { gsap, prefersReducedMotion } from './motion'
import { pageByPath } from './seo'

const pad = (n) => String(n).padStart(2, '0')
const host =(url) => new URL(url).host.replace(/^www\./, '')

// A desktop capture in a slim browser frame.
function Browser({ src, url, alt, eager }) {
  return (
    <figure className="cs-browser" data-reveal>
      <div className="cs-browser__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{host(url)}</span>
      </div>
      <div className="cs-browser__screen">
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
      </div>
    </figure>
  )
}

function Content({ project }) {
  const root = useRef(null)
  const { slug, title, tagline, type, year, industry, url, stack, services, summary, intro, features, desktop, mobile } = project
  const index = PROJECTS.indexOf(project)
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const more = [1, 2, 3].map((k) => PROJECTS[(index + k) % PROJECTS.length])
  const quote = project.quote && TESTIMONIALS.find((t) => t.name === project.quote)
  const [copied, copy] = useCopyLink(slug)
  // Gallery after the cover: one wide screen, a pair when there are enough,
  // the phones, then whatever is left full width.
  const [wide, ...rest] = desktop.slice(1)
  const pair = rest.length >= 2 ? rest.slice(0, 2) : []
  const tail = rest.slice(pair.length)

  useEffect(() => {
    document.title = pageByPath(`/work/${slug}`).title
  }, [slug])

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .from('.cs-title .w', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.05 }, 0)
        .from('.cs-crumbs, .cs-lead > *', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }, 0.3)
        .from('.cs-cover', { y: 60, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.45)

      // The cover opens up and settles as it scrolls into the middle.
      gsap.fromTo(
        '.cs-cover img',
        { scale: 1.12 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cs-cover', start: 'top bottom', end: 'center center', scrub: true } },
      )

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 56,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
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
          <Link to="/work">Work</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1 className="cs-title">
          <SplitWords text={`${title},`} />
          <em>
            <SplitWords text={tagline} />
          </em>
        </h1>
        <div className="cs-lead">
          <p>{summary}</p>
          <div className="cs-lead__actions">
            <button className="pill pill--sm" onClick={copy}>
              <span className="pill__label">{copied ? 'Link copied' : 'Copy link'}</span>
              <span className="pill__icon">
                <LinkIcon />
              </span>
            </button>
            <a className="pill pill--sm pill--solid" href={url} target="_blank" rel="noreferrer">
              <span className="pill__label">Visit live site</span>
              <span className="pill__icon">
                <Arrow />
              </span>
            </a>
          </div>
        </div>
      </section>

      <figure className="cs-cover">
        <img src={desktop[0]} alt={`${title}, home page`} />
      </figure>

      <section className="cs-info">
        <span className="lbl cs-label">(Project description)</span>
        <div className="cs-info__text" data-reveal>
          {intro.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <dl className="cs-facts" data-reveal>
          <div>
            <dt>Year</dt>
            <dd>{year}</dd>
          </div>
          <div>
            <dt>Industry</dt>
            <dd>{industry}</dd>
          </div>
          <div>
            <dt>Project type</dt>
            <dd>{type}</dd>
          </div>
          <div>
            <dt>Project direction</dt>
            <dd>{services.join(', ')}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{stack.join(', ')}</dd>
          </div>
          <div>
            <dt>Live site</dt>
            <dd>
              <a className="u-link" href={url} target="_blank" rel="noreferrer">
                {host(url)}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="cs-gallery" aria-label={`${title} screens`}>
        {wide && <Browser src={wide} url={url} alt={`${title}, a section of the site`} />}
        {pair.length > 0 && (
          <div className="cs-pair">
            {pair.map((src) => (
              <Browser key={src} src={src} url={url} alt={`${title}, a section of the site`} />
            ))}
          </div>
        )}
        {mobile.length > 0 && (
          <div className="cs-phones" data-reveal>
            {mobile.map((src, i) => (
              <div className="cs-phone" key={src}>
                <img src={src} alt={`${title} on a phone, screen ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
        {tail.map((src) => (
          <Browser key={src} src={src} url={url} alt={`${title}, a section of the site`} />
        ))}
      </section>

      <section className="cs-built">
        <span className="lbl cs-label">(What I built)</span>
        <ol className="cs-built__list">
          {features.map(([name, text], i) => (
            <li key={name} data-reveal>
              <span className="cs-built__n">{pad(i + 1)}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {quote && (
        <figure className="cs-quote" data-reveal>
          <blockquote>
            <span className="cs-quote__mark" aria-hidden="true">
              &ldquo;
            </span>
            {quote.quote}
          </blockquote>
          <figcaption>
            <span>{quote.name}</span>
            <span className="lbl">{quote.role}</span>
          </figcaption>
        </figure>
      )}

      <section className="cs-cta" data-reveal>
        <span className="lbl">Your project next</span>
        <h2>
          Want results like <em>{title}</em>?
        </h2>
        <p>
          I design and build fast, scalable web products end to end, from the first sketch to launch day. Tell me what you
          have in mind.
        </p>
        <div className="cs-cta__row">
          <Link className="pill pill--solid" to="/#contact">
            <span className="pill__label">Start a project</span>
            <span className="pill__icon">
              <Arrow />
            </span>
          </Link>
          <a className="pill" href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(`A project like ${title}`)}`}>
            <span className="pill__label">Email me</span>
            <span className="pill__icon">
              <Arrow />
            </span>
          </a>
        </div>
      </section>

      <nav className="cs-pager" aria-label="More projects">
        <Link className="cs-pager__item" to={`/work/${prev.slug}`}>
          <span className="lbl">
            <Arrow dir="left" /> Previous project
          </span>
          <span className="cs-pager__title">{prev.title}</span>
        </Link>
        <Link className="cs-pager__item cs-pager__item--next" to={`/work/${next.slug}`}>
          <span className="lbl">
            Next project <Arrow dir="right" />
          </span>
          <span className="cs-pager__title">{next.title}</span>
        </Link>
      </nav>

      <section className="cs-more">
        <div className="cs-more__head">
          <span className="lbl">(More work)</span>
          <Link className="h-link" to="/work">
            View all work
          </Link>
        </div>
        <ul className="cs-more__grid">
          {more.map((p) => (
            <li key={p.slug} data-reveal>
              <Link className="cs-card" to={`/work/${p.slug}`}>
                <span className="cs-card__img">
                  <img src={p.image} alt="" loading="lazy" />
                </span>
                <span className="cs-card__title">{p.title}</span>
                <span className="cs-card__type">
                  {p.type} · {p.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

// Route: /work/:slug. Each project remounts the content so its entrance plays
// again and the page starts at the top.
export default function CaseStudy() {
  const { slug } = useParams()
  const project = projectBySlug(slug)
  if (!project) return <Navigate to="/work" replace />
  return (
    <SubPage pageKey={slug}>
      <Content key={slug} project={project} />
    </SubPage>
  )
}
