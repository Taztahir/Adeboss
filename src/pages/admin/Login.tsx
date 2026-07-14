import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--hudson-navbar-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Brand */}
        <header className="mb-10 text-center">
          <a
            href="/"
            className="font-serif text-2xl font-bold"
            style={{ color: 'var(--hudson-navbar-fg)' }}
          >
            Adeboss<span style={{ color: 'var(--hudson-navbar-accent)' }}>.</span>
          </a>
          <p
            className="font-sans text-[10px] tracking-[0.25em] uppercase mt-2"
            style={{ color: 'var(--hudson-navbar-fg-muted)' }}
          >
            Admin Portal
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'var(--hudson-navbar-fg-muted)' }}
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full text-sm px-4 py-3 font-sans focus:outline-none transition-colors duration-200"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--hudson-navbar-fg)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--hudson-navbar-accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'var(--hudson-navbar-fg-muted)' }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm px-4 py-3 font-sans focus:outline-none transition-colors duration-200"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--hudson-navbar-fg)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--hudson-navbar-accent)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="font-sans text-xs px-4 py-3 border"
              style={{
                color: '#f87171',
                backgroundColor: 'rgba(248,113,113,0.08)',
                borderColor: 'rgba(248,113,113,0.2)',
              }}
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="admin-login-submit"
            disabled={loading}
            className="w-full font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-6 py-4 text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--hudson-navbar-accent)' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center font-sans text-xs">
          <Link
            to="/"
            className="transition-colors duration-200 hover:opacity-100"
            style={{ color: 'var(--hudson-navbar-fg-muted)' }}
          >
            ← Back to site
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
