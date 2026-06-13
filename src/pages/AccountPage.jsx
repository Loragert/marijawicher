import { BookOpen, Loader2, LogOut, PackageCheck, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCustomerSession,
  isCustomerLoggedIn,
  signOutCustomer,
} from "../lib/customerAuth.js";
import {
  getCustomerProfile,
  upsertCustomerProfile,
} from "../features/account/customerProfilesRepository.js";
import { formatCartPrice } from "../features/cart/cartModel.js";
import {
  getCourseApplicationStatusLabel,
  getCustomerCourseApplications,
} from "../features/courses/coursesRepository.js";
import { getCustomerOrders, getOrderStatusLabel } from "../features/orders/ordersRepository.js";

const emptyProfileForm = {
  full_name: "",
  phone: "",
  street: "",
  postal_code: "",
  city: "",
};

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AccountPage() {
  const [session, setSession] = useState(() => getCustomerSession());
  const [profile, setProfile] = useState(emptyProfileForm);
  const [orders, setOrders] = useState([]);
  const [courseApplications, setCourseApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      window.location.hash = "#/login";
      return;
    }

    loadAccount();
  }, []);

  async function loadAccount() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    const currentSession = getCustomerSession();
    setSession(currentSession);

    const [profileResult, ordersResult, courseApplicationsResult] = await Promise.all([
      getCustomerProfile(),
      getCustomerOrders(),
      getCustomerCourseApplications(),
    ]);

    setIsLoading(false);

    if (profileResult.error && profileResult.status !== 406) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać profilu. Sprawdź konfigurację Supabase.",
      });
    }

    if (ordersResult.error && ordersResult.status !== 401) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać zamówień. Sprawdź konfigurację Supabase.",
      });
    }

    if (courseApplicationsResult.error && courseApplicationsResult.status !== 401) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać zgłoszeń na kursy. Sprawdź konfigurację Supabase.",
      });
    }

    if (profileResult.data) {
      setProfile({
        full_name: profileResult.data.full_name || "",
        phone: profileResult.data.phone || "",
        street: profileResult.data.street || "",
        postal_code: profileResult.data.postal_code || "",
        city: profileResult.data.city || "",
      });
    }

    setOrders(ordersResult.data || []);
    setCourseApplications(courseApplicationsResult.data || []);
  }

  function updateField(name, value) {
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  }

  async function handleSaveProfile(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    const result = await upsertCustomerProfile({
      full_name: profile.full_name.trim() || null,
      phone: profile.phone.trim() || null,
      street: profile.street.trim() || null,
      postal_code: profile.postal_code.trim() || null,
      city: profile.city.trim() || null,
    });

    setIsSaving(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zapisać danych profilu.",
      });
      return;
    }

    setStatus({ type: "success", message: "Dane profilu zostały zapisane." });
  }

  async function handleLogout() {
    await signOutCustomer();
    window.location.hash = "#/login";
  }

  if (isLoading) {
    return (
      <section className="bg-porcelain pt-20">
        <div className="flex min-h-96 items-center justify-center text-stone">
          <Loader2 className="mr-3 animate-spin" size={22} aria-hidden="true" />
          Ładowanie konta...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20 lg:px-10">
        <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Konto klienta</p>
            <h1 className="font-display text-5xl leading-tight md:text-7xl">Moje konto</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
              Zarządzaj danymi kontaktowymi, adresem dostawy i sprawdzaj swoje zamówienia.
            </p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            <LogOut size={18} aria-hidden="true" />
            Wyloguj
          </button>
        </header>

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

        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
          <form
            className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8"
            onSubmit={handleSaveProfile}
          >
            <p className="eyebrow">Profil</p>
            <h2 className="font-display text-4xl leading-tight">Dane klienta</h2>
            <p className="mt-3 text-sm leading-6 text-stone">
              E-mail: <span className="font-semibold text-neutral-950">{session?.user?.email}</span>
            </p>

            <div className="mt-7 grid gap-5">
              {[
                ["full_name", "Imię i nazwisko", "text", "name"],
                ["phone", "Telefon", "tel", "tel"],
                ["street", "Ulica i numer domu", "text", "street-address"],
                ["postal_code", "Kod pocztowy", "text", "postal-code"],
                ["city", "Miasto", "text", "address-level2"],
              ].map(([name, label, type, autoComplete]) => (
                <label
                  className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone"
                  key={name}
                >
                  {label}
                  <input
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                    type={type}
                    autoComplete={autoComplete}
                    value={profile[name]}
                    onChange={(event) => updateField(name, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <button className="btn btn-primary mt-8" type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <Save size={18} aria-hidden="true" />
              )}
              ZAPISZ DANE
            </button>
          </form>

          <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
            <div className="mb-7 flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
                <PackageCheck size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow mb-2">Zamówienia</p>
                <h2 className="font-display text-4xl leading-tight">Moje zamówienia</h2>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                Nie masz jeszcze zamówień przypisanych do konta.
              </p>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <article
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5"
                    key={order.id}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone">
                          {formatDate(order.created_at)}
                        </p>
                        <h3 className="mt-2 font-display text-3xl leading-tight text-neutral-950">
                          Zamówienie #{String(order.id).slice(0, 8)}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <span className="font-semibold text-neutral-950">
                          {formatCartPrice(order.total_amount)}
                        </span>
                        <span className="w-fit rounded-full border border-neutral-950/10 bg-milk px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-neutral-950/10 pt-4">
                      {(order.items || []).map((item, index) => (
                        <div className="flex justify-between gap-4 text-sm leading-6" key={index}>
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-semibold text-neutral-950">
                            {formatCartPrice(item.line_total || item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-2 border-t border-neutral-950/10 pt-4 text-sm leading-6 text-stone">
                      <p>
                        <span className="font-semibold text-neutral-950">Kontakt:</span>{" "}
                        {order.customer_name}, {order.customer_email}, {order.customer_phone || "brak telefonu"}
                      </p>
                      <p>
                        <span className="font-semibold text-neutral-950">Adres:</span>{" "}
                        {order.street}, {order.postal_code} {order.city}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
          <div className="mb-7 flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
              <BookOpen size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow mb-2">Kursy</p>
              <h2 className="font-display text-4xl leading-tight">Moje kursy</h2>
            </div>
          </div>

          {courseApplications.length === 0 ? (
            <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
              Nie masz jeszcze zgłoszeń na kursy.
            </p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {courseApplications.map((application) => {
                const course = application.courses || {};

                return (
                  <article
                    className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5"
                    key={application.id}
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-stone">
                      {formatDate(application.created_at)}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-tight text-neutral-950">
                      {course.title || "Kurs szycia"}
                    </h3>
                    <div className="mt-5 grid gap-2 text-sm leading-6 text-stone">
                      <p>
                        <span className="font-semibold text-neutral-950">Start:</span>{" "}
                        {formatDate(course.start_date)}
                      </p>
                      <p>
                        <span className="font-semibold text-neutral-950">Cena:</span>{" "}
                        {formatCartPrice(course.price)}
                      </p>
                      <p>
                        <span className="font-semibold text-neutral-950">Status:</span>{" "}
                        {getCourseApplicationStatusLabel(application.status)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AccountPage;
