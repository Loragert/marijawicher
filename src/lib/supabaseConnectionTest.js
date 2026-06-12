import { supabaseConfig, supabaseRequest } from "./supabaseClient.js";

export async function testSupabaseConnection() {
  if (!supabaseConfig.isConfigured) {
    return {
      ok: false,
      message: "Supabase env variables are not configured.",
      status: 0,
    };
  }

  const result = await supabaseRequest(
    "/rest/v1/products?select=id&limit=1",
    {
      method: "GET",
      headers: {
        Prefer: "count=exact",
      },
    },
  );

  return {
    ok: !result.error,
    message: result.error
      ? "Supabase connection failed."
      : "Supabase connection is ready.",
    status: result.status,
    error: result.error,
  };
}
