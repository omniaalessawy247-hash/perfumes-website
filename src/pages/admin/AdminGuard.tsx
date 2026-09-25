import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './admin.css'

type Status = 'checking' | 'authed' | 'anon'

// Guards /admin/*: redirects to login when the session ends
export default function AdminGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking')
  const location = useLocation()

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setStatus(data.session ? 'authed' : 'anon')
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setStatus(session ? 'authed' : 'anon')
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="adm-loader" role="status" aria-live="polite">
        <span className="adm-loader-ring" />
        <img src="/assets/brand%20logo.png" alt="AMBRE" className="adm-loader-logo-img" />
        <span className="adm-loader-text">Checking your session…</span>
      </div>
    )
  }
  if (status === 'anon') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}
