import { z } from 'zod'

/**
 * Schema for checkout step 1: contact info + shipping address.
 *
 * Validates:
 * - Spanish postal codes: exactly 5 digits (01000–52999)
 * - Spanish phone numbers: optional +34 prefix, then 9 digits
 */
export const contactSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+34)?\d{9}$/,
      'Enter a valid Spanish phone number (9 digits, optional +34 prefix)',
    ),

  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address is too long'),

  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City is too long'),

  province: z
    .string()
    .min(1, 'Province is required')
    .max(100, 'Province is too long'),

  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d{5}$/, 'Enter a valid Spanish postal code (5 digits)'),
})

/** TypeScript type derived from the schema — single source of truth. */
export type ContactFormData = z.infer<typeof contactSchema>
