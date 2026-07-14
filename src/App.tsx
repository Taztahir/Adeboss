import './App.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop'
import Navbar from './Components/navbar'
import ProtectedRoute from './Components/ProtectedRoute'

// ── Route-level lazy imports (separate JS chunks per page) ──────────────────
const HeroSection      = lazy(() => import('./Components/hero-section'))
const AboutSection     = lazy(() => import('./Components/about-section'))
const ServicesSection  = lazy(() => import('./Components/services-section'))
const ToolsSection     = lazy(() => import('./Components/tools-section'))
const Testimonial3     = lazy(() => import('./Components/testimonial-section-3'))
const Footer           = lazy(() => import('./Components/footer-section-1'))
const WorksPage        = lazy(() => import('./pages/WorksPage'))
const AdminLogin       = lazy(() => import('./pages/admin/Login'))
const AdminDashboard   = lazy(() => import('./pages/admin/Dashboard'))
const NotFoundPage     = lazy(() => import('./pages/NotFound'))

// ── Full-screen loading fallback ────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--hudson-navbar-bg)' }}
      role="status"
      aria-label="Loading page"
    >
      <span
        className="font-mono text-xs tracking-[0.3em] uppercase animate-pulse"
        style={{ color: 'var(--hudson-navbar-fg-muted)' }}
      >
        Loading…
      </span>
    </div>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={null}>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ToolsSection />
          <Testimonial3 />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/works/:serviceId" element={<WorksPage />} />

          {/* ── Admin routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* ── Catch-all 404 route ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
