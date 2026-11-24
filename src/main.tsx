import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { router } from './router'

/**
 * Enable MSW mocking before rendering the app.
 *
 * In development: MSW registers a Service Worker that intercepts
 * fetch() calls in the browser.
 *
 * In production: we also enable it via VITE_ENABLE_MOCKS env var
 * because this is a portfolio demo with no real backend.
 *
 * The async import ensures the MSW code is NOT included in the
 * production bundle when mocks are disabled.
 */
async function enableMocking() {
  const shouldMock =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'

  if (!shouldMock) return

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledFrame: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
