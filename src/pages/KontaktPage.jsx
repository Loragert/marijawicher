import { Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { createContactMessage } from "../features/contact/contactMessagesRepository.js";

const emptyContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const contactDetails = [
  {
    title: "Telefon",
    value: <>+48 787 004 784</>,
    href: "tel:+48787004784",
    Icon: Phone,
  },
  {
    title: "Email",
    value: <>skkmarija@gmail.com</>,
    href: "mailto:skkmarija@gmail.com",
    Icon: Mail,
  },
  {
    title: "Adres",
    value: <>S&#322;owia&#324;ska 49, 64-100 Leszno</>,
    Icon: MapPin,
  },
  {
    title: "Godziny kontaktu",
    value: (
      <>
        Poniedzia&#322;ek - Pi&#261;tek
        <br />
        08:00 - 17:00
      </>
    ),
    Icon: Clock,
  },
];

function KontaktPage() {
  const [form, setForm] = useState(emptyContactForm);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: null });

  function updateField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSending(true);
    setStatusMessage({ type: "", text: null });

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    try {
      const result = await createContactMessage(payload);

      if (result.error) {
        setStatusMessage({
          type: "error",
          text: (
            <>
              Nie uda&#322;o si&#281; wys&#322;a&#263; wiadomo&#347;ci. Spr&#243;buj ponownie lub
              skontaktuj si&#281; telefonicznie.
            </>
          ),
        });
        return;
      }

      setForm(emptyContactForm);
      setStatusMessage({
        type: "success",
        text: (
          <>
            Wiadomo&#347;&#263; zosta&#322;a wys&#322;ana. Skontaktujemy si&#281; z Tob&#261;
            najszybciej jak to mo&#380;liwe.
          </>
        ),
      });
    } catch (error) {
      console.error("Contact form unexpected error", error);
      setStatusMessage({
        type: "error",
        text: (
          <>
            Nie uda&#322;o si&#281; wys&#322;a&#263; wiadomo&#347;ci. Spr&#243;buj ponownie lub
            skontaktuj si&#281; telefonicznie.
          </>
        ),
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <section className="contact-page-hero reveal-on-scroll">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="max-w-4xl">
            <p className="eyebrow">KONTAKT</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Skontaktuj si&#281; z nami
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Masz pytania dotycz&#261;ce szycia na miar&#281;, haftu komputerowego lub
              kurs&#243;w szycia? Ch&#281;tnie pomo&#380;emy i odpowiemy na wszystkie pytania.
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
                <p className="mt-4 leading-7 text-stone">{value}</p>
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
              Napisz wiadomo&#347;&#263;
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Opisz sw&#243;j projekt, pytanie lub termin, kt&#243;ry Ci&#281; interesuje.
              Wr&#243;cimy z odpowiedzi&#261; tak szybko, jak to mo&#380;liwe.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Imi&#281;
              <input
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </label>
            <label>
              Telefon
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
            <label>
              Temat
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                required
              />
            </label>
            <label className="md:col-span-2">
              Wiadomo&#347;&#263;
              <textarea
                name="message"
                rows="6"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                required
              />
            </label>
            <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
              <button className="btn btn-primary" type="submit" disabled={isSending}>
                {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {isSending ? <>WYSY&#321;ANIE...</> : <>WY&#346;LIJ WIADOMO&#346;&#262;</>}
              </button>
              {statusMessage.text && (
                <p
                  className={`text-sm leading-6 ${
                    statusMessage.type === "error" ? "text-rosewood" : "text-stone"
                  }`}
                  role="status"
                >
                  {statusMessage.text}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default KontaktPage;
