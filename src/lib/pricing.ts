import type { CartItem } from '../types'

/**
 * Round a number to 2 decimal places.
 *
 * Why: JavaScript floating-point arithmetic causes bugs like
 * 0.1 + 0.2 = 0.30000000000000004. For money calculations
 * we MUST round to avoid showing wrong prices.
 *
 * We use Math.round(x * 100) / 100 which handles most cases.
 * For a production payment system you'd use a library like
 * dinero.js or work in integer cents — but for this project
 * this approach is sufficient and simpler.
 */
export function roundToTwo(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/** Calculate the cart subtotal (sum of price * quantity). */
export function calcSubtotal(items: CartItem[]): number {
  const sum = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  return roundToTwo(sum)
}

/** Shipping rate constants in EUR. */
const STANDARD_SHIPPING = 4.99
const CANARY_ISLANDS_SHIPPING = 9.99
const FREE_SHIPPING_THRESHOLD = 50

/** Check if a postal code belongs to the Canary Islands (35xxx or 38xxx). */
function isCanaryIslands(postalCode: string): boolean {
  return postalCode.startsWith('35') || postalCode.startsWith('38')
}

/**
 * Calculate shipping cost.
 *
 * Rules:
 * - freeShipping coupon → 0 (overrides everything)
 * - Canary Islands (35xxx, 38xxx) → 9.99 (even above 50 EUR)
 * - subtotal >= 50 → free
 * - otherwise → 4.99 flat rate
 */
export function calcShipping(
  subtotal: number,
  postalCode: string,
  freeShipping: boolean,
): number {
  if (freeShipping) return 0
  if (isCanaryIslands(postalCode)) return CANARY_ISLANDS_SHIPPING
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return STANDARD_SHIPPING
}

/** Calculate 21% VAT (IVA in Spain), rounded to 2 decimals. */
export function calcVAT(amount: number): number {
  return roundToTwo(amount * 0.21)
}

/**
 * Calculate the order total.
 * Never returns negative — if discount exceeds the sum, returns 0.
 */
export function calcTotal(
  subtotal: number,
  shipping: number,
  vat: number,
  discount: number,
): number {
  const total = subtotal + shipping + vat - discount
  return roundToTwo(Math.max(0, total))
}
