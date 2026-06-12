import { BadgeCheck, MessagesSquare, Shirt } from "lucide-react";
import atelierImage from "../assets/atelier-hero.png";

const processSteps = [
  {
    number: "01",
    title: "Konsultacja",
    description:
      "Rozmawiamy o Twoich potrzebach, stylu i oczekiwaniach. Dobieramy tkaniny, kroje i detale, które podkreślą Ciebie i zapewnią komfort.",
    Icon: MessagesSquare,
  },
  {
    number: "02",
    title: "Projekt i przymiarki",
    description:
      "Tworzymy projekt i krok po kroku realizujemy go podczas przymiarek, aby zapewnić idealne dopasowanie do Twojej sylwetki.",
    Icon: Shirt,
  },
  {
    number: "03",
    title: "Gotowy produkt",
    description:
      "Otrzymujesz dopracowany w każdym detalu produkt, który podkreśla Twój styl i dodaje pewności siebie.",
    Icon: BadgeCheck,
  },
];

function SzycieNaMiareSection() {
  return (
    <section id="szycie-na-miare" className="section reveal-on-scroll">
      <div className="tailoring-panel">
        <div className="max-w-2xl">
          <p className="eyebrow">SZYCIE NA MIARĘ</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Od pomysłu do idealnej sylwetki
          </h2>
          <p className="mt-7 text-lg leading-8 text-stone">
            Tworzymy odzież, która powstaje w oparciu o indywidualne potrzeby i oczekiwania. 
            Od pierwszej konsultacji, przez dobór tkanin i detali, aż po finalne wykończenie — każdy etap realizowany jest z najwyższą starannością. 
            Dzięki temu powstają projekty wyjątkowe, komfortowe i dopracowane w najmniejszym szczególe.
          </p>
        </div>

        <div className="tailoring-image-frame">
          <img
            src={atelierImage}
            alt="Pracownia krawiecka z manekinem i tkaninami"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-3">
        {processSteps.map(({ number, title, description, Icon }, index) => (
          <article
            key={title}
            className="tailoring-step-card reveal-on-scroll"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-5">
              <span className="font-display text-6xl leading-none text-neutral-950/12">
                {number}
              </span>
              <span className="tailoring-step-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
            </div>
            <h3 className="mt-9 font-display text-3xl leading-tight">{title}</h3>
            <p className="mt-5 leading-7 text-stone">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-center md:mt-12">
        <a className="btn btn-primary" href="#/szycie-na-miare">
          UMÓW KONSULTACJĘ
        </a>
      </div>
    </section>
  );
}

export default SzycieNaMiareSection;
