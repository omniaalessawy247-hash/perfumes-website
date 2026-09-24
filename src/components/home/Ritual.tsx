import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { img } from '../../data/assets'
import { scrollToTarget } from '../../hooks/smoothScroll'
import './ritual.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const tiles = [
  { id: '20', no: '01', kicker: 'Gifting', title: 'Made to be given', text: 'Every bottle can be gift wrapped and engraved with a name.' },
  { id: '21', no: '02', kicker: 'Longevity', title: 'One spray', text: 'Eau de Parfum that stays with you from morning to night.' },
  { id: '23', no: '03', kicker: 'Coming soon', title: 'The discovery set', text: 'Four miniatures, one for each mood. Coming soon.' },
]

const perks = ['Complimentary gift wrap', 'Custom engraving', 'Small-batch Eau de Parfum', 'Cash on delivery']

export default function Ritual() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!reduce) {
        gsap.from('.ritual-head > *', {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.ritual-head', start: 'top 86%' },
        })
        gsap.from('.ritual-rule', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.6,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.ritual-rule', start: 'top 92%' },
        })
        gsap.utils.toArray<HTMLElement>('.tile').forEach((tile, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: tile, start: 'top 86%' } })
          const dir = i % 2 === 0 ? -1 : 1
          tl.from(tile.querySelector('.tile-frame'), { opacity: 0, x: 80 * dir, clipPath: 'inset(0% 0% 0% 100% round 22px)', duration: 1.5, ease: 'expo.out' })
            .from(tile.querySelector('.tile-arrow-line'), { scaleX: 0, transformOrigin: i % 2 === 0 ? 'left center' : 'right center', duration: 1, ease: 'power3.inOut' }, '<0.5')
            .from(tile.querySelectorAll('.tile-no, .tile-kicker, h3, .tile-text, .tile-arrow-head'), { y: 24, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' }, '<0.2')
        })
        gsap.from('.perk', {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.perks', start: 'top 92%' },
        })
        gsap.from('.ritual-cta', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.ritual-cta', start: 'top 94%' } })
      }
      gsap.utils.toArray<HTMLElement>('.tile-frame img').forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -6, scale: 1.16 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section className="ritual" id="ritual" ref={root}>
      <header className="ritual-head">
        <p className="eyebrow">Gifting and rituals</p>
        <h2 className="serif">
          Small details, <em>worn every day.</em>
        </h2>
        <p className="ritual-lead">Each bottle is finished by hand, wrapped with care and made to be remembered.</p>
      </header>
      <div className="ritual-rule" aria-hidden="true" />
      <div className="tiles">
        {tiles.map((tile) => (
          <article key={tile.id} className={'tile' + (tile.id === '23' ? ' tile-wide' : '')}>
            <div className="tile-frame">
              <img src={img(tile.id)} alt="" loading="lazy" />
              <span className="tile-shine" aria-hidden="true" />
            </div>
            <div className="tile-arrow" aria-hidden="true">
              <span className="tile-arrow-line" />
              <span className="tile-arrow-head">→</span>
            </div>
            <div className="tile-body">
              <span className="tile-no serif">{tile.no}</span>
              <p className="tile-kicker">{tile.kicker}</p>
              <h3 className="serif">{tile.title}</h3>
              <p className="tile-text">{tile.text}</p>
            </div>
          </article>
        ))}
      </div>
      <ul className="perks">
        {perks.map((perk) => (
          <li key={perk} className="perk">
            <i aria-hidden="true" />
            {perk}
          </li>
        ))}
      </ul>
      <div className="ritual-cta">
        <button className="btn btn-solid" onClick={() => scrollToTarget('#collection')}>
          Choose your hour
        </button>
      </div>
    </section>
  )
}
