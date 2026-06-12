import {
  BadgeCheck,
  BookOpen,
  CircleDot,
  Layers,
  PencilRuler,
  Sparkles,
  Wrench,
} from "lucide-react";
import courseAlterations from "../assets/course-alterations.jpg";
import courseFabricCutting from "../assets/course-fabric-cutting.jpg";
import courseFinishingDetails from "../assets/course-finishing-details.jpg";
import courseGarmentSewing from "../assets/course-garment-sewing.jpg";
import coursePatternMaking from "../assets/course-pattern-making.jpg";
import courseSewingMachine from "../assets/course-sewing-machine.jpg";
import coursesHeroImage from "../assets/sewing-courses-hero.jpg";

const learningCards = [
  { title: "Obsługa maszyny", image: courseSewingMachine },
  { title: "Podstawy konstrukcji", image: coursePatternMaking },
  { title: "Krojenie materiałów", image: courseFabricCutting },
  { title: "Szycie odzieży", image: courseGarmentSewing },
  { title: "Poprawki krawieckie", image: courseAlterations },
  { title: "Wykończenia i detale", image: courseFinishingDetails },
];

const learningSteps = [
  {
    number: "01",
    title: "Poznaj podstawy",
    description: "Uczysz się obsługi narzędzi, maszyny i podstaw pracy z tkaniną.",
    Icon: BookOpen,
  },
  {
    number: "02",
    title: "Ćwicz techniki",
    description: "Powtarzasz kluczowe ściegi, konstrukcje i sposoby wykańczania.",
    Icon: CircleDot,
  },
  {
    number: "03",
    title: "Twórz własne projekty",
    description: "Przekładasz wiedzę na praktyczne elementy garderoby i dodatki.",
    Icon: PencilRuler,
  },
  {
    number: "04",
    title: "Rozwijaj umiejętności",
    description: "Budujesz pewność, dokładność i własny rytm pracy przy maszynie.",
    Icon: Sparkles,
  },
];

const reasons = [
  {
    title: "Certyfikat uczestnictwa",
    description: "Otrzymujesz potwierdzenie udziału w kursie i zdobytych umiejętności.",
    Icon: BadgeCheck,
  },
  {
    title: "Samodzielna praca z maszyną",
    description: "Zyskujesz pewność w obsłudze maszyny i codziennej pracy z tkaniną.",
    Icon: Wrench,
  },
  {
    title: "Tworzenie własnych projektów",
    description: "Uczysz się przekładać pomysł na praktyczny, dopracowany projekt.",
    Icon: PencilRuler,
  },
  {
    title: "Znajomość materiałów i technik szycia",
    description: "Poznajesz tkaniny, konstrukcję, wykończenia i podstawowe techniki.",
    Icon: Layers,
  },
];

function KursyPage() {
  return (
    <>
      <section className="courses-page-hero reveal-on-scroll">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">KURSY SZYCIA</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Naucz się szyć z pasją i doświadczeniem
            </h1>
            <p className="mt-8 text-lg leading-8 text-stone md:text-xl md:leading-9">
              Praktyczna nauka szycia pod okiem doświadczonego instruktora. Kursy
              dla początkujących i osób rozwijających swoje umiejętności.
            </p>
            <a className="btn btn-primary mt-10" href="#/kursy">
              ZOBACZ OFERTĘ
            </a>
          </div>

          <div className="courses-page-hero-image">
            <img
              src={coursesHeroImage}
              alt="Kurs szycia w pracowni MARIJA"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Czego się nauczysz</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {learningCards.map(({ title, image }, index) => (
            <article
              key={title}
              className="group courses-skill-card reveal-on-scroll overflow-hidden p-0"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-7 md:p-8">
                <h3 className="font-display text-3xl leading-tight">{title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Jak wygląda nauka</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {learningSteps.map(({ number, title, description, Icon }, index) => (
            <article
              key={title}
              className="courses-process-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-display text-6xl leading-none text-neutral-950/10">
                  {number}
                </span>
                <span className="courses-page-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-9 font-display text-3xl leading-tight">{title}</h3>
              <p className="mt-5 leading-7 text-stone">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Co otrzymasz po ukończeniu kursu</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ title, description, Icon }, index) => (
            <article
              key={title}
              className="courses-reason-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="courses-page-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="mt-8 font-display text-3xl leading-tight">{title}</h3>
              <p className="mt-5 leading-7 text-stone">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="courses-page-cta">
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Rozpocznij swoją przygodę z szyciem
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone">
            Dołącz do kursów prowadzonych przez Mariję i rozwijaj swoje umiejętności
            w przyjaznej atmosferze.
          </p>
          <a className="btn btn-primary mt-9" href="#/kontakt">
            ZAPISZ SIĘ NA KURS
          </a>
        </div>
      </section>
    </>
  );
}

export default KursyPage;
