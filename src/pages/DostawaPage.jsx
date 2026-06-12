const deliveryMethods = [
  "odbiór osobisty w pracowni MARIJA w Lesznie",
  "wysyłka kurierska",
  "paczkomaty InPost",
  "inne formy dostawy ustalane indywidualnie",
];

function InfoSection({ title, children }) {
  return (
    <section className="reveal-on-scroll rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10">
      <h2 className="font-display text-3xl leading-tight md:text-5xl">{title}</h2>
      <div className="mt-6 space-y-5 text-base leading-8 text-stone md:text-lg">
        {children}
      </div>
    </section>
  );
}

function InfoList({ items }) {
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

function DostawaPage() {
  return (
    <>
      <section className="bg-porcelain pt-20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="reveal-on-scroll">
            <p className="eyebrow">Informacje</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Dostawa
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Realizacja zamówień odbywa się zgodnie z indywidualnymi ustaleniami
              z klientem. Czas przygotowania produktu zależy od rodzaju
              zamówienia, dostępności materiałów oraz zakresu pracy.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-5xl gap-6 px-5 pb-24 sm:px-8 md:pb-32 lg:px-10">
        <InfoSection title="Formy odbioru i dostawy">
          <InfoList items={deliveryMethods} />
        </InfoSection>

        <InfoSection title="Czas realizacji">
          <p>
            Czas realizacji zamówienia ustalany jest indywidualnie przed
            rozpoczęciem pracy. Produkty szyte na miarę, haftowane oraz
            personalizowane mogą wymagać dłuższego czasu przygotowania.
          </p>
        </InfoSection>

        <InfoSection title="Koszty dostawy">
          <p>
            Koszt dostawy zależy od wybranej formy wysyłki i jest ustalany przed
            finalizacją zamówienia.
          </p>
        </InfoSection>

        <InfoSection title="Kontakt w sprawie dostawy">
          <p>W przypadku pytań dotyczących dostawy prosimy o kontakt:</p>
          <div>
            <p>Email:</p>
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
        </InfoSection>
      </main>
    </>
  );
}

export default DostawaPage;
