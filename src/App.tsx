import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './Components/ScrollToTop'
import Navbar from './Components/navbar'
import HeroSection from './Components/hero-section'
import AboutSection from './Components/about-section'
import ServicesSection from './Components/services-section'
import ToolsSection from './Components/tools-section'
import Testimonial3 from './Components/testimonial-section-3'
import Footer from './Components/footer-section-1'
import WorksPage from './pages/WorksPage'
import ProtectedRoute from './Components/ProtectedRoute'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import NotFoundPage from './pages/NotFound'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ToolsSection />
        <Testimonial3 />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
    </BrowserRouter>
  )
}

export default App
