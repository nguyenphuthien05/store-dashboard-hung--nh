export function calculateOrderTotal(
  items: { price: number; quantity: number }[]
) {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}
