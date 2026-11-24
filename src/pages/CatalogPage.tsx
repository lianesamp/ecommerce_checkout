import { useState } from 'react'
import { useProducts } from '../api/products'
import { CategoryFilter } from '../components/catalog/CategoryFilter'
import { ProductGrid } from '../components/catalog/ProductGrid'
import { SortSelect } from '../components/catalog/SortSelect'
import { categories } from '../mocks/data'
import type { SortOption } from '../types'

export function CatalogPage() {
  const [category, setCategory] = useState<string | undefined>()
  const [sort, setSort] = useState<SortOption | undefined>()

  const { data: products, isLoading, error } = useProducts({ category, sort })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {isLoading && (
        <p className="text-center text-gray-500 py-12">Loading products...</p>
      )}

      {error && (
        <p className="text-center text-red-600 py-12">
          Failed to load products. Please try again.
        </p>
      )}

      {products && <ProductGrid products={products} />}
    </main>
  )
}
