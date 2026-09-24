import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let instance: Lenis | null = null

export const getLenis = (): Lenis | null => instance

export function startSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  instance = lenis

  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    instance = null
  }
}

export function scrollToTarget(target: string | number, immediate = false): void {
  if (instance) {
    // Forced so immediate jumps still work while Lenis is stopped
    instance.scrollTo(target, { immediate, duration: 1.4, force: immediate })
    if (immediate && typeof target === 'number') window.scrollTo(0, target)
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}
