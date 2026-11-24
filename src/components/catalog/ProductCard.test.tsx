import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { useCartStore } from '../../store/cartStore'
import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

/**
 * COMPONENT TEST — key concepts:
 *
 * render()     — from RTL. Renders a React component into jsdom
 *                (the fake browser DOM). Like mounting a Vue component
 *                in a test with `mount()` from Vue Test Utils.
 *
 * screen       — the "rendered page". Query it like a real user would:
 *                screen.getByRole('button', { name: /add to cart/i })
 *                NOT by CSS class or test-id. This catches accessibility
 *                bugs for free — if your button isn't a <button>, the
 *                query fails.
 *
 * userEvent    — simulates real user behavior: click, type, hover.
 *                Unlike fireEvent (which dispatches one synthetic event),
 *                userEvent simulates the full browser sequence (focus,
 *                mousedown, mouseup, click). Always prefer userEvent.
 *
 * RTL philosophy: "The more your tests resemble the way your software
 * is used, the more confidence they can give you."
 */

const mockProduct: Product = {
  id: 'prod-test',
  name: 'Wireless Headphones',
  price: 59.99,
  image: 'https://example.com/headphones.jpg',
  category: 'electronics',
  description: 'Great headphones for testing.',
}

afterEach(() => {
  useCartStore.setState({ items: [], coupon: null })
})

describe('ProductCard', () => {
  it('renders product name, price and category', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('59.99 €')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
  })

  it('renders the product image with alt text', () => {
    render(<ProductCard product={mockProduct} />)

    const img = screen.getByRole('img', { name: 'Wireless Headphones' })
    expect(img).toHaveAttribute('src', mockProduct.image)
  })

  it('adds the product to the cart when "Add to cart" is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /add to cart/i })
    await user.click(button)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('prod-test')
    expect(items[0].quantity).toBe(1)
  })

  it('increments quantity when clicked twice', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const button = screen.getByRole('button', { name: /add to cart/i })
    await user.click(button)
    await user.click(button)

    const { items } = useCartStore.getState()
    expect(items[0].quantity).toBe(2)
  })
})
