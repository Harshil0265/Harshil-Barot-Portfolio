import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

let lenis = null

// Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger and the
// smooth scroll always agree on the same frame.
export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    // Let overlays with their own scroll areas (admin inbox, mobile menu, the box) scroll natively.
    prevent: (node) => !!node.closest?.('.admin-panel-overlay, .mmenu, .box'),
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function lockScroll(locked) {
  document.documentElement.classList.toggle('is-locked', locked)
  if (lenis) (locked ? lenis.stop() : lenis.start())
}

// `immediate` jumps without the glide (landing on a section from another page).
export function scrollToTarget(target, { immediate = false } = {}) {
  const el = typeof target === 'string' ? (target === '#top' ? document.body : document.querySelector(target)) : target
  if (!el) return
  const smooth = !immediate && !prefersReducedMotion()
  if (lenis) {
    lenis.scrollTo(target === '#top' ? 0 : el, { immediate: !smooth, duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else if (target === '#top') {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  } else {
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }
}

const imageCache = new Map()

export function loadImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      }),
    )
  }
  return imageCache.get(src)
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
