import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { queryClient } from './api/queryClient'
import { CartDrawer } from './components/cart/CartDrawer'
import { useCartStore } from './store/cartStore'

/**
 * App shell — layout route that wraps all pages.
 *
 * Renders the header (with cart icon) and <Outlet /> where
 * child routes (CatalogPage, CheckoutPage, ConfirmationPage)
 * are rendered by React Router.
 *
 * In Vue Router terms, this is the parent component with
 * <router-view /> inside it.
 */
function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Checkout Store
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Child route renders here */}
        <Outlet />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            navigate('/checkout')
          }}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
