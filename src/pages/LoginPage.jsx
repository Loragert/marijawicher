import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { signInCustomer } from "../lib/customerAuth.js";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signInCustomer(form.email.trim(), form.password);
    setIsSubmitting(false);

    if (result.error) {
      setError("Nie udało się zalogować. Sprawdź e-mail i hasło.");
      return;
    }

    window.location.hash = "#/account";
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10">
          <p className="eyebrow">Konto klienta</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">Zaloguj się</h1>
          <p className="mt-5 text-lg leading-8 text-stone">
            Zaloguj się, aby zobaczyć swoje dane i zamówienia.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
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
              Hasło
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
              />
            </label>

            {error && <p className="text-sm leading-6 text-rosewood">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                ) : (
                  <LogIn size={18} aria-hidden="true" />
                )}
                ZALOGUJ SIĘ
              </button>
              <a className="btn btn-secondary" href="#/register">
                Utwórz konto
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

