import { NavLink } from "react-router";

const NavLinks = [
  {
    href: "/",
    name: "Start",
  },
  {
    href: "/Einkauf",
    name: "Einkauf",
  },
  {
    href: "/Mitarbeiter",
    name: "Mitarbeiter",
  },
  {
    href: "/Lieferanten",
    name: "Lieferanten",
  },
  {
    href: "/Formulare",
    name: "Formulare",
  },
  {
    href: "/Archiv",
    name: "CE Archiv",
  },
  {
    href: "/Kunden",
    name: "Kunden",
  },
  {
    href: "/Warenlieferung",
    name: "Warenlieferung",
  },
  {
    href: "/CMS",
    name: "CMS",
  },
  {
    href: "/SN",
    name: "SN",
  },
  {
    href: "/Info",
    name: "Info",
  },
  {
    href: "/Label",
    name: "Label",
  },
  {
    href: "/Aussteller",
    name: "Aussteller",
  },
  {
    href: "/Versand",
    name: "Versand",
  },
];

export default function Links() {
  return (
    <div className="panel print:hidden">
      <div className="panel-label">Links</div>
      <div className="grid grid-cols-7 mt-2">
        {NavLinks.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.href}
            className={({ isActive, isPending }) =>
              isPending
                ? "underline"
                : isActive
                ? "underline"
                : "hover:underline"
            }
          >
            <span className="pe-1">&gt;</span>
            {link.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
