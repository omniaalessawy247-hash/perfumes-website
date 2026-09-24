import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Navigate, useParams } from 'react-router-dom'
import { findPerfume, perfumes, type Perfume } from '../data/catalog'
import { img } from '../data/assets'
import { formatPrice } from '../lib/format'
import { useSizes } from '../store/catalog'
import { useCart } from '../store/cart'
import { useRevealNavigate } from '../hooks/useRevealNavigate'
import { useSpraySound } from '../hooks/useSpraySound'
import './pdp.css'

gsap.registerPlugin(useGSAP)

interface Orbit {
  x: number
  y: number
  scale: number
  rotate: number
  float: number
}

const orbit: Orbit[] = [
  { x: -35, y: -22, scale: 1, rotate: -20, float: 5 },
  { x: 36, y: -16, scale: 1.05, rotate: 25, float: 5.6 },
  { x: -34, y: 26, scale: 0.9, rotate: 60, float: 6.2 },
  { x: 35, y: 28, scale: 1.1, rotate: -40, float: 5.3 },
  { x: -25, y: -40, scale: 0.6, rotate: 100, float: 6.6 },
  { x: 25, y: 40, scale: 0.65, rotate: -90, float: 5.9 },
]

const maskUrl = (id: string) => ({ maskImage: 'url(' + img(id) + ')', WebkitMaskImage: 'url(' + img(id) + ')' })

const ribbonIn = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 0.95, scale: 1 },
  transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

const intensityLabel = (value: number): string => (value < 34 ? 'Eau Fraîche' : value < 67 ? 'Eau de Parfum' : 'Extrait')

function Stage({ perfume, intensity, engraving }: { perfume: Perfume; intensity: number; engraving: string }) {
  // One entry per click, so every press shows its own mist (and its own sound)
  const [sprays, setSprays] = useState<number[]>([])
  const sprayId = useRef(0)
  const { prime, play } = useSpraySound()
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.stage-orb', { opacity: 1 })
        return
      }
      const orbs = gsap.utils.toArray<HTMLElement>('.stage-orb')
      orbs.forEach((el, i) => {
        const slot = orbit[i]
        gsap.set(el, { left: '50%', top: '50%', opacity: 0, scale: 0, rotation: slot.rotate - 60 })
        gsap.to(el, {
          left: 50 + slot.x + '%',
          top: 50 + slot.y + '%',
          opacity: 1,
          scale: slot.scale,
          rotation: slot.rotate,
          duration: 1.6,
          delay: 0.5 + i * 0.09,
          ease: 'elastic.out(1, 0.7)',
          onComplete: () => {
            // Zoom in / zoom out, each ingredient on its own beat
            gsap.fromTo(
              el.firstElementChild,
              { scale: 0.88, rotation: 0 },
              { scale: 1.2, rotation: 0, duration: slot.float * 0.36, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.25 },
            )
          },
        })
      })
    },
    { scope: stage },
  )

  const spray = () => {
    const id = ++sprayId.current
    // Commit the mist to the DOM synchronously, then start the sound in the same
    // tick, so image and sound begin together on every click.
    flushSync(() => setSprays((list) => [...list.slice(-3), id]))
    play()
  }

  return (
    <div className="pdp-stage" ref={stage} style={{ '--i': intensity / 100 } as React.CSSProperties}>
      <div className="stage-glow" />

      {/* One continuous liquid ribbon around the whole bottle: back copy behind it, lower-half copy in front. */}
      <motion.div className="stage-rib stage-rib-back" aria-hidden="true" {...ribbonIn}>
        <div className="stage-rib-tilt">
          <img src={img(perfume.liquid)} alt="" />
        </div>
      </motion.div>

      {orbit.map((_slot, i) => {
        const id = perfume.ingredients[i % perfume.ingredients.length]
        return (
          <div key={i} className="stage-orb">
            <img src={img(id)} alt="" />
          </div>
        )
      })}

      <motion.button
        className="stage-bottle"
        onPointerDown={prime}
        onClick={spray}
        whileTap={{ scale: 0.97 }}
        aria-label={'Spray ' + perfume.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={img(perfume.bottle)} alt={perfume.name + ' perfume bottle'} />
      </motion.button>

      {sprays.map((id) => (
        <motion.div
          key={id}
          className="stage-mist lum-mask"
          style={maskUrl('22')}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.1, 1.6] }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          onAnimationComplete={() => setSprays((list) => list.filter((item) => item !== id))}
        />
      ))}

      <AnimatePresence>
        {engraving && (
          <motion.p
            key="plaque"
            className="stage-plaque serif"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {engraving}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="stage-hint">Tap the bottle to spray</p>
    </div>
  )
}

