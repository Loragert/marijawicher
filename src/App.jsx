import { useEffect, useState } from "react";
import AboutBrandSection from "./components/AboutBrandSection.jsx";
import CollectionsSection from "./components/CollectionsSection.jsx";
import FeaturedProductsSection from "./components/FeaturedProductsSection.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import HomeDirectionsSection from "./components/HomeDirectionsSection.jsx";
import AdminCategoriesPage from "./pages/AdminCategoriesPage.jsx";
import AdminCollectionsPage from "./pages/AdminCollectionsPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminMessagesPage from "./pages/AdminMessagesPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import DostawaPage from "./pages/DostawaPage.jsx";
import HaftPage from "./pages/HaftPage.jsx";
import KontaktPage from "./pages/KontaktPage.jsx";
import KursyPage from "./pages/KursyPage.jsx";
import OMarijiPage from "./pages/OMarijiPage.jsx";
import OMarcePage from "./pages/OMarcePage.jsx";
import PolitykaPrywatnosciPage from "./pages/PolitykaPrywatnosciPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import RegulaminPage from "./pages/RegulaminPage.jsx";
import SklepPage from "./pages/SklepPage.jsx";
import SzycieNaMiarePage from "./pages/SzycieNaMiarePage.jsx";
import ZwrotyReklamacjePage from "./pages/ZwrotyReklamacjePage.jsx";
import { isAdminLoggedIn } from "./lib/supabaseAuth.js";

const pageRoutes = {
  admin: AdminDashboardPage,
  "admin/login": AdminLoginPage,
  "admin/products": AdminProductsPage,
  "admin/categories": AdminCategoriesPage,
  "admin/collections": AdminCollectionsPage,
  "admin/messages": AdminMessagesPage,
  "szycie-na-miare": SzycieNaMiarePage,
  haft: HaftPage,
  kursy: KursyPage,
  "o-mariji": OMarijiPage,
  "o-marce": OMarcePage,
  sklep: SklepPage,
  kontakt: KontaktPage,
  dostawa: DostawaPage,
  "zwroty-i-reklamacje": ZwrotyReklamacjePage,
  "polityka-prywatnosci": PolitykaPrywatnosciPage,
  regulamin: RegulaminPage,
};

const sectionRoutes = {
  kolekcje: "kolekcje",
  "szycie-na-miare-home": "szycie-na-miare",
};

function getRouteFromLocation() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "");
  const pathRoute = window.location.pathname.replace(/^\//, "");

  return hashRoute || pathRoute;
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsSection />
      <HomeDirectionsSection />
      <FeaturedProductsSection />
      <AboutBrandSection />
    </>
  );
}

function App() {
  const [route, setRoute] = useState(getRouteFromLocation);
  const [, setAuthVersion] = useState(0);
  const productSlug = route.startsWith("produkt/") ? route.replace(/^produkt\//, "") : "";
  const PageComponent = productSlug ? ProductPage : pageRoutes[route];
  const sectionId = sectionRoutes[route];
  const adminLoggedIn = isAdminLoggedIn();
  const isAdminRoute = route === "admin" || route.startsWith("admin/");
  const isAdminLoginRoute = route === "admin/login";
  const canRenderAdminRoute = !isAdminRoute || isAdminLoginRoute || adminLoggedIn;
  const EffectivePageComponent = canRenderAdminRoute ? PageComponent : AdminLoginPage;

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRouteFromLocation());

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = () => setAuthVersion((version) => version + 1);
    window.addEventListener("marija-admin-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("marija-admin-auth-change", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (isAdminRoute && !isAdminLoginRoute && !adminLoggedIn) {
      window.location.hash = "#/admin/login";
    }

    if (isAdminLoginRoute && adminLoggedIn) {
      window.location.hash = "#/admin";
    }
  }, [adminLoggedIn, isAdminLoginRoute, isAdminRoute]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [route]);

  useEffect(() => {
    if (EffectivePageComponent) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [EffectivePageComponent, sectionId]);

  return (
    <div className="min-h-screen bg-porcelain text-neutral-950">
      <Header currentRoute={route} />
      <main>
        {productSlug ? (
          <ProductPage slug={decodeURIComponent(productSlug)} />
        ) : EffectivePageComponent ? (
          <EffectivePageComponent />
        ) : (
          <HomePage />
        )}
      </main>
      <div id="kontakt">
        <Footer />
      </div>
    </div>
  );
}

export default App;
