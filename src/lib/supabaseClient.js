import { createClient } from "@supabase/supabase-js";

function normalizeEnvValue(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

const supabaseUrl = normalizeEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = normalizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY);
export const SUPABASE_AUTH_STORAGE_KEY = "marija_supabase_session";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

function createSupabaseHeaders(extraHeaders = {}) {
  if (!isSupabaseConfigured) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
  }

  const storedSession = readStoredSupabaseSession();
  const accessToken = storedSession?.access_token || supabaseAnonKey;

  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

export function readStoredSupabaseSession() {
  try {
    const rawSession = window.localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
}

export function writeStoredSupabaseSession(session) {
  window.localStorage.setItem(SUPABASE_AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("marija-admin-auth-change"));
}

export function clearStoredSupabaseSession() {
  window.localStorage.removeItem(SUPABASE_AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("marija-admin-auth-change"));
}

function getSupabaseOrigin() {
  if (!isSupabaseConfigured) {
    return "";
  }

  return supabaseUrl.replace(/\/$/, "");
}

export async function supabaseRequest(path, options = {}) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error("Supabase env variables are not configured."),
      status: 0,
    };
  }

  const response = await fetch(`${getSupabaseOrigin()}${path}`, {
    ...options,
    headers: createSupabaseHeaders(options.headers),
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
    return {
      data: null,
      error: data,
      status: response.status,
    };
  }

  return {
    data,
    error: null,
    status: response.status,
  };
}

export async function uploadSupabaseStorageFile(bucket, path, file) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error("Supabase env variables are not configured."),
      status: 0,
    };
  }

  const response = await fetch(
    `${getSupabaseOrigin()}/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: createSupabaseHeaders({
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      }),
      body: file,
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
    return {
      data: null,
      error: data,
      status: response.status,
    };
  }

  return {
    data: {
      ...data,
      publicUrl: `${getSupabaseOrigin()}/storage/v1/object/public/${bucket}/${path}`,
    },
    error: null,
    status: response.status,
  };
}

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: isSupabaseConfigured,
};
