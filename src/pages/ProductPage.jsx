import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  PackageCheck,
  Ruler,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getActiveCategories } from "../features/catalog/categoriesRepository.js";
import { getActiveCollections } from "../features/catalog/collectionsRepository.js";
import {
  getActiveProductDetailBySlug,
  getActiveProducts,
} from "../features/catalog/productsRepository.js";

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

function setMetaDescription(content) {
  let meta = document.querySelector('meta[name="description"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function RelatedProductCard({ product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 hover:-translate-y-2 hover:border-rosewood/30">
      <a href={`#/produkt/${product.slug}`} className="flex h-full flex-col">
        <div className="flex h-64 items-center justify-center overflow-hidden bg-porcelain p-4">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.title}
              className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone">
              <ImagePlus size={30} aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-2xl leading-tight text-neutral-950">{product.title}</h3>
          <p className="mt-3 text-sm font-semibold text-neutral-950">{formatPrice(product.price)}</p>
        </div>
      </a>
    </article>
  );
}

function ProductPage({ slug }) {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartNotice, setCartNotice] = useState("");

  const categoriesById = useMemo(() => createLookup(categories), [categories]);
  const collectionsById = useMemo(() => createLookup(collections), [collections]);
  const galleryItems = useMemo(() => {
    if (!product) return [];

    const items = [];

    if (product.cover_image) {
      items.push({
        id: "cover",
        image_url: product.cover_image,
        label: "Zdjęcie główne",
      });
    }

    const images = [...(product.product_images || [])].sort((a, b) => a.sort_order - b.sort_order);
    images.forEach((image) => {
      if (image.image_url && image.image_url !== product.cover_image) {
        items.push({
          id: image.id,
          image_url: image.image_url,
          label: "Zdjęcie produktu",
        });
      }
    });

    return items;
  }, [product]);

  const selectedIndex = Math.max(
    galleryItems.findIndex((item) => item.image_url === selectedImage),
    0,
  );

  const categoryName = product
    ? categoriesById[product.category_id]?.name || product.category || "Bez kategorii"
    : "";
  const collectionName = product
    ? collectionsById[product.collection_id]?.title || "Bez kolekcji"
    : "";

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => {
        if (item.id === product.id) return false;

        const sameCategory = product.category_id && item.category_id === product.category_id;
        const sameCollection = product.collection_id && item.collection_id === product.collection_id;

        return sameCategory || sameCollection;
      })
      .slice(0, 4);
  }, [product, products]);

  useEffect(() => {
    async function loadProductData() {
      setIsLoading(true);
      setError("");
      setCartNotice("");

      const [productResult, productsResult, categoriesResult, collectionsResult] = await Promise.all([
        getActiveProductDetailBySlug(slug),
        getActiveProducts(),
        getActiveCategories(),
        getActiveCollections(),
      ]);

      setIsLoading(false);

      if (productResult.error || productsResult.error || categoriesResult.error || collectionsResult.error) {
        setError("Nie udało się pobrać danych produktu. Sprawdź konfigurację Supabase.");
        return;
      }

      if (!productResult.data) {
        setError("Nie znaleziono aktywnego produktu.");
        return;
      }

      const firstGalleryImage =
        productResult.data.cover_image ||
        [...(productResult.data.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)[0]
          ?.image_url ||
        "";

      setProduct(productResult.data);
      setSelectedImage(firstGalleryImage);
      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
      setCollections(collectionsResult.data || []);
    }

    loadProductData();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const title = product.seo_title || `${product.title} | Krawiectwo MARIJA`;
    const description =
      product.seo_description ||
      product.short_description ||
      `Produkt ${product.title} w sklepie Krawiectwo MARIJA.`;

    document.title = title;
    setMetaDescription(description);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((element) => element.classList.add("is-visible"));
  }, [product, relatedProducts.length]);

  function handleAddToCart() {
    setCartNotice("Koszyk zostanie uruchomiony w kolejnym etapie.");
  }

  function showPreviousImage() {
    if (!galleryItems.length) return;

    const nextIndex = selectedIndex === 0 ? galleryItems.length - 1 : selectedIndex - 1;
    setSelectedImage(galleryItems[nextIndex].image_url);
  }

  function showNextImage() {
    if (!galleryItems.length) return;

    const nextIndex = selectedIndex === galleryItems.length - 1 ? 0 : selectedIndex + 1;
    setSelectedImage(galleryItems[nextIndex].image_url);
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20 lg:px-10">
        {isLoading && (
          <div className="flex min-h-96 items-center justify-center text-stone">
            <Loader2 className="mr-3 animate-spin" size={22} aria-hidden="true" />
            &#321;adowanie produktu...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-10 text-center shadow-soft">
            <h1 className="font-display text-5xl">Produkt niedost&#281;pny</h1>
            <p className="mt-5 text-stone">{error}</p>
            <a className="btn btn-primary mt-8" href="#/sklep">
              Wr&#243;&#263; do sklepu
            </a>
          </div>
        )}

        {!isLoading && product && (
          <>
            <header className="reveal-on-scroll mb-8 max-w-4xl md:mb-10">
              <p className="eyebrow">PRODUKT</p>
              <h1 className="font-display text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02] text-neutral-950">
                {product.title}
              </h1>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.82fr)] lg:items-start">
              <div className="reveal-on-scroll">
                <div className="relative flex min-h-[25rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-neutral-950/10 bg-milk p-4 shadow-soft sm:min-h-[31rem] md:min-h-[38rem] md:p-8">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="max-h-[23rem] w-full object-contain sm:max-h-[29rem] md:max-h-[34rem]"
                    />
                  ) : (
                    <div className="flex h-[25rem] items-center justify-center text-stone">
                      <ImagePlus size={42} aria-hidden="true" />
                    </div>
                  )}

                  {galleryItems.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-neutral-950/10 bg-milk/90 text-neutral-950 shadow-soft transition hover:-translate-x-0.5 hover:text-rosewood"
                        type="button"
                        onClick={showPreviousImage}
                        aria-label="Poprzednie zdjęcie"
                      >
                        <ChevronLeft size={21} aria-hidden="true" />
                      </button>
                      <button
                        className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-neutral-950/10 bg-milk/90 text-neutral-950 shadow-soft transition hover:translate-x-0.5 hover:text-rosewood"
                        type="button"
                        onClick={showNextImage}
                        aria-label="Następne zdjęcie"
                      >
                        <ChevronRight size={21} aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>

                {galleryItems.length > 0 && (
                  <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                    {galleryItems.map((image) => (
                      <button
                        className={`flex h-20 items-center justify-center overflow-hidden rounded-2xl border bg-milk p-2 transition duration-300 sm:h-24 ${
                          selectedImage === image.image_url
                            ? "border-rosewood shadow-soft"
                            : "border-neutral-950/10 hover:border-rosewood/40"
                        }`}
                        key={image.id}
                        type="button"
                        onClick={() => setSelectedImage(image.image_url)}
                        aria-label={image.label}
                      >
                        <img
                          src={image.image_url}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <aside className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
                <p className="text-3xl font-semibold text-neutral-950">{formatPrice(product.price)}</p>

                {product.short_description && (
                  <p className="mt-6 text-lg leading-8 text-stone">{product.short_description}</p>
                )}

                <div className="mt-7 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-stone">
                  <span className="rounded-full border border-neutral-950/10 bg-porcelain px-4 py-3">
                    {categoryName}
                  </span>
                  <span className="rounded-full border border-neutral-950/10 bg-porcelain px-4 py-3">
                    {collectionName}
                  </span>
                </div>

                <div className="mt-8 grid gap-3">
                  {[
                    { icon: PackageCheck, label: "Dostępność", value: "Dostępny" },
                    { icon: Ruler, label: "Rozmiar", value: "Na zamówienie" },
                    { icon: Truck, label: "Czas wysyłki", value: "Ustalany indywidualnie" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      className="flex items-center gap-4 rounded-2xl border border-neutral-950/10 bg-porcelain p-4"
                      key={label}
                    >
                      <Icon className="text-rosewood" size={22} aria-hidden="true" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone">{label}</p>
                        <p className="mt-1 font-semibold text-neutral-950">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3">
                  <a className="btn btn-secondary w-full" href="#/sklep">
                    ← Wr&#243;&#263; do sklepu
                  </a>
                  <button className="btn btn-primary w-full" type="button" onClick={handleAddToCart}>
                    <ShoppingBag size={18} aria-hidden="true" />
                    Dodaj do koszyka
                  </button>
                  <a className="btn btn-secondary w-full" href="#/kontakt">
                    Zapytaj o produkt
                  </a>
                </div>

                {cartNotice && (
                  <p className="mt-5 rounded-2xl border border-neutral-950/10 bg-porcelain p-4 text-sm leading-6 text-stone">
                    {cartNotice}
                  </p>
                )}
              </aside>
            </div>

            {product.description && (
              <section className="reveal-on-scroll mt-16 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:mt-24 md:p-10">
                <div className="max-w-4xl">
                  <p className="eyebrow">SZCZEG&#211;&#321;Y</p>
                  <h2 className="font-display text-4xl leading-tight md:text-5xl">Opis produktu</h2>
                  <p className="mt-6 whitespace-pre-line text-lg leading-8 text-stone">
                    {product.description}
                  </p>
                </div>
              </section>
            )}

            {relatedProducts.length > 0 && (
              <section className="reveal-on-scroll mt-20 md:mt-28">
                <div className="section-heading">
                  <p className="eyebrow">SKLEP</p>
                  <h2>Podobne produkty</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedProducts.map((item) => (
                    <RelatedProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductPage;
