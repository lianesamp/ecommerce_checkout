export interface ContactData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
}

export type ShippingMethodId = 'standard' | 'express' | 'canary-islands'

export interface ShippingMethod {
  id: ShippingMethodId
  name: string
  price: number
  estimatedDays: string
}

export interface ShippingData {
  methodId: ShippingMethodId
}
