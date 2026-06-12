import { ChevronDown, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const contactDetails = [
  {
    title: "Telefon",
    value: "+48 787 004 784",
    href: "tel:+48787004784",
    Icon: Phone,
  },
  {
    title: "Email",
    value: "skkmarija@gmail.com",
    href: "mailto:skkmarija@gmail.com",
    Icon: Mail,
  },
  {
    title: "Adres",
    value: "Słowiańska 49, 64-100 Leszno",
    Icon: MapPin,
  },
  {
    title: "Godziny kontaktu",
    value: "Poniedziałek – Piątek\n08:00 – 17:00",
    Icon: Clock,
  },
];

const faqItems = [
  {
    question: "Jak umówić szycie na miarę?",
    answer:
      "Skontaktuj się z nami telefonicznie, mailowo lub przez formularz. Ustalimy termin konsultacji i omówimy szczegóły projektu.",
  },
  {
    question: "Jak zamówić haft komputerowy?",
    answer:
      "Prześlij tekst, logo lub opis pomysłu. Przygotujemy propozycję haftu i ustalimy szczegóły realizacji.",
  },
  {
    question: "Czy kursy są dla początkujących?",
    answer:
      "Tak, prowadzimy zajęcia zarówno dla osób początkujących, jak i dla tych, które chcą rozwijać swoje umiejętności.",
  },
  {
    question: "Czy można umówić konsultację indywidualną?",
    answer:
      "Tak, istnieje możliwość indywidualnego spotkania i omówienia projektu lub zakresu nauki.",
  },
];

function KontaktPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: connect contact form to backend/admin panel endpoint
    setStatusMessage("Formularz jest przygotowany do integracji z panelem administracyjnym.");
  }

  return (
    <>
      <section className="contact-page-hero reveal-on-scroll">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="max-w-4xl">
            <p className="eyebrow">KONTAKT</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Skontaktuj się z nami
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Masz pytania dotyczące szycia na miarę, haftu komputerowego lub kursów
              szycia? Chętnie pomożemy i odpowiemy na wszystkie pytania.
            </p>
            <a className="btn btn-primary mt-10" href="mailto:skkmarija@gmail.com">
              NAPISZ DO NAS
            </a>
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map(({ title, value, href, Icon }, index) => {
            const content = (
              <>
                <span className="contact-page-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h2 className="mt-8 font-display text-3xl leading-tight">{title}</h2>
                <p className="mt-4 whitespace-pre-line leading-7 text-stone">{value}</p>
              </>
            );

            return href ? (
              <a
                key={title}
                href={href}
                className="contact-detail-card reveal-on-scroll"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {content}
              </a>
            ) : (
              <article
                key={title}
                className="contact-detail-card reveal-on-scroll"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="contact-form-shell">
          <div className="max-w-xl">
            <p className="eyebrow">Formularz</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Napisz wiadomość
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Opisz swój projekt, pytanie lub termin, który Cię interesuje. Wrócimy z
              odpowiedzią tak szybko, jak to możliwe.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Imię
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Telefon
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label>
              Temat
              <input name="subject" type="text" required />
            </label>
            <label className="md:col-span-2">
              Wiadomość
              <textarea name="message" rows="6" required />
            </label>
            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
              <button className="btn btn-primary" type="submit">
                WYŚLIJ WIADOMOŚĆ
                <Send size={18} aria-hidden="true" />
              </button>
              {statusMessage && (
                <p className="text-sm leading-6 text-stone" role="status">
                  {statusMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Najczęstsze pytania</h2>
        </div>
        <div className="contact-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <article key={item.question} className="contact-faq-item reveal-on-scroll">
                <button
                  type="button"
                  className="contact-faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`transition duration-500 ${isOpen ? "rotate-180" : ""}`}
                    size={22}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && <p className="px-6 pb-6 leading-7 text-stone">{item.answer}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="contact-page-cta">
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Porozmawiajmy o Twoim projekcie
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone">
            Napisz lub zadzwoń do nas, a wspólnie stworzymy coś wyjątkowego.
          </p>
          <a className="btn btn-primary mt-9" href="mailto:skkmarija@gmail.com">
            SKONTAKTUJ SIĘ
          </a>
        </div>
      </section>
    </>
  );
}

export default KontaktPage;
