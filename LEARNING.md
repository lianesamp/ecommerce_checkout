# Learning Glossary

New terms and concepts I learned while building this project.

---

## Tools & Configuration

| Term | Explanation |
|------|-------------|
| **Vite** | A fast build tool and dev server for modern web apps. Uses native ES modules in dev (no bundling) for instant HMR. Similar to Laravel Mix/Vite but for pure frontend projects. |
| **Vitest** | A unit test runner built on top of Vite. It reuses your Vite config (plugins, transforms) so tests run in the same environment as your app. The React equivalent of PHPUnit. |
| **jsdom** | A pure JavaScript implementation of the browser DOM that runs in Node.js. Vitest uses it so component tests can render HTML without opening a real browser. |
| **Playwright** | An E2E testing framework by Microsoft that controls real browsers (Chromium, Firefox, WebKit). Tests interact with your app like a real user would. |
| **oxlint** | A very fast linter written in Rust. Vite 8 ships it by default instead of ESLint. Same idea (catch code issues) but much faster. |
| **MSW (Mock Service Worker)** | A library that intercepts network requests at the service worker level. You define fake API handlers and your app thinks it's talking to a real server. Used in dev and tests. |
| **Tailwind CSS v4** | A utility-first CSS framework. v4 uses a CSS-based config (`@import "tailwindcss"`) instead of the old `tailwind.config.js`. |

## Patterns & Concepts

| Term | Explanation |
|------|-------------|
| **`z.infer<typeof schema>`** | Derives a TypeScript type from a Zod schema. Single source of truth — change the schema and the type updates automatically. Like if Laravel Form Request rules also generated a typed DTO. |
| **Barrel export** | An `index.ts` file that re-exports from multiple files in a folder (e.g. `export type { Product } from './product'`). Lets you import from the folder path instead of individual files. |
| **Zod `z.enum()`** | Creates a schema that only allows specific string values — like a TypeScript `'a' | 'b'` union but validated at runtime too. Used for shipping method IDs. |
| **Schema-derived types** | Instead of defining a TypeScript `interface` and a Zod schema separately (which can go out of sync), define the Zod schema first and derive the type. The schema is the source of truth. |
| **`setupWorker` vs `setupServer`** | MSW has two modes: `setupWorker` registers a Service Worker in the real browser (for dev), `setupServer` intercepts `fetch` in Node.js (for tests). Same handlers, different runtimes. |
| **`onUnhandledFrame`** | MSW v3 option that controls what happens when your code makes a fetch call with no matching handler. `'error'` in tests (catches forgotten mocks), `'bypass'` in dev (lets real requests through). |
| **Dynamic import for mocking** | `await import('./mocks/browser')` loads the MSW code only when needed. In production without mocks, the code is never downloaded — keeps the bundle small. Like Laravel's lazy service providers. |

## Testing

| Term | Explanation |
|------|-------------|
| **`describe()`** | Groups related tests together. Like a test class in PHPUnit. Helps organize output and share setup logic. |
| **`it()` / `test()`** | A single test case. Like a test method in PHPUnit (`test_it_creates_a_user()`). `it` and `test` are interchangeable in Vitest. |
| **`expect()`** | An assertion. `expect(value).toBe(expected)` is like PHPUnit's `$this->assertEquals()`. Vitest has many matchers: `toBe`, `toEqual`, `toHaveLength`, `toBeGreaterThan`, etc. |
| **`renderHook()`** | From React Testing Library. Renders a React hook inside a minimal component so you can test hooks in isolation without building a full UI. |
| **`waitFor()`** | Waits for an async condition to become true. Needed for TanStack Query tests because data fetching is asynchronous — the hook returns `isLoading: true` first, then `isSuccess: true` after the fetch. |
| **Test wrapper** | A component that wraps the thing under test with required providers (e.g. `QueryClientProvider`). Like Laravel's `setUp()` that boots the app container before each test. |
| **`select` in `useQuery`** | TanStack Query option that transforms data after fetching but before returning to the component. We use it for client-side filtering and sorting. The raw cache stays unfiltered. |
| **`queryKey`** | A unique identifier for a TanStack Query cache entry. When the key changes (e.g. category changes), Query refetches automatically. Like a cache key in `Cache::remember('products:electronics', ...)`. |
| **TDD (Test-Driven Development)** | Write the test FIRST, see it fail (RED), write minimum code to pass (GREEN), then clean up (REFACTOR). Forces you to think about the interface before the implementation. |
| **Unit test** | Tests a single function in isolation — no DOM, no React, no network. Just input → output. Runs in ~1ms. Perfect for pure business logic like pricing math. |
| **Floating-point money** | `0.1 + 0.2 === 0.30000000000000004` in JS. For money, always round: `Math.round((n + Number.EPSILON) * 100) / 100`. Production systems use integer cents or libraries like dinero.js. |
| **Code coverage** | Measures what % of your code is executed by tests. Types: statements, branches (if/else paths), functions, lines. 100% on `lib/pricing.ts` means every line and branch is tested. |
| **Edge case** | An unusual or boundary input: empty array, zero, negative, very large number, exact threshold (49.99 vs 50). Edge cases are where most bugs hide — unit tests are cheap enough to cover them all. |
| **`toThrow()` matcher** | Tests that a function throws an error. `expect(() => fn()).toThrow('message')` — note the arrow function wrapper so the error is caught by `expect`, not thrown into the test. Like PHPUnit's `$this->expectException()`. |
