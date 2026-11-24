import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getShippingMethods } from '../../lib/shipping'
import {
  shippingSchema,
  type ShippingFormData,
} from '../../schemas/shipping.schema'
import type { ShippingMethod } from '../../types'

interface ShippingStepProps {
  postalCode: string
  subtotal: number
  freeShipping: boolean
  defaultValues?: Partial<ShippingFormData>
  onSubmit: (data: ShippingFormData) => void
  onBack: () => void
}

export function ShippingStep({
  postalCode,
  subtotal,
  freeShipping,
  defaultValues,
  onSubmit,
  onBack,
}: ShippingStepProps) {
  const methods = getShippingMethods(postalCode, subtotal, freeShipping)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Shipping Method
      </h2>

      <fieldset>
        <legend className="sr-only">Select a shipping method</legend>
        <div className="space-y-3">
          {methods.map((method: ShippingMethod) => (
            <label
              key={method.id}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 has-checked:border-indigo-500 has-checked:bg-indigo-50 transition-colors"
            >
              <input
                type="radio"
                value={method.id}
                {...register('methodId')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {method.name}
                </span>
                <span className="block text-xs text-gray-500">
                  {method.estimatedDays}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {method.price === 0 ? 'Free' : `${method.price.toFixed(2)} €`}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {errors.methodId && (
        <p className="text-sm text-red-600" role="alert">
          {errors.methodId.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Continue to Review
        </button>
      </div>
    </form>
  )
}
