import { supabaseBrowserClient, supabaseRequest } from "../../lib/supabaseClient.js";

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
  if (!supabaseBrowserClient) {
    return {
      data: null,
      error: new Error("Brakuje konfiguracji Supabase."),
      status: 0,
    };
  }

  const result = await supabaseBrowserClient
    .from("contact_messages")
    .insert({
      ...message,
      status: "new",
    })
    .select(contactMessageSelect)
    .single();

  return {
    data: result.data,
    error: result.error,
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
