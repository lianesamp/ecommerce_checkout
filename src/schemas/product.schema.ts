import { z } from 'zod'

/**
 * Schema to validate API responses for products.
 * Even with a fake API (MSW), validating responses catches
 * shape mismatches early instead of letting undefined values
 * propagate through the app.
 */
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string(),
  category: z.string(),
  description: z.string(),
})

export const productListSchema = z.array(productSchema)

export type ProductFromApi = z.infer<typeof productSchema>
