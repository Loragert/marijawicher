import {
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  PackagePlus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { getAdminCategories } from "../features/catalog/categoriesRepository.js";
import { getAdminCollections } from "../features/catalog/collectionsRepository.js";
import {
  createProduct,
  createProductImages,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  setProductActive,
  updateProduct,
  uploadProductImage,
} from "../features/catalog/productsRepository.js";
import { supabaseConfig } from "../lib/supabaseClient.js";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  category_id: "",
  collection_id: "",
  cover_image: "",
  sort_order: "0",
  is_active: true,
  featured: false,
  seo_title: "",
  seo_description: "",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AdminProductsPage() {
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : form.cover_image),
    [coverFile, form.cover_image],
  );

  const galleryPreviews = useMemo(
    () =>
      galleryFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [galleryFiles],
  );

  const isEditing = Boolean(form.id);
  const editedProduct = products.find((product) => product.id === form.id);
  const editedProductImages = [...(editedProduct?.product_images || [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    return () => {
      if (coverFile && coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [coverFile, coverPreview, galleryPreviews]);

  async function loadAdminData() {
    setIsLoading(true);
    const [productsResult, categoriesResult, collectionsResult] = await Promise.all([
      getAdminProducts(),
      getAdminCategories(),
      getAdminCollections(),
    ]);
    setIsLoading(false);

    if (productsResult.error) {
      setStatus({
        type: "error",
        message:
          "Nie udało się pobrać produktów. Sprawdź konfigurację Supabase i polityki RLS.",
      });
    } else {
      setProducts(productsResult.data || []);
    }

    if (categoriesResult.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kategorii. Sprawdź tabelę categories i polityki RLS.",
      });
    } else {
      setCategories(categoriesResult.data || []);
    }

    if (collectionsResult.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kolekcji. Sprawdź tabelę collections i polityki RLS.",
      });
    } else {
      setCollections(collectionsResult.data || []);
    }
  }

  async function loadProducts() {
    const result = await getAdminProducts();
    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się odświeżyć listy produktów.",
      });
      return;
    }

    setProducts(result.data || []);
  }

  function updateField(name, value) {
    setForm((currentForm) => {
      const nextForm = { ...currentForm, [name]: value };

      if (name === "title" && !slugTouched && !currentForm.id) {
        nextForm.slug = createSlug(value);
      }

      return nextForm;
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setCoverFile(null);
    setGalleryFiles([]);
    setSlugTouched(false);
    setStatus({ type: "", message: "" });
  }

  function editProduct(product) {
    setForm({
      id: product.id,
      title: product.title || "",
      slug: product.slug || "",
      short_description: product.short_description || "",
      description: product.description || "",
      price: product.price ?? "",
      category_id: product.category_id || "",
      collection_id: product.collection_id || "",
      cover_image: product.cover_image || "",
      sort_order: String(product.sort_order ?? 0),
      is_active: Boolean(product.is_active),
      featured: Boolean(product.featured),
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
    });
    setCoverFile(null);
    setGalleryFiles([]);
    setSlugTouched(true);
    setStatus({
      type: "info",
      message: "Produkt wczytany do edycji. Możesz dodać nowe zdjęcia do galerii.",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadGallery(productId, slug) {
    if (!galleryFiles.length) return { error: null };

    const existingImagesCount =
      products.find((product) => product.id === productId)?.product_images?.length || 0;
    const rows = [];

    for (const [index, file] of galleryFiles.entries()) {
      const uploadResult = await uploadProductImage(file, slug, "gallery");

      if (uploadResult.error) return uploadResult;

      rows.push({
        product_id: productId,
        image_url: uploadResult.data.publicUrl,
        sort_order: existingImagesCount + index,
      });
    }

    return createProductImages(rows);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    const slug = form.slug || createSlug(form.title);
    let coverImageUrl = form.cover_image;

    if (coverFile) {
      const uploadResult = await uploadProductImage(coverFile, slug, "cover");

      if (uploadResult.error) {
        setIsSaving(false);
        setStatus({
          type: "error",
          message: "Nie udało się przesłać zdjęcia głównego do Supabase Storage.",
        });
        return;
      }

      coverImageUrl = uploadResult.data.publicUrl;
    }

    const selectedCategory = categories.find((category) => category.id === form.category_id);
    const productPayload = {
      title: form.title,
      slug,
      short_description: form.short_description || null,
      description: form.description || null,
      price: Number(form.price || 0),
      category: selectedCategory?.name || "",
      category_id: form.category_id || null,
      collection_id: form.collection_id || null,
      cover_image: coverImageUrl || null,
      sort_order: Number(form.sort_order || 0),
      is_active: form.is_active,
      featured: form.featured,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };

    const saveResult = isEditing
      ? await updateProduct(form.id, productPayload)
      : await createProduct(productPayload);

    if (saveResult.error || !saveResult.data?.id) {
      setIsSaving(false);
      setStatus({
        type: "error",
        message:
          "Nie udało się zapisać produktu. Jeśli widzisz błąd RLS, konto musi mieć rolę admin w Supabase.",
      });
      return;
    }

    const galleryResult = await uploadGallery(saveResult.data.id, slug);

    if (galleryResult.error) {
      setIsSaving(false);
      setStatus({
        type: "error",
        message:
          "Produkt zapisano, ale nie udało się dodać zdjęć galerii. Sprawdź Storage i RLS.",
      });
      await loadProducts();
      return;
    }

    setIsSaving(false);
    resetForm();
    setStatus({
      type: "success",
      message: isEditing ? "Produkt został zaktualizowany." : "Produkt został utworzony.",
    });
    await loadProducts();
  }

  async function toggleProduct(product) {
    setStatus({ type: "", message: "" });
    const result = await setProductActive(product.id, !product.is_active);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić widoczności produktu. Sprawdź uprawnienia Supabase.",
      });
      return;
    }

    await loadProducts();
    setStatus({
      type: "success",
      message: product.is_active ? "Produkt został ukryty." : "Produkt został opublikowany.",
    });
  }

  async function removeProductImage(imageId) {
    setStatus({ type: "", message: "" });
    const result = await deleteProductImage(imageId);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się usunąć zdjęcia produktu.",
      });
      return;
    }

    await loadProducts();
    setStatus({ type: "success", message: "Zdjęcie zostało usunięte." });
  }

  async function removeProduct(product) {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten produkt?");

    if (!confirmed) return;

    setStatus({ type: "", message: "" });
    const result = await deleteProduct(product.id);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się usunąć produktu. Sprawdź uprawnienia Supabase.",
      });
      return;
    }

    if (form.id === product.id) {
      resetForm();
    }

    await loadProducts();
    setStatus({ type: "success", message: "Produkt został usunięty." });
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Panel produkt&#243;w</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Dodawaj i edytuj produkty, przesy&#322;aj zdj&#281;cia do Supabase Storage i
                zarz&#261;dzaj widoczno&#347;ci&#261; oferty.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Nowy produkt
            </button>
          </div>

          {!supabaseConfig.isConfigured && (
            <div className="mb-8 rounded-[1.25rem] border border-rosewood/30 bg-milk p-5 text-sm leading-6 text-rosewood">
              Brakuje konfiguracji Supabase. Dodaj `VITE_SUPABASE_URL` i
              `VITE_SUPABASE_ANON_KEY` w pliku `.env`.
            </div>
          )}

          {status.message && (
            <div
              className={`mb-8 rounded-[1.25rem] border bg-milk p-5 text-sm leading-6 ${
                status.type === "error"
                  ? "border-rosewood/40 text-rosewood"
                  : "border-neutral-950/10 text-stone"
              }`}
              role="status"
            >
              {status.message}
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <form
              className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">
                  {isEditing ? "Edytuj produkt" : "Dodaj produkt"}
                </h2>
                <PackagePlus size={26} aria-hidden="true" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Nazwa produktu
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Slug
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateField("slug", createSlug(event.target.value));
                    }}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950 md:col-span-2">
                  Kr&#243;tki opis
                  <textarea
                    className="min-h-24 rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.short_description}
                    onChange={(event) => updateField("short_description", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950 md:col-span-2">
                  Pe&#322;ny opis
                  <textarea
                    className="min-h-36 rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Cena
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Kategoria
                  <select
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.category_id}
                    onChange={(event) => updateField("category_id", event.target.value)}
                    required
                  >
                    <option value="">Wybierz kategori&#281;</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Kolekcja
                  <select
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.collection_id}
                    onChange={(event) => updateField("collection_id", event.target.value)}
                  >
                    <option value="">Bez kolekcji</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Kolejno&#347;&#263; sortowania
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    type="number"
                    value={form.sort_order}
                    onChange={(event) => updateField("sort_order", event.target.value)}
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 text-sm font-semibold text-neutral-950">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) => updateField("is_active", event.target.checked)}
                  />
                  Aktywny produkt
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 text-sm font-semibold text-neutral-950">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateField("featured", event.target.checked)}
                  />
                  Poka&#380; na stronie g&#322;&#243;wnej
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  SEO title
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.seo_title}
                    onChange={(event) => updateField("seo_title", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  SEO description
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.seo_description}
                    onChange={(event) => updateField("seo_description", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950 md:col-span-2">
                  Link do g&#322;&#243;wnego zdj&#281;cia
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.cover_image}
                    onChange={(event) => updateField("cover_image", event.target.value)}
                    placeholder="URL zostanie uzupełniony po przesłaniu zdjęcia"
                  />
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-neutral-950/20 bg-porcelain p-4 text-sm font-semibold text-neutral-950 md:col-span-2">
                  G&#322;&#243;wne zdj&#281;cie
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                  />
                  {coverPreview && (
                    <img
                      src={coverPreview}
                      alt="Podglad glownego zdjecia"
                      className="h-56 w-full rounded-2xl object-contain"
                    />
                  )}
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-neutral-950/20 bg-porcelain p-4 text-sm font-semibold text-neutral-950 md:col-span-2">
                  Dodatkowe zdj&#281;cia
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))}
                  />
                  {galleryPreviews.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {galleryPreviews.map((preview) => (
                        <img
                          key={preview.url}
                          src={preview.url}
                          alt={preview.name}
                          className="h-32 w-full rounded-2xl object-contain"
                        />
                      ))}
                    </div>
                  )}
                </label>
              </div>

              {isEditing && (
                <div className="mt-6 rounded-2xl border border-neutral-950/10 bg-porcelain p-4">
                  <p className="text-sm font-semibold text-neutral-950">
                    Aktualne dodatkowe zdj&#281;cia
                  </p>
                  {editedProductImages.length ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {editedProductImages.map((image) => (
                        <div className="rounded-xl border border-neutral-950/10 bg-milk p-3" key={image.id}>
                          <img
                            src={image.image_url}
                            alt=""
                            className="h-28 w-full rounded-lg object-contain"
                          />
                          <button
                            className="btn btn-secondary mt-3 min-h-10 w-full px-4 text-xs"
                            type="button"
                            onClick={() => removeProductImage(image.id)}
                          >
                            <Trash2 size={15} />
                            Usu&#324; zdj&#281;cie
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-stone">Brak zdj&#281;&#263; w galerii.</p>
                  )}
                </div>
              )}

              <button className="btn btn-primary mt-8 w-full" type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? "Zapisywanie..." : isEditing ? "Zapisz zmiany" : "Dodaj produkt"}
              </button>
            </form>

            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista produkt&#243;w</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} />}
              </div>

              <div className="space-y-4">
                {products.length === 0 && !isLoading && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak produkt&#243;w do wy&#347;wietlenia.
                  </p>
                )}

                {products.map((product) => (
                  <article
                    key={product.id}
                    className="grid gap-4 rounded-2xl border border-neutral-950/10 bg-porcelain p-4 md:grid-cols-[8rem_1fr] md:items-center"
                  >
                    <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-milk p-2">
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-stone">
                          <ImagePlus size={28} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="font-display text-3xl leading-tight">
                            {product.title}
                          </h3>
                          <p className="mt-2 text-sm text-stone">
                            {product.category || "Bez kategorii"} &middot; {formatPrice(product.price)}
                            {product.featured ? " · Strona główna" : ""}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone">
                            {product.is_active ? "Aktywny" : "Ukryty"} &middot;{" "}
                            {formatDate(product.created_at)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn btn-secondary min-h-10 px-4 text-xs"
                            type="button"
                            onClick={() => editProduct(product)}
                          >
                            <Edit3 size={16} />
                            Edytuj
                          </button>
                          <button
                            className="btn btn-secondary min-h-10 px-4 text-xs"
                            type="button"
                            onClick={() => toggleProduct(product)}
                          >
                            {product.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                            {product.is_active ? "Ukryj" : "Opublikuj"}
                          </button>
                          <button
                            className="btn btn-secondary min-h-10 border-rosewood/30 px-4 text-xs text-rosewood"
                            type="button"
                            onClick={() => removeProduct(product)}
                          >
                            <Trash2 size={16} />
                            Usu&#324; produkt
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminProductsPage;
