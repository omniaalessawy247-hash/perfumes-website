import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminSignOut } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { perfumes } from '../../data/catalog'
import { IconClose, IconExternal, IconLogout, IconMenu, IconOrders, IconStore } from './adminIcons'
import './admin.css'

interface Props {
  children: ReactNode
  newCount?: number
  actions?: ReactNode
}

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function AdminShell({ children, newCount = 0, actions }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setEmail(data.session?.user.email ?? '')
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const logout = async () => {
    await adminSignOut()
    navigate('/admin/login', { replace: true })
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="adm">
      <aside className={'adm-side' + (menuOpen ? ' is-open' : '')} aria-label="Admin navigation">
        <div className="adm-brand-row">
          <Link to="/admin/orders" className="adm-brand" onClick={() => setMenuOpen(false)}>
            <img src="/assets/brand%20logo%20light.png" alt="AMBRE" className="adm-brand-img" />
          </Link>
          <span className="adm-brand-tag">Admin</span>
          <button className="adm-side-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <IconClose size={20} />
          </button>
        </div>

        <p className="adm-nav-label">Manage</p>
        <nav className="adm-nav">
          <Link to="/admin/orders" className="adm-nav-link is-active" aria-current="page" onClick={() => setMenuOpen(false)}>
            <IconOrders size={19} />
            <span>Orders</span>
            {newCount > 0 && <span className="adm-nav-badge">{newCount}</span>}
          </Link>
        </nav>

        <p className="adm-nav-label">Shortcuts</p>
        <nav className="adm-nav">
          <a className="adm-nav-link" href="/" target="_blank" rel="noreferrer">
            <IconStore size={19} />
            <span>View storefront</span>
            <IconExternal size={15} className="adm-nav-ext" />
          </a>
        </nav>

        <div className="adm-side-foot">
          <div className="adm-swatches" aria-hidden="true" title="The AMBRE collection">
            {perfumes.map((perfume) => (
              <i key={perfume.id} style={{ background: perfume.theme.accent }} />
            ))}
          </div>
          <div className="adm-user">
            <span className="adm-user-avatar">{(email[0] ?? 'A').toUpperCase()}</span>
            <span className="adm-user-meta">
              <strong>{email || 'Administrator'}</strong>
              <small>Administrator</small>
            </span>
          </div>
          <button className="adm-signout" onClick={() => void logout()}>
            <IconLogout size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {menuOpen && <div className="adm-scrim" onClick={() => setMenuOpen(false)} />}

      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <IconMenu size={22} />
          </button>
          <div className="adm-top-title">
            <strong>{greeting()} 👋</strong>
            <span>{today}</span>
          </div>
          <div className="adm-top-actions">{actions}</div>
        </header>
        <div className="adm-content">{children}</div>
      </div>
    </div>
  )
}
