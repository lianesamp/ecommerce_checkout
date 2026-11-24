import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ShippingStep } from './ShippingStep'

describe('ShippingStep', () => {
  const baseProps = {
    postalCode: '28001',
    subtotal: 30,
    freeShipping: false,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  }

  it('shows standard (4.99) and express (7.99) for mainland below threshold', () => {
    render(<ShippingStep {...baseProps} />)

    expect(screen.getByText('Standard Shipping')).toBeInTheDocument()
    expect(screen.getByText('4.99 €')).toBeInTheDocument()
    expect(screen.getByText('Express Shipping')).toBeInTheDocument()
    expect(screen.getByText('7.99 €')).toBeInTheDocument()
  })

  it('shows free standard when subtotal >= 50', () => {
    render(<ShippingStep {...baseProps} subtotal={60} />)

    expect(screen.getByText('Standard Shipping')).toBeInTheDocument()
    // Standard is free, express still costs
    expect(screen.getAllByText('Free')).toHaveLength(1)
    expect(screen.getByText('7.99 €')).toBeInTheDocument()
  })

  it('shows only Canary Islands option for 35xxx postal code', () => {
    render(<ShippingStep {...baseProps} postalCode="35001" />)

    expect(screen.getByText('Canary Islands Shipping')).toBeInTheDocument()
    expect(screen.getByText('9.99 €')).toBeInTheDocument()
    expect(screen.queryByText('Standard Shipping')).not.toBeInTheDocument()
  })

  it('shows only Canary Islands option for 38xxx postal code', () => {
    render(<ShippingStep {...baseProps} postalCode="38005" />)

    expect(screen.getByText('Canary Islands Shipping')).toBeInTheDocument()
  })

  it('shows all free when freeShipping coupon is active', () => {
    render(<ShippingStep {...baseProps} freeShipping={true} />)

    const freeLabels = screen.getAllByText('Free')
    expect(freeLabels).toHaveLength(2) // standard + express both free
  })

  it('shows Canary Islands free with freeShipping coupon', () => {
    render(
      <ShippingStep
        {...baseProps}
        postalCode="35001"
        freeShipping={true}
      />,
    )

    expect(screen.getByText('Canary Islands Shipping')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('shows validation error when no method selected', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ShippingStep {...baseProps} onSubmit={onSubmit} />)

    await user.click(
      screen.getByRole('button', { name: /continue to review/i }),
    )

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Select a shipping method',
      )
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with selected method', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ShippingStep {...baseProps} onSubmit={onSubmit} />)

    await user.click(screen.getByText('Standard Shipping'))
    await user.click(
      screen.getByRole('button', { name: /continue to review/i }),
    )

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })
    expect(onSubmit).toHaveBeenCalledWith(
      { methodId: 'standard' },
      expect.anything(),
    )
  })

  it('calls onBack when Back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<ShippingStep {...baseProps} onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(onBack).toHaveBeenCalledOnce()
  })
})
