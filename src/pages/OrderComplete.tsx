import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { img } from '../data/assets'
import { formatPrice } from '../lib/format'
import './order.css'

interface OrderState {
  name?: string
  phone?: string
  orderNumber?: string
  total?: number
}

export default function OrderComplete() {
  const state = (useLocation().state ?? {}) as OrderState

  return (
    <section className="order">
      <motion.img
        className="order-bottle"
        src={img('01')}
        alt=""
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="order-copy"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg className="order-check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M14 27l8 8 16-17" />
        </svg>
        <h1 className="serif">{state.name ? 'Thank you, ' + state.name.split(' ')[0] + '.' : 'Thank you.'}</h1>
        <p>
          {state.orderNumber ? (
            <>
              Your order <strong>{state.orderNumber}</strong> is confirmed
              {typeof state.total === 'number' ? ' at ' + formatPrice(state.total) : ''}.
            </>
          ) : (
            'Your order is confirmed.'
          )}
          {state.phone ? ' We will call ' + state.phone + ' to confirm delivery.' : ' We will call you to confirm delivery.'}
        </p>
        {state.orderNumber && (
          <p className="order-track-hint">
            Save this number to track your order anytime: <Link to="/track-order">Track Order</Link>
          </p>
        )}
        <Link to="/" className="btn btn-solid">
          Back to AMBRE
        </Link>
      </motion.div>
    </section>
  )
}
