import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCartStore } from '../../store/cartStore'
import type { Product } from '../../types'
import { CartDrawer } from './CartDrawer'

/**
 * NEW CONCEPT: vi.fn() — a "spy" function.
 *
 * A spy records every call made to it (how many times, with what
 * arguments) so you can assert on it later. It doesn't DO anything
 * by default — it just watches.
 *
 * Mock vs Stub vs Spy:
 * - Stub: returns a fixed value. "If someone calls getPrice(), return 10."
 * - Spy: watches calls to a real function. "Was onClick called? How many times?"
 * - Mock: a broader term — an object that replaces a real dependency with
 *   controlled behavior. Can include stubs and spies.
 *
 * In Vitest: vi.fn() creates a spy. vi.fn(() => 42) creates a stub.
 * vi.mock('./module') mocks an entire module.
 */

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Wireless Headphones',
  price: 59.99,
  image: 'https://example.com/img.jpg',
  category: 'electronics',
  description: 'Test',
}

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'USB-C Hub',
  price: 34.99,
  image: 'https://example.com/img2.jpg',
  category: 'electronics',
  description: 'Test 2',
}

afterEach(() => {
  useCartStore.setState({ items: [], coupon: null })
})

describe('CartDrawer', () => {
  it('shows "Your cart is empty" when cart has no items', () => {
    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('renders cart items with names and prices', () => {
    useCartStore.setState({
      items: [
        { product: mockProduct, quantity: 1 },
        { product: mockProduct2, quantity: 2 },
      ],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('USB-C Hub')).toBeInTheDocument()
  })

  it('displays the subtotal', () => {
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 2 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    // 59.99 * 2 = 119.98
    expect(screen.getByText('119.98 €')).toBeInTheDocument()
  })

  it('increases quantity when + is clicked', async () => {
    const user = userEvent.setup()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /increase quantity of wireless headphones/i,
      }),
    )

    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('removes item when - is clicked at quantity 1', async () => {
    const user = userEvent.setup()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /decrease quantity of wireless headphones/i,
      }),
    )

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes item when × is clicked', async () => {
    const user = userEvent.setup()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 3 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    await user.click(
      screen.getByRole('button', {
        name: /remove wireless headphones from cart/i,
      }),
    )

    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('applies a valid coupon', async () => {
    const user = userEvent.setup()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    await user.type(screen.getByLabelText('Coupon code'), 'WELCOME10')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(screen.getByText(/WELCOME10/)).toBeInTheDocument()
    expect(screen.getByText(/applied/)).toBeInTheDocument()
  })

  it('shows error for invalid coupon', async () => {
    const user = userEvent.setup()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={vi.fn()} />,
    )

    await user.type(screen.getByLabelText('Coupon code'), 'FAKE')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid coupon code')
  })

  it('calls onCheckout when "Proceed to Checkout" is clicked', async () => {
    const user = userEvent.setup()
    const onCheckout = vi.fn()
    useCartStore.setState({
      items: [{ product: mockProduct, quantity: 1 }],
    })

    render(
      <CartDrawer isOpen={true} onClose={vi.fn()} onCheckout={onCheckout} />,
    )

    await user.click(
      screen.getByRole('button', { name: /proceed to checkout/i }),
    )

    expect(onCheckout).toHaveBeenCalledOnce()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <CartDrawer isOpen={true} onClose={onClose} onCheckout={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /close cart/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
