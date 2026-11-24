import { useQuery } from '@tanstack/react-query'
import { productListSchema } from '../schemas/product.schema'
import type { Product, SortOption } from '../types'

/**
 * Fetches products from the API and validates the response with Zod.
 *
 * Why validate a fake API response? It establishes the pattern you'd
 * use with a real API. If the response shape ever changes (e.g. a
 * field is renamed), Zod throws immediately instead of letting
 * undefined values cause mysterious bugs downstream.
 */
async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  const data: unknown = await response.json()
  return productListSchema.parse(data)
}

interface UseProductsOptions {
  category?: string
  sort?: SortOption
}

/**
 * React hook to fetch, filter and sort products.
 *
 * Filtering and sorting happen client-side since we have a small
 * static catalog. With a real API you'd pass query params instead.
 *
 * Usage:
 *   const { data: products, isLoading } = useProducts({ category: 'electronics', sort: 'price-asc' })
 */
export function useProducts(options: UseProductsOptions = {}) {
  const { category, sort } = options

  return useQuery({
    queryKey: ['products', category, sort],
    queryFn: fetchProducts,
    select(products) {
      let filtered = products

      if (category) {
        filtered = filtered.filter((p) => p.category === category)
      }

      if (sort === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.price - b.price)
      } else if (sort === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.price - a.price)
      }

      return filtered
    },
  })
}
