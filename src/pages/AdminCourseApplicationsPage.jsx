import { BookOpenCheck, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { formatCartPrice } from "../features/cart/cartModel.js";
import {
  courseApplicationStatuses,
  getAdminCourseApplications,
  getCourseApplicationStatusLabel,
  updateCourseApplicationStatus,
} from "../features/courses/coursesRepository.js";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AdminCourseApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const selectedApplication = useMemo(
    () =>
      applications.find((application) => application.id === selectedApplicationId) ||
      applications[0],
    [applications, selectedApplicationId],
  );

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const result = await getAdminCourseApplications();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message:
          "Nie udało się pobrać zgłoszeń. Sprawdź tabelę course_applications i polityki RLS.",
      });
      return;
    }

    const nextApplications = result.data || [];
    setApplications(nextApplications);
    setSelectedApplicationId((currentId) =>
      nextApplications.some((application) => application.id === currentId)
        ? currentId
        : nextApplications[0]?.id || "",
    );
  }

  async function handleStatusChange(applicationId, nextStatus) {
    setIsUpdating(true);
    setStatus({ type: "", message: "" });

    const result = await updateCourseApplicationStatus(applicationId, nextStatus);
    setIsUpdating(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić statusu zgłoszenia.",
      });
      return;
    }

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId ? { ...application, status: nextStatus } : application,
      ),
    );
    setStatus({ type: "success", message: "Status zgłoszenia został zaktualizowany." });
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">
                Zgłoszenia na kursy
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Przeglądaj zapisy klientów i aktualizuj status zgłoszeń.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={loadApplications}>
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

          <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista zgłoszeń</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} aria-hidden="true" />}
              </div>

              <div className="space-y-4">
                {!isLoading && applications.length === 0 && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak zgłoszeń do wyświetlenia.
                  </p>
                )}

                {applications.map((application) => (
                  <button
                    className={`w-full rounded-2xl border p-5 text-left transition duration-500 hover:-translate-y-1 hover:shadow-soft ${
                      selectedApplication?.id === application.id
                        ? "border-rosewood/40 bg-porcelain"
                        : "border-neutral-950/10 bg-porcelain/70 hover:border-rosewood/30"
                    }`}
                    key={application.id}
                    type="button"
                    onClick={() => setSelectedApplicationId(application.id)}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone">
                          {formatDate(application.created_at)}
                        </p>
                        <h3 className="mt-3 font-display text-3xl leading-tight text-neutral-950">
                          {application.customer_name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone">
                          {application.customer_email}
                          {application.customer_phone ? ` · ${application.customer_phone}` : ""}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-stone">
                          {application.courses?.title || "Kurs szycia"}
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-neutral-950/10 bg-milk px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
                        {getCourseApplicationStatusLabel(application.status)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              {selectedApplication ? (
                <>
                  <div className="mb-7 flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
                      <BookOpenCheck size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow mb-2">Podgląd</p>
                      <h2 className="font-display text-4xl leading-tight">
                        {selectedApplication.customer_name}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-6 text-stone">
                    <p>
                      <span className="font-semibold text-neutral-950">Kurs:</span>{" "}
                      {selectedApplication.courses?.title || "Kurs szycia"}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Start:</span>{" "}
                      {selectedApplication.courses?.start_date || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Cena:</span>{" "}
                      {formatCartPrice(selectedApplication.courses?.price)}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Data zgłoszenia:</span>{" "}
                      {formatDate(selectedApplication.created_at)}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Email:</span>{" "}
                      <a
                        className="hover:text-rosewood"
                        href={`mailto:${selectedApplication.customer_email}`}
                      >
                        {selectedApplication.customer_email}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Telefon:</span>{" "}
                      {selectedApplication.customer_phone ? (
                        <a
                          className="hover:text-rosewood"
                          href={`tel:${selectedApplication.customer_phone}`}
                        >
                          {selectedApplication.customer_phone}
                        </a>
                      ) : (
                        "Brak"
                      )}
                    </p>
                  </div>

                  <label className="mt-7 flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                    Status zgłoszenia
                    <select
                      className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                      value={selectedApplication.status || "new"}
                      onChange={(event) =>
                        handleStatusChange(selectedApplication.id, event.target.value)
                      }
                      disabled={isUpdating}
                    >
                      {courseApplicationStatuses.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-neutral-950/10 bg-porcelain p-8 text-center text-stone">
                  <BookOpenCheck size={36} aria-hidden="true" />
                  <p className="mt-5">Wybierz zgłoszenie z listy.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminCourseApplicationsPage;