function View({ perfume }: { perfume: Perfume }) {
  const sizes = useSizes(perfume.id)
  const add = useCart((state) => state.add)
  const setOpen = useCart((state) => state.setOpen)
  const reveal = useRevealNavigate()

  const [ml, setMl] = useState<number | null>(null)
  const [intensity, setIntensity] = useState(55)
  const [engraving, setEngraving] = useState('')
  const [giftWrap, setGiftWrap] = useState(false)

  const selected = sizes.find((size) => size.ml === ml) ?? sizes[Math.min(1, sizes.length - 1)]
  const moodRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: moodRef, offset: ['start end', 'end start'] })
  const moodY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const addToBag = () => {
    if (!selected) return
    add({
      productId: perfume.id,
      name: perfume.name,
      bottle: perfume.bottle,
      sizeMl: selected.ml,
      unitPrice: selected.price,
      quantity: 1,
      engraving,
      giftWrap,
    })
    setOpen(true)
  }

  const others = perfumes.filter((p) => p.id !== perfume.id)

  return (
    <article className="pdp">
      <section className="pdp-hero">
        <div className="pdp-dust lum-mask" style={maskUrl('08')} aria-hidden="true" />
        <div className="pdp-info">
          <p className="eyebrow">Eau de Parfum</p>
          <h1 className="serif">{perfume.name}</h1>
          <p className="pdp-tagline">{perfume.tagline}</p>
          <dl className="pdp-notes">
            <div>
              <dt>Top</dt>
              <dd>{perfume.notes.top}</dd>
            </div>
            <div>
              <dt>Heart</dt>
              <dd>{perfume.notes.heart}</dd>
            </div>
            <div>
              <dt>Base</dt>
              <dd>{perfume.notes.base}</dd>
            </div>
          </dl>
        </div>

        <Stage perfume={perfume} intensity={intensity} engraving={engraving} />

        <aside className="pdp-buy" aria-label="Order options">
          <fieldset>
            <legend>Size</legend>
            <div className="size-row">
              {sizes.map((size) => (
                <button
                  key={size.ml}
                  className="size-chip"
                  aria-pressed={selected?.ml === size.ml}
                  onClick={() => setMl(size.ml)}
                >
                  <strong>{size.ml} ml</strong>
                  <span>{formatPrice(size.price)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="intensity">
            <label htmlFor="intensity">
              Intensity <strong>{intensityLabel(intensity)}</strong>
            </label>
            <input
              id="intensity"
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="engraving">Engraving (optional)</label>
            <input
              id="engraving"
              value={engraving}
              maxLength={14}
              placeholder="Up to 14 characters"
              onChange={(event) => setEngraving(event.target.value.toUpperCase().replace(/[^A-Z0-9 .&'-]/g, ''))}
            />
          </div>

          <label className="check">
            <input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} />
            <span>Gift wrap, free</span>
          </label>

          <div className="buy-total">
            <span>Total</span>
            <strong className="serif">{selected ? formatPrice(selected.price) : '-'}</strong>
          </div>
          <button className="btn btn-solid buy-btn" onClick={addToBag} disabled={!selected}>
            Add to bag
          </button>
        </aside>
      </section>

      <section className="pdp-story">
        <p className="serif">{perfume.story}</p>
        <div className="note-columns">
          {(['top', 'heart', 'base'] as const).map((layer, i) => (
            <motion.div
              key={layer}
              className="note-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="eyebrow">{layer} note</span>
              <h3 className="serif">{perfume.notes[layer]}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pdp-mood" ref={moodRef}>
        <motion.img style={{ y: moodY }} src={img(perfume.scene)} alt="" loading="lazy" />
        <p className="serif">{perfume.tagline}</p>
      </section>

      <section className="pdp-others">
        <h2 className="serif">Try another hour</h2>
        <div className="others-row">
          {others.map((other) => (
            <button
              key={other.id}
              className="other themed"
              style={{ '--bg': other.theme.bg, '--text': other.theme.text } as React.CSSProperties}
              onClick={(event) => reveal('/perfume/' + other.id, { x: event.clientX, y: event.clientY })}
            >
              <img src={img(other.bottle)} alt="" loading="lazy" />
              <span className="serif">{other.name}</span>
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}

export default function PerfumePage() {
  const { id } = useParams()
  const perfume = findPerfume(id)
  if (!perfume) return <Navigate to="/" replace />
  return <View key={perfume.id} perfume={perfume} />
}
