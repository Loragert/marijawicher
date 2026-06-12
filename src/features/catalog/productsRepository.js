import { supabaseRequest, uploadSupabaseStorageFile } from "../../lib/supabaseClient.js";

const productSelect =
  "id,created_at,updated_at,title,slug,short_description,description,price,category,category_id,collection_id,cover_image,is_active,sort_order,seo_title,seo_description,featured";
const adminProductSelect = `${productSelect},product_images(id,image_url,sort_order)`;
const productWithImagesSelect = `${productSelect},product_images(id,image_url,sort_order)`;

export function getActiveProducts() {
  return supabaseRequest(
    `/rest/v1/products?select=${productSelect}&is_active=eq.true&order=sort_order.asc,created_at.desc`,
  );
}

export function getActiveProductBySlug(slug) {
  const encodedSlug = encodeURIComponent(slug);

  return supabaseRequest(
    `/rest/v1/products?select=${productWithImagesSelect}&slug=eq.${encodedSlug}&is_active=eq.true&limit=1`,
  );
}

export async function getActiveProductDetailBySlug(slug) {
  const result = await getActiveProductBySlug(slug);

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export function getAdminProducts() {
  return supabaseRequest(
    `/rest/v1/products?select=${adminProductSelect}&order=sort_order.asc,created_at.desc`,
  );
}

export async function createProduct(product) {
  const result = await supabaseRequest(
    `/rest/v1/products?select=${productSelect}`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(product),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export async function updateProduct(id, product) {
  const result = await supabaseRequest(
    `/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=${productSelect}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify(product),
    },
  );

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data[0] : result.data,
  };
}

export function setProductActive(id, isActive) {
  return updateProduct(id, { is_active: isActive });
}

export function createProductImages(images) {
  if (!images.length) {
    return Promise.resolve({ data: [], error: null, status: 200 });
  }

  return supabaseRequest("/rest/v1/product_images", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(images),
  });
}

export function deleteProductImage(id) {
  return supabaseRequest(`/rest/v1/product_images?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=representation",
    },
  });
}

export async function deleteProduct(id) {
  const imagesResult = await supabaseRequest(
    `/rest/v1/product_images?product_id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=representation",
      },
    },
  );

  if (imagesResult.error) {
    return imagesResult;
  }

  return supabaseRequest(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=representation",
    },
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

  return `${baseName || "image"}.${extension}`;
}

export function createProductImagePath(file, productSlug, group = "gallery") {
  const safeSlug = productSlug
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

  return `${safeSlug || "product"}/${group}/${timestamp}-${randomPart}-${sanitizeFileName(file.name)}`;
}

export function uploadProductImage(file, productSlug, group = "gallery") {
  const path = createProductImagePath(file, productSlug, group);

  return uploadSupabaseStorageFile("products", path, file);
}
