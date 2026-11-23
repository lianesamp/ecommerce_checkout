export interface Coupon {
  code: string
  type: 'percentage' | 'free-shipping'
  /** Discount percentage (e.g. 10 means 10%). Only for type 'percentage'. */
  value?: number
  expiresAt?: Date
}
