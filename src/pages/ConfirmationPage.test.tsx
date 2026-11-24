import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmationPage } from './ConfirmationPage'

const baseProps = {
  orderId: 'ORD-20261124-AB12C',
  onBackToShopping: vi.fn(),
}

describe('ConfirmationPage', () => {
  it('displays the order number', () => {
    render(<ConfirmationPage {...baseProps} />)

    expect(screen.getByTestId('order-id')).toHaveTextContent(
      'ORD-20261124-AB12C',
    )
  })

  it('shows a success heading', () => {
    render(<ConfirmationPage {...baseProps} />)

    expect(
      screen.getByRole('heading', { name: /order confirmed/i }),
    ).toBeInTheDocument()
  })

  it('shows a thank-you message', () => {
    render(<ConfirmationPage {...baseProps} />)

    expect(screen.getByText(/thank you for your purchase/i)).toBeInTheDocument()
  })

  it('calls onBackToShopping when button is clicked', async () => {
    const user = userEvent.setup()
    const onBackToShopping = vi.fn()
    render(
      <ConfirmationPage
        orderId={baseProps.orderId}
        onBackToShopping={onBackToShopping}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: /back to shopping/i }),
    )

    expect(onBackToShopping).toHaveBeenCalledOnce()
  })
})
