import { http, HttpResponse } from 'msw'
import { categories, products } from './data'

/**
 * MSW request handlers — shared between browser (dev) and server (tests).
 *
 * These act like Laravel routes:
 *   Route::get('/api/products', fn () => Product::all());
 *
 * But instead of a real server, MSW intercepts fetch() calls and
 * returns these responses. Your app code uses normal fetch/TanStack Query
 * and never knows the difference.
 */
export const handlers = [
  // GET /api/products — returns the full product catalog
  http.get('/api/products', () => {
    return HttpResponse.json(products)
  }),

  // GET /api/categories — returns unique category names
  http.get('/api/categories', () => {
    return HttpResponse.json(categories)
  }),
]
