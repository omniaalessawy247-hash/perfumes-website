import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { selectTotal, useCart } from '../store/cart'
import { formatPrice } from '../lib/format'
import { img } from '../data/assets'
import { findPerfume } from '../data/catalog'
import { getLenis } from '../hooks/smoothScroll'
import { IconBag, IconLock } from './icons'
import './cart.css'

export default function CartDrawer() {
  const { items, open, setOpen, setQuantity, remove, lastAdded } = useCart()
  const total = useCart(selectTotal)
  const navigate = useNavigate()

  // Tint the drawer with the last added perfume
  const theme = useMemo(() => {
    const id = lastAdded ?? items[items.length - 1]?.productId
    return findPerfume(id)?.theme ?? null
  }, [lastAdded, items])
  const drawerStyle = theme
    ? ({
        '--drawer-bg': theme.bg,
        '--drawer-text': theme.text,
        '--drawer-accent': theme.accent,
        '--drawer-on-accent': theme.onAccent,
      } as React.CSSProperties)
    : undefined

  useEffect(() => {
    if (!open) return
    getLenis()?.stop()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  const checkout = () => {
    setOpen(false)
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            style={drawerStyle}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.65, ease: [0.7, 0, 0.2, 1] }}
          >
            <header className="drawer-head">
              <h2 className="serif">
                <IconBag className="drawer-head-icon" size={26} />
                Your bag
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="drawer-close">
                Close
              </button>
            </header>

            {items.length === 0 ? (
              <p className="drawer-empty">Your bag is empty. Choose a perfume to begin.</p>
            ) : (
              <ul className="drawer-list">
                {items.map((line) => (
                  <motion.li
                    key={line.key}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="drawer-line"
                  >
                    <img src={img(line.bottle)} alt="" className="line-thumb" />
                    <div className="line-info">
                      <strong>{line.name}</strong>
                      <span>
                        {line.sizeMl} ml · {formatPrice(line.unitPrice)}
                      </span>
                      {line.engraving && <span>Engraved: {line.engraving}</span>}
                      {line.giftWrap && <span>Gift wrapped</span>}
                      <div className="line-qty">
                        <button onClick={() => setQuantity(line.key, line.quantity - 1)} aria-label="Decrease">
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button onClick={() => setQuantity(line.key, line.quantity + 1)} aria-label="Increase">
                          +
                        </button>
                      </div>
                    </div>
                    <button className="line-remove" onClick={() => remove(line.key)}>
                      Remove
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}

            <footer className="drawer-foot">
              <div className="drawer-total">
                <span>Total</span>
                <strong className="serif">{formatPrice(total)}</strong>
              </div>
              <p>
                <IconLock size={14} className="drawer-lock-icon" />
                Cash on delivery. We confirm every order by phone.
              </p>
              <button className="drawer-cta" disabled={items.length === 0} onClick={checkout}>
                Checkout
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
