import { useEffect, useRef, useState } from 'react'
import type { AdminOrder } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { getLenis } from '../../hooks/smoothScroll'
import {
  IconCheckCircle,
  IconClock,
  IconClose,
  IconCopy,
  IconGift,
  IconPen,
  IconPhone,
  IconPin,
  IconTruck,
  IconWhatsApp,
  IconXCircle,
} from './adminIcons'
import { avatarTint, formatDate, initials, perfumeColor, perfumeName, whatsappLink } from './adminUtils'

interface Props {
  order: AdminOrder
  onClose: () => void
  onStatus: (order: AdminOrder, status: string) => void
}

const STEPS = [
  { status: 'New', label: 'Received', Icon: IconClock },
  { status: 'Confirmed', label: 'Confirmed', Icon: IconCheckCircle },
  { status: 'Delivered', label: 'Delivered', Icon: IconTruck },
] as const

export default function OrderDrawer({ order, onClose, onStatus }: Props) {
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    getLenis()?.stop()
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.order_number)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard can be blocked; nothing to do */
    }
  }

  const subtotal = order.order_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const extras = order.total_egp - subtotal
  const cancelled = order.status === 'Cancelled'
  const activeIndex = STEPS.findIndex((step) => step.status === order.status)

  const cancelOrder = () => {
    if (window.confirm('Cancel order ' + order.order_number + '? You can restore it afterwards.')) {
      onStatus(order, 'Cancelled')
    }
  }

  return (
    <>
      <div className="adm-drawer-scrim" onClick={onClose} />
      <aside className="adm-drawer" role="dialog" aria-modal="true" aria-label={'Order ' + order.order_number}>
        <header className="adm-drawer-head">
          <div>
            <p className="adm-eyebrow">Order</p>
            <h2 className="serif">{order.order_number}</h2>
            <p className="adm-drawer-date">{formatDate(order.created_at)}</p>
          </div>
          <div className="adm-drawer-head-actions">
            <button className="adm-icon-btn" onClick={() => void copyNumber()} aria-label="Copy order number" title="Copy order number">
              {copied ? <IconCheckCircle size={17} /> : <IconCopy size={17} />}
            </button>
            <button ref={closeRef} className="adm-icon-btn" onClick={onClose} aria-label="Close">
              <IconClose size={18} />
            </button>
          </div>
        </header>

        <div className="adm-drawer-body" data-lenis-prevent="">
          {cancelled ? (
            <div className="adm-cancelled">
              <IconXCircle size={20} />
              <div>
                <strong>This order was cancelled</strong>
                <span>It is excluded from revenue.</span>
              </div>
              <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onStatus(order, 'New')}>
                Restore
              </button>
            </div>
          ) : (
            <ol className="adm-stepper" aria-label="Order progress">
              {STEPS.map(({ status, label, Icon }, index) => (
                <li key={status} className={index < activeIndex ? 'is-done' : index === activeIndex ? 'is-current' : ''}>
                  <button onClick={() => onStatus(order, status)} aria-current={index === activeIndex ? 'step' : undefined}>
                    <span className="adm-step-dot">
                      <Icon size={17} />
                    </span>
                    <span className="adm-step-label">{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}

          <section className="adm-drawer-section">
            <h3>Customer</h3>
            <div className="adm-customer-card">
              <span className="adm-avatar adm-avatar-lg" style={{ background: avatarTint(order.customer_name) }}>
                {initials(order.customer_name)}
              </span>
              <div>
                <strong>{order.customer_name}</strong>
                <span dir="ltr">{order.phone}</span>
              </div>
            </div>
            <div className="adm-contact-row">
              <a className="adm-btn adm-btn-ghost adm-btn-sm" href={'tel:' + order.phone}>
                <IconPhone size={16} /> Call
              </a>
              <a className="adm-btn adm-btn-wa adm-btn-sm" href={whatsappLink(order)} target="_blank" rel="noreferrer">
                <IconWhatsApp size={16} /> WhatsApp
              </a>
            </div>
            <p className="adm-address">
              <IconPin size={17} />
              <span>
                {order.address}
                <br />
                {order.city}
              </span>
            </p>
          </section>

          <section className="adm-drawer-section">
            <h3>Items · {order.order_items.reduce((sum, item) => sum + item.quantity, 0)}</h3>
            <ul className="adm-lines">
              {order.order_items.map((item, index) => (
                <li key={item.product_id + item.size_ml + index}>
                  <span className="adm-bottle-dot" style={{ background: perfumeColor(item.product_id) }} />
                  <div className="adm-line-main">
                    <strong>{perfumeName(item.product_id)}</strong>
                    <span>
                      {item.size_ml} ml · Qty {item.quantity}
                    </span>
                    {(item.gift_wrap || item.engraving) && (
                      <span className="adm-tags">
                        {item.gift_wrap && (
                          <em>
                            <IconGift size={13} /> Gift wrap
                          </em>
                        )}
                        {item.engraving && (
                          <em>
                            <IconPen size={13} /> “{item.engraving}”
                          </em>
                        )}
                      </span>
                    )}
                  </div>
                  <span className="adm-line-price">{formatPrice(item.unit_price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="adm-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {extras > 0 && (
                <div>
                  <dt>Delivery &amp; extras</dt>
                  <dd>{formatPrice(extras)}</dd>
                </div>
              )}
              <div className="adm-total-final">
                <dt>Total · Cash on delivery</dt>
                <dd className="serif">{formatPrice(order.total_egp)}</dd>
              </div>
            </dl>
          </section>
        </div>

        {!cancelled && (
          <footer className="adm-drawer-foot">
            <button className="adm-btn adm-btn-danger" onClick={cancelOrder}>
              <IconXCircle size={17} /> Cancel order
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
