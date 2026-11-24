import { createBrowserRouter } from 'react-router'
import App from './App'
import { CatalogPage } from './pages/CatalogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'

/**
 * Application routes.
 *
 * App acts as the layout route (header + cart drawer).
 * Child routes render inside App's <Outlet />.
 *
 * Similar to Laravel's Route::group with a layout middleware,
 * or Vue Router's nested routes with a parent component.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: CatalogPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'confirmation/:orderId', Component: ConfirmationPage },
    ],
  },
])
