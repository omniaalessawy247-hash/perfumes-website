import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SoundState {
  soundEnabled: boolean
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
}

// On by default; sound only plays on the visitor's own click
export const useSound = create<SoundState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    { name: 'ambre-sound' },
  ),
)
