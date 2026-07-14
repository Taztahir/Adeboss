import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute() {
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? 'authed' : 'unauthed')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'unauthed')
    })

    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--hudson-navbar-bg)' }}
      >
        <span
          className="font-mono text-xs tracking-widest uppercase animate-pulse"
          style={{ color: 'var(--hudson-navbar-fg-muted)' }}
        >
          Authenticating…
        </span>
      </div>
    )
  }

  if (status === 'unauthed') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
