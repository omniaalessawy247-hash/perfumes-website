import { useCallback, useEffect } from 'react'
import { useSound } from '../store/sound'

const SRC = '/assets/spray.mp3'

// Web Audio: the file is fetched and decoded once, so a click starts the sound
// instantly (no network / decode delay) and rapid clicks simply overlap.
type Ctor = typeof AudioContext
let ctx: AudioContext | null = null
let buffer: AudioBuffer | null = null
let loading: Promise<void> | null = null
let fallback: HTMLAudioElement | null = null

function getCtx(): AudioContext | null {
  if (ctx) return ctx
  const Ctx: Ctor | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext
  if (!Ctx) return null
  ctx = new Ctx()
  return ctx
}

function preload(): Promise<void> {
  if (loading) return loading
  const c = getCtx()
  if (!c) {
    fallback = new Audio(SRC)
    fallback.preload = 'auto'
    loading = Promise.resolve()
    return loading
  }
  loading = fetch(SRC)
    .then((res) => res.arrayBuffer())
    .then((data) => c.decodeAudioData(data))
    .then((decoded) => {
      buffer = decoded
    })
    .catch(() => {
      // Decoding failed: fall back to a plain element
      fallback = new Audio(SRC)
      fallback.preload = 'auto'
    })
  return loading
}

// Call inside a user gesture so the browser lets the context run
function unlock(): void {
  const c = getCtx()
  if (c && c.state === 'suspended') void c.resume()
}

function playNow(): void {
  const c = ctx
  if (c && buffer) {
    const source = c.createBufferSource()
    source.buffer = buffer
    source.connect(c.destination)
    source.start(0)
    return
  }
  if (fallback) {
    // clone so overlapping clicks each get their own sound
    const clone = fallback.cloneNode(true) as HTMLAudioElement
    void clone.play().catch(() => undefined)
  }
}

export function useSpraySound() {
  const soundEnabled = useSound((state) => state.soundEnabled)

  // Load the sound as soon as the page opens, not on the first click
  useEffect(() => {
    if (soundEnabled) void preload()
  }, [soundEnabled])

  // Run on pointer-down / click: wakes the audio context
  const prime = useCallback(() => {
    if (soundEnabled) unlock()
  }, [soundEnabled])

  // Start the sound right now (same tick as the visual spray)
  const play = useCallback(() => {
    if (!soundEnabled) return
    unlock()
    playNow()
  }, [soundEnabled])

  return { prime, play }
}
