import { Inbox, Loader2, Mail, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import {
  contactMessageStatuses,
  getAdminContactMessages,
  getContactStatusLabel,
  updateContactMessageStatus,
} from "../features/contact/contactMessagesRepository.js";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) || messages[0],
    [messages, selectedMessageId],
  );

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const result = await getAdminContactMessages();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać wiadomości. Sprawdź tabelę contact_messages i polityki RLS.",
      });
      return;
    }

    const nextMessages = result.data || [];
    setMessages(nextMessages);
    setSelectedMessageId((currentId) =>
      nextMessages.some((message) => message.id === currentId)
        ? currentId
        : nextMessages[0]?.id || "",
    );
  }

  async function handleStatusChange(messageId, nextStatus) {
    setIsUpdating(true);
    setStatus({ type: "", message: "" });

    const result = await updateContactMessageStatus(messageId, nextStatus);
    setIsUpdating(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się zmienić statusu wiadomości.",
      });
      return;
    }

    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === messageId ? { ...message, status: nextStatus } : message,
      ),
    );
    setStatus({ type: "success", message: "Status wiadomości został zaktualizowany." });
  }

  return (
    <AdminLayout>
      <section className="bg-porcelain">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">ADMIN</p>
              <h1 className="font-display text-5xl leading-tight md:text-7xl">Wiadomości</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone">
                Przeglądaj zapytania z formularza kontaktowego i aktualizuj status obsługi.
              </p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={loadMessages}>
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
                <h2 className="font-display text-4xl">Lista wiadomości</h2>
                {isLoading && <Loader2 className="animate-spin" size={24} aria-hidden="true" />}
              </div>

              <div className="space-y-4">
                {!isLoading && messages.length === 0 && (
                  <p className="rounded-2xl border border-neutral-950/10 bg-porcelain p-5 text-stone">
                    Brak wiadomości do wyświetlenia.
                  </p>
                )}

                {messages.map((message) => (
                  <button
                    className={`w-full rounded-2xl border p-5 text-left transition duration-500 hover:-translate-y-1 hover:shadow-soft ${
                      selectedMessage?.id === message.id
                        ? "border-rosewood/40 bg-porcelain"
                        : "border-neutral-950/10 bg-porcelain/70 hover:border-rosewood/30"
                    }`}
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedMessageId(message.id)}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone">
                          {formatDate(message.created_at)}
                        </p>
                        <h3 className="mt-3 font-display text-3xl leading-tight text-neutral-950">
                          {message.subject}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone">
                          {message.name} · {message.email}
                          {message.phone ? ` · ${message.phone}` : ""}
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-neutral-950/10 bg-milk px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
                        {getContactStatusLabel(message.status)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-6 shadow-soft md:p-8">
              {selectedMessage ? (
                <>
                  <div className="mb-7 flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neutral-950/10 bg-porcelain text-rosewood">
                      <Mail size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="eyebrow mb-2">Podgląd</p>
                      <h2 className="font-display text-4xl leading-tight">
                        {selectedMessage.subject}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-6 text-stone">
                    <p>
                      <span className="font-semibold text-neutral-950">Imię:</span>{" "}
                      {selectedMessage.name}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Email:</span>{" "}
                      <a className="hover:text-rosewood" href={`mailto:${selectedMessage.email}`}>
                        {selectedMessage.email}
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Telefon:</span>{" "}
                      {selectedMessage.phone ? (
                        <a className="hover:text-rosewood" href={`tel:${selectedMessage.phone}`}>
                          {selectedMessage.phone}
                        </a>
                      ) : (
                        "Brak"
                      )}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-950">Data:</span>{" "}
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>

                  <div className="mt-7 rounded-2xl border border-neutral-950/10 bg-porcelain p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">
                      Wiadomość
                    </p>
                    <p className="mt-4 whitespace-pre-line leading-7 text-neutral-950">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <label className="mt-7 flex flex-col gap-2 text-sm font-semibold text-neutral-950">
                    Status
                    <select
                      className="rounded-2xl border border-neutral-950/10 bg-porcelain px-4 py-3 font-normal outline-none focus:border-rosewood/50"
                      value={selectedMessage.status || "new"}
                      onChange={(event) =>
                        handleStatusChange(selectedMessage.id, event.target.value)
                      }
                      disabled={isUpdating}
                    >
                      {contactMessageStatuses.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-neutral-950/10 bg-porcelain p-8 text-center text-stone">
                  <Inbox size={36} aria-hidden="true" />
                  <p className="mt-5">Wybierz wiadomość z listy.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminMessagesPage;
