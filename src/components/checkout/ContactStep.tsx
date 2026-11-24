import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  contactSchema,
  type ContactFormData,
} from '../../schemas/contact.schema'

interface ContactStepProps {
  defaultValues?: Partial<ContactFormData>
  onSubmit: (data: ContactFormData) => void
}

/**
 * Checkout step 1: Contact info + shipping address.
 *
 * Uses React Hook Form with Zod resolver:
 * - register() connects an input to RHF (tracks value + validation)
 * - handleSubmit() validates with Zod, then calls onSubmit if valid
 * - formState.errors contains Zod error messages per field
 *
 * Compare with Laravel:
 * - Zod schema = Form Request rules
 * - register('email') = <input name="email"> with $request->validate()
 * - errors.email?.message = $errors->first('email') in Blade
 */
export function ContactStep({ defaultValues, onSubmit }: ContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Contact &amp; Shipping Address
      </h2>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+34 or 9 digits"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          id="address"
          type="text"
          {...register('address')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* City + Province row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            {...register('city')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <input
            id="province"
            type="text"
            {...register('province')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.province && (
            <p className="text-sm text-red-600 mt-1">{errors.province.message}</p>
          )}
        </div>
      </div>

      {/* Postal Code */}
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code
        </label>
        <input
          id="postalCode"
          type="text"
          {...register('postalCode')}
          placeholder="e.g. 28001"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.postalCode && (
          <p className="text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
      >
        Continue to Shipping
      </button>
    </form>
  )
}
