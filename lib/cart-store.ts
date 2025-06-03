import { create } from "zustand"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setItems: (items: CartItem[]) => void
  clearCart: () => void
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id)
    if (!existing) {
      const updated = [...get().items, item]
      set({ items: updated })
    }
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i.id !== id)
    set({ items: updated })
  },

  updateQuantity: (id, quantity) => {
    const updated = get().items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
    set({ items: updated })
  },

  clearCart: () => {
    set({ items: [] })
  },
}));  