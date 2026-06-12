import { Edit3, Eye, EyeOff, Loader2, Save, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import {
  createCategory,
  getAdminCategories,
  setCategoryActive,
  updateCategory,
} from "../features/catalog/categoriesRepository.js";

const emptyForm = {
  id: null,
  name: "",
  slug: "",
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

function AdminCategoriesPage() {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const isEditing = Boolean(form.id);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    const result = await getAdminCategories();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kategorii. Sprawdź Supabase i polityki RLS.",
      });
      return;
    }

    setCategories(result.data || []);
  }

  function updateField(name, value) {
    setForm((currentForm) => {
      const nextForm = { ...currentForm, [name]: value };
      if (name === "name" && !slugTouched && !currentForm.id) {
        nextForm.slug = createSlug(value);
      }
      return nextForm;
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setSlugTouched(false);
    setStatus({ type: "", message: "" });
  }

  function editCategory(category) {
    setForm({
      id: category.id,
      name: category.name || "",
      slug: category.slug || "",
      sort_order: String(category.sort_order ?? 0),
      is_active: Boolean(category.is_active),
    });
    setSlugTouched(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    const payload = {
      name: form.name,
      slug: form.slug || createSlug(form.name),
      sort_order: Number(form.sort_order || 0),
      is_active: form.is_active,
    };

    const result = isEditing
      ? await updateCategory(form.id, payload)
      : await createCategory(payload);

    setIsSaving(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zapisać kategorii. Sprawdź uprawnienia administratora.",
      });
      return;
    }

    resetForm();
    setStatus({
      type: "success",
      message: isEditing ? "Kategoria została zaktualizowana." : "Kategoria została utworzona.",
    });
    await loadCategories();
  }

  async function toggleCategory(category) {
    const result = await setCategoryActive(category.id, !category.is_active);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić widoczności kategorii.",
      });
      return;
    }

    setStatus({
      type: "success",
      message: category.is_active ? "Kategoria została ukryta." : "Kategoria została opublikowana.",
    });
    await loadCategories();
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Kategorie</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Twórz kategorie produktów, edytuj ich kolejność i zarządzaj widocznością.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Nowa kategoria
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

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <form
              className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">
                  {isEditing ? "Edytuj kategorię" : "Dodaj kategorię"}
                </h2>
                <Tags size={26} aria-hidden="true" />
              </div>

              <div className="grid gap-5">
                <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                  Nazwa
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
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
                  Aktywna kategoria
                </label>
              </div>

              <button className="btn btn-primary mt-8 w-full" type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? "Zapisywanie..." : isEditing ? "Zapisz zmiany" : "Dodaj kategorię"}
              </button>
            </form>

            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista kategorii</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} />}
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <article
                    className="flex flex-col gap-4 rounded-2xl border border-neutral-950/10 bg-porcelain p-5 md:flex-row md:items-center md:justify-between"
                    key={category.id}
                  >
                    <div>
                      <h3 className="font-display text-3xl">{category.name}</h3>
                      <p className="mt-2 text-sm text-stone">
                        {category.slug} · sort: {category.sort_order} · {formatDate(category.created_at)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone">
                        {category.is_active ? "Aktywna" : "Ukryta"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="btn btn-secondary min-h-10 px-4 text-xs"
                        type="button"
                        onClick={() => editCategory(category)}
                      >
                        <Edit3 size={16} />
                        Edytuj
                      </button>
                      <button
                        className="btn btn-secondary min-h-10 px-4 text-xs"
                        type="button"
                        onClick={() => toggleCategory(category)}
                      >
                        {category.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        {category.is_active ? "Ukryj" : "Opublikuj"}
                      </button>
                    </div>
                  </article>
                ))}

                {categories.length === 0 && !isLoading && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak kategorii do wyświetlenia.
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

export default AdminCategoriesPage;
