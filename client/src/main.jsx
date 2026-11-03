import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

// The creative page ships its own fonts and styles, so it loads on demand.
const CreativePortfolio = lazy(() => import('./CreativePortfolio.jsx'))
// The work index and case studies are opened from the home page, so they load on demand too.
const Work = lazy(() => import('./site/Work.jsx'))
const CaseStudy = lazy(() => import('./site/CaseStudy.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/work"
          element={
            <Suspense fallback={null}>
              <Work />
            </Suspense>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <Suspense fallback={null}>
              <CaseStudy />
            </Suspense>
          }
        />
        <Route
          path="/creative"
          element={
            <Suspense fallback={null}>
              <CreativePortfolio />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
