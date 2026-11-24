import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CartItem, ContactData, Coupon } from '../../types'
import { ReviewStep } from './ReviewStep'

const mockItems: CartItem[] = [
  {
    product: {
      id: 'prod-1',
      name: 'Wireless Headphones',
      price: 59.99,
      image: '',
      category: 'electronics',
      description: '',
    },
    quantity: 1,
  },
  {
    product: {
      id: 'prod-2',
      name: 'USB-C Hub',
      price: 34.99,
      image: '',
      category: 'electronics',
      description: '',
    },
    quantity: 1,
  },
]

const mockContact: ContactData = {
  fullName: 'María García',
  email: 'maria@example.com',
  phone: '612345678',
  address: 'Calle Mayor 10',
  city: 'Madrid',
  province: 'Madrid',
  postalCode: '28001',
}

const baseProps = {
  items: mockItems,
  contact: mockContact,
  shippingMethodId: 'standard' as const,
  coupon: null,
  onPlaceOrder: vi.fn(),
  onBack: vi.fn(),
}

describe('ReviewStep', () => {
  it('displays contact info', () => {
    render(<ReviewStep {...baseProps} />)

    expect(screen.getByText(/María García/)).toBeInTheDocument()
    expect(screen.getByText(/Calle Mayor 10/)).toBeInTheDocument()
    expect(screen.getByText(/28001/)).toBeInTheDocument()
  })

  it('displays items in the order summary', () => {
    render(<ReviewStep {...baseProps} />)

    expect(screen.getByText(/Wireless Headphones/)).toBeInTheDocument()
    expect(screen.getByText(/USB-C Hub/)).toBeInTheDocument()
  })

  it('shows correct subtotal', () => {
    render(<ReviewStep {...baseProps} />)

    // 59.99 + 34.99 = 94.98, subtotal >= 50 so shipping is free
    expect(screen.getByText('94.98 €')).toBeInTheDocument()
  })

  it('shows free shipping when subtotal >= 50', () => {
    render(<ReviewStep {...baseProps} />)

    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('shows discount when coupon applied', () => {
    const coupon: Coupon = { code: 'WELCOME10', type: 'percentage', value: 10 }
    render(<ReviewStep {...baseProps} coupon={coupon} />)

    // 10% of 94.98 = 9.50
    expect(screen.getByText(/-9.50 €/)).toBeInTheDocument()
    expect(screen.getByText(/WELCOME10/)).toBeInTheDocument()
  })

  it('shows VAT (21%)', () => {
    render(<ReviewStep {...baseProps} />)

    // subtotal 94.98, shipping 0, taxable = 94.98, VAT = 94.98 * 0.21 = 19.95
    expect(screen.getByText('19.95 €')).toBeInTheDocument()
  })

  it('calls onPlaceOrder when button is clicked', async () => {
    const user = userEvent.setup()
    const onPlaceOrder = vi.fn()
    render(<ReviewStep {...baseProps} onPlaceOrder={onPlaceOrder} />)

    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(onPlaceOrder).toHaveBeenCalledOnce()
  })

  it('calls onBack when Back is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<ReviewStep {...baseProps} onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalledOnce()
  })
})
