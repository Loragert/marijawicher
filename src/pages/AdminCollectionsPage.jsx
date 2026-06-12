import { Edit3, Eye, EyeOff, FolderKanban, ImagePlus, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import {
  createCollection,
  getAdminCollections,
  setCollectionActive,
  updateCollection,
  uploadCollectionImage,
} from "../features/catalog/collectionsRepository.js";

const emptyForm = {
  id: null,
  title: "",
  slug: "",
  description: "",
  cover_image: "",
  sort_order: "0",
  is_active: true,
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

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(value));
}

function AdminCollectionsPage() {
  const [form, setForm] = useState(emptyForm);
  const [collections, setCollections] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : form.cover_image),
    [coverFile, form.cover_image],
  );
  const isEditing = Boolean(form.id);

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    return () => {
      if (coverFile && coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverFile, coverPreview]);

  async function loadCollections() {
    setIsLoading(true);
    const result = await getAdminCollections();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kolekcji. Sprawdź Supabase i polityki RLS.",
      });
      return;
    }

    setCollections(result.data || []);
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
    setSlugTouched(false);
    setStatus({ type: "", message: "" });
  }

  function editCollection(collection) {
    setForm({
      id: collection.id,
      title: collection.title || "",
      slug: collection.slug || "",
      description: collection.description || "",
      cover_image: collection.cover_image || "",
      sort_order: String(collection.sort_order ?? 0),
      is_active: Boolean(collection.is_active),
    });
    setCoverFile(null);
    setSlugTouched(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    const slug = form.slug || createSlug(form.title);
    let coverImageUrl = form.cover_image;

    if (coverFile) {
      const uploadResult = await uploadCollectionImage(coverFile, slug);

      if (uploadResult.error) {
        setIsSaving(false);
        setStatus({
          type: "error",
          message: "Nie udało się przesłać zdjęcia kolekcji do Supabase Storage.",
        });
        return;
      }

      coverImageUrl = uploadResult.data.publicUrl;
    }

    const payload = {
      title: form.title,
      slug,
      description: form.description || null,
      cover_image: coverImageUrl || null,
      sort_order: Number(form.sort_order || 0),
      is_active: form.is_active,
    };

    const result = isEditing
      ? await updateCollection(form.id, payload)
      : await createCollection(payload);

    setIsSaving(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zapisać kolekcji. Sprawdź uprawnienia administratora.",
      });
      return;
    }

    resetForm();
    setStatus({
      type: "success",
      message: isEditing ? "Kolekcja została zaktualizowana." : "Kolekcja została utworzona.",
    });
    await loadCollections();
  }

  async function toggleCollection(collection) {
    const result = await setCollectionActive(collection.id, !collection.is_active);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić widoczności kolekcji.",
      });
      return;
    }

    setStatus({
      type: "success",
      message: collection.is_active ? "Kolekcja została ukryta." : "Kolekcja została opublikowana.",
    });
    await loadCollections();
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Kolekcje</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Zarządzaj kolekcjami, zdjęciami i kolejnością prezentacji przyszłego sklepu.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Nowa kolekcja
            </button>
          </div>

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

          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <form
              className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">
                  {isEditing ? "Edytuj kolekcję" : "Dodaj kolekcję"}
                </h2>
                <FolderKanban size={26} aria-hidden="true" />
              </div>

              <div className="grid gap-5">
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Tytuł
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

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Opis
                  <textarea
                    className="min-h-32 rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Kolejność sortowania
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
                  Aktywna kolekcja
                </label>

                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Link do zdjęcia
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.cover_image}
                    onChange={(event) => updateField("cover_image", event.target.value)}
                    placeholder="URL zostanie uzupełniony po przesłaniu zdjęcia"
                  />
                </label>

                <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-neutral-950/20 bg-porcelain p-4 text-sm font-semibold text-neutral-950">
                  Zdjęcie kolekcji
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                  />
                  {coverPreview && (
                    <img
                      src={coverPreview}
                      alt="Podgląd zdjęcia kolekcji"
                      className="h-56 w-full rounded-2xl object-cover"
                    />
                  )}
                </label>
              </div>

              <button className="btn btn-primary mt-8 w-full" type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? "Zapisywanie..." : isEditing ? "Zapisz zmiany" : "Dodaj kolekcję"}
              </button>
            </form>

            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista kolekcji</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} />}
              </div>

              <div className="space-y-4">
                {collections.map((collection) => (
                  <article
                    className="grid gap-4 rounded-2xl border border-neutral-950/10 bg-porcelain p-4 md:grid-cols-[8rem_1fr] md:items-center"
                    key={collection.id}
                  >
                    <div className="h-32 overflow-hidden rounded-xl bg-milk">
                      {collection.cover_image ? (
                        <img
                          src={collection.cover_image}
                          alt={collection.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-stone">
                          <ImagePlus size={28} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-display text-3xl">{collection.title}</h3>
                        <p className="mt-2 text-sm text-stone">
                          {collection.slug} · sort: {collection.sort_order} ·{" "}
                          {formatDate(collection.created_at)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone">
                          {collection.is_active ? "Aktywna" : "Ukryta"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn btn-secondary min-h-10 px-4 text-xs"
                          type="button"
                          onClick={() => editCollection(collection)}
                        >
                          <Edit3 size={16} />
                          Edytuj
                        </button>
                        <button
                          className="btn btn-secondary min-h-10 px-4 text-xs"
                          type="button"
                          onClick={() => toggleCollection(collection)}
                        >
                          {collection.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                          {collection.is_active ? "Ukryj" : "Opublikuj"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {collections.length === 0 && !isLoading && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak kolekcji do wyświetlenia.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminCollectionsPage;
