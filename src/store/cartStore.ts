import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateCoupon } from '../lib/coupons'
import { calcSubtotal } from '../lib/pricing'
import type { CartItem, Coupon, Product } from '../types'

/**
 * Zustand cart store with localStorage persistence.
 *
 * Zustand vs Pinia (Vue):
 * - Pinia: define a store with state, getters, actions in separate sections.
 * - Zustand: define everything in one function. State + actions live together.
 *   No mutations vs actions distinction — just functions that call `set()`.
 *
 * The `persist` middleware wraps the store and automatically:
 * - Serializes state to localStorage on every change
 * - Rehydrates state from localStorage when the app loads
 * - Handles the case where localStorage is empty (uses initial state)
 *
 * We only persist `items` and `coupon` (the data we want to survive
 * page reloads). The computed functions are not persisted.
 */

interface CartState {
  // State
  items: CartItem[]
  coupon: Coupon | null

  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void

  // Computed (implemented as functions, not getters, for Zustand simplicity)
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      coupon: null,

      // Actions
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          )

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], coupon: null })
      },

      applyCoupon: (code) => {
        // validateCoupon throws on invalid/expired codes
        const coupon = validateCoupon(code)
        set({ coupon })
      },

      removeCoupon: () => {
        set({ coupon: null })
      },

      // Computed
      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      subtotal: () => {
        return calcSubtotal(get().items)
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      // Only persist data, not functions
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    },
  ),
)
