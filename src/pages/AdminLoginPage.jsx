import { LogIn } from "lucide-react";
import { useState } from "react";
import { signInAdmin } from "../lib/supabaseAuth.js";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signInAdmin(email, password);
    setIsLoading(false);

    if (result.error) {
      console.error(result.error);

      setError(
        `Błąd logowania: ${ result.error.message || JSON.stringify(result.error) }`
      );

      return;
    }

    window.location.hash = "#/admin";
  }

  return (
    <section className="min-h-screen bg-porcelain pt-20">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center px-5 py-12 sm:px-8">
        <form
          className="w-full rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10"
          onSubmit={handleSubmit}
        >
          <p className="eyebrow">ADMIN</p>
          <h1 className="font-display text-5xl leading-tight">Logowanie</h1>
          <p className="mt-5 leading-7 text-stone">
            Zaloguj się, aby zarządzać produktami, kategoriami i kolekcjami.
          </p>

          {error && (
            <p className="mt-6 rounded-2xl border border-rosewood/30 bg-porcelain p-4 text-sm text-rosewood">
              {error}
            </p>
          )}

          <div className="mt-8 grid gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
              Email
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
              Hasło
              <input
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary mt-8 w-full" type="submit" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? "Logowanie..." : "Zaloguj"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLoginPage;
