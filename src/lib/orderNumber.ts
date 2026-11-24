/**
 * Generate a fake order number.
 * Format: ORD-YYYYMMDD-XXXXX (random 5-digit suffix).
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, '0')
  return `ORD-${y}${m}${d}-${rand}`
}
