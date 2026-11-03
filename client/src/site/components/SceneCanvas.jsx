import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data'
import { Scene } from '../Scene'
import { ScrollTrigger, loadImage, prefersReducedMotion } from '../motion'

export const PORTRAIT_SRC = '/portrait-particles.webp'
export const ATLAS_SRC = '/work/atlas.webp'

// `boxed`: the box is open on the left, so the view slides over to the right.
export default function SceneCanvas({ play, boxed }) {
  const wrap = useRef(null)
  const scene = useRef(null)
  const boxedRef = useRef(boxed)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    Promise.all([loadImage(PORTRAIT_SRC), loadImage(ATLAS_SRC)]).then(([portrait, atlas]) => {
      if (disposed) return
      // A fresh canvas per mount: a context lost in a previous mount can't be reused.
      const canvas = document.createElement('canvas')
      canvas.className = 'portrait__canvas'
      wrap.current.appendChild(canvas)
      let s
      try {
        s = new Scene(canvas, { portrait, atlas, cardCount: PROJECTS.length })
      } catch {
        canvas.remove()
        setFallback(true)
        return
      }
      scene.current = s
      s.setBoxed(boxedRef.current)
      PROJECTS.forEach((p, i) => loadImage(p.image).then((img) => !disposed && s.setCardImage(i, img)))

      const onResize = () => s.resize()
      const onMove = (e) => s.setPointer(e.clientX, e.clientY)
      const onLeave = () => s.clearPointer()
      const onVisibility = () => s.setVisible(s.state.visible)
      window.addEventListener('resize', onResize)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      document.addEventListener('visibilitychange', onVisibility)

      const triggers = [
        // Hero: the face breaks apart into work tiles.
        ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom top', onUpdate: (t) => s.setHero(t.progress) }),
        // Fly-through: travel past the six project cards.
        ScrollTrigger.create({ trigger: '#flight', start: 'top top', end: 'bottom bottom', onUpdate: (t) => s.setWork(t.progress) }),
        ScrollTrigger.create({
          trigger: '#top',
          start: 'top top',
          endTrigger: '#flight',
          end: 'bottom top',
          onUpdate: (t) => s.setVelocity(t.getVelocity() / 100),
        }),
        // Sleep once the fly-through is behind us.
        ScrollTrigger.create({
          trigger: '#top',
          start: 'top bottom',
          endTrigger: '#flight',
          end: 'bottom 30%',
          onToggle: (t) => {
            wrap.current?.classList.toggle('is-off', !t.isActive)
            s.setVisible(t.isActive)
          },
        }),
      ]

      cleanup = () => {
        window.removeEventListener('resize', onResize)
        window.removeEventListener('pointermove', onMove)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        document.removeEventListener('visibilitychange', onVisibility)
        triggers.forEach((t) => t.kill())
        s.destroy()
        canvas.remove()
        scene.current = null
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  useEffect(() => {
    boxedRef.current = boxed
    scene.current?.setBoxed(boxed)
  }, [boxed])

  useEffect(() => {
    if (!play) return
    let tries = 0
    let raf = 0
    // The scene may still be building on slow devices; wait (bounded) for it.
    const start = () => {
      const s = scene.current
      if (!s) {
        if (tries++ < 600) raf = requestAnimationFrame(start)
        return
      }
      if (prefersReducedMotion()) s.skipIntro()
      else s.play(4.2, 0.3)
    }
    start()
    return () => cancelAnimationFrame(raf)
  }, [play])

  return (
    <div className="portrait" ref={wrap} aria-hidden="true">
      {fallback && <img className="portrait__fallback" src={PORTRAIT_SRC} alt="" />}
    </div>
  )
}
