import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Terminal, Rocket } from 'lucide-react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.pageYOffset / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="scroll-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Progress Ring */}
          <svg className="progress-ring" width="64" height="64">
            <circle
              className="progress-ring-bg"
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#e5e5e0"
              strokeWidth="3"
            />
            <circle
              className="progress-ring-progress"
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#d97706"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>

          {/* Main Button */}
          <motion.button
            className="scroll-to-top-btn"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            {/* Animated Icon */}
            <motion.div
              className="btn-icon-container"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Rocket className="btn-icon" size={24} />
            </motion.div>

            {/* Code brackets decoration */}
            <div className="code-brackets">
              <span className="bracket-left">{'<'}</span>
              <span className="bracket-right">{'>'}</span>
            </div>
          </motion.button>

          {/* Floating particles */}
          <div className="particles">
            <motion.span
              className="particle"
              animate={{ 
                y: [-20, -40],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
              •
            </motion.span>
            <motion.span
              className="particle"
              animate={{ 
                y: [-20, -40],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              •
            </motion.span>
            <motion.span
              className="particle"
              animate={{ 
                y: [-20, -40],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              •
            </motion.span>
          </div>

          {/* Hover tooltip */}
          <div className="scroll-tooltip">
            <Terminal size={14} />
            <span>$ cd ~/top</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
