import { useEffect, useLayoutEffect } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import { ScrollTrigger, getLenis, initSmoothScroll, scrollToTarget } from './motion'
import './site.css'
import './case.css'

// Chrome for the pages beyond home (/work and the case studies): the dark
// theme, smooth scroll, and a header and footer that route back home.
// `pageKey` changes per page so each starts at the top.
export default function SubPage({ pageKey, children }) {
  useEffect(() => {
    document.documentElement.classList.add('is-site')
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const destroy = initSmoothScroll()
    // In-page anchors ("Back to top") go through the smooth scroller.
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented) return
      e.preventDefault()
      scrollToTarget(a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      destroy()
      document.documentElement.classList.remove('is-site')
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    getLenis()?.scrollTo(0, { immediate: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pageKey])

  return (
    <div className="site" id="top">
      <div className="grain" aria-hidden="true" />
      <Header intro logoVisible base="/" />
      {children}
      <Footer base="/" />
    </div>
  )
}
