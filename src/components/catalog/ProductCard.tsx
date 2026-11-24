import type { Product } from '../../types'
import { useCartStore } from '../../store/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toFixed(2)} &euro;
          </span>
          <button
            type="button"
            onClick={() => addItem(product)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
