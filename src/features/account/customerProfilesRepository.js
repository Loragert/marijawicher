import { getCustomerSession } from "../../lib/customerAuth.js";
import { supabaseConfig } from "../../lib/supabaseClient.js";

const profileSelect = "id,created_at,updated_at,full_name,phone,street,postal_code,city";

function getSupabaseOrigin() {
  return supabaseConfig.url?.replace(/\/$/, "");
}

async function customerRequest(path, options = {}) {
  const session = getCustomerSession();

  if (!supabaseConfig.isConfigured || !session?.access_token) {
    return {
      data: null,
      error: new Error("Klient nie jest zalogowany."),
      status: 401,
    };
  }

  const response = await fetch(`${getSupabaseOrigin()}${path}`, {
    ...options,
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

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
    return { data: null, error: data, status: response.status };
  }

  return { data, error: null, status: response.status };
}

export async function getCustomerProfile() {
  const session = getCustomerSession();

  if (!session?.user?.id) {
    return { data: null, error: new Error("Brak sesji klienta."), status: 401 };
  }

  const result = await customerRequest(
    `/rest/v1/customer_profiles?id=eq.${encodeURIComponent(session.user.id)}&select=${profileSelect}&limit=1`,
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] || null : result.data,
  };
}

export async function upsertCustomerProfile(profile) {
  const session = getCustomerSession();

  if (!session?.user?.id) {
    return { data: null, error: new Error("Brak sesji klienta."), status: 401 };
  }

  const result = await customerRequest(
    `/rest/v1/customer_profiles?on_conflict=id&select=${profileSelect}`,
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([{ id: session.user.id, ...profile }]),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] || null : result.data,
  };
}

