import { useRef } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { findPerfume, perfumes } from '../data/catalog'
import { img } from '../data/assets'
import './footer.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const perfume = findPerfume(matchPath('/perfume/:id', pathname)?.params.id) ?? perfumes[0]

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.footer-feature img', { y: 40, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 85%' } })
      gsap.from('.footer-mark', {
        yPercent: 30,
        opacity: 0,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      })
      gsap.from('.footer-grid > *, .footer-legal', {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.footer-grid', start: 'top 92%' },
      })
    },
    { scope: root },
  )

  return (
    <footer className="site-footer" ref={root} style={{ '--tone': perfume.theme.liquid, '--gold': perfume.theme.accent } as React.CSSProperties}>
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-top">
        <div>
          <div className="footer-mark serif" aria-hidden="true">
            AMBRE
          </div>
          <p className="footer-tag serif">{perfume.tagline}</p>
        </div>
        <div className="footer-feature">
          <img key={perfume.id} src={img(perfume.bottle)} alt={perfume.name + ' bottle'} loading="lazy" />
          <span className="footer-feature-name serif">{perfume.name}</span>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <p className="eyebrow">Perfumes</p>
          <ul>
            {perfumes.map((p) => (
              <li key={p.id}>
                <Link to={'/perfume/' + p.id}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul>
            <li>
              <Link to="/#collection">
                The collection
              </Link>
            </li>
            <li>
              <Link to="/#story">Our story</Link>
            </li>
            <li>
              <Link to="/#ritual">Gifting</Link>
            </li>
            <li>
              <Link to="/track-order">Track your order</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Service</p>
          <ul>
            <li>Complimentary gift wrap</li>
            <li>Custom engraving</li>
            <li>Cash on delivery</li>
          </ul>
        </div>
        <p className="footer-note">Eau de Parfum in 30, 50 and 100 ml, made in small batches.</p>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} AMBRE. All rights reserved.</p>
    </footer>
  )
}
