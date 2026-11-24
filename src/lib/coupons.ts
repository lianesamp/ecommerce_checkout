import type { Coupon } from '../types'
import { roundToTwo } from './pricing'

/**
 * Coupon "database" — in a real app this would come from an API.
 * We define them here as a static list for the portfolio demo.
 */
const COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
  },
  {
    code: 'FREESHIP',
    type: 'free-shipping',
  },
  {
    code: 'EXPIRED10',
    type: 'percentage',
    value: 10,
    expiresAt: new Date('2024-01-01'), // Already expired
  },
]

/**
 * Validate a coupon code and return the coupon if valid.
 * Throws an error for invalid or expired codes.
 *
 * Case-insensitive: "welcome10" matches "WELCOME10".
 */
export function validateCoupon(code: string): Coupon {
  const normalized = code.toUpperCase().trim()

  const coupon = COUPONS.find((c) => c.code === normalized)

  if (!coupon) {
    throw new Error('Invalid coupon code')
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error('This coupon has expired')
  }

  return coupon
}

interface CouponResult {
  discount: number
  freeShipping: boolean
}

/**
 * Apply a validated coupon to a subtotal.
 *
 * - Percentage coupons: discount = subtotal * (value / 100)
 * - Free shipping coupons: discount = 0, freeShipping = true
 *
 * The discount is capped at the subtotal (can't go negative).
 */
export function applyCouponDiscount(
  subtotal: number,
  coupon: Coupon,
): CouponResult {
  if (coupon.type === 'free-shipping') {
    return { discount: 0, freeShipping: true }
  }

  const rawDiscount = subtotal * ((coupon.value ?? 0) / 100)
  const discount = roundToTwo(Math.min(rawDiscount, subtotal))

  return { discount, freeShipping: false }
}
