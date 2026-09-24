import { useLayoutEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { findPerfume, perfumes } from '../data/catalog'

export default function ThemeSync() {
  const { pathname } = useLocation()
  const id = matchPath('/perfume/:id', pathname)?.params.id
  const theme = (findPerfume(id) ?? perfumes[0]).theme

  useLayoutEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bg', theme.bg)
    root.style.setProperty('--text', theme.text)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--liquid', theme.liquid)
    root.style.setProperty('--on-accent', theme.onAccent)
    root.style.colorScheme = theme.dark ? 'dark' : 'light'
    root.dataset.tone = theme.dark ? 'dark' : 'light'
  }, [theme])

  return null
}
