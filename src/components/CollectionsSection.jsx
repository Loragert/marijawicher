import dlaDzieciImage from "../assets/dla-dzieci.png";
import dlaNiejImage from "../assets/dla-niej.png";
import naturalnaElegancjaImage from "../assets/naturalna-elegancja.png";
import shopperyHaftowaneImage from "../assets/shoppery-haftowane.png";

const collectionCards = [
  {
    title: "Naturalna elegancja",
    image: naturalnaElegancjaImage,
    imageClass: "collection-model-natural",
  },
  {
    title: "Dla niej",
    image: dlaNiejImage,
    imageClass: "collection-model-women",
  },
  {
    title: "Dla dzieci",
    image: dlaDzieciImage,
    imageClass: "collection-model-kids",
  },
  {
    title: "Shoppery haftowane",
    image: shopperyHaftowaneImage,
    imageClass: "collection-model-shopper",
  },
];

function CollectionsSection() {
  return (
    <section id="kolekcje" className="section reveal-on-scroll">
      <div className="section-heading">
        <p className="eyebrow">Kolekcje</p>
        <h2>Kolekcje</h2>
        <p>Unikalne projekty tworzone z dbałością o każdy detal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {collectionCards.map((collection, index) => (
          <article
            key={collection.title}
            className="fashion-collection-card reveal-on-scroll"
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            <div className="fashion-collection-visual">
              <img
                src={collection.image}
                alt={`Kolekcja ${collection.title}`}
                className={`collection-model ${collection.imageClass}`}
              />
            </div>
            <div className="fashion-collection-overlay" />
            <div className="relative z-10 flex min-h-[32rem] flex-col justify-end p-7 md:min-h-[33rem] xl:min-h-[35rem]">
              <h3 className="max-w-[13rem] font-display text-4xl leading-none text-milk md:text-5xl">
                {collection.title}
              </h3>
              <a href="#/kolekcje" className="collection-button">
                Zobacz
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CollectionsSection;
