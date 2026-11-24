import type { Product } from '../types'

/**
 * Static product catalog — our "database".
 * MSW handlers serve this data as if it were a real API.
 *
 * We use picsum.photos for placeholder images (free, no signup).
 * Each product has a deterministic image based on its seed number.
 */
export const products: Product[] = [
  // Electronics
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    price: 59.99,
    image: 'https://picsum.photos/seed/headphones/400/400',
    category: 'electronics',
    description: 'Bluetooth 5.0 headphones with noise cancellation and 30h battery.',
  },
  {
    id: 'prod-2',
    name: 'USB-C Hub',
    price: 34.99,
    image: 'https://picsum.photos/seed/usbhub/400/400',
    category: 'electronics',
    description: '7-in-1 hub with HDMI, USB 3.0, SD card reader and PD charging.',
  },
  {
    id: 'prod-3',
    name: 'Mechanical Keyboard',
    price: 89.99,
    image: 'https://picsum.photos/seed/keyboard/400/400',
    category: 'electronics',
    description: 'Hot-swappable switches, RGB backlight, compact 75% layout.',
  },
  {
    id: 'prod-4',
    name: 'Webcam HD 1080p',
    price: 45.0,
    image: 'https://picsum.photos/seed/webcam/400/400',
    category: 'electronics',
    description: 'Full HD webcam with autofocus and built-in microphone.',
  },

  // Clothing
  {
    id: 'prod-5',
    name: 'Cotton T-Shirt',
    price: 19.99,
    image: 'https://picsum.photos/seed/tshirt/400/400',
    category: 'clothing',
    description: '100% organic cotton, unisex fit, available in 6 colors.',
  },
  {
    id: 'prod-6',
    name: 'Denim Jacket',
    price: 69.99,
    image: 'https://picsum.photos/seed/jacket/400/400',
    category: 'clothing',
    description: 'Classic fit denim jacket with brass buttons and two chest pockets.',
  },
  {
    id: 'prod-7',
    name: 'Running Shoes',
    price: 54.99,
    image: 'https://picsum.photos/seed/shoes/400/400',
    category: 'clothing',
    description: 'Lightweight mesh upper with responsive cushioning sole.',
  },

  // Home
  {
    id: 'prod-8',
    name: 'Desk Lamp LED',
    price: 29.99,
    image: 'https://picsum.photos/seed/lamp/400/400',
    category: 'home',
    description: 'Adjustable LED desk lamp with 5 brightness levels and USB port.',
  },
  {
    id: 'prod-9',
    name: 'Ceramic Mug Set',
    price: 24.99,
    image: 'https://picsum.photos/seed/mugs/400/400',
    category: 'home',
    description: 'Set of 4 handmade ceramic mugs, 350ml each, dishwasher safe.',
  },
  {
    id: 'prod-10',
    name: 'Plant Pot (Medium)',
    price: 15.99,
    image: 'https://picsum.photos/seed/plantpot/400/400',
    category: 'home',
    description: 'Minimalist concrete plant pot with drainage hole, 15cm diameter.',
  },
  {
    id: 'prod-11',
    name: 'Scented Candle',
    price: 12.5,
    image: 'https://picsum.photos/seed/candle/400/400',
    category: 'home',
    description: 'Soy wax candle with lavender and eucalyptus scent, 40h burn time.',
  },
  {
    id: 'prod-12',
    name: 'Throw Blanket',
    price: 39.99,
    image: 'https://picsum.photos/seed/blanket/400/400',
    category: 'home',
    description: 'Soft knitted throw blanket, 130x170cm, machine washable.',
  },
]

/** All unique categories derived from the product data. */
export const categories = [...new Set(products.map((p) => p.category))]
