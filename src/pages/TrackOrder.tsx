import { useState, type FormEvent } from 'react'
import { trackOrder, type TrackedOrder } from '../lib/api'
import { formatPrice } from '../lib/format'
import { isValidEgyptianPhone, normalizePhone } from '../lib/validate'
import { IconAlert, IconCheck, IconPackage, IconPhone, IconReceipt, IconSearch, IconTruck } from '../components/icons'
import './trackOrder.css'

const STEPS = [
  { label: 'New', Icon: IconReceipt },
  { label: 'Confirmed', Icon: IconCheck },
  { label: 'Delivered', Icon: IconTruck },
] as const
const NOT_FOUND_MESSAGE = "We couldn't find an order with these details. Please check your order number and phone number."

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-EG', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [result, setResult] = useState<TrackedOrder | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setResult(null)

    if (website) return // a bot filled the honeypot; say nothing, do nothing

    if (!orderNumber.trim() || !isValidEgyptianPhone(phone)) {
      setError(NOT_FOUND_MESSAGE)
      return
    }

    setSubmitting(true)
    try {
      const found = await trackOrder(orderNumber.trim(), normalizePhone(phone))
      if (!found) {
        setError(NOT_FOUND_MESSAGE)
        return
      }
      setResult(found)
    } catch (err) {
      setError(err instanceof Error ? err.message : NOT_FOUND_MESSAGE)
    } finally {
      setSubmitting(false)
    }
  }

  const stepIndex = result ? STEPS.findIndex((step) => step.label === result.status) : -1

  return (
    <section className="track-order">
      <h1 className="serif">
        <IconSearch className="track-title-icon" size={38} />
        Track Your Order
      </h1>

      <form onSubmit={onSubmit} className="track-form" noValidate>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hp-field"
          aria-hidden="true"
        />
        <div className="field field-icon">
          <label htmlFor="orderNumber">Order Number</label>
          <IconReceipt className="field-icon-glyph" size={18} />
          <input
            id="orderNumber"
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            placeholder="AMB-00001"
          />
        </div>
        <div className="field field-icon">
          <label htmlFor="phone">Phone Number</label>
          <IconPhone className="field-icon-glyph" size={18} />
          <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX" />
        </div>
        <button className="btn btn-solid" type="submit" disabled={submitting}>
          <IconSearch size={17} />
          {submitting ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error && (
        <p className="track-error" role="alert">
          <IconAlert size={17} />
          {error}
        </p>
      )}

      {result && (
        <div className="track-result">
          {result.status === 'Cancelled' ? (
            <p className="track-cancelled">
              <IconAlert size={17} />
              This order has been cancelled.
            </p>
          ) : (
            <ol className="track-steps">
              {STEPS.map((step, i) => (
                <li key={step.label} className={i <= stepIndex ? 'is-done' : ''}>
                  <span className="dot">
                    <step.Icon size={15} />
                  </span>
                  {step.label}
                </li>
              ))}
            </ol>
          )}

          <dl className="track-details">
            <div>
              <dt>
                <IconReceipt size={13} /> Order
              </dt>
              <dd>{result.order_number}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{formatDate(result.created_at)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(result.total_egp)}</dd>
            </div>
          </dl>

          <ul className="track-items">
            {result.items.map((item, i) => (
              <li key={i}>
                <IconPackage size={16} className="track-item-icon" />
                {item.product_id} · {item.size_ml}ml × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
