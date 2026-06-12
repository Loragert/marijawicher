import { ArrowRight } from "lucide-react";
import atelierClientArea from "../assets/o-marce/atelier-client-area.jpg";
import atelierCuttingTable from "../assets/o-marce/atelier-cutting-table.jpg";
import atelierFacade from "../assets/o-marce/atelier-facade.jpg";
import atelierOverview from "../assets/o-marce/atelier-overview.jpg";
import atelierSewingStations from "../assets/o-marce/atelier-sewing-stations.jpg";
import atelierShowroom from "../assets/o-marce/atelier-showroom.jpg";
import atelierWorkshop from "../assets/o-marce/atelier-workshop.jpg";
import pasmanteriaThreads from "../assets/o-marce/pasmanteria-threads.jpg";
import brandStoryVideo from "../assets/brand-story-video.mp4.mp4";
import { aboutBrand } from "../data/siteContent.js";

const studioCards = [
  {
    src: atelierShowroom,
    alt: "Showroom pracowni MARIJA",
  },
  {
    src: atelierOverview,
    alt: "Wnętrze pracowni Krawiectwo MARIJA",
  },
];

const projectSteps = [
  {
    title: "Projektowanie",
    description:
      "Rozpoczynamy od rozmowy, inspiracji i dopasowania pomysłu do sylwetki oraz okazji.",
    image: atelierWorkshop,
  },
  {
    title: "Przygotowanie",
    description:
      "Dobieramy materiały, przygotowujemy formę i dbamy o proporcje już od pierwszego etapu.",
    image: atelierCuttingTable,
  },
  {
    title: "Wykonanie",
    description:
      "Szyjemy z precyzją, kontrolując detale, wykończenie i komfort gotowej kreacji.",
    image: atelierSewingStations,
  },
];

function OMarcePage() {
  return (
    <>
      <section className="tailoring-page-hero">
        <div className="section grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="reveal-on-scroll">
            <p className="eyebrow">O MARCE</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Poznaj historię marki MARIJA
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone md:text-xl md:leading-9">
              {aboutBrand.intro}
            </p>
            <a className="btn btn-primary mt-10" href="#/kontakt">
              ZOBACZ USŁUGI
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <div className="about-page-logo-panel reveal-on-scroll">
            <video
              src={brandStoryVideo}
              className="h-full min-h-[34rem] w-full rounded-[1rem] object-cover md:h-[40rem]"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Historia marki Krawiectwo Marija"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-heading mb-0">
            <p className="eyebrow">Pracownia</p>
            <h2>Nasza pracownia</h2>
            <p>
              MARIJA to miejsce, w którym tradycyjne krawiectwo spotyka się z
              nowoczesnym podejściem do pracy z klientem. Tworzymy przestrzeń
              spokojną, estetyczną i uważną na detal, aby każdy projekt mógł
              powstawać w atmosferze zaufania.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {studioCards.map((image, index) => (
              <figure
                key={image.src}
                className="group reveal-on-scroll overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/5] h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="grid items-center gap-10 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
            <img
              src={atelierClientArea}
              alt="Przestrzeń dla klientów w pracowni MARIJA"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Konsultacje</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Przestrzeń stworzona dla klienta
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              W pracowni rozmawiamy o potrzebach, przymierzamy, dobieramy
              rozwiązania i wspólnie dopracowujemy projekt. Dbamy o komfortową
              atmosferę, w której można spokojnie opowiedzieć o swojej wizji i
              zobaczyć, jak nabiera realnego kształtu.
            </p>
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <p className="eyebrow">Proces</p>
          <h2>Jak powstają nasze projekty</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {projectSteps.map((step, index) => (
            <article
              key={step.title}
              className="group reveal-on-scroll overflow-hidden rounded-[1.25rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 ease-out hover:-translate-y-2 hover:border-rosewood/30"
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-7 md:p-8">
                <h3 className="font-display text-3xl leading-tight">{step.title}</h3>
                <p className="mt-5 leading-7 text-stone">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <p className="eyebrow">Pasmanteria</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Materiały i dodatki
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Wybór materiałów, nici i dodatków ma znaczenie na każdym etapie
              pracy. Zwracamy uwagę na fakturę, kolor, wytrzymałość oraz detale,
              które decydują o ostatecznym charakterze projektu.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft">
            <img
              src={pasmanteriaThreads}
              alt="Nici i dodatki krawieckie w pracowni MARIJA"
              className="aspect-[16/10] h-full w-full object-cover transition duration-700 ease-out hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="grid items-center gap-10 overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
            <img
              src={atelierFacade}
              alt="Wejście do pracowni Krawiectwo MARIJA w Lesznie"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">Zaproszenie</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Zapraszamy do pracowni MARIJA
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Odwiedź naszą pracownię w Lesznie, poznaj dostępne materiały i
              opowiedz nam o swoim projekcie. Chętnie doradzimy, zaplanujemy
              kolejne kroki i pomożemy stworzyć coś wyjątkowego.
            </p>
            <a className="btn btn-primary mt-9" href="#/kontakt">
              Skontaktuj się
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default OMarcePage;
