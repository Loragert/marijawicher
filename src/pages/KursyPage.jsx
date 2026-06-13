import { CalendarDays, Clock, ImagePlus, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import coursesHeroImage from "../assets/sewing-courses-hero.jpg";
import {
  createCourseApplication,
  getCourseStatusLabel,
  getPublicCourses,
} from "../features/courses/coursesRepository.js";
import { getCustomerProfile } from "../features/account/customerProfilesRepository.js";
import { formatCartPrice } from "../features/cart/cartModel.js";
import { getCustomerSession, isCustomerLoggedIn } from "../lib/customerAuth.js";

function formatDate(value) {
  if (!value) return "Termin ustalany indywidualnie";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function CourseStatusBadge({ status }) {
  return (
    <span className="w-fit rounded-full border border-neutral-950/10 bg-milk px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
      {getCourseStatusLabel(status)}
    </span>
  );
}

function KursyPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submittingCourseId, setSubmittingCourseId] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const result = await getPublicCourses();
    setIsLoading(false);

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się pobrać kursów. Sprawdź konfigurację Supabase.",
      });
      return;
    }

    setCourses(result.data || []);
  }

  async function handleCourseApply(course) {
    if (!isCustomerLoggedIn()) {
      window.location.hash = "#/login";
      return;
    }

    const session = getCustomerSession();
    setSubmittingCourseId(course.id);
    setStatus({ type: "", message: "" });

    const profileResult = await getCustomerProfile();
    const profile = profileResult.data || {};

    const result = await createCourseApplication({
      course_id: course.id,
      customer_id: session.user.id,
      customer_name: profile.full_name || session.user.email,
      customer_email: session.user.email,
      customer_phone: profile.phone || null,
      status: "new",
    });

    setSubmittingCourseId("");

    if (result.error) {
      setStatus({
        type: "error",
        message: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub skontaktuj się z nami.",
      });
      return;
    }

    setStatus({
      type: "success",
      message: "Zgłoszenie zostało wysłane. Możesz je zobaczyć w sekcji Moje kursy.",
    });
  }

  function renderCourseAction(course) {
    if (course.status === "available") {
      return (
        <button
          className="btn btn-primary w-full"
          type="button"
          onClick={() => handleCourseApply(course)}
          disabled={submittingCourseId === course.id}
        >
          {submittingCourseId === course.id && (
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          )}
          Zapisz się
        </button>
      );
    }

    if (course.status === "full") {
      return (
        <a className="btn btn-secondary w-full" href="#/kontakt">
          Zapytaj o kolejny termin
        </a>
      );
    }

    return (
      <button className="btn btn-secondary w-full opacity-70" type="button" disabled>
        Wkrótce dostępny
      </button>
    );
  }

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
              Praktyczna nauka szycia pod okiem doświadczonego instruktora. Wybierz
              kurs dopasowany do Twojego poziomu i zapisz się online.
            </p>
            <a className="btn btn-primary mt-10" href="#kursy-oferta">
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

      <section className="section reveal-on-scroll" id="kursy-oferta">
        <div className="section-heading">
          <p className="eyebrow">Oferta</p>
          <h2>Aktualne kursy</h2>
        </div>

        {status.message && (
          <div
            className={`mb-8 rounded-[1.25rem] border bg-milk p-5 text-sm leading-6 ${
              status.type === "error"
                ? "border-rosewood/40 text-rosewood"
                : "border-neutral-950/10 text-stone"
            }`}
            role="status"
          >
            {status.message}
          </div>
        )}

        {isLoading && (
          <div className="flex min-h-72 items-center justify-center text-stone">
            <Loader2 className="mr-3 animate-spin" size={22} aria-hidden="true" />
            Ładowanie kursów...
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="rounded-[1.5rem] border border-neutral-950/10 bg-milk p-8 text-center shadow-soft md:p-12">
            <h3 className="font-display text-4xl leading-tight">Brak aktywnych kursów</h3>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone">
              Nowe terminy pojawią się wkrótce. Możesz skontaktować się z nami, aby
              zapytać o indywidualne zajęcia.
            </p>
            <a className="btn btn-primary mt-8" href="#/kontakt">
              Skontaktuj się
            </a>
          </div>
        )}

        {!isLoading && courses.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {courses.map((course, index) => (
              <article
                className="group reveal-on-scroll overflow-hidden rounded-[1.5rem] border border-neutral-950/10 bg-milk shadow-soft transition duration-700 hover:-translate-y-2 hover:border-rosewood/30"
                key={course.id}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="grid h-full md:grid-cols-[0.86fr_1.14fr]">
                  <div className="flex min-h-72 items-center justify-center overflow-hidden bg-porcelain">
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlus className="text-stone" size={34} aria-hidden="true" />
                    )}
                  </div>

                  <div className="flex flex-col p-6 md:p-8">
                    <CourseStatusBadge status={course.status} />
                    <h3 className="mt-6 font-display text-4xl leading-tight text-neutral-950">
                      {course.title}
                    </h3>
                    {course.short_description && (
                      <p className="mt-5 text-lg leading-8 text-stone">
                        {course.short_description}
                      </p>
                    )}
                    {course.full_description && (
                      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-stone">
                        {course.full_description}
                      </p>
                    )}

                    <div className="mt-7 grid gap-3 text-sm text-stone">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="text-rosewood" size={18} aria-hidden="true" />
                        <span>{formatDate(course.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-rosewood" size={18} aria-hidden="true" />
                        <span>{course.duration || "Czas trwania ustalany indywidualnie"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-rosewood" size={18} aria-hidden="true" />
                        <span>
                          Miejsca: {course.available_places ?? 0} / {course.total_places ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-2xl font-semibold text-neutral-950">
                        {formatCartPrice(course.price)}
                      </p>
                      <div className="sm:min-w-52">{renderCourseAction(course)}</div>
                    </div>

                    {course.status === "full" && (
                      <p className="mt-4 text-sm leading-6 text-stone">Brak wolnych miejsc</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default KursyPage;
