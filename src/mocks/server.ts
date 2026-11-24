import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Node server — used in Vitest tests.
 *
 * setupServer intercepts fetch() calls in Node.js (no browser, no
 * Service Worker). It uses the same handlers as the browser worker,
 * so your tests hit the same fake API as your dev environment.
 *
 * Activated in vitest.setup.ts with:
 *   beforeAll(() => server.listen())
 *   afterEach(() => server.resetHandlers())
 *   afterAll(() => server.close())
 */
export const server = setupServer(...handlers)
