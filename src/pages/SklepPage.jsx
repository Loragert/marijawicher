import { ImagePlus, Loader2, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getActiveCategories } from "../features/catalog/categoriesRepository.js";
import { getActiveCollections } from "../features/catalog/collectionsRepository.js";
import { getActiveProducts } from "../features/catalog/productsRepository.js";
import { supabaseConfig } from "../lib/supabaseClient.js";

function formatPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value || 0));
}

function createLookup(items) {
  return items.reduce((lookup, item) => {
    lookup[item.id] = item;
    return lookup;
  }, {});
}

function ProductCard({ product, categoriesById, collectionsById }) {
  const categoryName = categoriesById[product.category_id]?.name || product.category || "Bez kategorii";
  const collectionName = collectionsById[product.collection_id]?.title || "Bez kolekcji";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 hover:-translate-y-2 hover:border-rosewood/30">
      <a href={`#/produkt/${product.slug}`} className="block">
        <div className="flex h-72 items-center justify-center overflow-hidden bg-porcelain p-5 sm:h-80">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.title}
              className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone">
              <ImagePlus size={36} aria-hidden="true" />
            </div>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-stone">
          {categoryName} &middot; {collectionName}
        </p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-neutral-950">
          {product.title}
        </h2>
        <p className="mt-4 text-lg font-semibold text-neutral-950">{formatPrice(product.price)}</p>
        <a className="btn btn-secondary mt-auto w-full" href={`#/produkt/${product.slug}`}>
          Zobacz produkt
        </a>
      </div>
    </article>
  );
}

function SklepPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const categoriesById = useMemo(() => createLookup(categories), [categories]);
  const collectionsById = useMemo(() => createLookup(collections), [collections]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatches = !selectedCategory || product.category_id === selectedCategory;
        const collectionMatches = !selectedCollection || product.collection_id === selectedCollection;

        return categoryMatches && collectionMatches;
      }),
    [products, selectedCategory, selectedCollection],
  );

  useEffect(() => {
    async function loadShopData() {
      setIsLoading(true);
      setError("");

      const [productsResult, categoriesResult, collectionsResult] = await Promise.all([
        getActiveProducts(),
        getActiveCategories(),
        getActiveCollections(),
      ]);

      setIsLoading(false);

      if (productsResult.error || categoriesResult.error || collectionsResult.error) {
        setError("Nie udało się pobrać danych sklepu. Sprawdź konfigurację Supabase.");
        return;
      }

      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
      setCollections(collectionsResult.data || []);
    }

    loadShopData();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((element) => element.classList.add("is-visible"));
  }, [filteredProducts.length, isLoading]);

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-16 lg:px-10">
        <div className="reveal-on-scroll mb-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow">SKLEP</p>
            <h1 className="font-display text-5xl leading-tight md:text-7xl">
              Kolekcje i produkty MARIJA
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-stone lg:justify-self-end">
            Odkryj autorskie projekty, haftowane dodatki i wybrane produkty tworzone w pracowni
            Krawiectwo MARIJA.
          </p>
        </div>

        {!supabaseConfig.isConfigured && (
          <div className="mb-8 rounded-[1.25rem] border border-rosewood/30 bg-milk p-5 text-sm leading-6 text-rosewood">
            Brakuje konfiguracji Supabase. Dodaj zmienne `VITE_SUPABASE_URL` i
            `VITE_SUPABASE_ANON_KEY`.
          </div>
        )}

        <div className="reveal-on-scroll mb-9 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-5 shadow-soft md:p-6">
          <div className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-950">
            <SlidersHorizontal size={18} aria-hidden="true" />
            Filtry
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
              Kategoria
              <select
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none transition focus:border-rosewood/50"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="">Wszystkie kategorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-950">
              Kolekcja
              <select
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none transition focus:border-rosewood/50"
                value={selectedCollection}
                onChange={(event) => setSelectedCollection(event.target.value)}
              >
                <option value="">Wszystkie kolekcje</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isLoading && (
          <div className="flex min-h-80 items-center justify-center text-stone">
            <Loader2 className="mr-3 animate-spin" size={22} aria-hidden="true" />
            &#321;adowanie produkt&#243;w...
          </div>
        )}

        {error && (
          <div className="rounded-[1.25rem] border border-rosewood/30 bg-milk p-6 text-rosewood">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-10 text-center shadow-soft">
            <h2 className="font-display text-4xl">Brak produkt&#243;w</h2>
            <p className="mt-4 text-stone">
              W tej chwili nie ma aktywnych produkt&#243;w spe&#322;niaj&#261;cych wybrane filtry.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div className="reveal-on-scroll h-full" key={product.id}>
                <ProductCard
                  product={product}
                  categoriesById={categoriesById}
                  collectionsById={collectionsById}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SklepPage;
