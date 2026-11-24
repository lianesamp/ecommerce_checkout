import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { ConfirmationPage } from './ConfirmationPage'

/**
 * Helper that renders ConfirmationPage inside a test router.
 *
 * Since the component reads `orderId` from route params (useParams),
 * we need a router context. MemoryRouter lets us set the initial URL
 * without a real browser — similar to Laravel's `$this->get('/url')`.
 */
function renderWithRouter(orderId: string) {
  const router = createMemoryRouter(
    [{ path: '/confirmation/:orderId', Component: ConfirmationPage }],
    { initialEntries: [`/confirmation/${orderId}`] },
  )
  return render(<RouterProvider router={router} />)
}

describe('ConfirmationPage', () => {
  it('displays the order number from route params', () => {
    renderWithRouter('ORD-20261124-AB12C')

    expect(screen.getByTestId('order-id')).toHaveTextContent(
      'ORD-20261124-AB12C',
    )
  })

  it('shows a success heading', () => {
    renderWithRouter('ORD-20261124-AB12C')

    expect(
      screen.getByRole('heading', { name: /order confirmed/i }),
    ).toBeInTheDocument()
  })

  it('shows a thank-you message', () => {
    renderWithRouter('ORD-20261124-AB12C')

    expect(screen.getByText(/thank you for your purchase/i)).toBeInTheDocument()
  })

  it('has a Back to shopping button', async () => {
    const user = userEvent.setup()
    renderWithRouter('ORD-20261124-AB12C')

    // We can't easily assert navigate('/') was called without mocking,
    // but we verify the button exists and is clickable (no errors thrown)
    await user.click(
      screen.getByRole('button', { name: /back to shopping/i }),
    )
  })
})
