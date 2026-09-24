import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  key: string
  productId: string
  name: string
  bottle: string
  sizeMl: number
  unitPrice: number
  quantity: number
  engraving: string
  giftWrap: boolean
}

interface CartState {
  items: CartItem[]
  open: boolean
  lastAdded: string | null
  add: (item: Omit<CartItem, 'key'>) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
  setOpen: (open: boolean) => void
}

const MAX_QTY = 10

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      lastAdded: null,
      add: (item) =>
        set((state) => {
          const key = [item.productId, item.sizeMl, item.engraving, item.giftWrap].join('|')
          const existing = state.items.find((line) => line.key === key)
          if (existing) {
            return {
              lastAdded: item.productId,
              items: state.items.map((line) =>
                line.key === key
                  ? { ...line, quantity: Math.min(MAX_QTY, line.quantity + item.quantity) }
                  : line,
              ),
            }
          }
          return { lastAdded: item.productId, items: [...state.items, { ...item, key }] }
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((line) =>
            line.key === key ? { ...line, quantity: Math.max(1, Math.min(MAX_QTY, quantity)) } : line,
          ),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((line) => line.key !== key) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: 'ambre-cart', partialize: (state) => ({ items: state.items }) },
  ),
)

export const selectCount = (state: CartState): number =>
  state.items.reduce((sum, line) => sum + line.quantity, 0)

export const selectTotal = (state: CartState): number =>
  state.items.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
