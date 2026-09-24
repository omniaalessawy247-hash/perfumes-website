import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { perfumes } from '../../data/catalog'
import { img } from '../../data/assets'
import { formatPrice } from '../../lib/format'
import { useSizes } from '../../store/catalog'
import { useRevealNavigate } from '../../hooks/useRevealNavigate'
import type { Perfume } from '../../data/catalog'
import './collection.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function Panel({ perfume }: { perfume: Perfume }) {
  const reveal = useRevealNavigate()
  const sizes = useSizes(perfume.id)
  const from = sizes.length ? Math.min(...sizes.map((size) => size.price)) : null
  const { theme } = perfume

  return (
    <a
      href={'/perfume/' + perfume.id}
      className="panel themed"
      style={{ '--bg': theme.bg, '--text': theme.text, '--accent': theme.accent, '--liquid': theme.liquid, '--on-accent': theme.onAccent } as React.CSSProperties}
      onClick={(event) => {
        event.preventDefault()
        reveal('/perfume/' + perfume.id, { x: event.clientX, y: event.clientY })
      }}
    >
      <div className="panel-glow" />
      <header className="panel-head">
        <h3 className="serif">{perfume.name}</h3>
        <p>{perfume.tagline}</p>
      </header>
      <div className="panel-image">
        <img className="panel-bottle" src={img(perfume.bottle)} alt={perfume.name + ' bottle'} loading="lazy" />
      </div>
      <footer className="panel-foot">
        <p>
          {perfume.notes.top} · {perfume.notes.heart} · {perfume.notes.base}
        </p>
        <span className="panel-price">{from ? 'From ' + formatPrice(from) : ''}</span>
        <span className="panel-open">Open</span>
      </footer>
    </a>
  )
}

export default function Collection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.from('.section-head > *', {
          y: 32,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.section-head', start: 'top 88%' },
        })
      }
      gsap.from('.panel', {
        y: 90,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.panels', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="collection" id="collection" ref={root}>
      <header className="section-head">
        <p className="eyebrow">The collection</p>
        <h2 className="serif">Four perfumes, four moods.</h2>
        <p className="section-lead">Choose the hour that feels like you. Open a bottle to discover its notes, colour and story.</p>
      </header>
      <div className="panels">
        {perfumes.map((perfume) => (
          <Panel key={perfume.id} perfume={perfume} />
        ))}
      </div>
    </section>
  )
}
