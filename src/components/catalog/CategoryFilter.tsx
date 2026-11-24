interface CategoryFilterProps {
  categories: string[]
  selected: string | undefined
  onSelect: (category: string | undefined) => void
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
          selected === undefined
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors cursor-pointer ${
            selected === category
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
