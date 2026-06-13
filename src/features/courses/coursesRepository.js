import { getCustomerSession } from "../../lib/customerAuth.js";
import {
  supabaseConfig,
  supabaseRequest,
  uploadSupabaseStorageFile,
} from "../../lib/supabaseClient.js";

export const courseStatuses = [
  { value: "available", label: "Dostępny" },
  { value: "full", label: "Brak miejsc" },
  { value: "soon", label: "Wkrótce" },
  { value: "hidden", label: "Ukryty" },
];

export const courseApplicationStatuses = [
  { value: "new", label: "Nowe zgłoszenie" },
  { value: "confirmed", label: "Potwierdzone" },
  { value: "payment_pending", label: "Oczekuje na płatność" },
  { value: "paid", label: "Opłacone" },
  { value: "cancelled", label: "Anulowane" },
];

const courseSelect =
  "id,title,short_description,full_description,price,start_date,duration,total_places,available_places,status,image_url,created_at,updated_at";

const courseApplicationSelect =
  "id,course_id,customer_id,customer_name,customer_email,customer_phone,status,created_at,updated_at,courses(id,title,start_date,price)";

function getSupabaseOrigin() {
  return supabaseConfig.url?.replace(/\/$/, "");
}

function createCustomerHeaders(extraHeaders = {}) {
  const session = getCustomerSession();

  return {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${session?.access_token || supabaseConfig.anonKey}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

async function customerRequest(path, options = {}) {
  if (!supabaseConfig.isConfigured) {
    return {
      data: null,
      error: new Error("Brakuje konfiguracji Supabase."),
      status: 0,
    };
  }

  const response = await fetch(`${getSupabaseOrigin()}${path}`, {
    ...options,
    headers: createCustomerHeaders(options.headers),
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

export function getPublicCourses() {
  return supabaseRequest(
    `/rest/v1/courses?select=${courseSelect}&status=neq.hidden&order=start_date.asc,created_at.desc`,
  );
}

export function getAdminCourses() {
  return supabaseRequest(`/rest/v1/courses?select=${courseSelect}&order=start_date.asc,created_at.desc`);
}

export async function createCourse(course) {
  const result = await supabaseRequest(`/rest/v1/courses?select=${courseSelect}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(course),
  });

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export async function updateCourse(id, course) {
  const result = await supabaseRequest(
    `/rest/v1/courses?id=eq.${encodeURIComponent(id)}&select=${courseSelect}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(course),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export function deleteCourse(id) {
  return supabaseRequest(`/rest/v1/courses?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
}

function sanitizeFileName(fileName) {
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop().toLowerCase() : "jpg";
  const baseName = parts
    .join(".")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "course"}.${extension}`;
}

export function createCourseImagePath(file, courseTitle) {
  const safeTitle = String(courseTitle || "kurs")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const timestamp = Date.now();
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `courses/${safeTitle || "kurs"}/${timestamp}-${randomPart}-${sanitizeFileName(file.name)}`;
}

export function uploadCourseImage(file, courseTitle) {
  const path = createCourseImagePath(file, courseTitle);

  return uploadSupabaseStorageFile("products", path, file);
}

export async function createCourseApplication(application) {
  const result = await customerRequest("/rest/v1/course_applications", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(application),
  });

  return result;
}

export function getCustomerCourseApplications() {
  const session = getCustomerSession();

  if (!session?.user?.id) {
    return Promise.resolve({
      data: [],
      error: new Error("Klient nie jest zalogowany."),
      status: 401,
    });
  }

  return customerRequest(
    `/rest/v1/course_applications?select=${courseApplicationSelect}&customer_id=eq.${encodeURIComponent(
      session.user.id,
    )}&order=created_at.desc`,
  );
}

export function getAdminCourseApplications() {
  return supabaseRequest(
    `/rest/v1/course_applications?select=${courseApplicationSelect}&order=created_at.desc`,
  );
}

export async function updateCourseApplicationStatus(id, status) {
  const result = await supabaseRequest(
    `/rest/v1/course_applications?id=eq.${encodeURIComponent(id)}&select=${courseApplicationSelect}`,
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

export function getCourseStatusLabel(status) {
  return courseStatuses.find((item) => item.value === status)?.label || courseStatuses[0].label;
}

export function getCourseApplicationStatusLabel(status) {
  return (
    courseApplicationStatuses.find((item) => item.value === status)?.label ||
    courseApplicationStatuses[0].label
  );
}

