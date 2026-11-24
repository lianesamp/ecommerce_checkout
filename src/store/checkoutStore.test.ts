import { afterEach, describe, expect, it } from 'vitest'
import { useCheckoutStore } from './checkoutStore'

afterEach(() => {
  useCheckoutStore.getState().reset()
})

const mockContact = {
  fullName: 'María García',
  email: 'maria@example.com',
  phone: '612345678',
  address: 'Calle Mayor 10',
  city: 'Madrid',
  province: 'Madrid',
  postalCode: '28001',
}

describe('checkoutStore', () => {
  it('starts at step 1 with no data', () => {
    const state = useCheckoutStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.contactData).toBeNull()
    expect(state.shippingMethodId).toBeNull()
  })

  it('setContactData saves data and advances to step 2', () => {
    useCheckoutStore.getState().setContactData(mockContact)

    const state = useCheckoutStore.getState()
    expect(state.contactData).toEqual(mockContact)
    expect(state.currentStep).toBe(2)
  })

  it('setShippingMethodId saves id and advances to step 3', () => {
    useCheckoutStore.getState().setShippingMethodId('standard')

    const state = useCheckoutStore.getState()
    expect(state.shippingMethodId).toBe('standard')
    expect(state.currentStep).toBe(3)
  })

  it('goToStep navigates to any step', () => {
    useCheckoutStore.getState().goToStep(2)
    expect(useCheckoutStore.getState().currentStep).toBe(2)

    useCheckoutStore.getState().goToStep(1)
    expect(useCheckoutStore.getState().currentStep).toBe(1)
  })

  it('reset clears all data and goes to step 1', () => {
    useCheckoutStore.getState().setContactData(mockContact)
    useCheckoutStore.getState().setShippingMethodId('express')
    useCheckoutStore.getState().reset()

    const state = useCheckoutStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.contactData).toBeNull()
    expect(state.shippingMethodId).toBeNull()
  })
})
