import type { CartItem } from './cart'
import type { ContactData, ShippingMethodId } from './checkout'

export interface Order {
  id: string
  items: CartItem[]
  contact: ContactData
  shippingMethodId: ShippingMethodId
  subtotal: number
  discount: number
  shipping: number
  vat: number
  total: number
  couponCode?: string
  createdAt: Date
}
