import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { navigation } from "../data/navigation.js";

function getNavigationRoute(href) {
  return href.replace(/^#\/?/, "").replace(/^\//, "") || "";
}

function isNavigationItemActive(item, currentRoute) {
  const itemRoute = getNavigationRoute(item.href);

  if (itemRoute === "kolekcje") {
    return currentRoute === "kolekcje";
  }

  if (itemRoute === "sklep") {
    return currentRoute === "sklep" || currentRoute.startsWith("produkt/");
  }

  return currentRoute === itemRoute;
}

function Header({ currentRoute = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-950/10 bg-porcelain/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Główna nawigacja"
      >
        <a href="/" className="logo" onClick={() => setIsOpen(false)}>
          KRAWIECTWO MARIJA
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => {
            const isActive = isNavigationItemActive(item, currentRoute);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button className="icon-button" aria-label="Szukaj">
            <Search size={20} aria-hidden="true" />
          </button>
          <button className="icon-button" aria-label="Profil użytkownika">
            <User size={20} aria-hidden="true" />
          </button>
          <button className="icon-button" aria-label="Koszyk">
            <ShoppingBag size={20} aria-hidden="true" />
          </button>
          <button
            className="icon-button lg:hidden"
            aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-neutral-950/10 bg-milk px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navigation.map((item) => {
              const isActive = isNavigationItemActive(item, currentRoute);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-sm uppercase tracking-[0.18em] transition ${
                    isActive ? "text-rosewood" : "text-neutral-950"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
