import { ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import { formatCartPrice } from "../features/cart/cartModel.js";
import {
  getAdminOrders,
  getOrderStatusLabel,
  orderStatuses,
  updateOrderStatus,
} from "../features/orders/ordersRepository.js";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || orders[0],
    [orders, selectedOrderId],
  );

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const result = await getAdminOrders();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać zamówień. Sprawdź tabelę orders i polityki RLS.",
      });
      return;
    }

    const nextOrders = result.data || [];
    setOrders(nextOrders);
    setSelectedOrderId((currentId) =>
      nextOrders.some((order) => order.id === currentId) ? currentId : nextOrders[0]?.id || "",
    );
  }

  async function handleStatusChange(orderId, nextStatus) {
    setIsUpdating(true);
    setStatus({ type: "", message: "" });

    const result = await updateOrderStatus(orderId, nextStatus);
    setIsUpdating(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić statusu zamówienia.",
      });
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
    setStatus({ type: "success", message: "Status zamówienia został zaktualizowany." });
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Zamówienia</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Przeglądaj zamówienia ze sklepu i aktualizuj status realizacji.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={loadOrders}>
              <RefreshCw size={16} aria-hidden="true" />
              Odśwież
            </button>
          </div>

          {status.message && (
            <div
              className={`mb-8 rounded-[1.25rem] border bg-milk p-5 text-sm leading-6 ${
                status.type === "error"
                  ? "border-rosewood/40 text-rosewood"
                  : "border-neutral-950/10 text-stone"
              }`}
              role="status"
            >
              {status.message}
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="font-display text-4xl">Lista zamówień</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} aria-hidden="true" />}
              </div>

              <div className="space-y-4">
                {!isLoading && orders.length === 0 && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak zamówień do wyświetlenia.
                  </p>
                )}

                {orders.map((order) => (
                  <button
                    className={`w-full rounded-2xl border p-5 text-left transition duration-500 hover:-translate-y-1 hover:shadow-soft ${
                      selectedOrder?.id === order.id
                        ? "border-rosewood/40 bg-porcelain"
                        : "border-neutral-950/10 bg-porcelain/70 hover:border-rosewood/30"
                    }`}
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone">
                          {formatDate(order.created_at)}
                        </p>
                        <h3 className="mt-3 font-display text-3xl leading-tight text-neutral-950">
                          {order.customer_name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone">
                          {order.customer_phone || "Brak telefonu"} · {order.customer_email}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 lg:items-end">
                        <span className="font-semibold text-neutral-950">
                          {formatCartPrice(order.total_amount)}
                        </span>
                        <span className="w-fit rounded-full border border-neutral-950/10 bg-milk px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              {selectedOrder ? (
                <>
                  <div className="mb-7 flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
                      <ClipboardList size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow mb-2">Podgląd</p>
                      <h2 className="font-display text-4xl leading-tight">
                        {selectedOrder.customer_name}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-6 text-stone">
                    <p>
                      <span className="font-semibold text-neutral-950">Data:</span>{" "}
                      {formatDate(selectedOrder.created_at)}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Email:</span>{" "}
                      <a className="hover:text-rosewood" href={`mailto:${selectedOrder.customer_email}`}>
                        {selectedOrder.customer_email}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Telefon:</span>{" "}
                      {selectedOrder.customer_phone ? (
                        <a className="hover:text-rosewood" href={`tel:${selectedOrder.customer_phone}`}>
                          {selectedOrder.customer_phone}
                        </a>
                      ) : (
                        "Brak"
                      )}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Adres:</span>{" "}
                      {selectedOrder.street}, {selectedOrder.postal_code} {selectedOrder.city}
                    </p>
                  </div>

                  <div className="mt-7 rounded-2xl border border-neutral-950/10 bg-porcelain p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">
                      Produkty
                    </p>
                    <div className="mt-4 space-y-3">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div className="flex justify-between gap-4 text-sm leading-6" key={index}>
                          <span>
                            {item.title} × {item.quantity}
                          </span>
                          <span className="font-semibold text-neutral-950">
                            {formatCartPrice(item.line_total || item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-between border-t border-neutral-950/10 pt-4">
                      <span className="font-semibold text-neutral-950">Razem</span>
                      <span className="font-semibold text-neutral-950">
                        {formatCartPrice(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div className="mt-5 rounded-2xl border border-neutral-950/10 bg-porcelain p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">
                        Uwagi
                      </p>
                      <p className="mt-4 whitespace-pre-line leading-7 text-neutral-950">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}

                  <label className="mt-7 flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                    Status
                    <select
                      className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                      value={selectedOrder.status || "new"}
                      onChange={(event) => handleStatusChange(selectedOrder.id, event.target.value)}
                      disabled={isUpdating}
                    >
                      {orderStatuses.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-neutral-950/10 bg-porcelain p-8 text-center text-stone">
                  <ClipboardList size={36} aria-hidden="true" />
                  <p className="mt-5">Wybierz zamówienie z listy.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminOrdersPage;
