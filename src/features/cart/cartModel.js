export const cartInitialState = {
  items: [],
  subtotal: 0,
  currency: "PLN",
};

export const CART_STORAGE_KEY = "marija_cart";

export function formatCartPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value || 0));
}

export function normalizeCartItems(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item?.id && item?.title)
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      price: Number(item.price || 0),
      cover_image: item.cover_image || "",
      quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
    }));
}

export function calculateCartSubtotal(items) {
  return normalizeCartItems(items).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export function createCartState(items) {
  const normalizedItems = normalizeCartItems(items);

  return {
    items: normalizedItems,
    subtotal: calculateCartSubtotal(normalizedItems),
    currency: "PLN",
  };
}
