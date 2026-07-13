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
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:serviceId" element={<WorksPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
