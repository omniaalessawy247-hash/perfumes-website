import { create } from 'zustand'
import { fetchSizes } from '../lib/api'
import { findPerfume, type Size } from '../data/catalog'

interface CatalogState {
  sizes: Record<string, Size[]>
  load: () => Promise<void>
}

export const useCatalog = create<CatalogState>((set) => ({
  sizes: {},
  load: async () => {
    try {
      set({ sizes: await fetchSizes() })
    } catch (error) {
      console.warn('Using fallback prices', error)
    }
  },
}))

export function useSizes(id: string): Size[] {
  const remote = useCatalog((state) => state.sizes[id])
  return remote?.length ? remote : (findPerfume(id)?.sizes ?? [])
}
