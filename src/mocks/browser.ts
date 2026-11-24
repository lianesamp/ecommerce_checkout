import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Browser worker — used during development (npm run dev).
 *
 * setupWorker registers a Service Worker that intercepts fetch() calls
 * in the real browser. When you open DevTools > Network, you'll see
 * the requests go out and get "mocked" responses — it looks exactly
 * like a real API.
 *
 * This is different from setupServer (see server.ts) which runs in
 * Node.js for tests.
 */
export const worker = setupWorker(...handlers)
