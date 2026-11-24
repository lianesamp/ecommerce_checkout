interface ConfirmationPageProps {
  orderId: string
  onBackToShopping: () => void
}

export function ConfirmationPage({
  orderId,
  onBackToShopping,
}: ConfirmationPageProps) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6 text-green-500 text-6xl" aria-hidden="true">
        ✓
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Order confirmed!
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order number is:
      </p>

      <p
        className="text-xl font-mono font-semibold text-indigo-600 mb-8"
        data-testid="order-id"
      >
        {orderId}
      </p>

      <p className="text-sm text-gray-500 mb-8">
        You will receive a confirmation email shortly.
      </p>

      <button
        type="button"
        onClick={onBackToShopping}
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Back to shopping
      </button>
    </main>
  )
}
