import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Globe, Share2, Search, Users, MessageSquare, CheckCircle, AlertCircle, Loader } from 'lucide-react'

// Contact section for the Creative Portfolio page — same validation and
// submit behaviour as the developer site's ContactSection, re-themed blue
// and with creative-relevant subject options.
const CreativeContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Video Editing',
    message: '',
    source: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [messageCount, setMessageCount] = useState(0)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }

    if (name === 'message') {
      setMessageCount(value.length)
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
      source: validateSource(formData.source)
    }

    const hasErrors = Object.values(newErrors).some(error => error !== null)

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Video Editing',
          message: '',
          source: []
        })
        setMessageCount(0)

        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        setSubmitStatus('error')
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
    <section className="cp-contact-form-section" id="cp-contact">
      <div className="cp-container">
        <motion.div
          className="cp-contact-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="cp-contact-badge">GET IN TOUCH · LET'S CREATE</span>
          <h2 className="cp-contact-heading">
            Got a video, design, or content idea?
          </h2>
          <p className="cp-contact-subheading">
            Whether it's a reel that needs editing, a poster that needs designing, or a script that
            needs writing — let's create something worth sharing.
          </p>
        </motion.div>

        <div className="cp-contact-layout">
          {/* Left Side - Contact Info Cards */}
          <motion.div
            className="cp-contact-info-cards"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="cp-contact-info-card">
              <div className="cp-contact-info-icon">
                <Mail size={22} />
              </div>
              <div className="cp-contact-info-content">
                <span className="cp-contact-info-label">EMAIL</span>
                <a href="mailto:harshill.barot@gmail.com" className="cp-contact-info-value">
                  harshill.barot@gmail.com
                </a>
              </div>
            </div>

            <div className="cp-contact-info-card">
              <div className="cp-contact-info-icon">
                <Phone size={22} />
              </div>
              <div className="cp-contact-info-content">
                <span className="cp-contact-info-label">PHONE</span>
                <a href="tel:+918866982848" className="cp-contact-info-value">
                  +91 88669 82848
                </a>
              </div>
            </div>

            <div className="cp-contact-info-card">
              <div className="cp-contact-info-icon">
                <MapPin size={22} />
              </div>
              <div className="cp-contact-info-content">
                <span className="cp-contact-info-label">LOCATION</span>
                <span className="cp-contact-info-value">Vadodara, Gujarat, India</span>
                <span className="cp-contact-info-sublabel">Remote collaborations welcome</span>
              </div>
            </div>

            <div className="cp-contact-info-card cp-reply-time">
              <div className="cp-contact-info-content">
                <span className="cp-contact-info-label">REPLY TIME</span>
                <span className="cp-contact-info-value-highlight">under 24 hrs, always.</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            className="cp-contact-form-wrapper"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="cp-contact-form-card">
              <h3 className="cp-form-title">DROP THE NOTE</h3>

              {submitStatus === 'success' && (
                <motion.div
                  className="cp-form-status-message success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={20} />
                  <span>Thank you! Your message has been sent successfully. I'll get back to you within 24 hours.</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  className="cp-form-status-message error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={20} />
                  <span>Something went wrong. Please try again later.</span>
                </motion.div>
              )}

              <form className="cp-modern-contact-form" onSubmit={handleSubmit}>
                <div className="cp-form-row-double">
                  <div className="cp-form-group">
                    <label className="cp-form-label-modern">
                      YOUR NAME <span className="cp-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Arjun Mehta"
                      className={`cp-form-input-modern ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name ? (
                      <span className="cp-form-error">{errors.name}</span>
                    ) : (
                      <span className="cp-form-hint">Letters only - no numbers or symbols</span>
                    )}
                  </div>

                  <div className="cp-form-group">
                    <label className="cp-form-label-modern">
                      EMAIL <span className="cp-required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={`cp-form-input-modern ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && (
                      <span className="cp-form-error">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="cp-form-row-double">
                  <div className="cp-form-group">
                    <label className="cp-form-label-modern">
                      PHONE <span className="cp-required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="8866982848"
                      maxLength="10"
                      className={`cp-form-input-modern ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone ? (
                      <span className="cp-form-error">{errors.phone}</span>
                    ) : (
                      <span className="cp-form-hint">10-digit mobile number</span>
                    )}
                  </div>

                  <div className="cp-form-group">
                    <label className="cp-form-label-modern">
                      SUBJECT <span className="cp-required">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="cp-form-select-modern"
                    >
                      <option value="Video Editing">Video Editing</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Scriptwriting">Scriptwriting</option>
                      <option value="AI Video">AI Video</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label-modern">
                    MESSAGE <span className="cp-required">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me a bit about what you're looking for..."
                    maxLength="500"
                    className={`cp-form-textarea-modern ${errors.message ? 'error' : ''}`}
                  />
                  <div className="cp-form-footer-row">
                    {errors.message ? (
                      <span className="cp-form-error">{errors.message}</span>
                    ) : (
                      <span></span>
                    )}
                    <span className={`cp-form-char-count ${messageCount > 450 ? 'warning' : ''}`}>
                      {messageCount}/500
                    </span>
                  </div>
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label-modern">
                    HOW DID YOU HEAR ABOUT ME? <span className="cp-required">*</span>
                  </label>
                  <div className="cp-form-checkbox-group">
                    <label className={`cp-checkbox-pill ${formData.source.includes('Internet') ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="source"
                        value="Internet"
                        checked={formData.source.includes('Internet')}
                        onChange={() => handleCheckboxChange('Internet')}
                      />
                      <span className="cp-checkbox-pill-text">
                        <Globe size={16} />
                        Internet
                      </span>
                    </label>
                    <label className={`cp-checkbox-pill ${formData.source.includes('Social Media') ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="source"
                        value="Social Media"
                        checked={formData.source.includes('Social Media')}
                        onChange={() => handleCheckboxChange('Social Media')}
                      />
                      <span className="cp-checkbox-pill-text">
                        <Share2 size={16} />
                        Social Media
                      </span>
                    </label>
                    <label className={`cp-checkbox-pill ${formData.source.includes('Google') ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="source"
                        value="Google"
                        checked={formData.source.includes('Google')}
                        onChange={() => handleCheckboxChange('Google')}
                      />
                      <span className="cp-checkbox-pill-text">
                        <Search size={16} />
                        Google
                      </span>
                    </label>
                    <label className={`cp-checkbox-pill ${formData.source.includes('Reference') ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="source"
                        value="Reference"
                        checked={formData.source.includes('Reference')}
                        onChange={() => handleCheckboxChange('Reference')}
                      />
                      <span className="cp-checkbox-pill-text">
                        <Users size={16} />
                        Reference
                      </span>
                    </label>
                    <label className={`cp-checkbox-pill ${formData.source.includes('Other') ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="source"
                        value="Other"
                        checked={formData.source.includes('Other')}
                        onChange={() => handleCheckboxChange('Other')}
                      />
                      <span className="cp-checkbox-pill-text">
                        <MessageSquare size={16} />
                        Other
                      </span>
                    </label>
                  </div>
                  {errors.source && (
                    <span className="cp-form-error">{errors.source}</span>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="cp-btn-submit-modern"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="cp-spinner" />
                      <span>SENDING...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND INQUIRY</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
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

export default CreativeContactSection
