import { create } from 'zustand'
import type { Product } from '../types'

export interface CartItem {
  productId: string
  name: string
  qty: number
  price: number
  taxRate: number
  subtotal: number
}

interface CartState {
  items: CartItem[]
  add: (product: Product) => void
  inc: (productId: string) => void
  dec: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
}

const calculateSubtotal = (qty: number, price: number) => Math.max(qty, 0) * price

export const useCartStore = create<CartState>((set) => ({
  items: [],

  add: (product: Product) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id)
      if (existing) {
        const nextItems = state.items.map((item) => {
          if (item.productId !== product.id) return item
          const nextQty = item.qty + 1
          return {
            ...item,
            qty: nextQty,
            subtotal: calculateSubtotal(nextQty, item.price),
          }
        })
        return { items: nextItems }
      }

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        qty: 1,
        price: product.sellPrice,
        taxRate: product.taxRate,
        subtotal: calculateSubtotal(1, product.sellPrice),
      }
      return { items: [...state.items, newItem] }
    })
  },

  inc: (productId: string) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.productId !== productId) return item
        const nextQty = item.qty + 1
        return {
          ...item,
          qty: nextQty,
          subtotal: calculateSubtotal(nextQty, item.price),
        }
      }),
    }))
  },

  dec: (productId: string) => {
    set((state) => {
      const nextItems = state.items
        .map((item) => {
          if (item.productId !== productId) return item
          const nextQty = item.qty - 1
          if (nextQty <= 0) return null
          return {
            ...item,
            qty: nextQty,
            subtotal: calculateSubtotal(nextQty, item.price),
          }
        })
        .filter(Boolean) as CartItem[]

      return { items: nextItems }
    })
  },

  setQty: (productId: string, qty: number) => {
    if (Number.isNaN(qty)) return

    set((state) => {
      if (qty <= 0) {
        return { items: state.items.filter((item) => item.productId !== productId) }
      }

      return {
        items: state.items.map((item) => {
          if (item.productId !== productId) return item
          return {
            ...item,
            qty,
            subtotal: calculateSubtotal(qty, item.price),
          }
        }),
      }
    })
  },

  clear: () => set({ items: [] }),
}))

export const selectCartItems = (state: CartState) => state.items

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.subtotal, 0)

export const selectCartTax = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.subtotal * (item.taxRate / 100), 0)

export const selectCartGrandTotal = (state: CartState) => {
  const subtotal = selectCartSubtotal(state)
  const tax = selectCartTax(state)
  return subtotal + tax
}
