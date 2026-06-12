import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../features/cart/CartContext.jsx";
import { formatCartPrice } from "../features/cart/cartModel.js";

function CartPage() {
  const { items, subtotal, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const hasItems = items.length > 0;

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20 lg:px-10">
        <header className="reveal-on-scroll mb-10 max-w-4xl">
          <p className="eyebrow">SKLEP</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">Tw&#243;j koszyk</h1>
        </header>

        {!hasItems ? (
          <div className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-8 text-center shadow-soft md:p-12">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
              <ShoppingBag size={28} aria-hidden="true" />
            </span>
            <h2 className="mt-7 font-display text-4xl leading-tight md:text-5xl">
              Tw&#243;j koszyk jest pusty
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-stone">
              Dodaj produkty do koszyka, aby rozpocz&#261;&#263; zakupy.
            </p>
            <a className="btn btn-primary mt-8" href="#/sklep">
              Przejd&#378; do sklepu
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  className="reveal-on-scroll grid gap-5 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-5 shadow-soft md:grid-cols-[8rem_1fr_auto] md:items-center"
                  key={item.id}
                >
                  <a
                    className="flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-porcelain p-3 md:h-32"
                    href={`#/produkt/${item.slug}`}
                  >
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag size={28} aria-hidden="true" />
                    )}
                  </a>

                  <div>
                    <h2 className="font-display text-3xl leading-tight text-neutral-950">
                      {item.title}
                    </h2>
                    <p className="mt-3 font-semibold text-neutral-950">
                      {formatCartPrice(item.price)}
                    </p>
                    <button
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone transition hover:text-rosewood"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Usu&#324;
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                    <div className="inline-flex items-center rounded-full border border-neutral-950/10 bg-porcelain p-1">
                      <button
                        className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-milk hover:text-rosewood"
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Zmniejsz ilość"
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="min-w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-milk hover:text-rosewood"
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Zwiększ ilość"
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-semibold text-neutral-950">
                      {formatCartPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <p className="eyebrow">Podsumowanie</p>
              <div className="mt-6 flex items-center justify-between border-b border-neutral-950/10 pb-5">
                <span className="text-stone">Suma</span>
                <span className="text-2xl font-semibold text-neutral-950">
                  {formatCartPrice(subtotal)}
                </span>
              </div>
              <a className="btn btn-primary mt-8 w-full" href="#/checkout">
                Przejd&#378; do zam&#243;wienia
              </a>
              <a className="btn btn-secondary mt-3 w-full" href="#/sklep">
                Przejd&#378; do sklepu
              </a>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
