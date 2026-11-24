import { useCartStore } from '../../store/cartStore'
import type { CartItem as CartItemType } from '../../types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-500">
          {item.product.price.toFixed(2)} &euro;
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          aria-label={`Decrease quantity of ${item.product.name}`}
          className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm cursor-pointer"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-label={`Quantity of ${item.product.name}`}>
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          aria-label={`Increase quantity of ${item.product.name}`}
          className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm cursor-pointer"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => removeItem(item.product.id)}
        aria-label={`Remove ${item.product.name} from cart`}
        className="text-gray-400 hover:text-red-500 text-lg cursor-pointer ml-1"
      >
        &times;
      </button>
    </div>
  )
}
