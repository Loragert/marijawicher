import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "../data/navigation.js";
import { useCart } from "../features/cart/CartContext.jsx";
import { isCustomerLoggedIn } from "../lib/customerAuth.js";

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
  const [customerLoggedIn, setCustomerLoggedIn] = useState(isCustomerLoggedIn);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleCustomerAuthChange = () => setCustomerLoggedIn(isCustomerLoggedIn());
    window.addEventListener("marija-customer-auth-change", handleCustomerAuthChange);

    return () => {
      window.removeEventListener("marija-customer-auth-change", handleCustomerAuthChange);
    };
  }, []);

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
          <a
            className="icon-button"
            href={customerLoggedIn ? "#/account" : "#/login"}
            aria-label={customerLoggedIn ? "Moje konto" : "Zaloguj się"}
            title={customerLoggedIn ? "Moje konto" : "Zaloguj się"}
          >
            <User size={20} aria-hidden="true" />
          </a>
          <a
            className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-stone transition hover:text-rosewood sm:inline-flex"
            href={customerLoggedIn ? "#/account" : "#/login"}
          >
            {customerLoggedIn ? "Moje konto" : "Zaloguj się"}
          </a>
          <a className="icon-button relative" href="#/cart" aria-label="Koszyk">
            <ShoppingBag size={20} aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rosewood px-1 text-[0.65rem] font-semibold leading-none text-milk">
                {itemCount}
              </span>
            )}
          </a>
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
