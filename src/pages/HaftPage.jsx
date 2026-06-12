import { BadgeCheck, ClipboardList, Send, Sparkles } from "lucide-react";
import haftApronBusiness from "../assets/haft-apron-business.jpg";
import haftBunnyPersonalized from "../assets/haft-bunny-personalized.jpg";
import haftCosmeticBag from "../assets/haft-cosmetic-bag.jpg";
import haftHeroMonogram from "../assets/haft-hero-monogram.jpg";
import haftShopperCollection from "../assets/haft-shopper-collection.jpg";
import haftShopperKoi from "../assets/haft-shopper-koi.jpg";
import haftShopperKoiPair from "../assets/haft-shopper-koi-pair.jpg";
import haftTowelRelax from "../assets/haft-towel-relax.jpg";
import haftTowelsNames from "../assets/haft-towels-names.jpg";

const embroideryItems = [
  {
    title: "Ręczniki",
    description: "Personalizowane ręczniki z imieniem, inicjałami, logo lub dedykacją.",
    image: haftTowelsNames,
  },
  {
    title: "Odzież",
    description: "Haft na koszulach, bluzach, fartuchach i odzieży codziennej.",
    image: haftHeroMonogram,
  },
  {
    title: "Shoppery",
    description: "Autorskie torby z haftem, idealne jako prezent lub element kolekcji.",
    image: haftShopperCollection,
  },
  {
    title: "Prezenty",
    description: "Personalizowane hafty na wyjątkowe okazje.",
    image: haftBunnyPersonalized,
  },
  {
    title: "Akcesoria",
    description: "Kosmetyczki, dodatki i tekstylia z indywidualnym haftem.",
    image: haftCosmeticBag,
  },
  {
    title: "Firmy",
    description: "Haft reklamowy i znakowanie tekstyliów dla biznesu.",
    image: haftApronBusiness,
  },
];

const orderSteps = [
  {
    number: "01",
    title: "Kontakt",
    description:
      "Kontaktujesz się z nami i przesyłasz tekst, logo, grafikę lub opis haftu.",
    Icon: Send,
  },
  {
    number: "02",
    title: "Projekt",
    description:
      "Przygotowujemy propozycję haftu i dobieramy odpowiedni rozmiar oraz miejsce wykonania.",
    Icon: ClipboardList,
  },
  {
    number: "03",
    title: "Realizacja",
    description:
      "Wykonujemy haft z dbałością o estetykę, trwałość i precyzję.",
    Icon: Sparkles,
  },
  {
    number: "04",
    title: "Odbiór",
    description: "Otrzymujesz gotowy, spersonalizowany produkt.",
    Icon: BadgeCheck,
  },
];

const galleryImages = [
  { src: haftHeroMonogram, alt: "Haftowany monogram na odzieży" },
  { src: haftTowelsNames, alt: "Personalizowane ręczniki z haftem" },
  { src: haftApronBusiness, alt: "Fartuch firmowy z haftem" },
  { src: haftBunnyPersonalized, alt: "Pluszak z personalizowanym haftem" },
  { src: haftCosmeticBag, alt: "Kosmetyczka z haftem" },
  { src: haftShopperKoi, alt: "Shopper z haftem koi" },
  { src: haftShopperKoiPair, alt: "Para shopperów z haftem koi" },
  { src: haftTowelRelax, alt: "Ręcznik z haftem relax" },
];

function HaftPage() {
  return (
    <>
      <section className="haft-page-hero reveal-on-scroll">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">HAFT KOMPUTEROWY</p>
            <h1 className="font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Personalizacja, która nadaje wyjątkowy charakter
            </h1>
            <p className="mt-8 text-lg leading-8 text-stone md:text-xl md:leading-9">
              Tworzymy hafty na ręcznikach, odzieży, dodatkach i produktach
              firmowych. Każdy projekt przygotowujemy z dbałością o detal, estetykę
              i trwałość wykonania.
            </p>
            <a className="btn btn-primary mt-10" href="#/kontakt">
              ZAMÓW HAFT
            </a>
          </div>

          <div className="haft-page-hero-image">
            <img
              src={haftHeroMonogram}
              alt="Haftowany monogram wykonany w pracowni MARIJA"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Co możemy dla Ciebie wyhaftować</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {embroideryItems.map(({ title, description, image }, index) => (
            <article
              key={title}
              className="group haft-page-card reveal-on-scroll overflow-hidden p-0"
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
                <p className="mt-5 leading-7 text-stone">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal-on-scroll">
        <div className="section-heading">
          <h2>Jak przebiega zamówienie haftu</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {orderSteps.map(({ number, title, description, Icon }, index) => (
            <article
              key={title}
              className="haft-order-card reveal-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-display text-6xl leading-none text-neutral-950/10">
                  {number}
                </span>
                <span className="haft-page-icon">
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
          <p className="eyebrow">Realizacje</p>
          <h2>Nasze realizacje</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <figure
              key={image.src}
              className="group reveal-on-scroll overflow-hidden rounded-[1.25rem] border border-neutral-950/10 bg-milk shadow-soft"
              style={{ transitionDelay: `${index * 55}ms` }}
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
        <div className="grid items-center gap-10 rounded-[1.5rem] border border-neutral-950/10 bg-milk p-7 shadow-soft md:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
          <div>
            <p className="eyebrow">Prezent</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">
              Haft na prezent
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone">
              Personalizowany haft to wyjątkowy pomysł na prezent — ręcznik z
              imieniem, kosmetyczka z inicjałami, shopper z autorskim wzorem lub
              pluszak z dedykacją. Tworzymy hafty, które mają osobisty charakter
              i zostają z obdarowaną osobą na długo.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
            <img
              src={haftTowelRelax}
              alt="Personalizowany haft na ręczniku jako prezent"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section reveal-on-scroll pb-24 md:pb-32">
        <div className="haft-page-cta">
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Stwórzmy coś wyjątkowego razem
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone">
            Opowiedz nam o swoim pomyśle, a przygotujemy haft dopasowany do Twoich
            oczekiwań.
          </p>
          <a className="btn btn-primary mt-9" href="#/kontakt">
            ZAMÓW HAFT
          </a>
        </div>
      </section>
    </>
  );
}

export default HaftPage;
