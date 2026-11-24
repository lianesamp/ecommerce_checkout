import type { ShippingMethod } from '../types'

/**
 * Build the available shipping methods based on the customer's
 * postal code, cart subtotal, and coupon status.
 *
 * Rules:
 * - Canary Islands (35xxx, 38xxx): only "canary-islands" option at 9.99
 * - freeShipping coupon: all options show 0.00
 * - subtotal >= 50: standard is free, express still costs
 * - otherwise: standard 4.99, express 7.99
 */
export function getShippingMethods(
  postalCode: string,
  subtotal: number,
  freeShipping: boolean,
): ShippingMethod[] {
  const isCanary =
    postalCode.startsWith('35') || postalCode.startsWith('38')

  if (isCanary) {
    return [
      {
        id: 'canary-islands',
        name: 'Canary Islands Shipping',
        price: freeShipping ? 0 : 9.99,
        estimatedDays: '5-7 business days',
      },
    ]
  }

  const standardFree = freeShipping || subtotal >= 50

  return [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: standardFree ? 0 : 4.99,
      estimatedDays: '3-5 business days',
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: freeShipping ? 0 : 7.99,
      estimatedDays: '1-2 business days',
    },
  ]
}
