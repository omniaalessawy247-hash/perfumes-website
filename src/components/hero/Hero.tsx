import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { img } from '../../data/assets'
import { perfumes } from '../../data/catalog'
import { useRevealNavigate } from '../../hooks/useRevealNavigate'
import { getLenis, scrollToTarget } from '../../hooks/smoothScroll'
import { swarm } from './swarm'
import './hero.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

// Where a perfume's own ingredients sit around its bottle (% of the stage), and the colour of its name
const slots: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 8, y: 50 }],
  2: [{ x: 6, y: 34 }, { x: 94, y: 66 }],
  3: [{ x: 6, y: 26 }, { x: 94, y: 48 }, { x: 8, y: 76 }],
}
const ringTilt = [-25, 30, 60]
const nameColor: Record<string, string> = { ambre: '#B9761A', ward: '#C9636F', 'oud-nuit': '#6E1F24', jasmin: '#7C9A3E' }

const isCompact = (): boolean => window.innerWidth < 768
// Viewport heights of scroll the pinned hero lasts; shorter on touch layouts
const pinScreens = (): number => {
  if (isCompact()) return 5
  return window.innerWidth <= 1100 && window.innerHeight > window.innerWidth ? 7 : 10.4
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const reveal = useRevealNavigate()
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // Offsets that move an ingredient onto its own bottle / onto the middle of the hero
  const toBottle = (axis: 'x' | 'y') => (_i: number, el: HTMLElement) => {
    const wrap = el.parentElement as HTMLElement
    const fig = wrap.parentElement as HTMLElement
    const a = wrap.getBoundingClientRect()
    const b = (fig.querySelector('.h-fig-bottle') as HTMLElement).getBoundingClientRect()
    return axis === 'x' ? b.left + b.width / 2 - (a.left + a.width / 2) : b.top + b.height / 2 - (a.top + a.height / 2)
  }
  const toCenter = (axis: 'x' | 'y') => (i: number, el: HTMLElement) => {
    const isBottle = el.classList.contains('h-fig-bottle')
    const a = (isBottle ? el : (el.parentElement as HTMLElement)).getBoundingClientRect()
    const h = root.current!.getBoundingClientRect()
    const spread = isBottle ? [-70, -24, 24, 70][i % 4] : [-36, 30, -14, 40, 12, -28, 24, -40][i % 8]
    return axis === 'x' ? h.left + h.width / 2 - (a.left + a.width / 2) + spread : h.top + h.height * 0.52 - (a.top + a.height / 2) + spread * 0.7
  }

  const showAll = () => {
    const tl = tlRef.current
    const st = tl?.scrollTrigger
    if (!tl || !st) return
    scrollToTarget(st.start + ((st.end - st.start) * 14.6) / tl.duration())
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const spread = () => (isCompact() ? 0.62 : 1)

        gsap.set('.h-ing', { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0, opacity: 0 })
        gsap.set('.h-rib', { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 })
        gsap.set('.h-fig, .h-line-title, .h-vignette', { opacity: 0 })
        gsap.set('.h-fig-ing img', { scale: 0, x: toBottle('x'), y: toBottle('y') })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + Math.round(window.innerHeight * pinScreens()),
            // Lenis already smooths the wheel, so no scrub delay
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tlRef.current = tl

        // Act 1: headline leaves, bottle grows
        tl.to('.h-title', { yPercent: -30, opacity: 0, duration: 1.2 }, 0)
          .to('.h-sub', { y: 40, opacity: 0, duration: 1 }, 0)
          .to('.h-cue', { opacity: 0, duration: 0.5 }, 0)
          .to('.h-bottle', { scale: 1.1, duration: 1.6 }, 0)

        // Act 2: the bottle opens
        tl.to('.h-closed', { opacity: 0, duration: 0.7 }, 1.3)
          .to('.h-open', { opacity: 1, duration: 0.7 }, 1.3)
          .fromTo('.h-glow', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.5, duration: 2.2, ease: 'power2.out' }, 1.3)
          .fromTo('.h-discover', { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' }, 2)
          .to('.h-dust:not(.h-dust-mix)', { opacity: 0.9, duration: 1.2 }, 2.2)

        // Act 3: a small liquid ribbon turns softly behind the bottle, 
        tl.to('.h-rib', { opacity: 0.92, scale: 0.9, duration: 2.6, ease: 'power2.out' }, 2)

        // Act 4: notes burst out and get named
        tl.to(
          '.h-ing',
          {
            x: (_i, el: HTMLElement) => (Number(el.dataset.x) * window.innerWidth * spread()) / 100,
            y: (_i, el: HTMLElement) => (Number(el.dataset.y) * window.innerHeight * spread()) / 100,
            scale: (_i, el: HTMLElement) => Number(el.dataset.scale) * 0.8,
            rotation: (_i, el: HTMLElement) => Number(el.dataset.rotate),
            opacity: 1,
            duration: 2.4,
            ease: 'expo.out',
            stagger: { each: 0.06, from: 'center' },
          },
          3.6,
        )
          .to('.h-ing', { scale: (_i, el: HTMLElement) => Number(el.dataset.scale) * 1.22, duration: 0.9, ease: 'sine.inOut', stagger: { each: 0.05, from: 'center' } }, 5.6)
          .to('.h-ing', { scale: (_i, el: HTMLElement) => Number(el.dataset.scale) * 0.9, duration: 0.9, ease: 'sine.inOut', stagger: { each: 0.05, from: 'center' } }, 6.6)
          .to('.h-label-top', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 4.9)
          .to('.h-label-heart', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 5.3)
          .to('.h-label-base', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 5.7)

        // Act 5: everything folds back into the bottle
        tl.to('.h-discover', { opacity: 0, scale: 0.9, duration: 1.2 }, 7.2)
          .to('.h-label', { opacity: 0, duration: 0.6 }, 7.6)
          .to('.h-rib', { opacity: 0, scale: 1, duration: 1.6, ease: 'power2.inOut' }, 6.6)
          .to(
            '.h-ing',
            { x: 0, y: 0, scale: 0, opacity: 0, rotation: '+=90', duration: 1.5, ease: 'power3.in', stagger: { each: 0.03, from: 'edges' } },
            7.8,
          )
          .to('.h-open', { opacity: 0, duration: 0.7 }, 8.6)
          .to('.h-closed', { opacity: 1, duration: 0.7 }, 8.6)
          // The atmosphere stays: the closing bottle sits inside its own colour field.
          .to('.h-glow', { opacity: 0.85, scale: 1.2, duration: 1.4 }, 8.4)
          .to('.h-dust:not(.h-dust-mix)', { opacity: 0.55, duration: 1.4 }, 8.4)
          .to('.h-atmos', { opacity: 1, duration: 1.4 }, 8.4)
          .to('.h-dust:not(.h-dust-mix)', { opacity: 0.9, duration: 1.4 }, 8.4)
          .to('.h-bottle', { scale: 0.86, duration: 1.4 }, 8.6)
          // ===== FINALE (each act has its own label) =====
          .addLabel('finale', 10.4)
          // Act A: the lone bottle leaves, the four perfumes arrive on a cinematic, blended backdrop
          .to('.h-bottle', { opacity: 0, scale: 0.7, duration: 1, ease: 'power2.in' }, 'finale')
          .to('.h-dust:not(.h-dust-mix)', { opacity: 0, duration: 2.4 }, 'finale')
          .to('.h-dust-mix', { opacity: 0.9, duration: 2.4 }, 'finale')
          .to('.h-vignette', { opacity: 1, duration: 2.4 }, 'finale')
          .set('.h-line', { visibility: 'visible' }, 'finale+=0.4')
          .fromTo('.h-line', { scale: 1.06 }, { scale: 1, duration: 3.2, ease: 'sine.out' }, 'finale+=0.4')
          .fromTo('.h-fig', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.8, ease: 'sine.out', stagger: 0.25 }, 'finale+=0.4')
          .fromTo('.h-line-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, ease: 'sine.out' }, 'finale+=1.4')
          // Act B: each perfume's ingredients rise out of its own bottle
          .addLabel('rise', 'finale+=2')
          .to('.h-fig-ing img', { scale: 1, x: 0, y: 0, duration: 2, ease: 'sine.out', stagger: 0.05 }, 'rise')
          // Act C: ingredients and bottles drift together and blend into one cloud
          .addLabel('blend', 'rise+=3')
          .to('.h-line-title', { opacity: 0, duration: 0.8 }, 'blend')
          .to('.h-fig-ing img', { x: toCenter('x'), y: toCenter('y'), scale: 0.7, duration: 2.4, ease: 'sine.inOut', stagger: 0.04 }, 'blend')
          .to('.h-fig-bottle', { x: toCenter('x'), y: toCenter('y'), scale: 0.8, duration: 2.4, ease: 'sine.inOut', stagger: 0.05 }, 'blend')
          // Act D: the phrase is written across the cloud
          .addLabel('write', 'blend+=2.6')
          .set('.h-outro', { visibility: 'visible' }, 'write')
          .fromTo('.h-outro', { opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, 'write')
          .to('.h-outro', { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 'write+=2.2')
          // Act E: everything returns to its place, each bottle with its own ingredients
          .addLabel('return', 'write+=2.4')
          .to('.h-fig-bottle', { x: 0, y: 0, scale: 1, duration: 2.4, ease: 'sine.inOut', stagger: 0.05 }, 'return')
          .to('.h-fig-ing img', { x: 0, y: 0, scale: 1, duration: 2.4, ease: 'sine.inOut', stagger: 0.04 }, 'return')
          .to('.h-line-title', { opacity: 1, duration: 1.2 }, 'return+=1.6')
          .to({}, { duration: 0.8 })

        // Every ingredient zooms in and out on its own rhythm
        gsap.utils.toArray<HTMLElement>('.h-ing img').forEach((el) => {
          gsap.to(el, { scale: '+=' + gsap.utils.random(0.03, 0.06), duration: gsap.utils.random(3.5, 5), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2) })
        })
        gsap.utils.toArray<HTMLElement>('.h-fig-ing').forEach((el) => {
          gsap.to(el, { scale: gsap.utils.random(1.06, 1.12), yPercent: gsap.utils.random(-4, 4), duration: gsap.utils.random(3, 4.5), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2) })
        })
        gsap.to('.h-dust', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })

        // Cinematic entrance (children only, so it never fights the scrubbed parents)
        gsap.from('.h-title h1', { yPercent: 35, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.1 })
        gsap.from('.h-tilt', { y: 90, opacity: 0, duration: 1.8, ease: 'power3.out', delay: 0.25 })
        gsap.from('.h-sub p, .h-actions .btn', {
          y: 24,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.7,
          clearProps: 'transform,opacity',
        })
      })

      // Re-measure triggers once images have loaded
      const onLoad = () => ScrollTrigger.refresh()
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad)

      // Hold the first frame until the first user gesture
      let locked = true
      // Stop Lenis too so momentum cannot advance the timeline
      getLenis()?.stop()
      const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      const unlock = () => {
        locked = false
        getLenis()?.start()
        events.forEach((name) => window.removeEventListener(name, unlock))
      }
      events.forEach((name) => window.addEventListener(name, unlock, { passive: true }))

      let frame = 0
      const hold = () => {
        if (!locked) return
        if (window.scrollY !== 0) scrollToTarget(0, true)
        frame = window.requestAnimationFrame(hold)
      }
      frame = window.requestAnimationFrame(hold)

      return () => {
        window.removeEventListener('load', onLoad)
        window.cancelAnimationFrame(frame)
        events.forEach((name) => window.removeEventListener(name, unlock))
        // Leaving on the hero before ever interacting (fast route change)
        // must not leave Lenis permanently stopped for the rest of the site.
        if (locked) getLenis()?.start()
        mm.revert()
      }
    },
    { scope: root },
  )

  useEffect(() => {
    const node = root.current
    if (!node || window.matchMedia('(pointer: coarse)').matches) return

    const rotY = gsap.quickTo('.h-tilt', 'rotationY', { duration: 0.8, ease: 'power3.out' })
    const rotX = gsap.quickTo('.h-tilt', 'rotationX', { duration: 0.8, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      rotY(((event.clientX / window.innerWidth) * 2 - 1) * 9)
      rotX(((event.clientY / window.innerHeight) * 2 - 1) * -6)
    }

    node.addEventListener('pointermove', onMove)
    return () => node.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section className="hero" ref={root} aria-label="AMBRE introduction">
      <div className="h-atmos" aria-hidden="true" />
      <div className="h-layer h-dust lum-mask" style={{ maskImage: 'url(' + img('08') + ')', WebkitMaskImage: 'url(' + img('08') + ')' }} />
      <div className="h-layer h-dust h-dust-mix lum-mask" style={{ background: 'linear-gradient(100deg, ' + perfumes.map((p) => p.theme.liquid).join(', ') + ')', maskImage: 'url(' + img('08') + ')', WebkitMaskImage: 'url(' + img('08') + ')' }} />

      <div className="h-discover serif" aria-hidden="true">
        DISCOVER
        <br />
        AMBRE
      </div>

      <div className="h-layer h-glow" />
      <div className="h-layer h-rib h-rib-back" aria-hidden="true">
        <div className="h-rib-tilt">
          <img className="h-rib-img" src={img('03')} alt="" />
        </div>
      </div>

      <div className="h-title">
        <h1 className="serif">
          Open
          <br />
          the hour.
        </h1>
      </div>

      <div className="h-bottle">
        <div className="h-tilt">
          <div className="h-float">
            <img className="h-closed" src={img('01')} alt="AMBRE perfume bottle" />
            <img className="h-open" src={img('02')} alt="" />
          </div>
        </div>
      </div>

      {swarm.map((p, i) => (
        <div
          key={i}
          className="h-layer h-ing"
          data-x={p.x}
          data-y={p.y}
          data-scale={p.scale}
          data-rotate={p.rotate}
          style={{ zIndex: p.z, width: p.width, height: p.width }}
        >
          <img src={img(p.id)} alt="" style={{ filter: p.blur ? 'blur(' + p.blur + 'px)' : undefined }} />
        </div>
      ))}

      <p className="h-label h-label-top">
        <span>Top</span>Blood orange
      </p>
      <p className="h-label h-label-heart">
        <span>Heart</span>Rose
      </p>
      <p className="h-label h-label-base">
        <span>Base</span>Amber
      </p>

      <div className="h-sub">
        <p>A perfume that opens like golden hour.</p>
        <div className="h-actions">
          <button className="btn btn-solid" onClick={(e) => reveal('/perfume/ambre', { x: e.clientX, y: e.clientY })}>
            Shop AMBRE
          </button>
          <button className="btn btn-ghost" onClick={showAll}>
            All four
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToTarget('#collection')}>
            The collection
          </button>
        </div>
      </div>

      <p className="h-cue">Scroll to open</p>

      <div className="h-vignette" aria-hidden="true" />

      <div className="h-line">
        <p className="h-line-title serif">Every hour has its scent.</p>
        {perfumes.map((p) => (
          <div
            key={p.id}
            style={{ '--g': p.theme.liquid } as React.CSSProperties}
            className={'h-fig' + (p.id === 'ambre' ? ' h-fig-main' : '')}
            onClick={p.id === 'ambre' ? () => scrollToTarget(0) : undefined}
            role={p.id === 'ambre' ? 'button' : undefined}
            aria-label={p.id === 'ambre' ? 'Back to the start' : undefined}
          >
            <div className="h-fig-stage">
              <img className="h-fig-bottle" src={img(p.bottle)} alt="" />
              {p.ingredients.map((id, k) => {
                const at = (slots[p.ingredients.length] ?? slots[3])[k]
                return (
                  <span key={id} className="h-fig-ing" style={{ left: at.x + '%', top: at.y + '%' }}>
                    <img src={img(id)} alt="" style={{ rotate: ringTilt[k % 3] + 'deg' }} />
                  </span>
                )
              })}
            </div>
            <span className="h-fig-name serif" style={{ color: nameColor[p.id] }}>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="h-outro">
        <p className="serif">
          <span style={{ color: nameColor.ambre }}>Four</span> <span style={{ color: nameColor.ward }}>perfumes.</span>
        </p>
        <p className="serif">
          <span style={{ color: nameColor['oud-nuit'] }}>Four</span> <span style={{ color: nameColor.jasmin }}>moods.</span>
        </p>
      </div>
    </section>
  )
}
