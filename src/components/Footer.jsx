import { Facebook, Instagram, MapPin } from "lucide-react";
import { footerColumns, socialLinks } from "../data/navigation.js";

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M14.2 4.5v9.05a4.45 4.45 0 1 1-4.45-4.45"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14.2 4.5c.58 2.45 2.08 4.03 4.55 4.42"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: TikTokIcon,
  map: MapPin,
};

function Footer() {
  return (
    <footer className="footer-shell">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="font-display text-2xl text-neutral-950">{column.title}</h2>
            <ul className="mt-5 space-y-3">
              {column.items.map((item) => (
                <li key={item.label}>
                  <a className="footer-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-950/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-sm text-neutral-950/65 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© 2026 Krawiectwo Marija</p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((item) => {
              const Icon = socialIcons[item.icon];

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer-social-link"
                  aria-label={item.label}
                  title={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
