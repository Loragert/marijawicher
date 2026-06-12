import { LogOut } from "lucide-react";
import { signOutAdmin } from "../lib/supabaseAuth.js";

const adminLinks = [
  { label: "Dashboard", href: "#/admin" },
  { label: "Produkty", href: "#/admin/products" },
  { label: "Kategorie", href: "#/admin/categories" },
  { label: "Kolekcje", href: "#/admin/collections" },
  { label: "Wiadomości", href: "#/admin/messages" },
];

function AdminLayout({ title, description, children }) {
  async function handleLogout() {
    await signOutAdmin();
    window.location.hash = "#/admin/login";
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="mb-8 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-5 shadow-soft">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow mb-3">ADMIN</p>
              {title && (
                <h1 className="font-display text-5xl leading-tight md:text-7xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-4 max-w-2xl text-lg leading-8 text-stone">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {adminLinks.map((link) => (
                <a key={link.href} className="btn btn-secondary min-h-10 px-4 text-xs" href={link.href}>
                  {link.label}
                </a>
              ))}
              <button className="btn btn-primary min-h-10 px-4 text-xs" type="button" onClick={handleLogout}>
                <LogOut size={16} />
                Wyloguj
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

export default AdminLayout;
