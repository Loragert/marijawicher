import { supabaseRequest, uploadSupabaseStorageFile } from "../../lib/supabaseClient.js";

const collectionSelect = "id,created_at,title,slug,description,cover_image,sort_order,is_active";

export function getAdminCollections() {
  return supabaseRequest(
    `/rest/v1/collections?select=${collectionSelect}&order=sort_order.asc,created_at.desc`,
  );
}

export function getActiveCollections() {
  return supabaseRequest(
    `/rest/v1/collections?select=${collectionSelect}&is_active=eq.true&order=sort_order.asc,title.asc`,
  );
}

export async function createCollection(collection) {
  const result = await supabaseRequest(`/rest/v1/collections?select=${collectionSelect}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(collection),
  });

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export async function updateCollection(id, collection) {
  const result = await supabaseRequest(
    `/rest/v1/collections?id=eq.${encodeURIComponent(id)}&select=${collectionSelect}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(collection),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export function setCollectionActive(id, isActive) {
  return updateCollection(id, { is_active: isActive });
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

  return `${baseName || "image"}.${extension}`;
}

export function createCollectionImagePath(file, collectionSlug) {
  const safeSlug = collectionSlug
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `collections/${safeSlug || "collection"}/${Date.now()}-${randomPart}-${sanitizeFileName(file.name)}`;
}

export function uploadCollectionImage(file, collectionSlug) {
  return uploadSupabaseStorageFile("products", createCollectionImagePath(file, collectionSlug), file);
}
