import { z } from 'zod'

/**
 * Schema for checkout step 2: shipping method selection.
 */
export const shippingSchema = z.object({
  methodId: z.enum(['standard', 'express', 'canary-islands'], {
    message: 'Select a shipping method',
  }),
})

export type ShippingFormData = z.infer<typeof shippingSchema>
