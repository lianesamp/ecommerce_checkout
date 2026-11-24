import { describe, expect, it } from 'vitest'
import { validateCoupon, applyCouponDiscount } from './coupons'

describe('validateCoupon', () => {
  it('returns the coupon for a valid WELCOME10 code', () => {
    const coupon = validateCoupon('WELCOME10')
    expect(coupon.code).toBe('WELCOME10')
    expect(coupon.type).toBe('percentage')
    expect(coupon.value).toBe(10)
  })

  it('returns the coupon for a valid FREESHIP code', () => {
    const coupon = validateCoupon('FREESHIP')
    expect(coupon.code).toBe('FREESHIP')
    expect(coupon.type).toBe('free-shipping')
  })

  it('is case-insensitive', () => {
    expect(validateCoupon('welcome10').code).toBe('WELCOME10')
    expect(validateCoupon('Welcome10').code).toBe('WELCOME10')
    expect(validateCoupon('freeship').code).toBe('FREESHIP')
  })

  it('throws for an invalid code', () => {
    expect(() => validateCoupon('NOTREAL')).toThrow('Invalid coupon code')
  })

  it('throws for an empty string', () => {
    expect(() => validateCoupon('')).toThrow('Invalid coupon code')
  })

  it('throws for an expired coupon', () => {
    // EXPIRED10 is defined as expired in our coupon "database"
    expect(() => validateCoupon('EXPIRED10')).toThrow('expired')
  })
})

describe('applyCouponDiscount', () => {
  /**
   * Applies a validated coupon to a subtotal.
   * Returns { discount, freeShipping }.
   */

  it('applies 10% off for WELCOME10', () => {
    const coupon = validateCoupon('WELCOME10')
    const result = applyCouponDiscount(100, coupon)
    expect(result.discount).toBe(10)
    expect(result.freeShipping).toBe(false)
  })

  it('rounds the discount to 2 decimals', () => {
    const coupon = validateCoupon('WELCOME10')
    // 10% of 33.33 = 3.333 → 3.33
    const result = applyCouponDiscount(33.33, coupon)
    expect(result.discount).toBe(3.33)
  })

  it('returns freeShipping true for FREESHIP', () => {
    const coupon = validateCoupon('FREESHIP')
    const result = applyCouponDiscount(100, coupon)
    expect(result.discount).toBe(0)
    expect(result.freeShipping).toBe(true)
  })

  it('discount never exceeds the subtotal', () => {
    const coupon = validateCoupon('WELCOME10')
    // 10% of 5 = 0.5 — just checking it doesn't go negative
    const result = applyCouponDiscount(5, coupon)
    expect(result.discount).toBe(0.5)
    expect(result.discount).toBeLessThanOrEqual(5)
  })

  it('handles zero subtotal', () => {
    const coupon = validateCoupon('WELCOME10')
    const result = applyCouponDiscount(0, coupon)
    expect(result.discount).toBe(0)
  })
})
