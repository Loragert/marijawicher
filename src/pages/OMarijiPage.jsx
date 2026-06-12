import marijaAndHusband from "../assets/historia-mariji/maria-and-husband.jpg";
import marijaAward2025 from "../assets/historia-mariji/maria-award-2025.jpg";
import marijaAwardDetail from "../assets/historia-mariji/maria-award-detail.jpg";
import marijaFamilyCommunion from "../assets/historia-mariji/maria-family-communion.jpg";
import marijaFamilyJourney from "../assets/historia-mariji/maria-family-journey.jpg";
import marijaFamilyToday from "../assets/historia-mariji/maria-family-today.jpg";
import marijaFirstWorkshop from "../assets/historia-mariji/maria-first-workshop.jpg";
import marijaPortrait from "../assets/historia-mariji/maria-portrait.jpg";
import marijaStudentsAndTeam from "../assets/historia-mariji/maria-students-and-team.jpg";
import marijaWithDaughters from "../assets/historia-mariji/maria-with-daughters.jpg";

const storyBlocks = [
  {
    title: "Od małej pracowni do własnej marki",
    image: marijaFirstWorkshop,
    alt: "Pierwsza pracownia Mariji Wicher",
    paragraphs: [
      "Początki były skromne. Najpierw szycie w domu, później pierwsza niewielka pracownia, w której powstawały autorskie projekty, poprawki krawieckie i pierwsze kolekcje tworzone na indywidualne zamówienie klientów.",
      "To właśnie tam narodziła się marka MARIJA - z pasji do jakości, precyzji i pięknego rzemiosła.",
    ],
  },
  {
    title: "Rodzina, która rosła razem z marzeniem",
    image: marijaFamilyJourney,
    alt: "Rodzinna droga Mariji Wicher",
    reverse: true,
    paragraphs: [
      "Rozwój firmy przeplatał się z życiem rodzinnym. W czasie budowania marki rodzina Mariji powiększała się, a kolejne etapy macierzyństwa stawały się częścią tej wyjątkowej historii.",
      "Dziś Marija jest mamą szóstki dzieci i często podkreśla, że to właśnie rodzina była największą inspiracją do dalszego działania.",
    ],
  },
  {
    title: "Dzielenie się wiedzą",
    image: marijaStudentsAndTeam,
    alt: "Marija Wicher z kursantami i zespołem",
    paragraphs: [
      "Pracownia MARIJA to nie tylko miejsce tworzenia ubrań. To również przestrzeń rozwoju dla młodych osób, które chcą poznawać świat projektowania, konstrukcji odzieży i szycia.",
      "Przez lata Marija szkoliła kursantów, współpracowała z praktykantami i pomagała rozwijać pierwsze zawodowe umiejętności przyszłych krawców.",
    ],
  },
  {
    title: "Kobieta stojąca za marką",
    image: marijaPortrait,
    alt: "Portret Mariji Wicher",
    reverse: true,
    paragraphs: [
      "Każdy projekt rozpoczyna się od rozmowy, pomysłu i wizji. Marija od lat zajmuje się projektowaniem, konstrukcją odzieży oraz indywidualnym dopasowaniem ubrań do potrzeb klientów.",
      "Jej podejście łączy klasyczne krawiectwo z nowoczesnym spojrzeniem na modę i wygodę.",
    ],
  },
  {
    title: "Pasja przekazywana kolejnym pokoleniom",
    image: marijaWithDaughters,
    alt: "Marija Wicher z córkami",
    paragraphs: [
      "Szycie od zawsze było obecne w codziennym życiu rodziny. Dzieci od najmłodszych lat obserwowały proces tworzenia, poznawały materiały i uczyły się szacunku do ręcznej pracy.",
      "To właśnie dzięki takim chwilom pasja staje się częścią rodzinnej historii.",
    ],
  },
  {
    title: "Siła wspólnego wsparcia",
    image: marijaAndHusband,
    alt: "Marija Wicher z mężem",
    reverse: true,
    paragraphs: [
      "Za każdą rozwijającą się marką stoją ludzie, którzy wierzą w jej sukces. Rodzina od początku wspierała rozwój pracowni, pomagając przechodzić przez kolejne etapy rozwoju firmy.",
      "Dzięki temu marka MARIJA mogła rosnąć i zdobywać zaufanie coraz większej liczby klientów.",
    ],
  },
];

