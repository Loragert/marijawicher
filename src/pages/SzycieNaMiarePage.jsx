import { BadgeCheck, HeartHandshake, Ruler, Sparkles } from "lucide-react";
import customDressConsultation from "../assets/custom-tailoring/custom-dress-consultation.jpg";
import customGarmentSewing from "../assets/custom-tailoring/custom-garment-sewing.jpg";
import customSkydivingSuit from "../assets/custom-tailoring/custom-skydiving-suit.jpg";
import customTailoringHero from "../assets/custom-tailoring/custom-tailoring-hero.jpg";
import fabricCuttingProcess from "../assets/custom-tailoring/fabric-cutting-process.jpg";
import garmentFinishing from "../assets/custom-tailoring/garment-finishing.jpg";
import girlsLaceCeremonyDress from "../assets/custom-tailoring/girls-lace-ceremony-dress.jpg";
import handmadeLeatherVest from "../assets/custom-tailoring/handmade-leather-vest.jpg";
import marijaCraftsmanship from "../assets/custom-tailoring/marija-sewing-craftsmanship.jpg";
import modernWomensSet from "../assets/custom-tailoring/modern-womens-set.jpg";
import tailoredLeatherSkirt from "../assets/custom-tailoring/tailored-leather-skirt.jpg";

const processSteps = [
  {
    number: "01",
    title: "Konsultacja",
    description: "Poznajemy Twoje potrzeby i oczekiwania.",
  },
  {
    number: "02",
    title: "Projekt",
    description: "Dobieramy fason, materiały i detale.",
  },
  {
    number: "03",
    title: "Przygotowanie",
    description: "Tworzymy konstrukcję i przygotowujemy projekt.",
  },
  {
    number: "04",
    title: "Przymiarki",
    description: "Dopasowujemy kreację do sylwetki.",
  },
  {
    number: "05",
    title: "Gotowa kreacja",
    description: "Odbierasz uszyty specjalnie dla Ciebie projekt.",
  },
];

const realizations = [
  { title: "Sukienki", image: girlsLaceCeremonyDress },
  { title: "Komplety", image: modernWomensSet },
  { title: "Spódnice", image: tailoredLeatherSkirt },
  { title: "Kamizelki", image: handmadeLeatherVest },
  { title: "Projekty specjalne", image: customSkydivingSuit },
  { title: "Projekty indywidualne", image: customDressConsultation },
];

const workshopImages = [
  {
    src: fabricCuttingProcess,
    alt: "Przygotowanie i krojenie tkaniny w pracowni MARIJA",
  },
  {
    src: customGarmentSewing,
    alt: "Szycie kreacji na miarę w pracowni MARIJA",
  },
  {
    src: garmentFinishing,
    alt: "Wykończenie detali szytej kreacji",
  },
];

const benefits = [
  {
    title: "Indywidualne podejście",
    Icon: HeartHandshake,
  },
  {
    title: "Perfekcyjne dopasowanie",
    Icon: Ruler,
  },
  {
    title: "Wysoka jakość wykonania",
    Icon: BadgeCheck,
  },
  {
    title: "Doświadczenie i pasja",
    Icon: Sparkles,
  },
];

function SzycieNaMiarePage() {
  return (
    <>
      <section className="tailoring-page-hero reveal-on-scroll">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">SZYCIE NA MIARĘ</p>
            <h1 className="font-display text-5xl leading-[0.92] md:text-7xl lg:text-8xl">
              Szycie na miarę
            </h1>
            <p className="mt-8 text-lg leading-8 text-stone md:text-xl md:leading-9">
              Tworzymy wyjątkowe kreacje dopasowane do Twojej sylwetki, stylu i
              potrzeb.
            </p>
            <a className="btn btn-primary mt-10" href="#/kontakt">
              Umów konsultację
            </a>
          </div>

          <div className="tailoring-page-hero-image">
            <img
              src={customTailoringHero}
              alt="Szycie na miarę w pracowni MARIJA"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <p className="eyebrow">Proces</p>
          <h2>Jak wygląda współpraca?</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="tailoring-process-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="font-display text-6xl leading-none text-neutral-950/10">
                {step.number}
              </span>
              <h3 className="mt-10 font-display text-3xl leading-tight">{step.title}</h3>
              <p className="mt-5 leading-7 text-stone">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <p className="eyebrow">Realizacje</p>
          <h2>Co możemy uszyć?</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {realizations.map((item, index) => (
            <article
              key={item.title}
              className="group tailoring-product-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="tailoring-product-image">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-display text-3xl leading-tight">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="grid items-center gap-10 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
          <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
            <img
              src={marijaCraftsmanship}
              alt="Marija podczas pracy krawieckiej"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="eyebrow">O Mariji</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Nie szyjemy według schematu
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Każda sylwetka jest inna. Dlatego każdą realizację tworzymy
              indywidualnie, dbając o komfort, proporcje i najmniejsze detale.
            </p>
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <p className="eyebrow">Pracownia</p>
          <h2>Rzemiosło, które widać w każdym detalu</h2>
          <p>
            Każdy etap pracy wykonujemy z najwyższą starannością — od
            przygotowania materiału aż po ostatnie wykończenie.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {workshopImages.map((image, index) => (
            <figure
              key={image.src}
              className="group reveal-on-scroll overflow-hidden rounded-[1.25rem] border border-neutral-950/10 bg-milk shadow-soft"
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
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Dlaczego warto?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, Icon }, index) => (
            <article
              key={title}
              className="tailoring-benefit-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="tailoring-page-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-8 font-display text-3xl leading-tight">{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-neutral-950/10 px-7 py-16 shadow-soft md:px-12 md:py-24">
          <img
            src={customSkydivingSuit}
            alt="Projekt specjalny wykonany na miarę"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/78 via-neutral-950/48 to-neutral-950/18" />
          <div className="max-w-2xl text-milk">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-milk/75">
              Konsultacja
            </p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Masz pomysł na własną kreację?
            </h2>
            <p className="mt-6 text-lg leading-8 text-milk/85">
              Skontaktuj się z nami i umów konsultację.
            </p>
            <a className="btn mt-9 bg-milk text-neutral-950 hover:-translate-y-0.5 hover:bg-porcelain" href="#/kontakt">
              Skontaktuj się
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default SzycieNaMiarePage;
