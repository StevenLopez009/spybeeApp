"use client";

import { ReactNode } from "react";

interface MapChromeProps {
  is3D: boolean;
  onSet3D: (enable: boolean) => void;
  is360: boolean;
  onSet360: (enable: boolean) => void;
  canOrbit: boolean;
  onShowDetails: () => void;
  canShowDetails: boolean;
}

/* ----- helpers de iconos (outline tipo Lucide) ----- */
function Svg({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const I = {
  panel: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  folderStar: (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="m12 10 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 12.3l2-.3z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>
  ),
  brush: (
    <>
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </>
  ),
  share: (
    <>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  film: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" />
    </>
  ),
  locate: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  map: (
    <>
      <path d="M14.1 4.6 9 2 3.6 4.7A1 1 0 0 0 3 5.6v14.3a.5.5 0 0 0 .7.5L9 18l6 3 5.4-2.7a1 1 0 0 0 .6-.9V3.8a.5.5 0 0 0-.7-.5L15 6" />
      <path d="M9 2v16M15 6v16" />
    </>
  ),
  bookmarkMap: (
    <>
      <path d="M9 10a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6Z" />
      <path d="M5 21h14" />
    </>
  ),
  triangle: <path d="M12 3 2 21h20L12 3Z" />,
};

function ToolBtn({
  children,
  active,
  className = "",
  title,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        active ? "bg-amber-400 text-white" : "text-gray-600 hover:bg-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function MapChrome({
  is3D,
  onSet3D,
  is360,
  onSet360,
  canOrbit,
  onShowDetails,
  canShowDetails,
}: MapChromeProps) {
  return (
    <>
      {/* Top-left: Ver detalles */}
      <button
        type="button"
        onClick={onShowDetails}
        disabled={!canShowDetails}
        title={
          canShowDetails
            ? "Ver información de la incidencia"
            : "Crea o selecciona una incidencia primero"
        }
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ver detalles
        <Svg size={18}>{I.panel}</Svg>
      </button>

      {/* Top-center: filtro + fecha + visitas */}
      <div className="absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-md lg:flex">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          title="Filtros"
        >
          <Svg>{I.filter}</Svg>
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700">
          02 jun 2026
          <Svg size={16}>{I.chevronDown}</Svg>
        </div>
        <span className="text-sm font-medium text-gray-700">
          Últimas 5 visitas
        </span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i === 4 ? "bg-white ring-2 ring-amber-400" : "bg-amber-400"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          title="Añadir"
        >
          <Svg size={18}>{I.plus}</Svg>
        </button>
      </div>

      {/* Top-right: Comparar */}
      <div className="absolute right-20 top-4 z-10 hidden items-center gap-2 lg:flex">
        <button
          type="button"
          className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500"
        >
          Comparar
        </button>
        <button
          type="button"
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition hover:bg-gray-50"
        >
          Comparar BIM
        </button>
      </div>

      {/* Right: barra de herramientas vertical */}
      <div className="absolute right-3 top-3 z-10 hidden flex-col items-center gap-1 rounded-2xl bg-white p-1.5 shadow-md md:flex">
        <ToolBtn active title="Crear">
          <Svg>{I.plus}</Svg>
        </ToolBtn>
        <ToolBtn title="Documentos">
          <Svg>{I.book}</Svg>
        </ToolBtn>
        <ToolBtn title="Favoritos">
          <Svg>{I.folderStar}</Svg>
        </ToolBtn>
        <ToolBtn title="Ubicaciones">
          <Svg>{I.pin}</Svg>
        </ToolBtn>
        <div className="my-1 h-px w-6 bg-gray-200" />
        <ToolBtn title="Capas">
          <Svg>{I.layers}</Svg>
        </ToolBtn>
        <ToolBtn title="Imágenes">
          <Svg>{I.image}</Svg>
        </ToolBtn>
        <ToolBtn title="Anotaciones">
          <Svg>{I.brush}</Svg>
        </ToolBtn>
        <ToolBtn title="Compartir">
          <Svg>{I.share}</Svg>
        </ToolBtn>
      </div>

      {/* Bottom-left: herramientas de mapa */}
      <div className="absolute bottom-4 left-4 z-10 hidden flex-col gap-2 md:flex">
        {[I.locate, I.map, I.bookmarkMap, I.triangle].map((icon, i) => (
          <button
            key={i}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-600 shadow-md transition hover:bg-gray-50"
          >
            <Svg size={18}>{icon}</Svg>
          </button>
        ))}
      </div>

      {/* Bottom-center: 2D/3D + 360° */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white p-1 shadow-md">
        <button
          type="button"
          onClick={() => onSet3D(false)}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition ${
            !is3D
              ? "bg-amber-400 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          2D
        </button>
        <button
          type="button"
          onClick={() => onSet3D(true)}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition ${
            is3D ? "bg-amber-400 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          3D
        </button>
        <div className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />
        <button
          type="button"
          title="Time-lapse"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 sm:flex"
        >
          <Svg size={18}>{I.clock}</Svg>
        </button>
        <button
          type="button"
          title="Recorrido"
          className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 sm:flex"
        >
          <Svg size={18}>{I.film}</Svg>
        </button>
        <button
          type="button"
          onClick={() => onSet360(!is360)}
          disabled={!canOrbit}
          title={
            canOrbit
              ? "Vista 360° de la incidencia"
              : "Crea o selecciona una incidencia primero"
          }
          className="ml-1 hidden items-center gap-2 pr-2 transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
        >
          <span
            className={`text-sm font-semibold ${
              is360 ? "text-amber-500" : "text-gray-700"
            }`}
          >
            360°
          </span>
          <span
            className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
              is360 ? "bg-amber-400" : "bg-gray-200"
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                is360 ? "translate-x-4" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Bottom-right: logo */}
      <div className="absolute bottom-3 right-4 z-10 select-none text-xl font-extrabold tracking-tight text-gray-400">
        Spybee
      </div>
    </>
  );
}
