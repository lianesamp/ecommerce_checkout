import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { CartItem } from './CartItem'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const subtotal = useCartStore((s) => s.subtotal)
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')

  function handleApplyCoupon() {
    setCouponError('')
    try {
      applyCoupon(couponInput.trim())
      setCouponInput('')
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Invalid coupon')
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                Your cart is empty
              </p>
            ) : (
              items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))
            )}
          </div>

          {/* Footer: coupon + subtotal + checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-4 space-y-4">
              {/* Coupon input */}
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                  <span className="text-sm text-green-700">
                    Coupon <strong>{coupon.code}</strong> applied
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-sm text-green-600 hover:text-green-800 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      aria-label="Coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600 mt-1" role="alert">
                      {couponError}
                    </p>
                  )}
                </div>
              )}

              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>{subtotal().toFixed(2)} &euro;</span>
              </div>

              {/* Checkout button */}
              <button
                type="button"
                onClick={onCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
