import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { selectTotal, useCart } from '../store/cart'
import { submitOrder } from '../lib/api'
import { formatPrice } from '../lib/format'
import { sanitizeText } from '../lib/sanitize'
import { isValidEgyptianPhone, normalizePhone } from '../lib/validate'
import { img } from '../data/assets'
import { IconBag, IconCard, IconCash, IconHome, IconLock, IconPhone, IconPin, IconUser } from '../components/icons'
import './checkout.css'

const cities = ['Cairo', 'Giza', 'Alexandria', 'Mansoura', 'Tanta', 'Zagazig', 'Port Said', 'Suez', 'Ismailia', 'Damietta', 'Luxor', 'Aswan']

interface FormState {
  name: string
  phone: string
  city: string
  address: string
  website: string // honeypot, must stay empty
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (form.name.trim().length < 3) errors.name = 'Please enter your full name.'
  if (!isValidEgyptianPhone(form.phone)) errors.phone = 'Please enter a valid phone number.'
  if (form.city.trim().length < 2) errors.city = 'Please enter your city.'
  if (form.address.trim().length < 8) errors.address = 'Please enter your full address.'
  return errors
}

export default function Checkout() {
  const { items, clear } = useCart()
  const total = useCart(selectTotal)
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({ name: '', phone: '', city: '', address: '', website: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState('')
  const inFlight = useRef(false)

  const update = (field: keyof FormState) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (inFlight.current) return
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    inFlight.current = true
    setSubmitting(true)
    setFailure('')
    try {
      const phone = normalizePhone(form.phone)
      const name = sanitizeText(form.name, 80)
      const address = sanitizeText(form.address, 300)
      const city = sanitizeText(form.city, 60)

      const result = await submitOrder(
        { name, phone, city, address, payment: 'cod' },
        items.map((line) => ({
          product_id: line.productId,
          size_ml: line.sizeMl,
          quantity: line.quantity,
          engraving: sanitizeText(line.engraving, 14),
          gift_wrap: line.giftWrap,
        })),
        form.website,
      )
      clear()
      navigate('/order/' + result.id, {
        state: { name, phone, orderNumber: result.order_number, total: result.total_egp },
      })
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'We could not place your order. Please check your details and try again.')
    } finally {
      inFlight.current = false
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="checkout checkout-empty">
        <IconBag size={44} className="checkout-empty-icon" />
        <h1 className="serif">Your bag is empty.</h1>
        <Link to="/#collection" className="btn btn-solid">
          Explore the collection
        </Link>
      </section>
    )
  }

  return (
    <section className="checkout">
      <form className="checkout-form" onSubmit={onSubmit} noValidate>
        <h1 className="serif">Checkout</h1>

        {/* Honeypot: bots fill it, users never see it */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={update('website')}
          className="hp-field"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="field field-icon" data-invalid={Boolean(errors.name)}>
          <label htmlFor="name">Full name</label>
          <IconUser className="field-icon-glyph" size={18} />
          <input id="name" autoComplete="name" value={form.name} onChange={update('name')} />
          {errors.name && <p role="alert">{errors.name}</p>}
        </div>

        <div className="field field-icon" data-invalid={Boolean(errors.phone)}>
          <label htmlFor="phone">Mobile number</label>
          <IconPhone className="field-icon-glyph" size={18} />
          <input id="phone" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={update('phone')} />
          {errors.phone && <p role="alert">{errors.phone}</p>}
        </div>

        <div className="field field-icon" data-invalid={Boolean(errors.city)}>
          <label htmlFor="city">City</label>
          <IconPin className="field-icon-glyph" size={18} />
          <input id="city" list="cities" autoComplete="address-level2" value={form.city} onChange={update('city')} />
          <datalist id="cities">
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.city && <p role="alert">{errors.city}</p>}
        </div>

        <div className="field field-icon" data-invalid={Boolean(errors.address)}>
          <label htmlFor="address">Address</label>
          <IconHome className="field-icon-glyph field-icon-glyph-top" size={18} />
          <textarea id="address" rows={3} autoComplete="street-address" value={form.address} onChange={update('address')} />
          {errors.address && <p role="alert">{errors.address}</p>}
        </div>

        <fieldset className="payment">
          <legend>Payment</legend>
          <label className="pay-option">
            <input type="radio" name="payment" defaultChecked />
            <IconCash size={20} />
            <span>Cash on delivery</span>
          </label>
          <label className="pay-option is-disabled">
            <input type="radio" name="payment" disabled />
            <IconCard size={20} />
            <span>Card, coming soon</span>
          </label>
        </fieldset>

        {failure && (
          <p className="form-error" role="alert">
            {failure}
          </p>
        )}

        <button className="btn btn-solid" type="submit" disabled={submitting}>
          <IconLock size={17} />
          {submitting ? 'Placing order...' : 'Place order · ' + formatPrice(total)}
        </button>
      </form>

      <aside className="summary">
        <h2 className="serif">
          <IconBag size={24} className="summary-icon" />
          Order summary
        </h2>
        <ul>
          {items.map((line) => (
            <li key={line.key}>
              <img src={img(line.bottle)} alt="" />
              <div>
                <strong>{line.name}</strong>
                <span>
                  {line.sizeMl} ml × {line.quantity}
                </span>
                {line.engraving && <span>Engraved: {line.engraving}</span>}
                {line.giftWrap && <span>Gift wrapped</span>}
              </div>
              <b>{formatPrice(line.unitPrice * line.quantity)}</b>
            </li>
          ))}
        </ul>
        <div className="summary-total">
          <span>Total</span>
          <strong className="serif">{formatPrice(total)}</strong>
        </div>
      </aside>
    </section>
  )
}