function StoryBlock({ block, index }) {
  const image = (
    <div className="overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft">
      <img
        src={block.image}
        alt={block.alt}
        className="aspect-[4/5] h-full w-full object-cover transition duration-700 ease-out hover:scale-105"
      />
    </div>
  );

  const text = (
    <div className="max-w-xl">
      <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
      <h2 className="font-display text-4xl leading-tight md:text-6xl">
        {block.title}
      </h2>
      <div className="mt-6 space-y-5 text-lg leading-8 text-stone">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );

  return (
    <section className="section reveal-on-scroll">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {block.reverse ? (
          <>
            <div className="lg:order-2">{image}</div>
            <div className="lg:order-1">{text}</div>
          </>
        ) : (
          <>
            {image}
            {text}
          </>
        )}
      </div>
    </section>
  );
}

function OMarijiPage() {
  return (
    <>
      <section className="bg-porcelain pt-20">
        <div className="section grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal-on-scroll">
            <p className="eyebrow">O Mariji</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Marija Wicher
            </h1>
            <p className="mt-5 max-w-2xl font-display text-3xl leading-tight text-neutral-950 md:text-5xl">
              Projektantka, przedsiębiorczyni i mama szóstki dzieci
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              Historia marki MARIJA to historia kobiety, która połączyła pasję do
              szycia z życiem rodzinnym. Od pierwszych projektów tworzonych
              samodzielnie po rozwój własnej pracowni - każdy etap tej drogi
              budowany był z odwagą, determinacją i miłością do tworzenia.
            </p>
          </div>

          <div className="reveal-on-scroll overflow-hidden rounded-[1.75rem] border border-neutral-950/10 bg-milk shadow-soft">
            <img
              src={marijaFamilyToday}
              alt="Marija Wicher z rodziną"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {storyBlocks.map((block, index) => (
        <StoryBlock key={block.title} block={block} index={index} />
      ))}

      <section className="section reveal-on-scroll">
        <div className="grid items-center gap-6 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div className="grid gap-5 sm:grid-cols-2">
            <img
              src={marijaAward2025}
              alt="Wyróżnienie Złota Firma 2025 dla pracowni MARIJA"
              className="aspect-[4/5] h-full w-full rounded-[1.25rem] object-cover shadow-soft"
            />
            <img
              src={marijaAwardDetail}
              alt="Detal wyróżnienia Złota Firma"
              className="aspect-[4/5] h-full w-full rounded-[1.25rem] object-cover shadow-soft"
            />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Wyróżnienie</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Docenieni przez klientów
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-stone">
              <p>
                Największą nagrodą zawsze było zaufanie klientów. Jednak wieloletnia
                praca została również zauważona i wyróżniona.
              </p>
              <p>
                W 2025 roku pracownia MARIJA otrzymała prestiżowe wyróżnienie
                Złota Firma, przyznawane przedsiębiorstwom cieszącym się wyjątkowo
                wysokimi ocenami i opiniami klientów.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="grid items-center gap-10 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
            <img
              src={marijaFamilyCommunion}
              alt="Rodzina Mariji Wicher podczas uroczystości"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Dzisiaj</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Historia, która trwa nadal
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-stone">
              <p>
                Dziś MARIJA to nowoczesna pracownia projektowa, miejsce nauki,
                realizacji marzeń klientów oraz przestrzeń tworzona przez ludzi z
                pasją.
              </p>
              <p>
                To historia budowana przez rodzinę, doświadczenie i miłość do
                krawiectwa - historia, która każdego dnia pisze swój kolejny
                rozdział.
              </p>
            </div>
            <a className="btn btn-primary mt-9" href="#/o-marce">
              Poznaj naszą pracownię
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default OMarijiPage;
