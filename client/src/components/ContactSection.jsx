import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Globe, Share2, Search, Users, MessageSquare, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import AnimatedCategoryCard from './AnimatedCategoryCard'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    source: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' or 'error'
  const [messageCount, setMessageCount] = useState(0)

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required'
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces'
    return null
  }

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'
    return null
  }

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required'
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) return 'Phone number must be exactly 10 digits'
    return null
  }

  const validateMessage = (message) => {
    if (!message.trim()) return 'Message is required'
    if (message.length > 500) return 'Message cannot exceed 500 characters'
    return null
  }

  const validateSource = (source) => {
    if (source.length === 0) return 'Please select at least one option'
    return null
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }

    // Update character count for message
    if (name === 'message') {
      setMessageCount(value.length)
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const newSource = prev.source.includes(value)
        ? prev.source.filter(item => item !== value)
        : [...prev.source, value]
      
      return { ...prev, source: newSource }
    })
    
    if (errors.source) {
      setErrors(prev => ({ ...prev, source: null }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
      source: validateSource(formData.source)
    }

    // Filter out null errors
    const hasErrors = Object.values(newErrors).some(error => error !== null)
    
    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = formData.phone.replace(/\D/g, '')

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: cleanPhone
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
          source: []
        })
        setMessageCount(0)
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        setSubmitStatus('error')
        // Handle validation errors from server
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors = {}
          data.errors.forEach(err => {
            serverErrors[err.path] = err.msg
          })
          setErrors(serverErrors)
        }
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact-section-dotted" id="contact">
      <div className="contact-dotted-bg"></div>
      <div className="container-wide">
        <motion.div 
          className="contact-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="contact-badge">GET IN TOUCH • LET'S CONNECT</span>
          <h2 className="contact-heading">
            let's build something <span className="contact-heading-accent">amazing</span>.
          </h2>
          <p className="contact-subheading">
            Whether you're looking for a full-stack developer, have a project in mind, or just want to 
            connect – I'm always open to discussing new opportunities and collaborations.
          </p>
        </motion.div>

        <div className="contact-layout">
          {/* Left Side - Contact Info Cards */}
          <motion.div 
            className="contact-info-cards"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Mail size={24} />
              </div>
              <div className="contact-info-content">
                <span className="contact-info-label">EMAIL</span>
                <a href="mailto:harshill.barot@gmail.com" className="contact-info-value">
                  harshill.barot@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon phone">
                <Phone size={24} />
              </div>
              <div className="contact-info-content">
                <span className="contact-info-label">PHONE</span>
                <a href="tel:+918866982848" className="contact-info-value">
                  +91 88669 82848
                </a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon location">
                <MapPin size={24} />
              </div>
              <div className="contact-info-content">
                <span className="contact-info-label">LOCATION</span>
                <span className="contact-info-value">Vadodara, Gujarat, India</span>
                <span className="contact-info-sublabel">Remote work available worldwide</span>
              </div>
            </div>

            <div className="contact-info-card reply-time">
              <div className="contact-info-content">
                <span className="contact-info-label">REPLY TIME</span>
                <span className="contact-info-value-highlight">under 24 hrs, always.</span>
              </div>
            </div>

            {/* Animated What I Build Card */}
            <div className="contact-info-card what-i-build-wrapper">
              <AnimatedCategoryCard />
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div 
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="contact-form-card">
              <h3 className="form-title">DROP THE NOTE</h3>
              
              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div 
                  className="form-status-message success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={20} />
                  <span>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</span>
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div 
                  className="form-status-message error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={20} />
                  <span>Something went wrong. Please try again later.</span>
                </motion.div>
              )}
              
              <form className="modern-contact-form" onSubmit={handleSubmit}>
                <div className="form-row-double">
                  <div className="form-group">
                    <label className="form-label-modern">
                      YOUR NAME <span className="required">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Arjun Mehta" 
                      className={`form-input-modern ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name ? (
                      <span className="form-error">{errors.name}</span>
                    ) : (
                      <span className="form-hint">Letters only - no numbers or symbols</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label-modern">
                      EMAIL <span className="required">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com" 
                      className={`form-input-modern ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && (
                      <span className="form-error">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-double">
                  <div className="form-group">
                    <label className="form-label-modern">
                      PHONE <span className="required">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="8866982848" 
                      maxLength="10"
                      className={`form-input-modern ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone ? (
                      <span className="form-error">{errors.phone}</span>
                    ) : (
                      <span className="form-hint">10-digit mobile number</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label-modern">
                      SUBJECT <span className="required">*</span>
                    </label>
                    <select 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-select-modern"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Web Development">Web Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Full-Stack Project">Full-Stack Project</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-modern">
                    MESSAGE <span className="required">*</span>
                  </label>
                  <textarea 
                    name="message" 
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a bit about what you're looking for..." 
                    maxLength="500"
                    className={`form-textarea-modern ${errors.message ? 'error' : ''}`}
                  />
                  <div className="form-footer-row">
                    {errors.message ? (
                      <span className="form-error">{errors.message}</span>
                    ) : (
                      <span></span>
                    )}
                    <span className={`form-char-count ${messageCount > 450 ? 'warning' : ''}`}>
                      {messageCount}/500
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label-modern">
                    HOW DID YOU HEAR ABOUT US? <span className="required">*</span>
                  </label>
                  <div className="form-checkbox-group">
                    <label className={`checkbox-pill ${formData.source.includes('Internet') ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        name="source" 
                        value="Internet"
                        checked={formData.source.includes('Internet')}
                        onChange={() => handleCheckboxChange('Internet')}
                      />
                      <span className="checkbox-pill-text">
                        <Globe size={16} className="checkbox-icon" />
                        Internet
                      </span>
                    </label>
                    <label className={`checkbox-pill ${formData.source.includes('Social Media') ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        name="source" 
                        value="Social Media"
                        checked={formData.source.includes('Social Media')}
                        onChange={() => handleCheckboxChange('Social Media')}
                      />
                      <span className="checkbox-pill-text">
                        <Share2 size={16} className="checkbox-icon" />
                        Social Media
                      </span>
                    </label>
                    <label className={`checkbox-pill ${formData.source.includes('Google') ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        name="source" 
                        value="Google"
                        checked={formData.source.includes('Google')}
                        onChange={() => handleCheckboxChange('Google')}
                      />
                      <span className="checkbox-pill-text">
                        <Search size={16} className="checkbox-icon" />
                        Google
                      </span>
                    </label>
                    <label className={`checkbox-pill ${formData.source.includes('Reference') ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        name="source" 
                        value="Reference"
                        checked={formData.source.includes('Reference')}
                        onChange={() => handleCheckboxChange('Reference')}
                      />
                      <span className="checkbox-pill-text">
                        <Users size={16} className="checkbox-icon" />
                        Reference
                      </span>
                    </label>
                    <label className={`checkbox-pill ${formData.source.includes('Other') ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        name="source" 
                        value="Other"
                        checked={formData.source.includes('Other')}
                        onChange={() => handleCheckboxChange('Other')}
                      />
                      <span className="checkbox-pill-text">
                        <MessageSquare size={16} className="checkbox-icon" />
                        Other
                      </span>
                    </label>
                  </div>
                  {errors.source && (
                    <span className="form-error">{errors.source}</span>
                  )}
                </div>

                <motion.button 
                  type="submit" 
                  className="btn-submit-modern"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="spinner" />
                      <span>SENDING...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND INQUIRY</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
