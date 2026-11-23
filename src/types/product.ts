export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export type SortOption = 'price-asc' | 'price-desc'
