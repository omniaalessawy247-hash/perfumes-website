import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section style={{ minHeight: '100svh', display: 'grid', placeContent: 'center', gap: 24, padding: '0 var(--gutter)' }}>
      <h1 className="serif" style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}>
        Page not found.
      </h1>
      <Link to="/" className="btn btn-solid" style={{ justifySelf: 'start' }}>
        Back to AMBRE
      </Link>
    </section>
  )
}
