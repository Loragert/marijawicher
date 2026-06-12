import { Building2, Gift, Shirt, Waves } from "lucide-react";

const embroideryServices = [
  {
    title: "Ręczniki",
    description: "Personalizowane ręczniki z imieniem, logo lub dedykacją.",
    Icon: Waves,
  },
  {
    title: "Odzież",
    description: "Haft na koszulach, bluzach, fartuchach i odzieży firmowej.",
    Icon: Shirt,
  },
  {
    title: "Prezenty",
    description: "Wyjątkowe produkty tworzone na specjalne okazje.",
    Icon: Gift,
  },
  {
    title: "Firmy",
    description: "Hafty reklamowe i znakowanie tekstyliów dla biznesu.",
    Icon: Building2,
  },
];

function HaftSection() {
  return (
    <section id="haft" className="section reveal-on-scroll">
      <div className="haft-shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow justify-center">HAFT</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl lg:text-7xl">
            Haft komputerowy i personalizacja
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-stone">
            Tworzymy wyjątkowe hafty na ręcznikach, szlafrokach, odzieży, dodatkach
            oraz produktach reklamowych. Każdy projekt realizujemy z dbałością o
            najmniejsze detale, tworząc personalizowane produkty na prezent, dla firm
            oraz klientów indywidualnych.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {embroideryServices.map(({ title, description, Icon }, index) => (
            <article
              key={title}
              className="haft-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <div className="haft-icon">
                <Icon size={34} aria-hidden="true" />
              </div>
              <h3 className="mt-9 font-display text-3xl leading-tight">{title}</h3>
              <p className="mt-5 leading-7 text-stone">{description}</p>
            </article>
          ))}
        </div>

        <div className="haft-cta reveal-on-scroll">
          <h3 className="font-display text-4xl leading-tight md:text-5xl">
            Masz własny pomysł na haft?
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-stone">
            Przygotujemy indywidualny projekt dopasowany do Twoich potrzeb.
          </p>
          <a className="btn btn-primary mt-8" href="#/haft">
            SKONTAKTUJ SIĘ
          </a>
        </div>
      </div>
    </section>
  );
}

export default HaftSection;
