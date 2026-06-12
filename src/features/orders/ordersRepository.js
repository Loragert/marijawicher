import { getCustomerSession } from "../../lib/customerAuth.js";
import { supabaseConfig, supabaseRequest } from "../../lib/supabaseClient.js";

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
  "id,created_at,updated_at,customer_id,customer_name,customer_email,customer_phone,street,postal_code,city,notes,items,total_amount,status";

export async function createOrder(order, options = {}) {
  const headers = options.accessToken
    ? {
        Authorization: `Bearer ${options.accessToken}`,
      }
    : {};

  const result = await supabaseRequest("/rest/v1/orders", {
    method: "POST",
    headers: { Prefer: "return=minimal", ...headers },
    body: JSON.stringify(order),
  });

  return result;
}

export function getAdminOrders() {
  return supabaseRequest(`/rest/v1/orders?select=${orderSelect}&order=created_at.desc`);
}

function getSupabaseOrigin() {
  return supabaseConfig.url?.replace(/\/$/, "");
}

export async function getCustomerOrders() {
  const session = getCustomerSession();

  if (!supabaseConfig.isConfigured || !session?.access_token || !session?.user?.id) {
    return {
      data: [],
      error: new Error("Klient nie jest zalogowany."),
      status: 401,
    };
  }

  const response = await fetch(
    `${getSupabaseOrigin()}/rest/v1/orders?select=${orderSelect}&customer_id=eq.${encodeURIComponent(
      session.user.id,
    )}&order=created_at.desc`,
    {
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    return { data: [], error: data, status: response.status };
  }

  return { data: data || [], error: null, status: response.status };
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
