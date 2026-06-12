import { supabaseConfig, supabaseRequest } from "../../lib/supabaseClient.js";

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
  if (!supabaseConfig.isConfigured) {
    return {
      data: null,
      error: new Error("Brakuje VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY."),
      status: 0,
    };
  }

  const response = await fetch(
    `${supabaseConfig.url.replace(/\/$/, "")}/rest/v1/contact_messages?select=${contactMessageSelect}`,
    {
      method: "POST",
      headers: {
        apikey: supabaseConfig.anonKey,
        Authorization: `Bearer ${supabaseConfig.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          ...message,
          status: "new",
        },
      ]),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      data: null,
      error: data || new Error("Nie udalo sie wyslac wiadomosci."),
      status: response.status,
    };
  }

  return {
    data: Array.isArray(data) ? data[0] : data,
    error: null,
    status: response.status,
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
