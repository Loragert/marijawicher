import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqSections = [
  {
    id: "szycie",
    title: <>Szycie na miar&#281;</>,
    items: [
      {
        question: <>Jak um&#243;wi&#263; szycie na miar&#281;?</>,
        answer: (
          <>
            Skontaktuj si&#281; z nami telefonicznie, mailowo lub przez formularz
            kontaktowy. Ustalimy termin konsultacji, om&#243;wimy projekt, tkaniny,
            wymiary oraz oczekiwany efekt ko&#324;cowy.
          </>
        ),
      },
      {
        question: <>Czy mog&#281; przyj&#347;&#263; z w&#322;asnym pomys&#322;em lub inspiracj&#261;?</>,
        answer: (
          <>
            Tak. Mo&#380;esz przynie&#347;&#263; zdj&#281;cie, szkic, inspiracj&#281; lub
            opisa&#263;, czego potrzebujesz. Na tej podstawie przygotujemy propozycj&#281;
            dopasowan&#261; do Twojej sylwetki, stylu i okazji.
          </>
        ),
      },
      {
        question: <>Czy szyjecie ubrania na specjalne okazje?</>,
        answer: (
          <>
            Tak. Realizujemy projekty na uroczysto&#347;ci rodzinne, sesje
            zdj&#281;ciowe, wydarzenia firmowe, &#347;luby, komunie, chrzciny oraz inne
            wyj&#261;tkowe okazje.
          </>
        ),
      },
      {
        question: <>Ile trwa realizacja zam&#243;wienia na miar&#281;?</>,
        answer: (
          <>
            Czas realizacji zale&#380;y od rodzaju projektu, dost&#281;pno&#347;ci
            materia&#322;&#243;w oraz liczby przymiarek. Termin ustalamy indywidualnie
            podczas konsultacji.
          </>
        ),
      },
      {
        question: <>Czy potrzebne s&#261; przymiarki?</>,
        answer: (
          <>
            Tak, w wi&#281;kszo&#347;ci projekt&#243;w przymiarki s&#261; bardzo wa&#380;ne.
            Dzi&#281;ki nim mo&#380;emy dopasowa&#263; ubranie do sylwetki i zadba&#263; o
            komfort noszenia.
          </>
        ),
      },
    ],
  },
  {
    id: "haft",
    title: <>Haft</>,
    items: [
      {
        question: <>Jak zam&#243;wi&#263; haft komputerowy?</>,
        answer: (
          <>
            Wystarczy skontaktowa&#263; si&#281; z nami i przes&#322;a&#263; wz&#243;r,
            napis, logo lub pomys&#322;. Sprawdzimy mo&#380;liwo&#347;&#263; wykonania haftu,
            dobierzemy rozmiar, kolor nici i miejsce haftu.
          </>
        ),
      },
      {
        question: <>Czy mo&#380;na wykona&#263; haft na w&#322;asnych ubraniach?</>,
        answer: (
          <>
            Tak, w wielu przypadkach mo&#380;emy wykona&#263; haft na powierzonych
            ubraniach lub tekstyliach. Ka&#380;dy materia&#322; oceniamy indywidualnie,
            aby upewni&#263; si&#281;, &#380;e haft b&#281;dzie wygl&#261;da&#322; estetycznie i
            b&#281;dzie trwa&#322;y.
          </>
        ),
      },
      {
        question: <>Czy wykonujecie haft na r&#281;cznikach?</>,
        answer: (
          <>
            Tak. Haft na r&#281;cznikach to jedna z dost&#281;pnych us&#322;ug. Mo&#380;emy
            wykona&#263; imi&#281;, inicja&#322;y, dat&#281;, kr&#243;tki napis lub dekoracyjny
            motyw.
          </>
        ),
      },
      {
        question: <>Czy haft nadaje si&#281; na prezent?</>,
        answer: (
          <>
            Tak. Personalizowany haft &#347;wietnie sprawdza si&#281; jako prezent na
            urodziny, &#347;lub, chrzest, komuni&#281;, rocznic&#281; lub jako elegancki
            upominek firmowy.
          </>
        ),
      },
    ],
  },
  {
    id: "kursy",
    title: <>Kursy szycia</>,
    items: [
      {
        question: <>Czy kursy s&#261; dla pocz&#261;tkuj&#261;cych?</>,
        answer: (
          <>
            Tak. Kursy mog&#261; by&#263; dopasowane do os&#243;b pocz&#261;tkuj&#261;cych oraz
            do tych, kt&#243;re chc&#261; rozwin&#261;&#263; swoje umiej&#281;tno&#347;ci. Zakres
            zaj&#281;&#263; ustalamy wed&#322;ug poziomu uczestnika.
          </>
        ),
      },
      {
        question: <>Czy mo&#380;na um&#243;wi&#263; konsultacj&#281; indywidualn&#261;?</>,
        answer: (
          <>
            Tak. Mo&#380;na um&#243;wi&#263; indywidualne spotkanie, podczas kt&#243;rego
            skupiamy si&#281; na konkretnym problemie, projekcie lub technice szycia.
          </>
        ),
      },
      {
        question: <>Czy musz&#281; mie&#263; w&#322;asn&#261; maszyn&#281; do szycia?</>,
        answer: (
          <>
            Nie zawsze. Szczeg&#243;&#322;y ustalamy przed rozpocz&#281;ciem kursu.
            Je&#347;li masz w&#322;asn&#261; maszyn&#281;, mo&#380;esz r&#243;wnie&#380; nauczy&#263;
            si&#281; pracy w&#322;a&#347;nie na niej.
          </>
        ),
      },
    ],
  },
  {
    id: "zakupy",
    title: <>Zakupy i zam&#243;wienia</>,
    items: [
      {
        question: <>Jak mog&#281; z&#322;o&#380;y&#263; zam&#243;wienie w sklepie?</>,
        answer: (
          <>
            Wybierz produkt, dodaj go do koszyka i przejd&#378; do finalizacji
            zam&#243;wienia. Po z&#322;o&#380;eniu zam&#243;wienia otrzymasz potwierdzenie oraz
            informacje dotycz&#261;ce dalszej realizacji.
          </>
        ),
      },
      {
        question: <>Czy produkty s&#261; dost&#281;pne od r&#281;ki?</>,
        answer: (
          <>
            Cz&#281;&#347;&#263; produkt&#243;w mo&#380;e by&#263; dost&#281;pna od r&#281;ki, a cz&#281;&#347;&#263;
            wykonywana jest po zam&#243;wieniu. Informacja o dost&#281;pno&#347;ci znajduje
            si&#281; przy produkcie lub jest ustalana indywidualnie.
          </>
        ),
      },
      {
        question: <>Czy mog&#281; zam&#243;wi&#263; produkt w innym rozmiarze lub kolorze?</>,
        answer: (
          <>
            W wielu przypadkach tak. Je&#347;li interesuje Ci&#281; inny rozmiar, kolor
            lub drobna modyfikacja, skontaktuj si&#281; z nami przed z&#322;o&#380;eniem
            zam&#243;wienia.
          </>
        ),
      },
      {
        question: <>Jak wygl&#261;da dostawa?</>,
        answer: (
          <>
            Dost&#281;pne metody dostawy oraz koszty pokazuj&#261; si&#281; podczas
            sk&#322;adania zam&#243;wienia. Szczeg&#243;&#322;owe informacje znajduj&#261; si&#281;
            r&#243;wnie&#380; na stronie Dostawa.
          </>
        ),
      },
      {
        question: <>Czy mog&#281; odebra&#263; zam&#243;wienie osobi&#347;cie?</>,
        answer: (
          <>
            Tak, je&#347;li taka opcja jest dost&#281;pna dla danego zam&#243;wienia.
            Szczeg&#243;&#322;y odbioru osobistego ustalamy indywidualnie.
          </>
        ),
      },
      {
        question: <>Czy mog&#281; zwr&#243;ci&#263; produkt?</>,
        answer: (
          <>
            Zasady zwrot&#243;w zale&#380;&#261; od rodzaju produktu. Produkty
            personalizowane lub szyte na indywidualne zam&#243;wienie mog&#261; nie
            podlega&#263; standardowemu zwrotowi. Szczeg&#243;&#322;y znajduj&#261; si&#281; na
            stronie Zwroty i reklamacje.
          </>
        ),
      },
    ],
  },
];

function FaqPage() {
  const [openItem, setOpenItem] = useState("szycie-0");

  return (
    <>
      <section className="contact-page-hero reveal-on-scroll">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
          <div className="max-w-4xl">
            <p className="eyebrow">FAQ</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Najcz&#281;stsze pytania
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Odpowiedzi na najcz&#281;&#347;ciej zadawane pytania dotycz&#261;ce szycia na
              miar&#281;, haftu, kurs&#243;w i zakup&#243;w.
            </p>
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="space-y-12">
          {faqSections.map((section) => (
            <div key={section.id} className="faq-section">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow">Sekcja</p>
                  <h2 className="font-display text-4xl leading-tight md:text-5xl">
                    {section.title}
                  </h2>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">
                  {section.items.length} pyta&#324;
                </span>
              </div>

              <div className="contact-faq-list">
                {section.items.map((item, index) => {
                  const itemId = `${section.id}-${index}`;
                  const isOpen = openItem === itemId;

                  return (
                    <article key={itemId} className="contact-faq-item reveal-on-scroll">
                      <button
                        type="button"
                        className="contact-faq-trigger"
                        aria-expanded={isOpen}
                        onClick={() => setOpenItem(isOpen ? "" : itemId)}
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default FaqPage;
