const services = [
  "szycie na miarę",
  "haft komputerowy",
  "kursy szycia",
  "sprzedaż produktów prezentowanych na stronie",
];

function LegalSection({ title, children }) {
  return (
    <section className="reveal-on-scroll border-t border-neutral-950/10 py-10">
      <h2 className="font-display text-3xl leading-tight md:text-5xl">{title}</h2>
      <div className="mt-6 space-y-5 text-base leading-8 text-stone md:text-lg">
        {children}
      </div>
    </section>
  );
}

function LegalList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-rosewood" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RegulaminPage() {
  return (
    <>
      <section className="bg-porcelain pt-20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="reveal-on-scroll">
            <p className="eyebrow">Dokumenty</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Regulamin
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Niniejszy regulamin określa zasady korzystania ze strony
              internetowej MARIJA.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8 md:pb-32 lg:px-10">
        <LegalSection title="Informacje o firmie">
          <address className="not-italic">
            <p>Krawiectwo MARIJA</p>
            <p>Słowiańska 49</p>
            <p>64-100 Leszno</p>
          </address>
          <div>
            <p>E-mail:</p>
            <a className="footer-link" href="mailto:skkmarija@gmail.com">
              skkmarija@gmail.com
            </a>
          </div>
          <div>
            <p>Telefon:</p>
            <a className="footer-link" href="tel:+48787004784">
              +48 787 004 784
            </a>
          </div>
        </LegalSection>

        <LegalSection title="Usługi">
          <p>Pracownia oferuje:</p>
          <LegalList items={services} />
        </LegalSection>

        <LegalSection title="Zamówienia">
          <p>Każde zamówienie ustalane jest indywidualnie z klientem.</p>
          <p>
            Szczegóły realizacji, termin oraz cena ustalane są przed rozpoczęciem
            wykonania usługi.
          </p>
        </LegalSection>

        <LegalSection title="Płatności">
          <p>
            Płatności realizowane są zgodnie z indywidualnymi ustaleniami z
            klientem lub za pośrednictwem dostępnych metod płatności na stronie.
          </p>
        </LegalSection>

        <LegalSection title="Odpowiedzialność">
          <p>
            Administrator dokłada wszelkich starań, aby informacje publikowane na
            stronie były aktualne i prawidłowe.
          </p>
        </LegalSection>

        <LegalSection title="Kontakt">
          <div>
            <p>E-mail:</p>
            <a className="footer-link" href="mailto:skkmarija@gmail.com">
              skkmarija@gmail.com
            </a>
          </div>
          <div>
            <p>Telefon:</p>
            <a className="footer-link" href="tel:+48787004784">
              +48 787 004 784
            </a>
          </div>
        </LegalSection>
      </main>
    </>
  );
}

export default RegulaminPage;
