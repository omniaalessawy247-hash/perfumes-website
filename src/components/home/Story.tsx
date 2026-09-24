import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { img } from '../../data/assets'
import './story.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const copy =
  'Every AMBRE begins as a single note. We build each perfume in small batches, layer by layer, until it smells like an hour you can wear.'

const pillars = [
  { no: '01', title: 'Small batches', text: 'Poured in limited runs, never rushed.' },
  { no: '02', title: 'Layered by hand', text: 'Top, heart and base, balanced note by note.' },
  { no: '03', title: 'Worn like an hour', text: 'Each scent holds one mood from start to finish.' },
]

export default function Story() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.story-word',
        { opacity: 0.18 },
        { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: '.story-copy', start: 'top 78%', end: 'bottom 52%', scrub: true } },
      )
      gsap.fromTo(
        '.story-photo img',
        { yPercent: -8, scale: 1.14 },
        { yPercent: 8, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.story-photo', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('.story-photo', { clipPath: 'inset(0 0 100% 0 round 22px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.story-photo', start: 'top 85%' } })
      gsap.from('.story-frame', { x: -30, y: 30, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.story-photo', start: 'top 85%' } })
      gsap.from('.pillar', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.14, scrollTrigger: { trigger: '.pillars', start: 'top 92%' } })
    },
    { scope: root },
  )

  return (
    <section className="story" id="story" ref={root}>
      <div className="story-grid">
        <div className="story-inner">
          <p className="eyebrow">Our story</p>
          <p className="story-copy serif" aria-label={copy}>
            {copy.split(' ').map((word, i) => (
              <span key={i} className="story-word" aria-hidden="true">
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
        <div className="story-media">
          <span className="story-frame" aria-hidden="true" />
          <div className="story-photo">
            <img src={img('24')} alt="A perfumer's dropper above small glass vials" loading="lazy" />
          </div>
        </div>
      </div>
      <ul className="pillars">
        {pillars.map((p) => (
          <li key={p.no} className="pillar">
            <span className="pillar-no serif">{p.no}</span>
            <h3 className="serif">{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
