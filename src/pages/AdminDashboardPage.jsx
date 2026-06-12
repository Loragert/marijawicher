import { ClipboardList, FolderKanban, Inbox, LayoutDashboard, Package, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { getAdminCategories } from "../features/catalog/categoriesRepository.js";
import { getAdminCollections } from "../features/catalog/collectionsRepository.js";
import { getAdminProducts } from "../features/catalog/productsRepository.js";
import { getAdminContactMessages } from "../features/contact/contactMessagesRepository.js";
import { getAdminOrders } from "../features/orders/ordersRepository.js";

const dashboardLinks = [
  { href: "#/admin/products", label: "Produkty", icon: Package },
  { href: "#/admin/categories", label: "Kategorie", icon: Tags },
  { href: "#/admin/collections", label: "Kolekcje", icon: FolderKanban },
  { href: "#/admin/messages", label: "Wiadomości", icon: Inbox },
  { href: "#/admin/orders", label: "Zamówienia", icon: ClipboardList },
];

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    hiddenProducts: 0,
    categories: 0,
    collections: 0,
    messages: 0,
    orders: 0,
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadStats() {
      const [productsResult, categoriesResult, collectionsResult, messagesResult, ordersResult] =
        await Promise.all([
          getAdminProducts(),
          getAdminCategories(),
          getAdminCollections(),
          getAdminContactMessages(),
          getAdminOrders(),
        ]);

      if (
        productsResult.error ||
        categoriesResult.error ||
        collectionsResult.error ||
        messagesResult.error ||
        ordersResult.error
      ) {
        setStatus("Nie udało się pobrać statystyk. Sprawdź Supabase i uprawnienia RLS.");
        return;
      }

      const products = productsResult.data || [];
      setStats({
        products: products.length,
        activeProducts: products.filter((product) => product.is_active).length,
        hiddenProducts: products.filter((product) => !product.is_active).length,
        categories: (categoriesResult.data || []).length,
        collections: (collectionsResult.data || []).length,
        messages: (messagesResult.data || []).length,
        orders: (ordersResult.data || []).length,
      });
    }

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10">
            <p className="eyebrow">ADMIN</p>
            <h1 className="font-display text-5xl leading-tight md:text-7xl">Dashboard</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
              Szybki podgląd katalogu produktów, kategorii, kolekcji i wiadomości MARIJA.
            </p>
          </div>

          {status && (
            <div className="mb-8 rounded-[1.25rem] border border-rosewood/40 bg-milk p-5 text-sm leading-6 text-rosewood">
              {status}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {[
              ["Wszystkie produkty", stats.products],
              ["Aktywne produkty", stats.activeProducts],
              ["Ukryte produkty", stats.hiddenProducts],
              ["Kategorie", stats.categories],
              ["Kolekcje", stats.collections],
              ["Wiadomości", stats.messages],
              ["Zamówienia", stats.orders],
            ].map(([label, value]) => (
              <article
                className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft"
                key={label}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-stone">{label}</p>
                <p className="mt-5 font-display text-5xl text-neutral-950">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {dashboardLinks.map(({ href, label, icon: Icon }) => (
              <a
                className="group rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                href={href}
                key={href}
              >
                <Icon className="mb-6 text-rosewood" size={30} aria-hidden="true" />
                <span className="font-display text-4xl text-neutral-950">{label}</span>
                <span className="mt-4 block text-sm leading-6 text-stone">
                  Przejdź do zarządzania sekcją.
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <LayoutDashboard className="mt-1 text-rosewood" size={26} aria-hidden="true" />
              <p className="text-sm leading-7 text-stone">
                Panel jest przygotowany jako pierwszy etap administracji sklepu. Koszyk,
                zamówienia i płatności zostaną podłączone w kolejnych etapach.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
