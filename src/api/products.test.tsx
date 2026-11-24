import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { products } from '../mocks/data'
import { useProducts } from './products'

/**
 * FIRST TEST FILE — key concepts:
 *
 * describe() — groups related tests. Like a test class in PHPUnit.
 * it()       — a single test case. Like a test method in PHPUnit.
 * expect()   — assertion. expect(value).toBe(expected).
 *
 * renderHook() — from React Testing Library. Renders a React hook
 *   inside a minimal component so we can test hooks in isolation
 *   without building a full UI. The hook runs in a real React
 *   environment with all lifecycle events.
 *
 * waitFor() — waits for an async condition to be true. TanStack Query
 *   fetches data asynchronously, so we need to wait for the query
 *   to resolve before checking the result.
 *
 * wrapper — a component that wraps the hook with required providers
 *   (QueryClientProvider). Like Laravel's test setUp() that boots
 *   the app container.
 */

/** Create a fresh QueryClient for each test to avoid shared cache. */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

/** Wrapper that provides QueryClient to the hook under test. */
function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe('useProducts', () => {
  it('fetches all products from the API', async () => {
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    })

    // Wait for the query to resolve (MSW responds with mock data)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(products.length)
  })

  it('filters products by category', async () => {
    const { result } = renderHook(
      () => useProducts({ category: 'electronics' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const data = result.current.data!
    expect(data.length).toBeGreaterThan(0)
    expect(data.every((p) => p.category === 'electronics')).toBe(true)
  })

  it('sorts products by price ascending', async () => {
    const { result } = renderHook(
      () => useProducts({ sort: 'price-asc' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const prices = result.current.data!.map((p) => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  })

  it('sorts products by price descending', async () => {
    const { result } = renderHook(
      () => useProducts({ sort: 'price-desc' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const prices = result.current.data!.map((p) => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1])
    }
  })

  it('filters and sorts at the same time', async () => {
    const { result } = renderHook(
      () => useProducts({ category: 'home', sort: 'price-asc' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const data = result.current.data!
    expect(data.every((p) => p.category === 'home')).toBe(true)

    const prices = data.map((p) => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  })
})
