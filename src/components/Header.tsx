import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { findPerfume, perfumes } from '../data/catalog'
import { selectCount, useCart } from '../store/cart'
import { useSound } from '../store/sound'
import './header.css'

const links = [
  { to: '/#collection', label: 'Collection' },
  { to: '/#story', label: 'Story' },
  { to: '/#ritual', label: 'Gifting' },
  { to: '/track-order', label: 'Track Order' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const theme = (findPerfume(matchPath('/perfume/:id', pathname)?.params.id) ?? perfumes[0]).theme
  const mood = {
    '--nav-bg': 'linear-gradient(100deg, color-mix(in srgb, ' + theme.bg + ' 82%, ' + theme.accent + ') 0%, color-mix(in srgb, ' + theme.bg + ' 80%, ' + theme.liquid + ') 100%)',
    '--nav-line': 'color-mix(in srgb, ' + theme.accent + ' 55%, transparent)',
  } as React.CSSProperties
  const count = useCart(selectCount)
  const setOpen = useCart((state) => state.setOpen)
  const soundEnabled = useSound((state) => state.soundEnabled)
  const toggleSound = useSound((state) => state.toggleSound)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on every route change, so it never lingers open
  // on the page the visitor navigated away from.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '')} style={mood}>
      <Link to="/" className="site-logo serif" aria-label="AMBRE home">
        AMBRE
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="sound-button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.6 5.4a9 9 0 0 1 0 13.2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <line x1="17" y1="9" x2="23" y2="15" />
              <line x1="23" y1="9" x2="17" y2="15" />
            </svg>
          )}
        </button>

        <button className="bag-button" onClick={() => setOpen(true)} aria-label={'Open bag, ' + count + ' items'}>
          Bag
          <span className="bag-count" data-empty={count === 0}>
            {count}
          </span>
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={'menu-bars' + (menuOpen ? ' is-open' : '')} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label="Mobile"
              initial={{ y: '-8%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-8%', opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="mobile-nav-link serif" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
