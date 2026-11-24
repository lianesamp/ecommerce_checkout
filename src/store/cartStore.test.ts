import { afterEach, describe, expect, it } from 'vitest'
import type { Product } from '../types'
import { useCartStore } from './cartStore'

/**
 * Testing Zustand stores WITHOUT React.
 *
 * Since Zustand stores are plain JavaScript, we can test them
 * by calling getState() and setState() directly — no need to
 * render a component, use renderHook(), or set up providers.
 *
 * This is a major advantage over Redux or Context-based stores
 * which require a React tree to test.
 *
 * We reset the store between tests with store.setState() to
 * avoid test pollution (one test's data leaking into the next).
 */

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Headphones',
  price: 59.99,
  image: '',
  category: 'electronics',
  description: 'Test product',
}

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Test Hub',
  price: 34.99,
  image: '',
  category: 'electronics',
  description: 'Test product 2',
}

afterEach(() => {
  // Reset store to initial state between tests
  useCartStore.setState({
    items: [],
    coupon: null,
  })
})

describe('cartStore — addItem', () => {
  it('adds a new product to the cart', () => {
    useCartStore.getState().addItem(mockProduct)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('prod-1')
    expect(items[0].quantity).toBe(1)
  })

  it('increments quantity if product already in cart', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('adds different products as separate items', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct2)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(2)
  })
})

describe('cartStore — removeItem', () => {
  it('removes an item by product id', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct2)
    useCartStore.getState().removeItem('prod-1')

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('prod-2')
  })

  it('does nothing if product id not found', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().removeItem('nonexistent')

    expect(useCartStore.getState().items).toHaveLength(1)
  })
})

describe('cartStore — updateQuantity', () => {
  it('updates quantity for a given product', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity('prod-1', 5)

    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes the item if quantity is set to 0', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity('prod-1', 0)

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes the item if quantity is negative', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().updateQuantity('prod-1', -1)

    expect(useCartStore.getState().items).toHaveLength(0)
  })
})

describe('cartStore — clearCart', () => {
  it('removes all items and coupon', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct2)
    useCartStore.getState().applyCoupon('WELCOME10')
    useCartStore.getState().clearCart()

    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
    expect(state.coupon).toBeNull()
  })
})

describe('cartStore — applyCoupon / removeCoupon', () => {
  it('applies a valid coupon', () => {
    useCartStore.getState().applyCoupon('WELCOME10')

    const { coupon } = useCartStore.getState()
    expect(coupon).not.toBeNull()
    expect(coupon!.code).toBe('WELCOME10')
  })

  it('throws for an invalid coupon', () => {
    expect(() => useCartStore.getState().applyCoupon('FAKE')).toThrow(
      'Invalid coupon code',
    )
    expect(useCartStore.getState().coupon).toBeNull()
  })

  it('removes a coupon', () => {
    useCartStore.getState().applyCoupon('WELCOME10')
    useCartStore.getState().removeCoupon()

    expect(useCartStore.getState().coupon).toBeNull()
  })
})

describe('cartStore — computed: itemCount', () => {
  it('returns 0 for empty cart', () => {
    expect(useCartStore.getState().itemCount()).toBe(0)
  })

  it('sums all quantities', () => {
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct)
    useCartStore.getState().addItem(mockProduct2)

    // 2 headphones + 1 hub = 3
    expect(useCartStore.getState().itemCount()).toBe(3)
  })
})

describe('cartStore — computed: subtotal', () => {
  it('returns 0 for empty cart', () => {
    expect(useCartStore.getState().subtotal()).toBe(0)
  })

  it('calculates subtotal using pricing logic', () => {
    useCartStore.getState().addItem(mockProduct) // 59.99
    useCartStore.getState().addItem(mockProduct2) // 34.99

    expect(useCartStore.getState().subtotal()).toBe(94.98)
  })
})
