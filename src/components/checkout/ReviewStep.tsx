import { applyCouponDiscount } from '../../lib/coupons'
import { calcShipping, calcSubtotal, calcTotal, calcVAT } from '../../lib/pricing'
import { getShippingMethods } from '../../lib/shipping'
import type { CartItem, ContactData, Coupon, ShippingMethodId } from '../../types'
import { OrderSummary } from './OrderSummary'

interface ReviewStepProps {
  items: CartItem[]
  contact: ContactData
  shippingMethodId: ShippingMethodId
  coupon: Coupon | null
  onPlaceOrder: () => void
  onBack: () => void
}

export function ReviewStep({
  items,
  contact,
  shippingMethodId,
  coupon,
  onPlaceOrder,
  onBack,
}: ReviewStepProps) {
  const subtotal = calcSubtotal(items)

  const couponResult = coupon
    ? applyCouponDiscount(subtotal, coupon)
    : { discount: 0, freeShipping: false }

  const shippingMethods = getShippingMethods(
    contact.postalCode,
    subtotal,
    couponResult.freeShipping,
  )
  const selectedMethod = shippingMethods.find((m) => m.id === shippingMethodId)
  const shipping = selectedMethod
    ? selectedMethod.price
    : calcShipping(subtotal, contact.postalCode, couponResult.freeShipping)

  const taxableAmount = subtotal - couponResult.discount + shipping
  const vat = calcVAT(taxableAmount)
  const total = calcTotal(subtotal, shipping, vat, couponResult.discount)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>

      {/* Contact info summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Shipping to
        </h3>
        <p className="text-sm text-gray-600">
          {contact.fullName}<br />
          {contact.address}<br />
          {contact.postalCode} {contact.city}, {contact.province}<br />
          {contact.phone} &middot; {contact.email}
        </p>
      </div>

      {/* Shipping method summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Shipping method
        </h3>
        <p className="text-sm text-gray-600">
          {selectedMethod?.name ?? 'Standard Shipping'}{' '}
          ({selectedMethod?.estimatedDays ?? '3-5 business days'})
        </p>
      </div>

      {/* Order summary with full price breakdown */}
      <OrderSummary
        items={items}
        subtotal={subtotal}
        discount={couponResult.discount}
        shipping={shipping}
        vat={vat}
        total={total}
        couponCode={coupon?.code}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
