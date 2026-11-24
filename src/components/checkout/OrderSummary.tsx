import type { CartItem } from '../../types'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  vat: number
  total: number
  couponCode?: string
}

/**
 * Reusable price breakdown sidebar. Used in ReviewStep and
 * could be reused on the confirmation page.
 */
export function OrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  vat,
  total,
  couponCode,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

      {/* Item list */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.product.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} &times; {item.quantity}
            </span>
            <span className="text-gray-900 font-medium">
              {(item.product.price * item.quantity).toFixed(2)} &euro;
            </span>
          </li>
        ))}
      </ul>

      <hr className="border-gray-200" />

      {/* Price breakdown */}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="text-gray-900 font-medium">{subtotal.toFixed(2)} &euro;</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <dt>
              Discount{couponCode && ` (${couponCode})`}
            </dt>
            <dd className="font-medium">-{discount.toFixed(2)} &euro;</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="text-gray-900 font-medium">
            {shipping === 0 ? 'Free' : `${shipping.toFixed(2)} €`}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-600">VAT (21%)</dt>
          <dd className="text-gray-900 font-medium">{vat.toFixed(2)} &euro;</dd>
        </div>
      </dl>

      <hr className="border-gray-200" />

      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>{total.toFixed(2)} &euro;</span>
      </div>
    </div>
  )
}
