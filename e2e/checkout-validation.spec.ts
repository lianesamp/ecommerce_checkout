import { expect, test } from '@playwright/test'

/**
 * E2E validation test: verifies that form errors display correctly
 * and that invalid coupons are rejected.
 *
 * This complements the happy path by testing the "unhappy" paths —
 * the error states a real user might trigger.
 */

test.describe('checkout validation errors', () => {
  test.beforeEach(async ({ page }) => {
    // Add a product and go to checkout
    await page.goto('/')
    await expect(page.getByText('Wireless Headphones')).toBeVisible()
    await page.getByRole('button', { name: 'Add to cart' }).first().click()
    await page.getByLabel('Open cart').click()
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click()
    await expect(page).toHaveURL('/checkout')
  })

  test('shows validation errors on empty contact form submission', async ({
    page,
  }) => {
    // Submit the form without filling anything
    await page.getByRole('button', { name: 'Continue to Shipping' }).click()

    // Should show required field errors (not advance to step 2)
    await expect(page.getByText('Full name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()

    // Still on step 1
    await expect(
      page.getByRole('heading', { name: 'Contact & Shipping Address' }),
    ).toBeVisible()
  })

  test('shows error for invalid postal code', async ({ page }) => {
    // Fill all fields but with an invalid postal code — scope to form
    const form = page.locator('form')
    await form.getByLabel('Full Name').fill('Test User')
    await form.getByLabel('Email').fill('test@example.com')
    await form.getByLabel('Phone').fill('612345678')
    await form.getByLabel('Address').fill('Some Street 1')
    await form.getByLabel('City').fill('Madrid')
    await form.getByLabel('Province').fill('Madrid')
    await form.getByLabel('Postal Code').fill('123') // Too short

    await page.getByRole('button', { name: 'Continue to Shipping' }).click()

    await expect(page.getByText(/5 digits/i)).toBeVisible()
  })

  test('shows error for expired coupon', async ({ page }) => {
    // Go back to catalog to test coupon in the cart
    await page.getByText('Checkout Store').click()
    await page.getByLabel('Open cart').click()

    await page.getByLabel('Coupon code').fill('EXPIRED10')
    await page.getByRole('button', { name: 'Apply' }).click()

    await expect(page.getByRole('alert')).toContainText(/expired/i)
  })

  test('shows error for shipping method not selected', async ({ page }) => {
    // Fill contact form correctly to get to step 2 — scope to form
    const form = page.locator('form')
    await form.getByLabel('Full Name').fill('Test User')
    await form.getByLabel('Email').fill('test@example.com')
    await form.getByLabel('Phone').fill('612345678')
    await form.getByLabel('Address').fill('Some Street 1')
    await form.getByLabel('City').fill('Madrid')
    await form.getByLabel('Province').fill('Madrid')
    await form.getByLabel('Postal Code').fill('28001')
    await page.getByRole('button', { name: 'Continue to Shipping' }).click()

    // Now on step 2 — click Continue without selecting a method
    await expect(page.getByRole('heading', { name: 'Shipping Method' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue to Review' }).click()

    // Should show validation error
    await expect(page.getByRole('alert')).toBeVisible()
  })
})
