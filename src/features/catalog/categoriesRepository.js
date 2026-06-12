import { supabaseRequest } from "../../lib/supabaseClient.js";

const categorySelect = "id,created_at,name,slug,sort_order,is_active";

export function getAdminCategories() {
  return supabaseRequest(
    `/rest/v1/categories?select=${categorySelect}&order=sort_order.asc,created_at.desc`,
  );
}

export function getActiveCategories() {
  return supabaseRequest(
    `/rest/v1/categories?select=${categorySelect}&is_active=eq.true&order=sort_order.asc,name.asc`,
  );
}

export async function createCategory(category) {
  const result = await supabaseRequest(`/rest/v1/categories?select=${categorySelect}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(category),
  });

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export async function updateCategory(id, category) {
  const result = await supabaseRequest(
    `/rest/v1/categories?id=eq.${encodeURIComponent(id)}&select=${categorySelect}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(category),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export function setCategoryActive(id, isActive) {
  return updateCategory(id, { is_active: isActive });
}
