import { supabaseRequest } from "../../lib/supabaseClient.js";

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

export function createContactMessage(message) {
  return supabaseRequest(`/rest/v1/contact_messages?select=${contactMessageSelect}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...message,
      status: "new",
    }),
  });
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
