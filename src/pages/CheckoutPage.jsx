import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomerProfile } from "../features/account/customerProfilesRepository.js";
import { useCart } from "../features/cart/CartContext.jsx";
import { formatCartPrice } from "../features/cart/cartModel.js";
import { createOrder } from "../features/orders/ordersRepository.js";
import { getCustomerSession, isCustomerLoggedIn } from "../lib/customerAuth.js";

const emptyCheckoutForm = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  street: "",
  postal_code: "",
  city: "",
  notes: "",
};

function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(emptyCheckoutForm);
  const [customerSession, setCustomerSession] = useState(() => getCustomerSession());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function prefillCustomerData() {
      if (!isCustomerLoggedIn()) {
        return;
      }

      const session = getCustomerSession();
      setCustomerSession(session);
      const profileResult = await getCustomerProfile();
      const profile = profileResult.data || {};

      setForm((currentForm) => ({
        ...currentForm,
        customer_email: session?.user?.email || currentForm.customer_email,
        customer_name: profile.full_name || currentForm.customer_name,
        customer_phone: profile.phone || currentForm.customer_phone,
        street: profile.street || currentForm.street,
        postal_code: profile.postal_code || currentForm.postal_code,
        city: profile.city || currentForm.city,
      }));
    }

    prefillCustomerData();
  }, []);

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!items.length) {
      setStatus({ type: "error", message: "Koszyk jest pusty." });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...form,
      ...(customerSession?.user?.id ? { customer_id: customerSession.user.id } : {}),
      items: items.map((item) => ({
        product_id: item.id,
        title: item.title,
        slug: item.slug,
        price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      })),
      total_amount: subtotal,
      status: "new",
    };

    const result = await createOrder(payload, {
      accessToken: customerSession?.access_token,
    });
    setIsSubmitting(false);

    if (result.error) {
      console.error("Order submit error", result.error);
      setStatus({
        type: "error",
        message:
          "Nie uda&#322;o si&#281; wys&#322;a&#263; zam&#243;wienia. Sprawd&#378; konfiguracj&#281; Supabase.",
      });
      return;
    }

    clearCart();
    setForm(emptyCheckoutForm);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <section className="bg-porcelain pt-20">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 md:py-28 lg:px-10">
          <div className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-8 shadow-soft md:p-12">
            <p className="eyebrow">Zam&#243;wienie</p>
            <h1 className="font-display text-5xl leading-tight md:text-7xl">
              Dzi&#281;kujemy za zam&#243;wienie
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone">
              Skontaktujemy si&#281; z Tob&#261; w celu potwierdzenia szczeg&#243;&#322;&#243;w
              realizacji.
            </p>
            <p className="mx-auto mt-5 max-w-2xl rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-sm leading-6 text-stone">
              Zam&#243;wienie nie wymaga p&#322;atno&#347;ci online. Po otrzymaniu
              zam&#243;wienia skontaktujemy si&#281; z Tob&#261;, aby potwierdzi&#263;
              szczeg&#243;&#322;y, termin realizacji oraz spos&#243;b p&#322;atno&#347;ci.
            </p>
            <a className="btn btn-primary mt-9" href="/">
              Powr&#243;t do strony g&#322;&#243;wnej
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-porcelain pt-20">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20 lg:px-10">
        <header className="reveal-on-scroll mb-10 max-w-4xl">
          <p className="eyebrow">Zam&#243;wienie</p>
          <h1 className="font-display text-5xl leading-tight md:text-7xl">
            Dane do zam&#243;wienia
          </h1>
        </header>

        <div className="reveal-on-scroll mb-8 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-5 text-sm leading-6 text-stone shadow-soft md:p-6">
          Zam&#243;wienie nie wymaga p&#322;atno&#347;ci online. Po otrzymaniu
          zam&#243;wienia skontaktujemy si&#281; z Tob&#261;, aby potwierdzi&#263;
          szczeg&#243;&#322;y, termin realizacji oraz spos&#243;b p&#322;atno&#347;ci.
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <form
            className="reveal-on-scroll grid gap-5 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:grid-cols-2 md:p-8"
            onSubmit={handleSubmit}
          >
            {[
              ["customer_name", "Imi&#281; i nazwisko", "text", "name"],
              ["customer_phone", "Telefon", "tel", "tel"],
              ["customer_email", "E-mail", "email", "email"],
              ["street", "Ulica i numer domu", "text", "street-address"],
              ["postal_code", "Kod pocztowy", "text", "postal-code"],
              ["city", "Miasto", "text", "address-level2"],
            ].map(([name, label, type, autoComplete]) => (
              <label
                className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone"
                key={name}
              >
                <span dangerouslySetInnerHTML={{ __html: label }} />
                <input
                  className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  value={form[name]}
                  onChange={(event) => updateField(name, event.target.value)}
                  required={name !== "customer_phone"}
                />
              </label>
            ))}

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone md:col-span-2">
              Uwagi do zam&#243;wienia
              <textarea
                className="rounded-2xl border border-neutral-950/10 bg-porcelain px-5 py-4 text-base normal-case tracking-normal text-neutral-950 outline-none transition duration-300 focus:border-rosewood/50 focus:ring-2 focus:ring-rosewood/10"
                name="notes"
                rows="5"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </label>

            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting || !items.length}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                ) : (
                  <Send size={18} aria-hidden="true" />
                )}
                {isSubmitting ? <>WYSY&#321;ANIE...</> : <>Z&#321;&#211;&#379; ZAM&#211;WIENIE</>}
              </button>
              {status.message && (
                <p
                  className={`text-sm leading-6 ${
                    status.type === "error" ? "text-rosewood" : "text-stone"
                  }`}
                  role="status"
                  dangerouslySetInnerHTML={{ __html: status.message }}
                />
              )}
            </div>
          </form>

          <aside className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
            <p className="eyebrow">Koszyk</p>
            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-stone">Tw&#243;j koszyk jest pusty.</p>
              ) : (
                items.map((item) => (
                  <div
                    className="flex items-start justify-between gap-4 border-b border-neutral-950/10 pb-4"
                    key={item.id}
                  >
                    <div>
                      <p className="font-semibold text-neutral-950">{item.title}</p>
                      <p className="mt-1 text-sm text-stone">
                        {item.quantity} × {formatCartPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-neutral-950">
                      {formatCartPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-stone">Razem</span>
              <span className="text-2xl font-semibold text-neutral-950">
                {formatCartPrice(subtotal)}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
