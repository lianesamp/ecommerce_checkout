import type { SortOption } from '../../types'

interface SortSelectProps {
  value: SortOption | undefined
  onChange: (sort: SortOption | undefined) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value
        onChange(val === '' ? undefined : (val as SortOption))
      }}
      aria-label="Sort by price"
      className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700"
    >
      <option value="">Default order</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  )
}
