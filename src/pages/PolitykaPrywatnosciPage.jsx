const collectedData = [
  "imię i nazwisko",
  "adres e-mail",
  "numer telefonu",
  "treść wiadomości przesłanej przez formularz kontaktowy",
];

const processingGoals = [
  "kontaktu z klientem",
  "realizacji usług",
  "odpowiedzi na zapytania",
  "prowadzenia korespondencji",
];

const userRights = [
  "dostępu do swoich danych",
  "poprawiania danych",
  "usunięcia danych",
  "ograniczenia przetwarzania",
  "wniesienia skargi do odpowiedniego organu",
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

function PolitykaPrywatnosciPage() {
  return (
    <>
      <section className="bg-porcelain pt-20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="reveal-on-scroll">
            <p className="eyebrow">Dokumenty</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Polityka prywatności
            </h1>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8 md:pb-32 lg:px-10">
        <LegalSection title="Administrator danych">
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

        <LegalSection title="Jakie dane zbieramy">
          <p>Możemy zbierać dane podawane dobrowolnie przez użytkownika:</p>
          <LegalList items={collectedData} />
        </LegalSection>

        <LegalSection title="Cel przetwarzania danych">
          <p>Dane wykorzystywane są wyłącznie w celu:</p>
          <LegalList items={processingGoals} />
        </LegalSection>

        <LegalSection title="Udostępnianie danych">
          <p>Dane nie są sprzedawane osobom trzecim.</p>
          <p>
            Mogą być przekazywane wyłącznie podmiotom niezbędnym do realizacji
            usług lub obowiązków prawnych.
          </p>
        </LegalSection>

        <LegalSection title="Prawa użytkownika">
          <p>Każdy użytkownik ma prawo do:</p>
          <LegalList items={userRights} />
        </LegalSection>

        <LegalSection title="Kontakt">
          <p>W sprawach dotyczących danych osobowych prosimy o kontakt:</p>
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

export default PolitykaPrywatnosciPage;
