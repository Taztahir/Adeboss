import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import SiteContentEditor  from './SiteContentEditor'
import ServicesEditor      from './ServicesEditor'
import ProjectsEditor      from './ProjectsEditor'
import TestimonialsEditor  from './TestimonialsEditor'
import { FileText, Briefcase, Image, Star, LogOut, ExternalLink, Menu, X } from 'lucide-react'

type Section = 'content' | 'services' | 'projects' | 'testimonials'

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'content',      label: 'Site Content',  icon: <FileText className="w-4 h-4" />,  desc: 'Hero, About & Contact text' },
  { id: 'services',     label: 'Services',      icon: <Briefcase className="w-4 h-4" />, desc: 'Title, description & tags' },
  { id: 'projects',     label: 'Projects',      icon: <Image className="w-4 h-4" />,     desc: 'Portfolio gallery images' },
  { id: 'testimonials', label: 'Testimonials',  icon: <Star className="w-4 h-4" />,      desc: 'Client quotes & ordering' },
]

const SECTION_TITLES: Record<Section, string> = {
  content:      'Site Content',
  services:     'Services',
  projects:     'Projects',
  testimonials: 'Testimonials',
}

export default function AdminDashboard() {
  const [active, setActive]       = useState<Section>('content')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  function switchSection(id: Section) {
    setActive(id)
    setMobileOpen(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--hudson-navbar-bg)', color: 'var(--hudson-navbar-fg)' }}
    >
      {/* ── Top bar ─────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: 'var(--hudson-navbar-bg)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-1 transition-opacity hover:opacity-70"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a href="/" className="font-serif text-lg font-bold" style={{ color: 'var(--hudson-navbar-fg)' }}>
            Adeboss<span style={{ color: 'var(--hudson-navbar-accent)' }}>.</span>
          </a>
          <span
            className="hidden sm:inline font-mono text-[9px] tracking-[0.3em] uppercase px-2 py-0.5"
            style={{
              color: 'var(--hudson-navbar-accent)',
              border: '1px solid var(--hudson-navbar-accent)',
            }}
          >
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-3" aria-label="Admin header actions">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--hudson-navbar-fg-muted)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ExternalLink className="w-3 h-3" /> View Site
          </Link>

          <button
            type="button"
            id="admin-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}
          >
            <LogOut className="w-3 h-3" />
            {loggingOut ? 'Signing out…' : 'Logout'}
          </button>
        </nav>
      </header>

      {/* ── Body ────────────────────────────────── */}
      <div className="flex flex-1 relative">

        {/* ── Sidebar (desktop) ──────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-56 shrink-0 py-8 px-4 sticky top-[57px] self-start h-[calc(100vh-57px)] overflow-y-auto"
          style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}
          aria-label="Admin navigation"
        >
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                type="button"
                id={`admin-nav-${item.id}`}
                onClick={() => switchSection(item.id)}
                aria-current={active === item.id ? 'page' : undefined}
                className="w-full flex items-start gap-3 px-3 py-3 text-left transition-all duration-200"
                style={active === item.id
                  ? { backgroundColor: 'rgba(255,255,255,0.06)', borderLeft: '2px solid var(--hudson-navbar-accent)' }
                  : { borderLeft: '2px solid transparent' }
                }
              >
                <span
                  className="mt-0.5 shrink-0"
                  style={{ color: active === item.id ? 'var(--hudson-navbar-accent)' : 'var(--hudson-navbar-fg-muted)' }}
                >
                  {item.icon}
                </span>
                <div>
                  <p
                    className="font-sans text-xs font-bold tracking-[0.1em]"
                    style={{ color: active === item.id ? 'var(--hudson-navbar-fg)' : 'var(--hudson-navbar-fg-muted)' }}
                  >
                    {item.label}
                  </p>
                  <p className="font-sans text-[10px] mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Mobile sidebar drawer ──────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-30 bg-black/60"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-[57px] bottom-0 z-40 w-64 py-8 px-4 overflow-y-auto"
                style={{
                  backgroundColor: 'var(--hudson-navbar-bg)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                }}
                aria-label="Mobile admin navigation"
              >
                <nav className="space-y-1">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => switchSection(item.id)}
                      aria-current={active === item.id ? 'page' : undefined}
                      className="w-full flex items-start gap-3 px-3 py-3 text-left transition-all duration-200"
                      style={active === item.id
                        ? { backgroundColor: 'rgba(255,255,255,0.06)', borderLeft: '2px solid var(--hudson-navbar-accent)' }
                        : { borderLeft: '2px solid transparent' }
                      }
                    >
                      <span className="mt-0.5 shrink-0"
                        style={{ color: active === item.id ? 'var(--hudson-navbar-accent)' : 'var(--hudson-navbar-fg-muted)' }}>
                        {item.icon}
                      </span>
                      <p className="font-sans text-xs font-bold"
                        style={{ color: active === item.id ? 'var(--hudson-navbar-fg)' : 'var(--hudson-navbar-fg-muted)' }}>
                        {item.label}
                      </p>
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ───────────────────────── */}
        <main className="flex-1 px-6 py-10 md:px-10 lg:px-12 min-w-0">
          <h1
            className="font-serif text-2xl md:text-3xl font-bold mb-8"
            style={{ color: 'var(--hudson-navbar-fg)' }}
          >
            {SECTION_TITLES[active]}
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {active === 'content'      && <SiteContentEditor />}
              {active === 'services'     && <ServicesEditor />}
              {active === 'projects'     && <ProjectsEditor />}
              {active === 'testimonials' && <TestimonialsEditor />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
