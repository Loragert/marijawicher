import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import heroImage from "../assets/atelier-hero.png";
import heroImage1 from "../assets/atelier-hero1.png";
import heroImage2 from "../assets/atelier-hero2.png";

const heroImages = [
  {
    src: heroImage,
    alt: "Jasne atelier Krawiectwo Marija z elegancką odzieżą i tkaninami",
  },
  {
    src: heroImage1,
    alt: "Pracownia Krawiectwo Marija z detalami krawieckimi",
  },
  {
    src: heroImage2,
    alt: "Eleganckie atelier marki Krawiectwo Marija",
  },
];

function HeroSection() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="strona-glowna"
      className="relative isolate overflow-hidden bg-porcelain pt-20"
    >
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:px-10">
        <div className="reveal-on-scroll z-10 max-w-2xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.34em] text-rosewood">
            Leszno atelier
          </p>
          <h1 className="font-display text-5xl leading-[0.92] text-neutral-950 sm:text-6xl md:text-7xl xl:text-8xl">
            KRAWIECTWO MARIJA
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-8 text-neutral-950 md:text-2xl md:leading-10">
            Odzież tworzona z pasją, haftem i dbałością o każdy detal.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-stone md:text-lg">
            Autorskie kolekcje, szycie na miarę oraz kursy krawieckie w Lesznie.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a className="btn btn-primary" href="#/kolekcje">
              Zobacz kolekcje
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href="#/szycie-na-miare">
              Umów szycie na miarę
            </a>
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-stone">
            Leszno • Krawiectwo • Haft • Pasmanteria
          </p>
        </div>

        <div className="relative lg:pl-8">
          <div className="hero-image-panel">
            {heroImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                  activeImageIndex === index ? "opacity-100" : "opacity-0"
                }`}
                decoding={index === 0 ? "sync" : "async"}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
          <div className="hero-note">
            <span className="text-xs uppercase tracking-[0.28em] text-stone">Atelier</span>
            <strong className="mt-2 block font-display text-3xl font-medium">Leszno</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
