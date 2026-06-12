import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { registerCustomer, signInCustomer } from "../lib/customerAuth.js";
import { upsertCustomerProfile } from "../features/account/customerProfilesRepository.js";

function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: "", text: "" });
    setIsSubmitting(true);

    const registerResult = await registerCustomer(form.email.trim(), form.password);

    if (registerResult.error) {
      setIsSubmitting(false);
      setMessage({
        type: "error",
        text: "Nie udało się utworzyć konta. Sprawdź dane lub spróbuj ponownie.",
      });
      return;
    }

    if (!registerResult.data?.access_token) {
      const loginResult = await signInCustomer(form.email.trim(), form.password);
      if (loginResult.error) {
        setIsSubmitting(false);
        setMessage({
          type: "success",
          text: "Konto zostało utworzone. Sprawdź e-mail i zaloguj się po potwierdzeniu konta.",
        });
        return;
      }
    }

    await upsertCustomerProfile({
      full_name: form.full_name.trim(),
      phone: form.phone.trim() || null,
      street: null,
      postal_code: null,
      city: null,
    });

    setIsSubmitting(false);
    window.location.hash = "#/account";
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10">
          <p className="eyebrow">Konto klienta</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">Utwórz konto</h1>
          <p className="mt-5 text-lg leading-8 text-stone">
            Załóż konto, aby wygodnie śledzić swoje zamówienia.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              Imię i nazwisko
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                type="text"
                autoComplete="name"
                value={form.full_name}
                onChange={(event) => updateField("full_name", event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              E-mail
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              Telefon
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone">
              Hasło
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
              />
            </label>

            {message.text && (
              <p
                className={`text-sm leading-6 ${
                  message.type === "error" ? "text-rosewood" : "text-stone"
                }`}
              >
                {message.text}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                ) : (
                  <UserPlus size={18} aria-hidden="true" />
                )}
                UTWÓRZ KONTO
              </button>
              <a className="btn btn-secondary" href="#/login">
                Mam już konto
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;

