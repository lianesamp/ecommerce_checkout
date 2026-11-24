import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient instance for the app.
 *
 * staleTime: 5 minutes — data is considered "fresh" for 5 min
 * after fetching. During that window, TanStack Query serves from
 * cache without re-fetching. Similar to Laravel's Cache::remember().
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})
