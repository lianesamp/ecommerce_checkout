import { describe, expect, it } from 'vitest'
import type { CartItem } from '../types'
import {
  calcSubtotal,
  calcShipping,
  calcVAT,
  calcTotal,
  roundToTwo,
} from './pricing'

/**
 * TDD — PRICING LOGIC
 *
 * These are UNIT TESTS: pure input → output, no React, no DOM.
 * They run in ~1ms each. Perfect for exhaustive edge-case coverage.
 *
 * We test every function with:
 * - The normal/happy case
 * - Edge cases (empty input, zero, boundaries)
 * - Error cases where applicable
 *
 * Floating-point money gotcha:
 *   0.1 + 0.2 === 0.30000000000000004 in JavaScript.
 *   We handle this by rounding to 2 decimal places in our
 *   helper function roundToTwo(). Every money calculation
 *   goes through it.
 */

// --- Helper to build a CartItem quickly ---
function item(price: number, quantity: number): CartItem {
  return {
    product: {
      id: 'test',
      name: 'Test',
      price,
      image: '',
      category: 'test',
      description: '',
    },
    quantity,
  }
}

// ============================================================
// roundToTwo
// ============================================================
describe('roundToTwo', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundToTwo(1.005)).toBe(1.01)
    expect(roundToTwo(1.004)).toBe(1.0)
    expect(roundToTwo(10)).toBe(10)
  })

  it('handles the classic 0.1 + 0.2 problem', () => {
    expect(roundToTwo(0.1 + 0.2)).toBe(0.3)
  })

  it('returns 0 for 0', () => {
    expect(roundToTwo(0)).toBe(0)
  })
})

// ============================================================
// calcSubtotal
// ============================================================
describe('calcSubtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calcSubtotal([])).toBe(0)
  })

  it('returns price * quantity for one item', () => {
    expect(calcSubtotal([item(19.99, 2)])).toBe(39.98)
  })

  it('sums multiple items', () => {
    const items = [item(10, 1), item(20, 2), item(5.5, 3)]
    // 10 + 40 + 16.5 = 66.5
    expect(calcSubtotal(items)).toBe(66.5)
  })

  it('handles fractional prices without floating-point errors', () => {
    // 0.1 * 3 = 0.3 (not 0.30000000000000004)
    expect(calcSubtotal([item(0.1, 3)])).toBe(0.3)
  })

  it('handles large quantities', () => {
    expect(calcSubtotal([item(9.99, 100)])).toBe(999)
  })
})

// ============================================================
// calcShipping
// ============================================================
describe('calcShipping', () => {
  /**
   * Shipping rules:
   * - subtotal >= 50 → free (0)
   * - subtotal < 50  → standard flat rate (4.99)
   * - Canary Islands (postal codes starting with 35 or 38) → 9.99
   * - freeShipping coupon → 0 regardless
   */

  it('returns 0 when subtotal >= 50 (free shipping threshold)', () => {
    expect(calcShipping(50, '28001', false)).toBe(0)
    expect(calcShipping(100, '28001', false)).toBe(0)
  })

  it('returns standard rate (4.99) when subtotal < 50', () => {
    expect(calcShipping(49.99, '28001', false)).toBe(4.99)
    expect(calcShipping(0, '28001', false)).toBe(4.99)
  })

  it('returns Canary Islands rate (9.99) for 35xxx postal codes', () => {
    expect(calcShipping(30, '35001', false)).toBe(9.99)
  })

  it('returns Canary Islands rate (9.99) for 38xxx postal codes', () => {
    expect(calcShipping(30, '38005', false)).toBe(9.99)
  })

  it('Canary Islands rate applies even if subtotal >= 50', () => {
    // Canary Islands always costs 9.99 — the free threshold doesn't apply
    expect(calcShipping(100, '35001', false)).toBe(9.99)
  })

  it('returns 0 when freeShipping is true (coupon)', () => {
    expect(calcShipping(30, '28001', true)).toBe(0)
  })

  it('freeShipping coupon overrides even Canary Islands rate', () => {
    expect(calcShipping(30, '35001', true)).toBe(0)
  })
})

// ============================================================
// calcVAT
// ============================================================
describe('calcVAT', () => {
  it('calculates 21% VAT', () => {
    expect(calcVAT(100)).toBe(21)
  })

  it('rounds to 2 decimals', () => {
    // 33.33 * 0.21 = 6.9993 → 7.00
    expect(calcVAT(33.33)).toBe(7.0)
  })

  it('returns 0 for 0', () => {
    expect(calcVAT(0)).toBe(0)
  })
})

// ============================================================
// calcTotal
// ============================================================
describe('calcTotal', () => {
  it('sums subtotal + shipping + VAT - discount', () => {
    // 100 + 4.99 + 21 - 10 = 115.99
    expect(calcTotal(100, 4.99, 21, 10)).toBe(115.99)
  })

  it('works with zero discount', () => {
    expect(calcTotal(50, 0, 10.5, 0)).toBe(60.5)
  })

  it('never returns negative (discount exceeds sum)', () => {
    // If discount is somehow larger than everything else
    expect(calcTotal(10, 0, 2.1, 50)).toBe(0)
  })
})
