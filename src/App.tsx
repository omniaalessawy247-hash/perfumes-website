import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Route, Routes, useLocation } from 'react-router-dom'
import ThemeSync from './components/ThemeSync'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Home from './pages/Home'
import PerfumePage from './pages/PerfumePage'
import Checkout from './pages/Checkout'
import OrderComplete from './pages/OrderComplete'
import TrackOrder from './pages/TrackOrder'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOrders from './pages/admin/AdminOrders'
import AdminGuard from './pages/admin/AdminGuard'
import { getLenis, scrollToTarget, startSmoothScroll } from './hooks/smoothScroll'
import { useCatalog } from './store/catalog'

// Always open on the hero, also after a refresh
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  ScrollTrigger.clearScrollMemory('manual')
  if (!window.location.hash) window.scrollTo(0, 0)
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    // First load / refresh: always sit on the hero, never animate down to a hash.
    if (first.current) {
      first.current = false
      scrollToTarget(0, true)
      return
    }
    // Never leave Lenis stopped on another page (a stopped Lenis freezes scrolling).
    if (pathname !== '/') getLenis()?.start()
    if (hash) {
      const timer = window.setTimeout(() => scrollToTarget(hash), 120)
      return () => window.clearTimeout(timer)
    }
    scrollToTarget(0, true)
  }, [pathname, hash])

  return null
}

export default function App() {
  const load = useCatalog((state) => state.load)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const hideFooter = pathname === '/checkout' || pathname === '/track-order'

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return startSmoothScroll()
  }, [])

  return (
    <>
      <ThemeSync />
      <ScrollManager />
      {!isAdmin && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfume/:id" element={<PerfumePage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderComplete />} />
          <Route path="/track-order" element={<TrackOrder />} />
          {/* Deliberately not linked anywhere in the public UI. */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/orders"
            element={
              <AdminGuard>
                <AdminOrders />
              </AdminGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && !hideFooter && <Footer />}
      {!isAdmin && <CartDrawer />}
    </>
  )
}
