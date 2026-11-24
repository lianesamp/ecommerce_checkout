import { ContactStep } from '../components/checkout/ContactStep'
import { ReviewStep } from '../components/checkout/ReviewStep'
import { ShippingStep } from '../components/checkout/ShippingStep'
import { StepIndicator } from '../components/checkout/StepIndicator'
import { generateOrderNumber } from '../lib/orderNumber'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'

interface CheckoutPageProps {
  onOrderPlaced: (orderId: string) => void
}

export function CheckoutPage({ onOrderPlaced }: CheckoutPageProps) {
  const currentStep = useCheckoutStore((s) => s.currentStep)
  const contactData = useCheckoutStore((s) => s.contactData)
  const shippingMethodId = useCheckoutStore((s) => s.shippingMethodId)
  const setContactData = useCheckoutStore((s) => s.setContactData)
  const setShippingMethodId = useCheckoutStore((s) => s.setShippingMethodId)
  const goToStep = useCheckoutStore((s) => s.goToStep)
  const resetCheckout = useCheckoutStore((s) => s.reset)

  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const subtotal = useCartStore((s) => s.subtotal)
  const clearCart = useCartStore((s) => s.clearCart)

  function handlePlaceOrder() {
    const orderId = generateOrderNumber()
    clearCart()
    resetCheckout()
    onOrderPlaced(orderId)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <ContactStep
          defaultValues={contactData ?? undefined}
          onSubmit={setContactData}
        />
      )}

      {currentStep === 2 && contactData && (
        <ShippingStep
          postalCode={contactData.postalCode}
          subtotal={subtotal()}
          freeShipping={coupon?.type === 'free-shipping'}
          defaultValues={
            shippingMethodId ? { methodId: shippingMethodId } : undefined
          }
          onSubmit={(data) => setShippingMethodId(data.methodId)}
          onBack={() => goToStep(1)}
        />
      )}

      {currentStep === 3 && contactData && shippingMethodId && (
        <ReviewStep
          items={items}
          contact={contactData}
          shippingMethodId={shippingMethodId}
          coupon={coupon}
          onPlaceOrder={handlePlaceOrder}
          onBack={() => goToStep(2)}
        />
      )}
    </main>
  )
}
