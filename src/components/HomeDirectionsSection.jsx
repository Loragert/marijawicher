import madeToMeasureDress from "../assets/made-to-measure-dress.jpg";
import marijaFamily from "../assets/marija-family.jpg";
import marijaFamilyCommunion from "../assets/sewing-course-student.jpg";
import sewingCourse from "../assets/sewing-course.jpg";

const directions = [
  {
    title: "Szycie na miarę",
    description:
      "Tworzymy ubrania dopasowane do sylwetki, stylu i okazji — od pierwszego pomysłu po gotową kreację.",
    button: "Zobacz szycie na miarę",
    href: "#/szycie-na-miare",
    image: madeToMeasureDress,
    alt: "Sukienka szyta na miarę w pracowni MARIJA",
  },
  {
    title: "Poznaj Mariję",
    description:
      "Za marką MARIJA stoi kobieta, która od lat łączy rodzinę, pasję, doświadczenie i miłość do krawiectwa.",
    button: "Poznaj Mariję",
    href: "#/o-mariji",
    image: marijaFamily,
    alt: "Marija Wicher z rodziną",
  },
  {
    title: "Haft komputerowy",
    description:
      "Personalizujemy odzież, ręczniki, dodatki i wyjątkowe projekty na ważne okazje.",
    button: "Zobacz haft",
    href: "#/haft",
    image: marijaFamilyCommunion,
    alt: "Rodzinne zdjęcie z uroczystości z elementami marki MARIJA",
  },
  {
    title: "Kursy szycia",
    description:
      "Uczymy szycia krok po kroku — z praktyką, cierpliwością i doświadczeniem.",
    button: "Zobacz kursy",
    href: "#/kursy",
    image: sewingCourse,
    alt: "Kurs szycia w pracowni MARIJA",
  },
];

function HomeDirectionsSection() {
  return (
    <section className="section reveal-on-scroll">
      <div className="section-heading">
        <p className="eyebrow">Pracownia MARIJA</p>
        <h2>Wybierz kierunek, który najlepiej opisuje Twoje potrzeby</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {directions.map((item, index) => (
          <article
            key={item.title}
            className="group overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 ease-out hover:-translate-y-2 hover:border-rosewood/30"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <div className="aspect-[16/11] overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-7 md:p-9">
              <h3 className="font-display text-4xl leading-tight">{item.title}</h3>
              <p className="mt-5 min-h-24 text-lg leading-8 text-stone">
                {item.description}
              </p>
              <a className="btn btn-secondary mt-7" href={item.href}>
                {item.button}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeDirectionsSection;
