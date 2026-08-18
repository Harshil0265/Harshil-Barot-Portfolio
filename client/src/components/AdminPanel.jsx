import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Mail, Phone, Calendar, Tag, MessageSquare, Search, Filter,
  Eye, Check, Reply, Archive, Trash2, LogOut, BarChart3, Loader,
  AlertCircle, CheckCircle, Lock
} from 'lucide-react'

const AdminPanel = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  const [contacts, setContacts] = useState([])
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0, archived: 0 })
  const [selectedContact, setSelectedContact] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      verifyToken(token)
    }
  }, [])

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchContacts()
      fetchStats()
    }
  }, [isAuthenticated, isOpen, currentPage, statusFilter, searchQuery])

  // Verify token
  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Token verification error:', error)
      localStorage.removeItem('adminToken')
      setIsAuthenticated(false)
    }
  }

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        setLoginForm({ username: '', password: '' })
      } else {
        setLoginError(data.message || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setContacts([])
    setStats({ total: 0, new: 0, read: 0, replied: 0, archived: 0 })
    setSelectedContact(null)
  }

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await fetch(`/api/contact?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.data)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Fetch contacts error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/contact/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    }
  }

  // Update contact status
  const updateStatus = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/contact/${contactId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchContacts()
        fetchStats()
        if (selectedContact?._id === contactId) {
          setSelectedContact(prev => ({ ...prev, status: newStatus }))
        }
      }
    } catch (error) {
      console.error('Update status error:', error)
    }
  }

  // Delete contact
  const deleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchContacts()
        fetchStats()
        if (selectedContact?._id === contactId) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error('Delete contact error:', error)
    }
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6',
      read: '#f59e0b',
      replied: '#10b981',
      archived: '#6b7280'
    }
    return colors[status] || '#6b7280'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="admin-panel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="admin-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isAuthenticated ? (
            // Login Screen
            <div className="admin-login">
              <div className="admin-login-header">
                <Lock size={48} />
                <h2>Admin Panel</h2>
                <p>Please login to continue</p>
              </div>

              <form onSubmit={handleLogin} className="admin-login-form">
                {loginError && (
                  <div className="admin-error-message">
                    <AlertCircle size={18} />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="admin-form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <button type="submit" className="admin-login-btn" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader size={20} className="spinner" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </form>

              <button className="admin-close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
          ) : (
            // Admin Dashboard
            <>
              <div className="admin-header">
                <div className="admin-header-left">
                  <h2>Admin Dashboard</h2>
                  <p>Manage contact inquiries</p>
                </div>
                <div className="admin-header-right">
                  <button className="admin-logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                  <button className="admin-close-btn" onClick={onClose}>
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Statistics */}
              <div className="admin-stats">
                <div className="stat-card">
                  <BarChart3 size={24} />
                  <div>
                    <h3>{stats.total}</h3>
                    <p>Total Contacts</p>
                  </div>
                </div>
                <div className="stat-card new">
                  <Mail size={24} />
                  <div>
                    <h3>{stats.new}</h3>
                    <p>New</p>
                  </div>
                </div>
                <div className="stat-card read">
                  <Eye size={24} />
                  <div>
                    <h3>{stats.read}</h3>
                    <p>Read</p>
                  </div>
                </div>
                <div className="stat-card replied">
                  <CheckCircle size={24} />
                  <div>
                    <h3>{stats.replied}</h3>
                    <p>Replied</p>
                  </div>
                </div>
                <div className="stat-card archived">
                  <Archive size={24} />
                  <div>
                    <h3>{stats.archived}</h3>
                    <p>Archived</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="admin-filters">
                <div className="admin-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, email or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="admin-filter-buttons">
                  <button
                    className={statusFilter === 'all' ? 'active' : ''}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={statusFilter === 'new' ? 'active' : ''}
                    onClick={() => setStatusFilter('new')}
                  >
                    New
                  </button>
                  <button
                    className={statusFilter === 'read' ? 'active' : ''}
                    onClick={() => setStatusFilter('read')}
                  >
                    Read
                  </button>
                  <button
                    className={statusFilter === 'replied' ? 'active' : ''}
                    onClick={() => setStatusFilter('replied')}
                  >
                    Replied
                  </button>
                  <button
                    className={statusFilter === 'archived' ? 'active' : ''}
                    onClick={() => setStatusFilter('archived')}
                  >
                    Archived
                  </button>
                </div>
              </div>

              <div className="admin-content">
                {/* Contacts List */}
                <div className="admin-contacts-list">
                  {loading ? (
                    <div className="admin-loading">
                      <Loader size={32} className="spinner" />
                      <p>Loading contacts...</p>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="admin-empty">
                      <Mail size={48} />
                      <p>No contacts found</p>
                    </div>
                  ) : (
                    <>
                      {contacts.map(contact => (
                        <div
                          key={contact._id}
                          className={`admin-contact-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="contact-item-header">
                            <h4>{contact.name}</h4>
                            <span
                              className="contact-status-badge"
                              style={{ backgroundColor: getStatusColor(contact.status) }}
                            >
                              {contact.status}
                            </span>
                          </div>
                          <p className="contact-item-email">{contact.email}</p>
                          <p className="contact-item-subject">{contact.subject}</p>
                          <p className="contact-item-date">{formatDate(contact.createdAt)}</p>
                        </div>
                      ))}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="admin-pagination">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                          >
                            Previous
                          </button>
                          <span>Page {currentPage} of {totalPages}</span>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Contact Details */}
                <div className="admin-contact-details">
                  {selectedContact ? (
                    <>
                      <div className="contact-details-header">
                        <h3>Contact Details</h3>
                        <button
                          className="close-details-btn"
                          onClick={() => setSelectedContact(null)}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="contact-details-body">
                        <div className="detail-group">
                          <label>Name</label>
                          <p>{selectedContact.name}</p>
                        </div>

                        <div className="detail-group">
                          <label>Email</label>
                          <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                        </div>

                        <div className="detail-group">
                          <label>Phone</label>
                          <a href={`tel:+91${selectedContact.phone}`}>+91 {selectedContact.phone}</a>
                        </div>

                        <div className="detail-group">
                          <label>Subject</label>
                          <p>{selectedContact.subject}</p>
                        </div>

                        <div className="detail-group">
                          <label>Message</label>
                          <p className="message-text">{selectedContact.message}</p>
                        </div>

                        <div className="detail-group">
                          <label>How they heard about us</label>
                          <div className="source-tags">
                            {selectedContact.source.map((src, idx) => (
                              <span key={idx} className="source-tag">{src}</span>
                            ))}
                          </div>
                        </div>

                        <div className="detail-group">
                          <label>Received</label>
                          <p>{formatDate(selectedContact.createdAt)}</p>
                        </div>

                        <div className="detail-group">
                          <label>Status</label>
                          <span
                            className="contact-status-badge large"
                            style={{ backgroundColor: getStatusColor(selectedContact.status) }}
                          >
                            {selectedContact.status}
                          </span>
                        </div>
                      </div>

                      <div className="contact-details-actions">
                        <button
                          className="action-btn read"
                          onClick={() => updateStatus(selectedContact._id, 'read')}
                          disabled={selectedContact.status === 'read'}
                        >
                          <Eye size={18} />
                          <span>Mark as Read</span>
                        </button>
                        <button
                          className="action-btn replied"
                          onClick={() => updateStatus(selectedContact._id, 'replied')}
                          disabled={selectedContact.status === 'replied'}
                        >
                          <Reply size={18} />
                          <span>Mark as Replied</span>
                        </button>
                        <button
                          className="action-btn archived"
                          onClick={() => updateStatus(selectedContact._id, 'archived')}
                          disabled={selectedContact.status === 'archived'}
                        >
                          <Archive size={18} />
                          <span>Archive</span>
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteContact(selectedContact._id)}
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="contact-details-empty">
                      <MessageSquare size={64} />
                      <p>Select a contact to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdminPanel
