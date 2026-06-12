import { BookOpen, Scissors, UserRoundCheck } from "lucide-react";
import atelierImage from "../assets/atelier-hero.png";

const courseCards = [
  {
    number: "01",
    title: "Dla początkujących",
    description:
      "Poznaj podstawy szycia, obsługi maszyny oraz pracy z materiałami. Naucz się tworzyć pierwsze projekty krok po kroku.",
    Icon: BookOpen,
  },
  {
    number: "02",
    title: "Rozwój umiejętności",
    description:
      "Doskonal techniki konstrukcji, modelowania oraz wykańczania odzieży pod okiem doświadczonego instruktora.",
    Icon: Scissors,
  },
  {
    number: "03",
    title: "Zajęcia indywidualne",
    description:
      "Program nauki dopasowany do Twojego poziomu, tempa pracy oraz konkretnych celów.",
    Icon: UserRoundCheck,
  },
];

function KursySection() {
  return (
    <section id="kursy" className="section reveal-on-scroll">
      <div className="courses-panel">
        <div className="max-w-2xl">
          <p className="eyebrow">KURSY SZYCIA</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Naucz się szyć z pasją i doświadczeniem
          </h2>
          <p className="mt-7 text-lg leading-8 text-stone">
            Ponad 30 lat doświadczenia w branży odzieżowej pozwala nam dzielić się
            wiedzą w praktyczny i przystępny sposób. Kursy szycia prowadzone są
            zarówno dla osób początkujących, jak i tych, które chcą rozwijać swoje
            umiejętności zawodowe.
          </p>
        </div>

        <div className="courses-image-frame">
          <img
            src={atelierImage}
            alt="Pracownia szycia przygotowana do kursu"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
        {courseCards.map(({ number, title, description, Icon }, index) => (
          <article
            key={title}
            className="courses-card reveal-on-scroll"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-5">
              <span className="font-display text-6xl leading-none text-neutral-950/12">
                {number}
              </span>
              <span className="courses-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
            </div>
            <h3 className="mt-9 font-display text-3xl leading-tight">{title}</h3>
            <p className="mt-5 leading-7 text-stone">{description}</p>
          </article>
        ))}
      </div>

      <div className="courses-cta reveal-on-scroll">
        <h3 className="font-display text-4xl leading-tight md:text-5xl">
          Rozpocznij swoją przygodę z szyciem
        </h3>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone">
          Dołącz do kursów prowadzonych przez doświadczonego instruktora i rozwijaj
          swoje umiejętności krok po kroku.
        </p>
        <a className="btn btn-primary mt-8" href="#/kursy">
          ZOBACZ KURSY
        </a>
      </div>
    </section>
  );
}

export default KursySection;
