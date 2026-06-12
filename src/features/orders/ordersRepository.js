import { supabaseRequest } from "../../lib/supabaseClient.js";

export const orderStatuses = [
  { value: "new", label: "Nowe" },
  { value: "confirmed", label: "Potwierdzone" },
  { value: "completed", label: "Zrealizowane" },
  { value: "cancelled", label: "Anulowane" },
];

export function getOrderStatusLabel(status) {
  return orderStatuses.find((item) => item.value === status)?.label || orderStatuses[0].label;
}

const orderSelect =
  "id,created_at,updated_at,customer_name,customer_email,customer_phone,street,postal_code,city,notes,items,total_amount,status";

export async function createOrder(order) {
  const result = await supabaseRequest("/rest/v1/orders", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(order),
  });

  return result;
}

export function getAdminOrders() {
  return supabaseRequest(`/rest/v1/orders?select=${orderSelect}&order=created_at.desc`);
}

export async function updateOrderStatus(id, status) {
  const result = await supabaseRequest(
    `/rest/v1/orders?id=eq.${encodeURIComponent(id)}&select=${orderSelect}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status }),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}
