import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Coffee, Briefcase, Rocket } from 'lucide-react'

const AnimatedCategoryCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const categories = [
    {
      icon: GraduationCap,
      title: 'Education Platforms',
      description: 'Building interactive learning management systems and educational websites'
    },
    {
      icon: Coffee,
      title: 'E-Commerce & Cafés',
      description: 'Creating online ordering systems and digital storefronts for businesses'
    },
    {
      icon: Briefcase,
      title: 'SaaS Solutions',
      description: 'Developing scalable software-as-a-service applications for enterprises'
    },
    {
      icon: Rocket,
      title: 'Web Applications',
      description: 'Crafting custom web apps and mobile-responsive platforms'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length)
    }, 6000) // Change every 6 seconds

    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = categories[currentIndex].icon

  return (
    <div className="animated-category-card">
      <span className="contact-info-label">WHAT I BUILD</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="category-content"
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="category-icon-large">
            <CurrentIcon size={40} strokeWidth={2} />
          </div>
          <h4 className="category-title">{categories[currentIndex].title}</h4>
          <p className="category-description">{categories[currentIndex].description}</p>
        </motion.div>
      </AnimatePresence>
      <div className="category-indicators">
        {categories.map((_, index) => (
          <div
            key={index}
            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default AnimatedCategoryCard
