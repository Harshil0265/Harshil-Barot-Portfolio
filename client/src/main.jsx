import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import App from './App.jsx'

// The work index and case studies are opened from the home page, so they load on demand too.
const Work = lazy(() => import('./site/Work.jsx'))
const CaseStudy = lazy(() => import('./site/CaseStudy.jsx'))
// The private inbox: only its owner ever loads it.
const AdminPage = lazy(() => import('./admin/AdminPage.jsx'))

// Ctrl + Shift + A anywhere on the site opens the inbox.
function AdminShortcut() {
  const navigate = useNavigate()
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        navigate('/admin')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
  return null
}

const lazyPage = (Page) => (
  <Suspense fallback={null}>
    <Page />
  </Suspense>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminShortcut />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={lazyPage(Work)} />
        <Route path="/work/:slug" element={lazyPage(CaseStudy)} />
        <Route path="/admin" element={lazyPage(AdminPage)} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
