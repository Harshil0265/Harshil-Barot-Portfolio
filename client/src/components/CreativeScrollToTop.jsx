import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2 } from 'lucide-react'

const CreativeScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.pageYOffset / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cp-scroll-top-wrapper"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Progress ring — blue theme */}
          <svg className="cp-scroll-ring" width="64" height="64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#cfe8fb"
              strokeWidth="3"
            />
            <circle
              className="cp-scroll-ring-progress"
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>

          {/* Main button */}
          <motion.button
            className="cp-scroll-top-btn"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            {/* Bouncing wand icon */}
            <motion.div
              className="cp-scroll-icon-wrap"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="cp-scroll-icon" size={22} />
            </motion.div>

            {/* Star decorations mirroring dev's < > brackets */}
            <div className="cp-scroll-stars">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >✦</motion.span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >✦</motion.span>
            </div>
          </motion.button>

          {/* Floating particles */}
          <div className="cp-scroll-particles">
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.span
                key={i}
                className="cp-scroll-particle"
                animate={{ y: [-20, -40], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay }}
              >•</motion.span>
            ))}
          </div>

          {/* Hover tooltip */}
          <div className="cp-scroll-tooltip">
            <Wand2 size={13} />
            <span>Back to top</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreativeScrollToTop
