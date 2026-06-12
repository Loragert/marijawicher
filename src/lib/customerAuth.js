import { supabaseConfig } from "./supabaseClient.js";

export const CUSTOMER_AUTH_STORAGE_KEY = "marija_customer_session";

function getSupabaseOrigin() {
  return supabaseConfig.url?.replace(/\/$/, "");
}

function normalizeSession(data) {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    user: data.user,
  };
}

export function getCustomerSession() {
  try {
    const rawSession = window.localStorage.getItem(CUSTOMER_AUTH_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
}

export function writeCustomerSession(session) {
  window.localStorage.setItem(CUSTOMER_AUTH_STORAGE_KEY, JSON.stringify(normalizeSession(session)));
  window.dispatchEvent(new Event("marija-customer-auth-change"));
}

export function clearCustomerSession() {
  window.localStorage.removeItem(CUSTOMER_AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("marija-customer-auth-change"));
}

export function isCustomerLoggedIn() {
  const session = getCustomerSession();

  if (!session?.access_token) {
    return false;
  }

  if (!session.expires_at) {
    return true;
  }

  return session.expires_at * 1000 > Date.now();
}

export async function signInCustomer(email, password) {
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
    return { data: null, error: data };
  }

  writeCustomerSession(data);

  return { data, error: null };
}

export async function registerCustomer(email, password) {
  if (!supabaseConfig.isConfigured) {
    return {
      data: null,
      error: new Error("Brakuje konfiguracji Supabase."),
    };
  }

  const response = await fetch(`${getSupabaseOrigin()}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: supabaseConfig.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  if (!response.ok) {
    return { data: null, error: data };
  }

  if (data.access_token) {
    writeCustomerSession(data);
  }

  return { data, error: null };
}

export async function signOutCustomer() {
  const session = getCustomerSession();

  if (supabaseConfig.isConfigured && session?.access_token) {
    await fetch(`${getSupabaseOrigin()}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
    }).catch(() => undefined);
  }

  clearCustomerSession();
}

