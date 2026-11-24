import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContactStep } from './ContactStep'

/**
 * Testing forms with RTL:
 *
 * 1. Query inputs by their <label> text: screen.getByLabelText('Email')
 *    This ensures labels are properly associated with inputs (accessibility).
 *    If the label doesn't have htmlFor matching the input's id, the query fails.
 *
 * 2. Fill inputs with userEvent.type() — simulates real typing.
 *
 * 3. Click submit and use waitFor() to check for validation errors.
 *    RHF + Zod validation is async, so errors appear after a tick.
 *
 * 4. For the happy path, assert onSubmit was called with the form data.
 */

/** Helper to fill the entire form with valid data. */
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name'), 'María García')
  await user.type(screen.getByLabelText('Email'), 'maria@example.com')
  await user.type(screen.getByLabelText('Phone'), '612345678')
  await user.type(screen.getByLabelText('Address'), 'Calle Mayor 10')
  await user.type(screen.getByLabelText('City'), 'Madrid')
  await user.type(screen.getByLabelText('Province'), 'Madrid')
  await user.type(screen.getByLabelText('Postal Code'), '28001')
}

describe('ContactStep', () => {
  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    render(<ContactStep onSubmit={vi.fn()} />)

    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('Province is required')).toBeInTheDocument()
      expect(screen.getByText('Postal code is required')).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    const user = userEvent.setup()
    render(<ContactStep onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText('Enter a valid email address'),
      ).toBeInTheDocument()
    })
  })

  it('shows error for invalid Spanish postal code', async () => {
    const user = userEvent.setup()
    render(<ContactStep onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('Postal Code'), '1234') // 4 digits
    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText('Enter a valid Spanish postal code (5 digits)'),
      ).toBeInTheDocument()
    })
  })

  it('shows error for invalid phone number', async () => {
    const user = userEvent.setup()
    render(<ContactStep onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('Phone'), '12345') // too short
    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          /enter a valid spanish phone number/i,
        ),
      ).toBeInTheDocument()
    })
  })

  it('calls onSubmit with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactStep onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'María García',
        email: 'maria@example.com',
        phone: '612345678',
        postalCode: '28001',
      }),
      expect.anything(), // RHF passes the event as second arg
    )
  })

  it('does NOT call onSubmit when form is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactStep onSubmit={onSubmit} />)

    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('accepts a phone number with +34 prefix', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactStep onSubmit={onSubmit} />)

    await fillValidForm(user)
    // Clear and re-type phone with prefix
    await user.clear(screen.getByLabelText('Phone'))
    await user.type(screen.getByLabelText('Phone'), '+34612345678')
    await user.click(
      screen.getByRole('button', { name: /continue to shipping/i }),
    )

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })
  })
})
