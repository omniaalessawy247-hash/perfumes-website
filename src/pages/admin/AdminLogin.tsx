import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminSignIn } from '../../lib/api'
import { perfumes } from '../../data/catalog'
import { IconAlert, IconArrowLeft, IconEye, IconEyeOff, IconLock, IconMail, IconShield } from './adminIcons'
import './admin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await adminSignIn(email.trim(), password)
      navigate('/admin/orders', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="adm-auth">
      <div className="adm-auth-art" aria-hidden="true">
        <span className="adm-orb adm-orb-1" />
        <span className="adm-orb adm-orb-2" />
        <span className="adm-orb adm-orb-3" />
        <div className="adm-auth-art-inner">
          <img src="/assets/brand%20logo%20light.png" alt="AMBRE" className="adm-auth-logo-img" />
          <h2 className="adm-auth-tagline serif">
            Every order,
            <br />
            <em>a little golden hour.</em>
          </h2>
          <ul className="adm-auth-collection">
            {perfumes.map((perfume) => (
              <li key={perfume.id}>
                <i style={{ background: perfume.theme.accent }} />
                {perfume.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="adm-auth-panel">
        <form className="adm-auth-card" onSubmit={onSubmit} noValidate>
          <span className="adm-auth-badge">
            <IconShield size={15} />
            Staff area
          </span>
          <div>
            <h1 className="serif">Welcome back</h1>
            <p className="adm-auth-sub">Sign in to manage your AMBRE orders.</p>
          </div>

          <div className="adm-field">
            <label htmlFor="admin-email">Email</label>
            <div className="adm-input">
              <IconMail size={18} />
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="you@ambre.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="adm-field">
            <label htmlFor="admin-password">Password</label>
            <div className="adm-input">
              <IconLock size={18} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="adm-input-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="adm-alert" role="alert">
              <IconAlert size={17} />
              {error}
            </p>
          )}

          <button className="adm-submit" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="adm-spinner" /> Signing in…
              </>
            ) : (
              <>
                <IconLock size={17} /> Sign in
              </>
            )}
          </button>

          <Link to="/" className="adm-auth-back">
            <IconArrowLeft size={16} />
            Back to storefront
          </Link>
        </form>
      </div>
    </section>
  )
}
