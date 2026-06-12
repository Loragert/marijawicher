import { ArrowRight } from "lucide-react";
import brandLogo from "../assets/brand-logo-marija.png";
import { aboutBrand } from "../data/siteContent.js";

const brandStats = [
  { value: "30+", label: "lat doświadczenia" },
  { value: "1000+", label: "zrealizowanych projektów" },
  { value: "100+", label: "uczestników kursów" },
];

const brandValues = [
  {
    title: "Jakość",
    description: "Każdy produkt powstaje z dbałością o najmniejszy detal.",
  },
  {
    title: "Profesjonalizm",
    description: "Ponad 30 lat doświadczenia w branży odzieżowej.",
  },
  {
    title: "Indywidualne podejście",
    description: "Każdy projekt dopasowujemy do potrzeb klienta.",
  },
  {
    title: "Kreatywność",
    description: "Łączymy tradycyjne rzemiosło z nowoczesnym wzornictwem.",
  },
  {
    title: "Zaufanie",
    description: "Budujemy relacje oparte na uczciwości i wysokiej jakości usług.",
  },
];

function AboutBrandSection() {
  return (
    <section id="o-marce" className="section reveal-on-scroll pb-24 md:pb-32">
      <div className="about-story">
        <div className="about-story-image" aria-hidden="true">
          <img
            src={brandLogo}
            alt=""
            className="h-full w-full scale-150 object-contain"
          />
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="eyebrow">O marce</p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            Poznaj historię marki MARIJA
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-stone md:text-xl md:leading-9">
            {aboutBrand.intro}
          </p>
          <a className="btn btn-primary mt-10" href="#/o-marce">
            POZNAJ MARIĘ
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="about-stats relative z-10">
          {brandStats.map((stat) => (
            <div key={stat.label} className="about-stat-item">
              <p className="font-display text-5xl leading-none md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 max-w-40 text-xs font-semibold uppercase tracking-[0.22em] text-stone">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Nasze wartości</p>
              <h3 className="font-display text-4xl leading-tight md:text-6xl">
                Wartości, które tworzą markę MARIJA
              </h3>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brandValues.map((value, index) => (
              <article
                key={value.title}
                className="about-value-card reveal-on-scroll"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-rosewood">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-8 font-display text-3xl leading-tight">
                  {value.title}
                </h4>
                <p className="mt-5 text-sm leading-6 text-stone">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutBrandSection;
