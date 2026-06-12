import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getActiveProducts } from "../features/catalog/productsRepository.js";

function formatPrice(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value || 0));
}

function FeaturedProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeaturedProducts() {
      setIsLoading(true);
      setError("");

      const result = await getActiveProducts();
      setIsLoading(false);

      if (result.error) {
        setError("Nie udało się pobrać polecanych produktów.");
        return;
      }

      setProducts((result.data || []).filter((product) => product.featured).slice(0, 4));
    }

    loadFeaturedProducts();
  }, []);

  if (!isLoading && !error && products.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-heading reveal-on-scroll">
        <p className="eyebrow">SKLEP</p>
        <h2>Polecane produkty</h2>
        <p>Wybrane projekty z pracowni MARIJA dost&#281;pne w sklepie.</p>
      </div>

      {isLoading && (
        <div className="flex min-h-40 items-center justify-center text-stone">
          <Loader2 className="mr-3 animate-spin" size={22} aria-hidden="true" />
          &#321;adowanie produkt&#243;w...
        </div>
      )}

      {error && (
        <div className="rounded-[1.25rem] border border-rosewood/30 bg-milk p-6 text-rosewood">
          {error}
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              className="group reveal-on-scroll flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 hover:-translate-y-2 hover:border-rosewood/30"
              key={product.id}
            >
              <a href={`#/produkt/${product.slug}`} className="flex h-full flex-col">
                <div className="flex h-64 items-center justify-center bg-porcelain p-5">
                  {product.cover_image ? (
                    <img
                      src={product.cover_image}
                      alt={product.title}
                      className="h-full w-full object-contain transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone">
                      <ImagePlus size={32} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl leading-tight text-neutral-950">
                    {product.title}
                  </h3>
                  <p className="mt-4 font-semibold text-neutral-950">{formatPrice(product.price)}</p>
                  <span className="btn btn-secondary mt-auto w-full">Zobacz produkt</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProductsSection;
