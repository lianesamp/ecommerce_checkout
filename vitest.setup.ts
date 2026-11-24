import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/mocks/server'

/**
 * MSW server lifecycle for tests:
 *
 * beforeAll  → start intercepting fetch() calls
 * afterEach  → reset any per-test handler overrides (server.use(...))
 * afterAll   → stop intercepting, clean up
 *
 * 'onUnhandledFrame: error' makes tests FAIL if your code makes
 * a fetch() call that has no matching handler. This catches bugs
 * where you forgot to mock an endpoint.
 */
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())
