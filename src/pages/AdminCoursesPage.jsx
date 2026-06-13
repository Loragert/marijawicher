import { Edit3, ImagePlus, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import {
  courseStatuses,
  createCourse,
  deleteCourse,
  getAdminCourses,
  getCourseStatusLabel,
  updateCourse,
  uploadCourseImage,
} from "../features/courses/coursesRepository.js";
import { formatCartPrice } from "../features/cart/cartModel.js";

const emptyCourseForm = {
  title: "",
  short_description: "",
  full_description: "",
  price: "",
  start_date: "",
  duration: "",
  total_places: "",
  available_places: "",
  status: "available",
  image_url: "",
};

function normalizeCoursePayload(form) {
  return {
    title: form.title.trim(),
    short_description: form.short_description.trim() || null,
    full_description: form.full_description.trim() || null,
    price: Number(form.price || 0),
    start_date: form.start_date || null,
    duration: form.duration.trim() || null,
    total_places: Number.parseInt(form.total_places, 10) || 0,
    available_places: Number.parseInt(form.available_places, 10) || 0,
    status: form.status,
    image_url: form.image_url.trim() || null,
  };
}

function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const result = await getAdminCourses();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kursów. Sprawdź tabelę courses i polityki RLS.",
      });
      return;
    }

    setCourses(result.data || []);
  }

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function startEdit(course) {
    setEditingCourseId(course.id);
    setImageFile(null);
    setForm({
      title: course.title || "",
      short_description: course.short_description || "",
      full_description: course.full_description || "",
      price: course.price ?? "",
      start_date: course.start_date || "",
      duration: course.duration || "",
      total_places: course.total_places ?? "",
      available_places: course.available_places ?? "",
      status: course.status || "available",
      image_url: course.image_url || "",
    });
  }

  function resetForm() {
    setEditingCourseId("");
    setImageFile(null);
    setForm(emptyCourseForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    let payload = normalizeCoursePayload(form);

    if (imageFile) {
      const uploadResult = await uploadCourseImage(imageFile, form.title);

      if (uploadResult.error) {
        setIsSaving(false);
        setStatus({
          type: "error",
          message: "Nie udało się przesłać zdjęcia kursu.",
        });
        return;
      }

      payload = { ...payload, image_url: uploadResult.data.publicUrl };
    }

    const result = editingCourseId
      ? await updateCourse(editingCourseId, payload)
      : await createCourse(payload);

    setIsSaving(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zapisać kursu.",
      });
      return;
    }

    setStatus({ type: "success", message: "Kurs został zapisany." });
    resetForm();
    loadCourses();
  }

  async function handleDelete(course) {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten kurs?");

    if (!confirmed) return;

    const result = await deleteCourse(course.id);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się usunąć kursu. Jeśli są zgłoszenia, ustaw status Ukryty.",
      });
      return;
    }

    setStatus({ type: "success", message: "Kurs został usunięty." });
    loadCourses();
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Kursy</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Dodawaj terminy kursów, opis programu, cenę, liczbę miejsc i zdjęcie.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={loadCourses}>
              <RefreshCw size={16} aria-hidden="true" />
              Odśwież
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

          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <form
              className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8"
              onSubmit={handleSubmit}
            >
              <p className="eyebrow">{editingCourseId ? "Edycja kursu" : "Nowy kurs"}</p>
              <h2 className="font-display text-4xl leading-tight">
                {editingCourseId ? "Edytuj kurs" : "Dodaj kurs"}
              </h2>

              <div className="mt-7 grid gap-5">
                <label className="admin-field">
                  Nazwa kursu
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    required
                  />
                </label>
                <label className="admin-field">
                  Krótki opis
                  <textarea
                    rows="3"
                    value={form.short_description}
                    onChange={(event) => updateField("short_description", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  Pełny opis / program
                  <textarea
                    rows="6"
                    value={form.full_description}
                    onChange={(event) => updateField("full_description", event.target.value)}
                  />
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="admin-field">
                    Cena
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => updateField("price", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    Data startu
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(event) => updateField("start_date", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    Czas trwania
                    <input
                      value={form.duration}
                      onChange={(event) => updateField("duration", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    Status
                    <select
                      value={form.status}
                      onChange={(event) => updateField("status", event.target.value)}
                    >
                      {courseStatuses.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-field">
                    Liczba miejsc
                    <input
                      type="number"
                      min="0"
                      value={form.total_places}
                      onChange={(event) => updateField("total_places", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    Dostępne miejsca
                    <input
                      type="number"
                      min="0"
                      value={form.available_places}
                      onChange={(event) => updateField("available_places", event.target.value)}
                    />
                  </label>
                </div>
                <label className="admin-field">
                  Link do zdjęcia
                  <input
                    value={form.image_url}
                    onChange={(event) => updateField("image_url", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  Zdjęcie kursu
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="btn btn-primary" type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                  ) : (
                    <Plus size={18} aria-hidden="true" />
                  )}
                  {editingCourseId ? "ZAPISZ ZMIANY" : "DODAJ KURS"}
                </button>
                {editingCourseId && (
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Anuluj
                  </button>
                )}
              </div>
            </form>

            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista kursów</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} aria-hidden="true" />}
              </div>

              <div className="space-y-4">
                {!isLoading && courses.length === 0 && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak kursów do wyświetlenia.
                  </p>
                )}

                {courses.map((course) => (
                  <article
                    className="grid gap-5 rounded-2xl border border-neutral-950/10 bg-porcelain p-5 md:grid-cols-[7rem_1fr]"
                    key={course.id}
                  >
                    <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-milk">
                      {course.image_url ? (
                        <img
                          src={course.image_url}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="text-stone" size={26} aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-stone">
                            {getCourseStatusLabel(course.status)}
                          </p>
                          <h3 className="mt-2 font-display text-3xl leading-tight">
                            {course.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-stone">
                            {course.start_date || "Bez daty"} · {formatCartPrice(course.price)} ·{" "}
                            {course.available_places ?? 0}/{course.total_places ?? 0} miejsc
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn btn-secondary min-h-10 px-4 text-xs"
                            type="button"
                            onClick={() => startEdit(course)}
                          >
                            <Edit3 size={15} aria-hidden="true" />
                            Edytuj
                          </button>
                          <button
                            className="btn btn-secondary min-h-10 px-4 text-xs"
                            type="button"
                            onClick={() => handleDelete(course)}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            Usuń
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

export default AdminCoursesPage;

