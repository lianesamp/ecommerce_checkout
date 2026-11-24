import { create } from 'zustand'
import type { ContactData, ShippingMethodId } from '../types'

/**
 * Checkout store — holds form data across the 3-step wizard.
 *
 * Unlike the cart store, this is NOT persisted to localStorage.
 * If the user refreshes mid-checkout, they start over. This is
 * intentional — partial checkout data is sensitive (address, phone).
 */

interface CheckoutState {
  currentStep: number
  contactData: ContactData | null
  shippingMethodId: ShippingMethodId | null

  setContactData: (data: ContactData) => void
  setShippingMethodId: (id: ShippingMethodId) => void
  goToStep: (step: number) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  currentStep: 1,
  contactData: null,
  shippingMethodId: null,

  setContactData: (data) => set({ contactData: data, currentStep: 2 }),
  setShippingMethodId: (id) => set({ shippingMethodId: id, currentStep: 3 }),
  goToStep: (step) => set({ currentStep: step }),
  reset: () => set({ currentStep: 1, contactData: null, shippingMethodId: null }),
}))
