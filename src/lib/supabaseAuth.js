import {
  clearStoredSupabaseSession,
  readStoredSupabaseSession,
  supabaseConfig,
  writeStoredSupabaseSession,
} from "./supabaseClient.js";

function getSupabaseOrigin() {
  return supabaseConfig.url?.replace(/\/$/, "");
}

export function getAdminSession() {
  return readStoredSupabaseSession();
}

export function isAdminLoggedIn() {
  const session = getAdminSession();

  if (!session?.access_token) {
    return false;
  }

  if (!session.expires_at) {
    return true;
  }

  return session.expires_at * 1000 > Date.now();
}

export async function signInAdmin(email, password) {
  if (!supabaseConfig.isConfigured) {
    return {
      data: null,
      error: new Error("Brakuje konfiguracji Supabase."),
    };
  }

  const response = await fetch(`${getSupabaseOrigin()}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseConfig.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  if (!response.ok) {
    return {
      data: null,
      error: data,
    };
  }

  writeStoredSupabaseSession(data);

  return {
    data,
    error: null,
  };
}

export async function signOutAdmin() {
  const session = getAdminSession();

  if (supabaseConfig.isConfigured && session?.access_token) {
    await fetch(`${getSupabaseOrigin()}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
    }).catch(() => undefined);
  }

  clearStoredSupabaseSession();
}
