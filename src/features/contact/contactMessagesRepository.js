import { supabase, supabaseConfig, supabaseRequest } from "../../lib/supabaseClient.js";

export const contactMessageStatuses = [
  { value: "new", label: "Nowe" },
  { value: "in_progress", label: "W trakcie" },
  { value: "answered", label: "Odpowiedziano" },
];

export function getContactStatusLabel(status) {
  return (
    contactMessageStatuses.find((item) => item.value === status)?.label ||
    contactMessageStatuses[0].label
  );
}

const contactMessageSelect =
  "id,created_at,updated_at,name,email,phone,subject,message,status";

export async function createContactMessage(message) {
  if (!supabaseConfig.isConfigured || !supabase) {
    const error = new Error("Brakuje VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY.");
    console.error("Contact form Supabase configuration error", {
      hasUrl: Boolean(supabaseConfig.url),
      hasAnonKey: Boolean(supabaseConfig.anonKey),
    });

    return {
      data: null,
      error,
      status: 0,
    };
  }

  const result = await supabase
    .from("contact_messages")
    .insert([
      {
        name: message.name,
        email: message.email,
        phone: message.phone || null,
        subject: message.subject,
        message: message.message,
        status: "new",
      },
    ])
    .select(contactMessageSelect)
    .single();

  if (result.error) {
    console.error("Contact form Supabase insert error", {
      status: result.status,
      statusText: result.statusText,
      error: result.error,
    });

    return {
      data: null,
      error: result.error,
      status: result.status,
    };
  }

  return {
    data: result.data,
    error: null,
    status: result.status,
  };
}

export function getAdminContactMessages() {
  return supabaseRequest(
    `/rest/v1/contact_messages?select=${contactMessageSelect}&order=created_at.desc`,
  );
}

export async function updateContactMessageStatus(id, status) {
  const result = await supabaseRequest(
    `/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}&select=${contactMessageSelect}`,
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
