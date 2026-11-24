import { expect, test } from '@playwright/test'

/**
 * E2E happy path: add product → apply coupon → complete all 3 checkout
 * steps → reach the confirmation page.
 *
 * This test runs in a real Chromium browser against the production build
 * (with MSW serving mock data). It's the closest thing to a real user
 * clicking through the app.
 *
 * Compare with Laravel Dusk: same idea, but Playwright is faster and
 * doesn't need Selenium.
 */
test('complete checkout happy path', async ({ page }) => {
  // 1. Load the catalog
  await page.goto('/')

  // Wait for products to load (MSW serves them)
  await expect(page.getByText('Wireless Headphones')).toBeVisible()

  // 2. Add a product to the cart
  const firstAddButton = page.getByRole('button', { name: 'Add to cart' }).first()
  await firstAddButton.click()

  // Cart badge should show "1"
  await expect(page.getByLabel('Open cart')).toContainText('1')

  // 3. Open the cart drawer
  await page.getByLabel('Open cart').click()
  await expect(page.getByRole('dialog', { name: 'Shopping cart' })).toBeVisible()

  // 4. Apply a coupon
  await page.getByLabel('Coupon code').fill('WELCOME10')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByText('WELCOME10')).toBeVisible()

  // 5. Proceed to checkout
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click()

  // Should be on /checkout, step 1
  await expect(page).toHaveURL('/checkout')
  await expect(page.getByRole('heading', { name: 'Contact & Shipping Address' })).toBeVisible()

  // 6. Fill the contact form — scope to <form> to avoid cart drawer elements
  const form = page.locator('form')
  await form.getByLabel('Full Name').fill('María García')
  await form.getByLabel('Email').fill('maria@example.com')
  await form.getByLabel('Phone').fill('612345678')
  await form.getByLabel('Address').fill('Calle Mayor 10')
  await form.getByLabel('City').fill('Madrid')
  await form.getByLabel('Province').fill('Madrid')
  await form.getByLabel('Postal Code').fill('28001')
  await page.getByRole('button', { name: 'Continue to Shipping' }).click()

  // 7. Step 2: select a shipping method
  await expect(page.getByRole('heading', { name: 'Shipping Method' })).toBeVisible()
  // Subtotal is 59.99 >= 50 so "Standard Shipping" should be free
  await page.getByLabel(/Standard Shipping/).click()
  await page.getByRole('button', { name: 'Continue to Review' }).click()

  // 8. Step 3: review the order
  await expect(page.getByText('Review Your Order')).toBeVisible()
  await expect(page.getByText('María García')).toBeVisible()
  await expect(page.getByText('Wireless Headphones').first()).toBeVisible()

  // 9. Place the order
  await page.getByRole('button', { name: 'Place Order' }).click()

  // 10. Confirmation page
  await expect(page.getByRole('heading', { name: 'Order confirmed!' })).toBeVisible()
  await expect(page.getByTestId('order-id')).toContainText('ORD-')
  await expect(page).toHaveURL(/\/confirmation\/ORD-/)
})
