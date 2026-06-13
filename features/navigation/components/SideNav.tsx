"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { key: string; label: string; href?: string };

const items: Item[] = [
  { key: "home", label: "Inicio", href: "/" },
  { key: "pie", label: "Reportes", href: "/reports" },
  { key: "pin", label: "Incidencias", href: "/incidencias" },
  { key: "info", label: "Información", href: "/configuracion" },
  { key: "clock", label: "Historial" },
  { key: "calendar", label: "Calendario" },
  { key: "image", label: "Galería" },
  { key: "folder", label: "Archivos" },
];

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const paths: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </>
  ),
  pie: (
    <>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

interface SideNavProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function SideNav({ expanded, onToggle }: SideNavProps) {
  const pathname = usePathname();

  const isActive = (it: Item) =>
    it.href
      ? it.href === "/"
        ? pathname === "/"
        : pathname.startsWith(it.href)
      : false;

  // En móvil solo mostramos las entradas con ruta real (bottom nav)
  const mobileItems = items.filter((it) => it.href);

  return (
    <>
      {/* Bottom nav — móvil */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch justify-around border-t border-gray-200 bg-white sm:hidden">
        {mobileItems.map((it) => {
          const active = isActive(it);
          return (
            <Link
              key={it.key}
              href={it.href!}
              aria-label={it.label}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${
                active ? "text-amber-500" : "text-gray-500"
              }`}
            >
              <Icon name={it.key} />
              <span className="max-w-full truncate px-1 text-[10px] font-medium leading-tight">
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Rail izquierdo — tablet / desktop */}
      <nav
        className={`fixed left-0 top-0 z-40 hidden h-full flex-col bg-white border-r border-gray-200 py-4 transition-all duration-200 sm:flex ${
          expanded ? "w-56" : "w-16"
        }`}
      >
        {/* Avatar + botón expandir */}
        <div className="relative flex items-center gap-3 px-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br from-amber-300 to-amber-500 text-lg"
            style={{ clipPath: HEX }}
          >
            🐺
          </div>
          {expanded && (
            <span className="truncate text-sm font-semibold text-gray-800">
              Mi cuenta
            </span>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={expanded ? "Contraer" : "Expandir"}
            className="absolute -right-3 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm hover:text-gray-800"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="my-4 border-t border-gray-200" />

        {/* Iconos de navegación */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
          {items.map((it) => {
            const active = it.href
              ? it.href === "/"
                ? pathname === "/"
                : pathname.startsWith(it.href)
              : false;

            const base = `relative flex items-center rounded-xl transition ${
              expanded ? "gap-3 px-3 py-2.5" : "h-11 w-11 justify-center"
            }`;
            const state = active
              ? "bg-amber-50 text-amber-500 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-amber-400"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700";
            const className = `${base} ${state}`;

            const content = (
              <>
                <Icon name={it.key} />
                {expanded && (
                  <span className="truncate text-sm font-medium">
                    {it.label}
                  </span>
                )}
              </>
            );

            return it.href ? (
              <Link
                key={it.key}
                href={it.href}
                title={it.label}
                aria-label={it.label}
                className={className}
              >
                {content}
              </Link>
            ) : (
              <button
                key={it.key}
                type="button"
                title={`${it.label} (próximamente)`}
                aria-label={it.label}
                className={className}
              >
                {content}
              </button>
            );
          })}
        </div>

        {/* Acciones inferiores */}
        <div className="mt-2 flex flex-col gap-1 px-2">
          {[
            { key: "settings", label: "Configuración" },
            { key: "share", label: "Compartir" },
          ].map((it) => (
            <button
              key={it.key}
              type="button"
              title={it.label}
              aria-label={it.label}
              className={`relative flex items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 ${
                expanded ? "gap-3 px-3 py-2.5" : "h-11 w-11 justify-center"
              }`}
            >
              <Icon name={it.key} />
              {expanded && (
                <span className="truncate text-sm font-medium">{it.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
